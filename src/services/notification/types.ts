export enum NotificationType {
  OTP = "otp",
  WELCOME = "welcome",
  TICKET_CONFIRMATION = "ticket",
  ORDER_RECEIPT = "receipt",
  EVENT_REMINDER = "reminder",
  PASSWORD_RESET = "password_reset",
}

export enum NotificationChannel {
  EMAIL = "email",
  WHATSAPP = "whatsapp",
}

export const ALL_NOTIFICATION_TYPES: NotificationType[] = [
  NotificationType.OTP,
  NotificationType.WELCOME,
  NotificationType.TICKET_CONFIRMATION,
  NotificationType.ORDER_RECEIPT,
  NotificationType.EVENT_REMINDER,
  NotificationType.PASSWORD_RESET,
];

export const ALL_CHANNELS: NotificationChannel[] = [
  NotificationChannel.EMAIL,
  NotificationChannel.WHATSAPP,
];

export function channelKey(type: NotificationType, channel: NotificationChannel): string {
  return `notify_${type}_${channel}`;
}

export function parseChannelSetting(key: string): { type: NotificationType; channel: NotificationChannel } | null {
  const match = key.match(/^notify_(\w+)_(\w+)$/);
  if (!match) return null;
  const type = match[1] as NotificationType;
  const channel = match[2] as NotificationChannel;
  if (ALL_NOTIFICATION_TYPES.includes(type) && ALL_CHANNELS.includes(channel)) {
    return { type, channel };
  }
  return null;
}

export const NOTIFICATION_LABELS: Record<NotificationType, string> = {
  [NotificationType.OTP]: "OTP Verification",
  [NotificationType.WELCOME]: "Welcome Message",
  [NotificationType.TICKET_CONFIRMATION]: "Ticket Confirmation",
  [NotificationType.ORDER_RECEIPT]: "Order Receipt",
  [NotificationType.EVENT_REMINDER]: "Event Reminder",
  [NotificationType.PASSWORD_RESET]: "Password Reset",
};

export const CHANNEL_LABELS: Record<NotificationChannel, string> = {
  [NotificationChannel.EMAIL]: "Email",
  [NotificationChannel.WHATSAPP]: "WhatsApp",
};

export const DEFAULT_CHANNEL_CONFIG: Record<string, boolean> = {
  [channelKey(NotificationType.OTP, NotificationChannel.EMAIL)]: false,
  [channelKey(NotificationType.OTP, NotificationChannel.WHATSAPP)]: true,
  [channelKey(NotificationType.WELCOME, NotificationChannel.EMAIL)]: true,
  [channelKey(NotificationType.WELCOME, NotificationChannel.WHATSAPP)]: true,
  [channelKey(NotificationType.TICKET_CONFIRMATION, NotificationChannel.EMAIL)]: true,
  [channelKey(NotificationType.TICKET_CONFIRMATION, NotificationChannel.WHATSAPP)]: false,
  [channelKey(NotificationType.ORDER_RECEIPT, NotificationChannel.EMAIL)]: true,
  [channelKey(NotificationType.ORDER_RECEIPT, NotificationChannel.WHATSAPP)]: true,
  [channelKey(NotificationType.EVENT_REMINDER, NotificationChannel.EMAIL)]: true,
  [channelKey(NotificationType.EVENT_REMINDER, NotificationChannel.WHATSAPP)]: false,
  [channelKey(NotificationType.PASSWORD_RESET, NotificationChannel.EMAIL)]: true,
  [channelKey(NotificationType.PASSWORD_RESET, NotificationChannel.WHATSAPP)]: false,
};
