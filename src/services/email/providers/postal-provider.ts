import { EmailProvider, SendEmailOptions, EmailResult, TestResult } from "../types";

interface PostalSendResponse {
  status: string;
  data?: {
    id: string;
    message_id: string;
  };
  error?: {
    code: string;
    message: string;
  };
}

interface PostalInfoResponse {
  status: string;
  data?: {
    version?: string;
    host?: string;
  };
  error?: {
    code: string;
    message: string;
  };
}

function toArray(value: string | string[] | undefined): string[] | undefined {
  if (!value) return undefined;
  return Array.isArray(value) ? value : [value];
}

export class PostalApiProvider implements EmailProvider {
  readonly name = "postal";

  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.apiKey = apiKey;
  }

  private get headers(): Record<string, string> {
    return {
      "Content-Type": "application/json",
      "X-Server-API-Key": this.apiKey,
    };
  }

  private debug(method: string, url: string, body?: unknown): void {
    const maskedHeaders = { ...this.headers, "X-Server-API-Key": "***masked***" };
    console.log(`[Postal] ${method} ${url}`);
    console.log(`[Postal] Headers:`, JSON.stringify(maskedHeaders));
    if (body) {
      const masked = JSON.parse(JSON.stringify(body));
      if (masked.api_key) masked.api_key = "***masked***";
      console.log(`[Postal] Body:`, JSON.stringify(masked, null, 2));
    }
  }

  async send(options: SendEmailOptions): Promise<EmailResult> {
    const start = Date.now();
    const url = `${this.baseUrl}/api/v1/send/message`;

    try {
      const to = Array.isArray(options.to) ? options.to : [options.to];
      const cc = toArray(options.cc);
      const bcc = toArray(options.bcc);

      const payload: Record<string, unknown> = {
        to,
        subject: options.subject,
        html_body: options.html,
        plain_body: options.text,
        reply_to: options.replyTo,
        tag: options.tags?.category,
      };

      if (options.from) {
        payload.from = options.from;
      }
      if (options.headers) {
        payload.headers = options.headers;
      }
      if (cc?.length) payload.cc = cc;
      if (bcc?.length) payload.bcc = bcc;

      if (options.attachments?.length) {
        payload.attachments = options.attachments.map((a) => ({
          filename: a.filename,
          content_type: a.contentType || "application/octet-stream",
          data: typeof a.content === "string" ? a.content : a.content.toString("base64"),
        }));
      }

      this.debug("POST", url, payload);

      const response = await fetch(url, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(15000),
      });

      const responseText = await response.text();
      const latencyMs = Date.now() - start;

      console.log(`[Postal] Response status: ${response.status}`);
      console.log(`[Postal] Response body: ${responseText.slice(0, 500)}`);

      let result: PostalSendResponse;
      try {
        result = JSON.parse(responseText);
      } catch {
        return {
          success: false,
          provider: this.name,
          latencyMs,
          error: `Non-JSON response (${response.status}): ${responseText.slice(0, 200)}`,
        };
      }

      if (result.status === "ok" && result.data) {
        return {
          success: true,
          messageId: result.data.message_id || result.data.id,
          provider: this.name,
          latencyMs,
        };
      }

      return {
        success: false,
        provider: this.name,
        latencyMs,
        error: result.error?.message || response.statusText,
      };
    } catch (error) {
      const latencyMs = Date.now() - start;
      const msg = error instanceof Error ? error.message : "Unknown error";
      console.error(`[Postal] Error: ${msg}`);
      return {
        success: false,
        provider: this.name,
        latencyMs,
        error: msg,
      };
    }
  }

  async testConnection(): Promise<TestResult> {
    const url = `${this.baseUrl}/api/v1/`;
    try {
      const start = Date.now();
      this.debug("GET", url);

      const response = await fetch(url, {
        method: "GET",
        headers: this.headers,
        signal: AbortSignal.timeout(10000),
      });

      const responseText = await response.text();
      const latencyMs = Date.now() - start;

      console.log(`[Postal] Test response status: ${response.status}`);
      console.log(`[Postal] Test response body: ${responseText.slice(0, 500)}`);

      if (!response.ok) {
        return {
          success: false,
          message: `Postal server returned ${response.status}: ${response.statusText}. Endpoint: ${url}`,
          details: { statusCode: response.status, latencyMs, endpoint: url },
        };
      }

      let result: PostalInfoResponse;
      try {
        result = JSON.parse(responseText);
      } catch {
        return {
          success: true,
          message: `Server responded (${response.status}) — ${latencyMs}ms. Unable to parse info response.`,
          details: { statusCode: response.status, latencyMs },
        };
      }

      if (result.status === "ok") {
        return {
          success: true,
          message: `Connected to Postal v${result.data?.version || "unknown"} (${latencyMs}ms)`,
          details: { version: result.data?.version, latencyMs },
        };
      }

      return {
        success: false,
        message: result.error?.message || "Server returned non-ok status",
        details: { latencyMs },
      };
    } catch (error) {
      console.error(`[Postal] Test error:`, error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Connection failed",
        details: { error: String(error) },
      };
    }
  }
}
