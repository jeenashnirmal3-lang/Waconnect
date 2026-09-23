export type ConnectionStatus = 'connected' | 'connecting' | 'waiting_qr' | 'disconnected';

export interface WhatsAppSession {
  id: string;
  name: string;
  phoneNumber: string;
  status: ConnectionStatus;
  qrCode?: string;
  pairingCode?: string;
  batteryLevel?: number;
  platform?: string;
  uptimeSeconds: number;
  totalMessagesSent: number;
  totalMessagesReceived: number;
  lastActive: string;
  createdAt: string;
}

export type MatchType = 'exact' | 'contains' | 'startsWith' | 'endsWith' | 'regex';
export type ReplyType = 'text' | 'image' | 'video' | 'document' | 'template';

export interface AutoReplyRule {
  id: string;
  name: string;
  keywords: string[]; // comma separated or array
  matchType: MatchType;
  replyType: ReplyType;
  replyContent: string;
  mediaUrl?: string;
  delaySeconds: number; // 0-60
  workingHoursOnly: boolean;
  workingHoursStart?: string; // e.g. "09:00"
  workingHoursEnd?: string;   // e.g. "21:00"
  cooldownSeconds: number;    // default 60
  priority: number;           // 1-100
  enabled: boolean;
  applyToSessionIds: string[]; // 'all' or specific session IDs
  contactFilterType: 'all' | 'whitelist' | 'blacklist';
  triggerCount: number;
  createdAt: string;
}

export interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
  avatar?: string;
  isWhitelisted: boolean;
  isBlacklisted: boolean;
  tags: string[];
  lastContacted?: string;
  notes?: string;
}

export type MessageStatus = 'pending' | 'sent' | 'delivered' | 'read' | 'failed';

export interface Message {
  id: string;
  chatId: string;
  sessionId: string;
  sender: 'user' | 'contact' | 'bot';
  senderName: string;
  text: string;
  mediaType?: 'image' | 'video' | 'audio' | 'document';
  mediaUrl?: string;
  mediaName?: string;
  mediaSize?: string;
  status: MessageStatus;
  timestamp: string;
  isAutoReply?: boolean;
  replyToId?: string;
}

export interface Chat {
  id: string;
  sessionId: string;
  contactId: string;
  contactName: string;
  contactNumber: string;
  avatar: string;
  lastMessage: string;
  lastMessageTimestamp: string;
  unreadCount: number;
  isArchived: boolean;
  isPinned: boolean;
  online: boolean;
}

export interface AutoReplyLog {
  id: string;
  timestamp: string;
  ruleId: string;
  ruleName: string;
  contactNumber: string;
  contactName: string;
  incomingText: string;
  repliedText: string;
  delayAppliedMs: number;
  status: 'sent' | 'skipped_cooldown' | 'skipped_hours' | 'error';
  sessionId: string;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  type: 'auth' | 'session' | 'auto_reply' | 'system' | 'error';
  category?: string;
  message: string;
  details?: string;
  level: 'info' | 'warn' | 'error';
}

export interface AppSettings {
  workingHoursEnabled: boolean;
  workingHoursStart: string;
  workingHoursEnd: string;
  timezone: string;
  defaultDelaySeconds: number;
  minDelaySeconds?: number;
  maxDelaySeconds?: number;
  maxMessagesPerHour?: number;
  randomizeDelay: boolean;
  cooldownSeconds: number;
  maxMessagesPerHourPerContact: number;
  antiBanProtection: boolean;
  webhookUrl: string;
  notificationsSound: boolean;
  soundNotification?: boolean;
  darkMode: boolean;
}
