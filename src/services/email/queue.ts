import { SendEmailOptions, EmailResult } from "./types";

interface QueueItem {
  id: string;
  fn: () => Promise<EmailResult>;
  options: SendEmailOptions;
  retriesLeft: number;
  maxRetries: number;
}

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 1000;

let queue: QueueItem[] = [];
let processing = false;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function exponentialBackoff(attempt: number): number {
  return BASE_DELAY_MS * Math.pow(2, attempt) + Math.random() * 500;
}

export function enqueue(
  fn: () => Promise<EmailResult>,
  options: SendEmailOptions,
  maxRetries: number = MAX_RETRIES
): string {
  const id = `email_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  queue.push({ id, fn, options, retriesLeft: maxRetries, maxRetries });
  if (!processing) {
    processQueue();
  }
  return id;
}

async function processQueue(): Promise<void> {
  processing = true;
  while (queue.length > 0) {
    const item = queue.shift()!;
    try {
      const result = await item.fn();
      if (!result.success && item.retriesLeft > 0) {
        const backoff = exponentialBackoff(item.maxRetries - item.retriesLeft);
        console.warn(
          `[Email Queue] Retrying ${item.id} (${item.retriesLeft} retries left) in ${Math.round(backoff)}ms: ${result.error}`
        );
        await delay(backoff);
        queue.unshift({ ...item, retriesLeft: item.retriesLeft - 1 });
      }
    } catch (error) {
      if (item.retriesLeft > 0) {
        const backoff = exponentialBackoff(item.maxRetries - item.retriesLeft);
        await delay(backoff);
        queue.unshift({ ...item, retriesLeft: item.retriesLeft - 1 });
      }
    }
  }
  processing = false;
}

export function getQueueLength(): number {
  return queue.length;
}
