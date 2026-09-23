import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  WhatsAppSession,
  AutoReplyRule,
  Contact,
  Chat,
  Message,
  AutoReplyLog,
  SystemLog,
  AppSettings,
  MatchType
} from '../types';
import {
  initialSessions,
  initialRules,
  initialContacts,
  initialChats,
  initialMessages,
  initialAutoReplyLogs,
  initialSystemLogs,
  initialSettings
} from '../data/mockData';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  description?: string;
}

export type ActiveTab =
  | 'overview'
  | 'sessions'
  | 'chats'
  | 'autoreply'
  | 'contacts'
  | 'settings'
  | 'logs'
  | 'profile';

const STORAGE_KEY_PREFIX = 'jeenash_wa_';

function getStorage<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    return saved ? JSON.parse(saved) : fallback;
  } catch (e) {
    console.warn(`Error reading localStorage for ${key}`, e);
    return fallback;
  }
}

function setStorage<T>(key: string, val: T): void {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(val));
  } catch (e) {
    console.warn(`Error writing localStorage for ${key}`, e);
  }
}

export function useAppStore() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return getStorage<boolean>('isAuth', false);
  });
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return getStorage<boolean>('darkMode', true);
  });

  // Sessions state
  const [sessions, setSessions] = useState<WhatsAppSession[]>(() => {
    return getStorage<WhatsAppSession[]>('sessions', initialSessions);
  });
  const [activeSessionId, setActiveSessionId] = useState<string>(() => {
    return sessions[0]?.id || 'session-1';
  });

  // Chats state
  const [chats, setChats] = useState<Chat[]>(() => {
    return getStorage<Chat[]>('chats', initialChats);
  });
  const [activeChatId, setActiveChatId] = useState<string>(() => {
    return chats[0]?.id || 'chat-1';
  });
  const [messages, setMessages] = useState<Record<string, Message[]>>(() => {
    return getStorage<Record<string, Message[]>>('messages', initialMessages);
  });
  const [isTyping, setIsTyping] = useState<Record<string, boolean>>({});

  // Auto-Reply Rules state
  const [rules, setRules] = useState<AutoReplyRule[]>(() => {
    return getStorage<AutoReplyRule[]>('rules', initialRules);
  });

  // Contacts state
  const [contacts, setContacts] = useState<Contact[]>(() => {
    return getStorage<Contact[]>('contacts', initialContacts);
  });

  // Logs state
  const [autoReplyLogs, setAutoReplyLogs] = useState<AutoReplyLog[]>(() => {
    return getStorage<AutoReplyLog[]>('autoReplyLogs', initialAutoReplyLogs);
  });
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>(() => {
    return getStorage<SystemLog[]>('systemLogs', initialSystemLogs);
  });

  // Settings state
  const [settings, setSettings] = useState<AppSettings>(() => {
    return getStorage<AppSettings>('settings', initialSettings);
  });

  // Deployment modal state
  const [isDeploymentModalOpen, setIsDeploymentModalOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((arg1: string, arg2?: string, arg3?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    let type: 'success' | 'error' | 'info' | 'warning' = 'info';
    let title = '';
    let description = '';

    if (arg1 === 'success' || arg1 === 'error' || arg1 === 'info' || arg1 === 'warning') {
      type = arg1;
      title = arg2 || '';
      description = arg3 || '';
    } else {
      title = arg1;
      description = arg2 || '';
      if (arg3 === 'success' || arg3 === 'error' || arg3 === 'warning' || arg3 === 'info') {
        type = arg3;
      }
    }

    setToasts(prev => [...prev, { id, type, title, description }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Save to localStorage when states update
  useEffect(() => {
    setStorage('isAuth', isAuthenticated);
  }, [isAuthenticated]);

  useEffect(() => {
    setStorage('darkMode', isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    setStorage('sessions', sessions);
  }, [sessions]);

  useEffect(() => {
    setStorage('chats', chats);
  }, [chats]);

  useEffect(() => {
    setStorage('messages', messages);
  }, [messages]);

  useEffect(() => {
    setStorage('rules', rules);
  }, [rules]);

  useEffect(() => {
    setStorage('contacts', contacts);
  }, [contacts]);

  useEffect(() => {
    setStorage('autoReplyLogs', autoReplyLogs);
  }, [autoReplyLogs]);

  useEffect(() => {
    setStorage('systemLogs', systemLogs);
  }, [systemLogs]);

  useEffect(() => {
    setStorage('settings', settings);
  }, [settings]);

  // Auth actions
  const login = useCallback((password: string) => {
    // Default password from user prompt: @Jeenash123
    const adminPass = '@Jeenash123';
    if (password === adminPass) {
      setIsAuthenticated(true);
      addToast('success', 'Authentication Successful', 'Welcome to Jeenash WA Business Platform');
      // add system log
      const newLog: SystemLog = {
        id: 'slog-' + Date.now(),
        timestamp: new Date().toISOString(),
        type: 'auth',
        message: 'Admin signed in successfully via JWT session (bearer token generated)',
        level: 'info'
      };
      setSystemLogs(prev => [newLog, ...prev]);
      return true;
    } else {
      addToast('error', 'Authentication Failed', 'Invalid admin password. Default is @Jeenash123');
      const failLog: SystemLog = {
        id: 'slog-' + Date.now(),
        timestamp: new Date().toISOString(),
        type: 'auth',
        message: 'Failed login attempt detected from client IP (rate limiter active: 1/5)',
        level: 'warn'
      };
      setSystemLogs(prev => [failLog, ...prev]);
      return false;
    }
  }, [addToast]);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    addToast('info', 'Logged Out', 'You have been safely signed out of the dashboard');
  }, [addToast]);

  // Sessions actions
  const addSession = useCallback((name: string, phoneNumber: string) => {
    const newSession: WhatsAppSession = {
      id: 'session-' + Date.now(),
      name: name.trim() || 'WhatsApp Business Line',
      phoneNumber: phoneNumber.trim(),
      status: 'connected',
      batteryLevel: 98,
      platform: 'Baileys Multi-Device (v6.7)',
      uptimeSeconds: 0,
      totalMessagesSent: 0,
      totalMessagesReceived: 0,
      lastActive: 'Just now',
      createdAt: new Date().toISOString()
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    addToast('success', 'Session Connected', `Baileys socket linked for ${newSession.name} (${newSession.phoneNumber})`);
    
    // add log
    setSystemLogs(prev => [
      {
        id: 'slog-' + Date.now(),
        timestamp: new Date().toISOString(),
        type: 'session',
        message: `New Baileys session initialized: ${newSession.id} (${newSession.phoneNumber})`,
        level: 'info'
      },
      ...prev
    ]);
    return newSession;
  }, [addToast]);

  const disconnectSession = useCallback((sessionId: string) => {
    setSessions(prev =>
      prev.map(s => (s.id === sessionId ? { ...s, status: 'disconnected' } : s))
    );
    addToast('warning', 'Session Disconnected', 'Socket closed and state saved in /sessions');
    setSystemLogs(prev => [
      {
        id: 'slog-' + Date.now(),
        timestamp: new Date().toISOString(),
        type: 'session',
        message: `Session ${sessionId} disconnected cleanly by administrator`,
        level: 'info'
      },
      ...prev
    ]);
  }, [addToast]);

  const reconnectSession = useCallback((sessionId: string) => {
    setSessions(prev =>
      prev.map(s => (s.id === sessionId ? { ...s, status: 'connecting' } : s))
    );
    addToast('info', 'Reconnecting Session', 'Restoring multi-file auth credentials...');

    setTimeout(() => {
      setSessions(prev =>
        prev.map(s => (s.id === sessionId ? { ...s, status: 'connected', lastActive: 'Just now' } : s))
      );
      addToast('success', 'Session Reconnected', 'WhatsApp socket online and listening for events');
      setSystemLogs(prev => [
        {
          id: 'slog-' + Date.now(),
          timestamp: new Date().toISOString(),
          type: 'session',
          message: `Session ${sessionId} re-authenticated successfully from /sessions directory`,
          level: 'info'
        },
        ...prev
      ]);
    }, 1500);
  }, [addToast]);

  // Matcher function for rules
  const testRuleMatch = useCallback((rule: AutoReplyRule, text: string): boolean => {
    if (!rule.enabled) return false;
    const cleanInput = text.trim().toLowerCase();
    
    return rule.keywords.some(keyword => {
      const cleanKeyword = keyword.trim().toLowerCase();
      if (!cleanKeyword) return false;

      switch (rule.matchType) {
        case 'exact':
          return cleanInput === cleanKeyword;
        case 'contains':
          return cleanInput.includes(cleanKeyword);
        case 'startsWith':
          return cleanInput.startsWith(cleanKeyword);
        case 'endsWith':
          return cleanInput.endsWith(cleanKeyword);
        case 'regex':
          try {
            const rx = new RegExp(keyword.trim(), 'i');
            return rx.test(text.trim());
          } catch (e) {
            return false;
          }
        default:
          return false;
      }
    });
  }, []);

  // Format reply placeholders
  const formatReply = useCallback((template: string, contactName: string): string => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    
    return template
      .replace(/{{name}}/gi, contactName)
      .replace(/{{time}}/gi, timeStr)
      .replace(/{{date}}/gi, dateStr);
  }, []);

  // Process Auto-Reply engine
  const triggerAutoReplyEvaluation = useCallback((
    chatId: string,
    sessionId: string,
    contactNumber: string,
    contactName: string,
    incomingText: string
  ) => {
    // 1. Check contact blacklist
    const contact = contacts.find(c => c.phoneNumber === contactNumber || c.name === contactName);
    if (contact?.isBlacklisted) {
      const skippedLog: AutoReplyLog = {
        id: 'log-' + Date.now(),
        timestamp: new Date().toISOString(),
        ruleId: 'none',
        ruleName: 'Blocked by Blacklist',
        contactNumber,
        contactName,
        incomingText,
        repliedText: 'Ignored: Contact is blacklisted',
        delayAppliedMs: 0,
        status: 'skipped_cooldown',
        sessionId
      };
      setAutoReplyLogs(prev => [skippedLog, ...prev]);
      return;
    }

    // 2. Sort rules by priority (higher runs first)
    const sortedRules = [...rules].sort((a, b) => b.priority - a.priority);

    // 3. Find first matching rule
    const matchedRule = sortedRules.find(rule => {
      // Check session compatibility
      if (!rule.applyToSessionIds.includes('all') && !rule.applyToSessionIds.includes(sessionId)) {
        return false;
      }
      return testRuleMatch(rule, incomingText);
    });

    if (!matchedRule) {
      return; // No match found
    }

    // Determine delay (randomized for natural feel if configured)
    const baseDelaySec = matchedRule.delaySeconds || settings.defaultDelaySeconds || 2;
    const finalDelayMs = settings.randomizeDelay
      ? Math.max(1000, (baseDelaySec + Math.random() * 2 - 1) * 1000)
      : baseDelaySec * 1000;

    // Show typing indicator in UI
    setIsTyping(prev => ({ ...prev, [chatId]: true }));

    setTimeout(() => {
      setIsTyping(prev => ({ ...prev, [chatId]: false }));

      const replyContent = formatReply(matchedRule.replyContent, contactName);

      const botMessage: Message = {
        id: 'msg-' + Date.now(),
        chatId,
        sessionId,
        sender: 'bot',
        senderName: 'Jeenash WA Bot',
        text: replyContent,
        status: 'read',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAutoReply: true
      };

      // Append bot message
      setMessages(prev => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), botMessage]
      }));

      // Update chat last message
      setChats(prev =>
        prev.map(c =>
          c.id === chatId
            ? {
                ...c,
                lastMessage: replyContent.slice(0, 60) + (replyContent.length > 60 ? '...' : ''),
                lastMessageTimestamp: botMessage.timestamp
              }
            : c
        )
      );

      // Increment rule trigger count
      setRules(prev =>
        prev.map(r => (r.id === matchedRule.id ? { ...r, triggerCount: r.triggerCount + 1 } : r))
      );

      // Add auto-reply log
      const newAutoReplyLog: AutoReplyLog = {
        id: 'log-' + Date.now(),
        timestamp: new Date().toISOString(),
        ruleId: matchedRule.id,
        ruleName: matchedRule.name,
        contactNumber,
        contactName,
        incomingText,
        repliedText: replyContent,
        delayAppliedMs: Math.round(finalDelayMs),
        status: 'sent',
        sessionId
      };
      setAutoReplyLogs(prev => [newAutoReplyLog, ...prev]);

      // Add system log
      setSystemLogs(prev => [
        {
          id: 'slog-' + Date.now(),
          timestamp: new Date().toISOString(),
          type: 'auto_reply',
          message: `Auto-reply triggered for ${contactName}: "${matchedRule.name}"`,
          details: `Sent after ${Math.round(finalDelayMs)}ms natural delay to ${contactNumber}`,
          level: 'info'
        },
        ...prev
      ]);
    }, finalDelayMs);
  }, [rules, contacts, settings, testRuleMatch, formatReply]);

  // Send message from admin
  const sendMessage = useCallback((chatId: string, text: string, media?: Partial<Message>) => {
    if (!text.trim() && !media) return;

    const chat = chats.find(c => c.id === chatId);
    const sessionId = chat?.sessionId || activeSessionId;

    const newMessage: Message = {
      id: 'msg-' + Date.now(),
      chatId,
      sessionId,
      sender: 'user',
      senderName: 'Admin',
      text: text.trim(),
      status: 'pending',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ...media
    };

    // Append message immediately
    setMessages(prev => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), newMessage]
    }));

    // Update last message in chat preview
    setChats(prev =>
      prev.map(c =>
        c.id === chatId
          ? {
              ...c,
              lastMessage: text || (media?.mediaType ? `[${media.mediaType.toUpperCase()}]` : ''),
              lastMessageTimestamp: newMessage.timestamp
            }
          : c
      )
    );

    // Simulate WhatsApp socket delivery sequence: pending -> sent -> delivered -> read
    setTimeout(() => {
      setMessages(prev => ({
        ...prev,
        [chatId]: (prev[chatId] || []).map(m =>
          m.id === newMessage.id ? { ...m, status: 'sent' } : m
        )
      }));
    }, 400);

    setTimeout(() => {
      setMessages(prev => ({
        ...prev,
        [chatId]: (prev[chatId] || []).map(m =>
          m.id === newMessage.id ? { ...m, status: 'delivered' } : m
        )
      }));
    }, 1000);

    setTimeout(() => {
      setMessages(prev => ({
        ...prev,
        [chatId]: (prev[chatId] || []).map(m =>
          m.id === newMessage.id ? { ...m, status: 'read' } : m
        )
      }));
    }, 2200);

    // Update session sent message count
    setSessions(prev =>
      prev.map(s =>
        s.id === sessionId
          ? { ...s, totalMessagesSent: s.totalMessagesSent + 1, lastActive: 'Just now' }
          : s
      )
    );
  }, [chats, activeSessionId]);

  // Simulate customer incoming message (allows testing auto-replies interactively!)
  const simulateCustomerMessage = useCallback((chatId: string, incomingText: string) => {
    const chat = chats.find(c => c.id === chatId);
    if (!chat) return;

    const newIncoming: Message = {
      id: 'msg-' + Date.now(),
      chatId,
      sessionId: chat.sessionId,
      sender: 'contact',
      senderName: chat.contactName,
      text: incomingText,
      status: 'read',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), newIncoming]
    }));

    setChats(prev =>
      prev.map(c =>
        c.id === chatId
          ? {
              ...c,
              lastMessage: incomingText,
              lastMessageTimestamp: newIncoming.timestamp,
              unreadCount: 0
            }
          : c
      )
    );

    // Update session received count
    setSessions(prev =>
      prev.map(s =>
        s.id === chat.sessionId
          ? { ...s, totalMessagesReceived: s.totalMessagesReceived + 1, lastActive: 'Just now' }
          : s
      )
    );

    // Evaluate Auto-Reply
    triggerAutoReplyEvaluation(
      chatId,
      chat.sessionId,
      chat.contactNumber,
      chat.contactName,
      incomingText
    );
  }, [chats, triggerAutoReplyEvaluation]);

  // Auto-Reply Rules CRUD
  const addRule = useCallback((rule: Omit<AutoReplyRule, 'id' | 'triggerCount' | 'createdAt'>) => {
    const newRule: AutoReplyRule = {
      ...rule,
      id: 'rule-' + Date.now(),
      triggerCount: 0,
      createdAt: new Date().toISOString()
    };
    setRules(prev => [newRule, ...prev]);
    addToast('success', 'Rule Created', `Auto-reply rule "${newRule.name}" is now live`);
  }, [addToast]);

  const updateRule = useCallback((updated: AutoReplyRule) => {
    setRules(prev => prev.map(r => (r.id === updated.id ? updated : r)));
    addToast('success', 'Rule Updated', `Rule "${updated.name}" settings saved`);
  }, [addToast]);

  const deleteRule = useCallback((ruleId: string) => {
    setRules(prev => prev.filter(r => r.id !== ruleId));
    addToast('info', 'Rule Deleted', 'Auto-reply rule has been removed');
  }, [addToast]);

  const toggleRule = useCallback((ruleId: string) => {
    setRules(prev =>
      prev.map(r => (r.id === ruleId ? { ...r, enabled: !r.enabled } : r))
    );
  }, []);

  const importRules = useCallback((importedRules: AutoReplyRule[]) => {
    if (!Array.isArray(importedRules) || importedRules.length === 0) {
      addToast('error', 'Import Failed', 'Invalid rules format');
      return;
    }
    setRules(prev => [...importedRules, ...prev]);
    addToast('success', 'Rules Imported', `Successfully added ${importedRules.length} rules`);
  }, [addToast]);

  // Contacts Actions
  const addContact = useCallback((contact: Omit<Contact, 'id'>) => {
    const newContact: Contact = {
      ...contact,
      id: 'contact-' + Date.now()
    };
    setContacts(prev => [newContact, ...prev]);
    addToast('success', 'Contact Added', `${newContact.name} was added to contacts`);
  }, [addToast]);

  const toggleContactWhitelist = useCallback((contactId: string) => {
    setContacts(prev =>
      prev.map(c =>
        c.id === contactId
          ? { ...c, isWhitelisted: !c.isWhitelisted, isBlacklisted: false }
          : c
      )
    );
  }, []);

  const toggleContactBlacklist = useCallback((contactId: string) => {
    setContacts(prev =>
      prev.map(c =>
        c.id === contactId
          ? { ...c, isBlacklisted: !c.isBlacklisted, isWhitelisted: false }
          : c
      )
    );
  }, []);

  const importContactsCsv = useCallback((csvText: string) => {
    try {
      const lines = csvText.split('\n').filter(l => l.trim().length > 0);
      const newItems: Contact[] = [];

      // skip header if present
      const startIdx = lines[0].toLowerCase().includes('name') ? 1 : 0;
      for (let i = startIdx; i < lines.length; i++) {
        const parts = lines[i].split(',').map(p => p.trim().replace(/^["']|["']$/g, ''));
        if (parts.length >= 2) {
          const name = parts[0];
          const phoneNumber = parts[1];
          const tags = parts[2] ? parts[2].split(';') : ['CSV Import'];
          newItems.push({
            id: 'contact-' + Date.now() + '-' + i,
            name,
            phoneNumber,
            isWhitelisted: false,
            isBlacklisted: false,
            tags
          });
        }
      }

      if (newItems.length > 0) {
        setContacts(prev => [...newItems, ...prev]);
        addToast('success', 'Contacts Imported', `Imported ${newItems.length} contacts from CSV`);
      } else {
        addToast('warning', 'Empty CSV', 'No valid contact rows found. Format: Name, Phone, Tags');
      }
    } catch (e) {
      addToast('error', 'CSV Parse Error', 'Could not parse CSV file');
    }
  }, [addToast]);

  const updateContact = useCallback((updated: Contact) => {
    setContacts(prev => prev.map(c => c.id === updated.id ? updated : c));
    addToast('success', 'Contact Updated', `Saved details for ${updated.name}`);
  }, [addToast]);

  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    addToast('success', 'Settings Saved', 'Platform configuration successfully saved.');
  }, [addToast]);

  const clearLogs = useCallback(() => {
    setAutoReplyLogs([]);
    setSystemLogs([]);
    addToast('info', 'Logs Cleared', 'In-memory audit logs have been reset.');
  }, [addToast]);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  return {
    // Auth & Navigation
    isAuthenticated,
    login,
    logout,
    activeTab,
    setActiveTab,
    isDarkMode,
    setIsDarkMode,
    toggleDarkMode,

    // Sessions
    sessions,
    activeSessionId,
    setActiveSessionId,
    addSession,
    disconnectSession,
    reconnectSession,

    // Chats & Messages
    chats,
    activeChatId,
    setActiveChatId,
    messages,
    isTyping,
    sendMessage,
    simulateCustomerMessage,

    // Auto-Reply
    rules,
    addRule,
    updateRule,
    deleteRule,
    toggleRule,
    importRules,
    testRuleMatch,
    formatReply,

    // Contacts
    contacts,
    addContact,
    updateContact,
    toggleContactWhitelist,
    toggleContactBlacklist,
    importContactsCsv,

    // Logs & Settings
    autoReplyLogs,
    systemLogs,
    clearLogs,
    settings,
    setSettings,
    updateSettings,

    // Toasts & Deployment Modal
    toasts,
    addToast,
    removeToast,
    isDeploymentModalOpen,
    setIsDeploymentModalOpen
  };
}
