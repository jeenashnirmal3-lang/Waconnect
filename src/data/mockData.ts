import { WhatsAppSession, AutoReplyRule, Contact, Chat, Message, AutoReplyLog, SystemLog, AppSettings } from '../types';

export const initialSessions: WhatsAppSession[] = [
  {
    id: 'session-1',
    name: 'Primary Sales Line',
    phoneNumber: '+91 98234 56789',
    status: 'connected',
    batteryLevel: 94,
    platform: 'iOS 18.2 (Baileys v6.7)',
    uptimeSeconds: 86400 * 3 + 14200,
    totalMessagesSent: 1420,
    totalMessagesReceived: 1890,
    lastActive: 'Just now',
    createdAt: '2026-09-18T10:00:00Z',
  },
  {
    id: 'session-2',
    name: 'Support & Helpdesk',
    phoneNumber: '+1 (415) 890-2341',
    status: 'connected',
    batteryLevel: 78,
    platform: 'Android 14 (Baileys v6.7)',
    uptimeSeconds: 86400 * 1 + 3600,
    totalMessagesSent: 852,
    totalMessagesReceived: 934,
    lastActive: '2 min ago',
    createdAt: '2026-09-20T12:00:00Z',
  },
  {
    id: 'session-3',
    name: 'VIP Concierge',
    phoneNumber: '+44 7700 900123',
    status: 'disconnected',
    batteryLevel: 42,
    platform: 'Web Client (Baileys v6.7)',
    uptimeSeconds: 0,
    totalMessagesSent: 340,
    totalMessagesReceived: 410,
    lastActive: 'Yesterday',
    createdAt: '2026-09-15T08:00:00Z',
  }
];

export const initialRules: AutoReplyRule[] = [
  {
    id: 'rule-1',
    name: 'Welcome & Greeting',
    keywords: ['hi', 'hello', 'hey', 'start', 'namaste'],
    matchType: 'contains',
    replyType: 'text',
    replyContent: 'Hello {{name}}! 👋 Welcome to Jeenash Enterprise. How can our team assist you today?\n\n1️⃣ Product Pricing & Plans\n2️⃣ Schedule Live Demo\n3️⃣ Talk to Support Rep\n\nReply with a number or type your query.',
    delaySeconds: 2,
    workingHoursOnly: false,
    cooldownSeconds: 120,
    priority: 90,
    enabled: true,
    applyToSessionIds: ['all'],
    contactFilterType: 'all',
    triggerCount: 428,
    createdAt: '2026-09-19T00:00:00Z'
  },
  {
    id: 'rule-2',
    name: 'Pricing & Brochure',
    keywords: ['price', 'pricing', 'cost', 'plan', 'quote', 'brochure'],
    matchType: 'contains',
    replyType: 'text',
    replyContent: 'Here is our standard pricing structure, {{name}}:\n\n🚀 Starter: $29/mo (Up to 3 WA numbers, 10k messages)\n⚡ Pro: $79/mo (Unlimited numbers, custom auto-reply, Webhooks)\n🏢 Enterprise: $199/mo (Dedicated VPS, White-label, SLA)\n\nFull PDF catalog has been dispatched. Would you like to schedule an onboarding call at {{time}}?',
    delaySeconds: 4,
    workingHoursOnly: false,
    cooldownSeconds: 300,
    priority: 80,
    enabled: true,
    applyToSessionIds: ['all'],
    contactFilterType: 'all',
    triggerCount: 312,
    createdAt: '2026-09-19T01:00:00Z'
  },
  {
    id: 'rule-3',
    name: 'Working Hours Auto-Responder',
    keywords: ['urgent', 'emergency', 'help', 'human', 'agent'],
    matchType: 'contains',
    replyType: 'text',
    replyContent: 'Thank you for reaching out, {{name}}. Our support engineers are currently online. An executive has been notified and will respond to this chat within 10-15 minutes.',
    delaySeconds: 3,
    workingHoursOnly: true,
    workingHoursStart: '09:00',
    workingHoursEnd: '21:00',
    cooldownSeconds: 180,
    priority: 95,
    enabled: true,
    applyToSessionIds: ['all'],
    contactFilterType: 'all',
    triggerCount: 154,
    createdAt: '2026-09-19T02:00:00Z'
  },
  {
    id: 'rule-4',
    name: 'Demo Booking Link',
    keywords: ['demo', 'trial', 'schedule'],
    matchType: 'contains',
    replyType: 'text',
    replyContent: 'Great! You can pick any suitable slot on our calendar right here: https://cal.jeenashera.online/demo\n\nLooking forward to showing you the full automation engine!',
    delaySeconds: 3,
    workingHoursOnly: false,
    cooldownSeconds: 360,
    priority: 85,
    enabled: true,
    applyToSessionIds: ['all'],
    contactFilterType: 'all',
    triggerCount: 98,
    createdAt: '2026-09-19T03:00:00Z'
  },
  {
    id: 'rule-5',
    name: 'Exact Order Status',
    keywords: ['^order #?\\d+$'],
    matchType: 'regex',
    replyType: 'text',
    replyContent: 'Order Status Query received for {{name}} at {{time}}. Your order is currently: In Transit 🚚. Expected delivery within 24-48 hours.',
    delaySeconds: 2,
    workingHoursOnly: false,
    cooldownSeconds: 60,
    priority: 70,
    enabled: true,
    applyToSessionIds: ['all'],
    contactFilterType: 'all',
    triggerCount: 64,
    createdAt: '2026-09-20T05:00:00Z'
  }
];

export const initialContacts: Contact[] = [
  {
    id: 'contact-1',
    name: 'Rajesh Sharma',
    phoneNumber: '+91 98111 22334',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    isWhitelisted: true,
    isBlacklisted: false,
    tags: ['VIP Client', 'Tech Lead'],
    lastContacted: '10 min ago',
    notes: 'Interested in 50 multi-session licenses'
  },
  {
    id: 'contact-2',
    name: 'Elena Rostova',
    phoneNumber: '+1 (312) 555-0188',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    isWhitelisted: true,
    isBlacklisted: false,
    tags: ['Enterprise', 'USA'],
    lastContacted: '25 min ago',
    notes: 'Waiting for custom Nginx config guide'
  },
  {
    id: 'contact-3',
    name: 'Vikram Patel',
    phoneNumber: '+91 99200 44556',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    isWhitelisted: false,
    isBlacklisted: false,
    tags: ['Prospect', 'E-commerce'],
    lastContacted: '1 hour ago',
    notes: 'Asked for pricing brochure'
  },
  {
    id: 'contact-4',
    name: 'Sarah Jenkins',
    phoneNumber: '+44 7911 123456',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    isWhitelisted: false,
    isBlacklisted: false,
    tags: ['Marketing Lead'],
    lastContacted: '3 hours ago',
    notes: 'Sent voice note inquiring about webhooks'
  },
  {
    id: 'contact-5',
    name: 'Marcus Vance',
    phoneNumber: '+61 412 345 678',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    isWhitelisted: false,
    isBlacklisted: true,
    tags: ['Spam', 'Blacklisted'],
    lastContacted: '2 days ago',
    notes: 'Sent promotional spam; blocked from auto-replies'
  }
];

export const initialChats: Chat[] = [
  {
    id: 'chat-1',
    sessionId: 'session-1',
    contactId: 'contact-1',
    contactName: 'Rajesh Sharma',
    contactNumber: '+91 98111 22334',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    lastMessage: 'Great! The auto-reply sent the contract details promptly.',
    lastMessageTimestamp: '10:42 AM',
    unreadCount: 0,
    isArchived: false,
    isPinned: true,
    online: true
  },
  {
    id: 'chat-2',
    sessionId: 'session-1',
    contactId: 'contact-2',
    contactName: 'Elena Rostova',
    contactNumber: '+1 (312) 555-0188',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    lastMessage: 'Can you share the pricing structure for 10 sessions?',
    lastMessageTimestamp: '10:15 AM',
    unreadCount: 2,
    isArchived: false,
    isPinned: true,
    online: true
  },
  {
    id: 'chat-3',
    sessionId: 'session-1',
    contactId: 'contact-3',
    contactName: 'Vikram Patel',
    contactNumber: '+91 99200 44556',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    lastMessage: 'Hello, please send the demo link.',
    lastMessageTimestamp: '09:30 AM',
    unreadCount: 0,
    isArchived: false,
    isPinned: false,
    online: false
  },
  {
    id: 'chat-4',
    sessionId: 'session-2',
    contactId: 'contact-4',
    contactName: 'Sarah Jenkins',
    contactNumber: '+44 7911 123456',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    lastMessage: 'Voice Note (0:14)',
    lastMessageTimestamp: 'Yesterday',
    unreadCount: 0,
    isArchived: false,
    isPinned: false,
    online: false
  }
];

export const initialMessages: Record<string, Message[]> = {
  'chat-1': [
    {
      id: 'm1-1',
      chatId: 'chat-1',
      sessionId: 'session-1',
      sender: 'contact',
      senderName: 'Rajesh Sharma',
      text: 'Hi team, I would like to know about the multi-session WhatsApp engine setup.',
      status: 'read',
      timestamp: '10:38 AM'
    },
    {
      id: 'm1-2',
      chatId: 'chat-1',
      sessionId: 'session-1',
      sender: 'bot',
      senderName: 'Jeenash WA Bot',
      text: 'Hello Rajesh Sharma! 👋 Welcome to Jeenash Enterprise. How can our team assist you today?\n\n1️⃣ Product Pricing & Plans\n2️⃣ Schedule Live Demo\n3️⃣ Talk to Support Rep',
      status: 'read',
      timestamp: '10:38 AM',
      isAutoReply: true
    },
    {
      id: 'm1-3',
      chatId: 'chat-1',
      sessionId: 'session-1',
      sender: 'contact',
      senderName: 'Rajesh Sharma',
      text: 'Thanks! Here is the architecture doc we were discussing yesterday.',
      mediaType: 'document',
      mediaName: 'Enterprise_Architecture_v2.pdf',
      mediaSize: '2.4 MB',
      status: 'read',
      timestamp: '10:40 AM'
    },
    {
      id: 'm1-4',
      chatId: 'chat-1',
      sessionId: 'session-1',
      sender: 'user',
      senderName: 'Admin',
      text: 'Received! Our senior architect is reviewing the server specifications now.',
      status: 'read',
      timestamp: '10:41 AM'
    },
    {
      id: 'm1-5',
      chatId: 'chat-1',
      sessionId: 'session-1',
      sender: 'contact',
      senderName: 'Rajesh Sharma',
      text: 'Great! The auto-reply sent the contract details promptly.',
      status: 'read',
      timestamp: '10:42 AM'
    }
  ],
  'chat-2': [
    {
      id: 'm2-1',
      chatId: 'chat-2',
      sessionId: 'session-1',
      sender: 'contact',
      senderName: 'Elena Rostova',
      text: 'Hi Jeenash team! We are scaling our sales representatives next month.',
      status: 'read',
      timestamp: '10:12 AM'
    },
    {
      id: 'm2-2',
      chatId: 'chat-2',
      sessionId: 'session-1',
      sender: 'contact',
      senderName: 'Elena Rostova',
      text: 'Can you share the pricing structure for 10 sessions?',
      status: 'delivered',
      timestamp: '10:15 AM'
    }
  ],
  'chat-3': [
    {
      id: 'm3-1',
      chatId: 'chat-3',
      sessionId: 'session-1',
      sender: 'contact',
      senderName: 'Vikram Patel',
      text: 'Hello, please send the demo link.',
      status: 'read',
      timestamp: '09:29 AM'
    },
    {
      id: 'm3-2',
      chatId: 'chat-3',
      sessionId: 'session-1',
      sender: 'bot',
      senderName: 'Jeenash WA Bot',
      text: 'Great! You can pick any suitable slot on our calendar right here: https://cal.jeenashera.online/demo\n\nLooking forward to showing you the full automation engine!',
      status: 'read',
      timestamp: '09:30 AM',
      isAutoReply: true
    }
  ],
  'chat-4': [
    {
      id: 'm4-1',
      chatId: 'chat-4',
      sessionId: 'session-2',
      sender: 'contact',
      senderName: 'Sarah Jenkins',
      text: 'Hey! Quick question regarding webhook signatures.',
      status: 'read',
      timestamp: 'Yesterday 04:12 PM'
    },
    {
      id: 'm4-2',
      chatId: 'chat-4',
      sessionId: 'session-2',
      sender: 'contact',
      senderName: 'Sarah Jenkins',
      text: 'Voice Note (0:14)',
      mediaType: 'audio',
      mediaName: 'voice_note_sarah.ogg',
      mediaSize: '142 KB',
      status: 'read',
      timestamp: 'Yesterday 04:14 PM'
    }
  ]
};

export const initialAutoReplyLogs: AutoReplyLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-09-22T16:32:10Z',
    ruleId: 'rule-1',
    ruleName: 'Welcome & Greeting',
    contactNumber: '+91 98111 22334',
    contactName: 'Rajesh Sharma',
    incomingText: 'Hi team, I would like to know about...',
    repliedText: 'Hello Rajesh Sharma! 👋 Welcome to Jeenash Enterprise...',
    delayAppliedMs: 2000,
    status: 'sent',
    sessionId: 'session-1'
  },
  {
    id: 'log-2',
    timestamp: '2026-09-22T15:45:22Z',
    ruleId: 'rule-4',
    ruleName: 'Demo Booking Link',
    contactNumber: '+91 99200 44556',
    contactName: 'Vikram Patel',
    incomingText: 'Hello, please send the demo link.',
    repliedText: 'Great! You can pick any suitable slot on our calendar...',
    delayAppliedMs: 3100,
    status: 'sent',
    sessionId: 'session-1'
  },
  {
    id: 'log-3',
    timestamp: '2026-09-22T14:10:05Z',
    ruleId: 'rule-2',
    ruleName: 'Pricing & Brochure',
    contactNumber: '+1 (312) 555-0188',
    contactName: 'Elena Rostova',
    incomingText: 'what is the price per month?',
    repliedText: 'Here is our standard pricing structure, Elena Rostova...',
    delayAppliedMs: 4000,
    status: 'sent',
    sessionId: 'session-1'
  },
  {
    id: 'log-4',
    timestamp: '2026-09-22T12:02:18Z',
    ruleId: 'rule-1',
    ruleName: 'Welcome & Greeting',
    contactNumber: '+61 412 345 678',
    contactName: 'Marcus Vance',
    incomingText: 'hi there',
    repliedText: 'Skipped - Contact is on Blacklist',
    delayAppliedMs: 0,
    status: 'skipped_cooldown',
    sessionId: 'session-1'
  }
];

export const initialSystemLogs: SystemLog[] = [
  {
    id: 'slog-1',
    timestamp: '2026-09-22T16:30:00Z',
    type: 'session',
    message: 'Session session-1 (Primary Sales Line) WebSocket connection healthy (ping: 28ms)',
    level: 'info'
  },
  {
    id: 'slog-2',
    timestamp: '2026-09-22T16:00:15Z',
    type: 'auto_reply',
    message: 'Auto-reply rule "Welcome & Greeting" dispatched message to +91 98111 22334',
    details: 'Matched keyword "hi" with 2000ms randomized natural delay',
    level: 'info'
  },
  {
    id: 'slog-3',
    timestamp: '2026-09-22T15:20:44Z',
    type: 'auth',
    message: 'Admin authentication success from IP 103.21.244.10 (JWT Issued, exp: 15m)',
    level: 'info'
  },
  {
    id: 'slog-4',
    timestamp: '2026-09-22T14:15:30Z',
    type: 'session',
    message: 'Session session-3 (VIP Concierge) disconnected by remote device',
    details: 'Connection closed: 401 logged out from mobile client',
    level: 'warn'
  },
  {
    id: 'slog-5',
    timestamp: '2026-09-22T11:05:00Z',
    type: 'system',
    message: 'Prisma DB vacuum and session file permissions audited (0700 enforced)',
    level: 'info'
  }
];

export const initialSettings: AppSettings = {
  workingHoursEnabled: true,
  workingHoursStart: '09:00',
  workingHoursEnd: '21:00',
  timezone: 'Asia/Kolkata (IST +05:30)',
  defaultDelaySeconds: 3,
  randomizeDelay: true,
  cooldownSeconds: 60,
  maxMessagesPerHourPerContact: 10,
  antiBanProtection: true,
  webhookUrl: 'https://wa.jeenashera.online/api/webhooks/messages',
  notificationsSound: true,
  darkMode: true
};
