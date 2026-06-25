import { db } from "@/lib/db";
import { sendEmailNotification } from "./channels/email-channel";
import { sendWhatsAppNotification } from "./channels/whatsapp-channel";
import {
  NotificationType,
  NotificationChannel,
  ALL_NOTIFICATION_TYPES,
  ALL_CHANNELS,
  channelKey,
  DEFAULT_CHANNEL_CONFIG,
} from "./types";

let configCache: Record<string, boolean> | null = null;

async function loadChannelConfig(): Promise<Record<string, boolean>> {
  const rows = await db.platformSetting.findMany({
    where: {
      key: { startsWith: "notify_" },
    },
  });

  const dbConfig = Object.fromEntries(
    rows.map((r) => [r.key, r.value === "true"])
  );

  const merged: Record<string, boolean> = { ...DEFAULT_CHANNEL_CONFIG };
  for (const type of ALL_NOTIFICATION_TYPES) {
    for (const channel of ALL_CHANNELS) {
      const key = channelKey(type, channel);
      if (dbConfig[key] !== undefined) {
        merged[key] = dbConfig[key];
      }
    }
  }

  configCache = merged;
  return merged;
}

function getCachedConfig(): Record<string, boolean> {
  return configCache ?? DEFAULT_CHANNEL_CONFIG;
}

export function invalidateNotificationConfigCache(): void {
  configCache = null;
}

export async function getEnabledChannels(type: NotificationType): Promise<NotificationChannel[]> {
  const config = await loadChannelConfig();
  return ALL_CHANNELS.filter((ch) => config[channelKey(type, ch)]);
}

export function getEnabledChannelsSync(type: NotificationType): NotificationChannel[] {
  const config = getCachedConfig();
  return ALL_CHANNELS.filter((ch) => config[channelKey(type, ch)]);
}

export async function notify(
  type: NotificationType,
  recipient: { email?: string; phone?: string },
  subject: string,
  html: string,
  waData?: Record<string, unknown>
): Promise<void> {
  const channels = await getEnabledChannels(type);

  await Promise.all(
    channels.map(async (channel) => {
      try {
        if (channel === NotificationChannel.EMAIL && recipient.email) {
          await sendEmailNotification(type, recipient.email, subject, html);
        } else if (channel === NotificationChannel.WHATSAPP && recipient.phone) {
          await sendWhatsAppNotification(type, recipient.phone, html, waData);
        }
      } catch (err) {
        console.error(`[Notification] ${channel} failed for ${type}:`, err);
      }
    })
  );
}
