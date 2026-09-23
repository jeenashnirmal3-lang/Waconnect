import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Check,
  CheckCheck,
  Paperclip,
  Smile,
  Send,
  MoreVertical,
  Phone,
  Video,
  FileText,
  Image as ImageIcon,
  Play,
  Pause,
  Download,
  Copy,
  Trash2,
  CornerUpLeft,
  Share2,
  Sparkles,
  Bot,
  UserCheck,
  X,
  Mic,
  Maximize2
} from 'lucide-react';
import { Chat, Message, WhatsAppSession } from '../types';

interface ChatsPageProps {
  chats: Chat[];
  activeChatId: string;
  onSelectChat: (id: string) => void;
  messages: Record<string, Message[]>;
  isTyping: Record<string, boolean>;
  onSendMessage: (chatId: string, text: string, media?: Partial<Message>) => void;
  onSimulateCustomerMessage: (chatId: string, text: string) => void;
  sessions: WhatsAppSession[];
  activeSessionId: string;
}

export const ChatsPage: React.FC<ChatsPageProps> = ({
  chats,
  activeChatId,
  onSelectChat,
  messages,
  isTyping,
  onSendMessage,
  onSimulateCustomerMessage,
  sessions,
  activeSessionId
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'archived'>('all');
  const [inputText, setInputText] = useState('');
  const [chatSearchQuery, setChatSearchQuery] = useState('');
  const [isChatSearchOpen, setIsChatSearchOpen] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = useState(false);
  const [activeMediaLightbox, setActiveMediaLightbox] = useState<string | null>(null);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  // Context menu state
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    message: Message | null;
  }>({ visible: false, x: 0, y: 0, message: null });

  // Quick simulate input
  const [simulateInputText, setSimulateInputText] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const activeChat = chats.find(c => c.id === activeChatId) || chats[0];
  const chatMessages = (activeChat ? messages[activeChat.id] : []) || [];

  // Auto-scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  // Close context menu on window click
  useEffect(() => {
    const handleClick = () => {
      if (contextMenu.visible) {
        setContextMenu({ visible: false, x: 0, y: 0, message: null });
      }
      setIsEmojiPickerOpen(false);
      setIsAttachmentMenuOpen(false);
    };
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [contextMenu.visible]);

  // Filter chats list
  const filteredChats = chats.filter(chat => {
    const matchesSearch =
      chat.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.contactNumber.includes(searchQuery);

    if (filterType === 'unread') return matchesSearch && chat.unreadCount > 0;
    if (filterType === 'archived') return matchesSearch && chat.isArchived;
    return matchesSearch && !chat.isArchived;
  });

  // Filter messages within conversation
  const displayedMessages = chatSearchQuery.trim()
    ? chatMessages.filter(m => m.text?.toLowerCase().includes(chatSearchQuery.toLowerCase()))
    : chatMessages;

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !activeChat) return;

    onSendMessage(activeChat.id, inputText);
    setInputText('');
  };

  const handleSimulateSubmit = (textToSimulate?: string) => {
    const text = textToSimulate || simulateInputText;
    if (!text.trim() || !activeChat) return;
    onSimulateCustomerMessage(activeChat.id, text.trim());
    setSimulateInputText('');
  };

  const handleContextMenu = (e: React.MouseEvent, message: Message) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      visible: true,
      x: Math.min(e.clientX, window.innerWidth - 180),
      y: Math.min(e.clientY, window.innerHeight - 200),
      message
    });
  };

  const handleCopyMessage = () => {
    if (contextMenu.message?.text) {
      navigator.clipboard.writeText(contextMenu.message.text);
    }
    setContextMenu({ visible: false, x: 0, y: 0, message: null });
  };

  const handleAddEmoji = (emoji: string) => {
    setInputText(prev => prev + emoji);
  };

  const handleAttachDemoMedia = (type: 'image' | 'document' | 'video') => {
    if (!activeChat) return;
    if (type === 'image') {
      onSendMessage(activeChat.id, 'Attached photo for inquiry review', {
        mediaType: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
        mediaName: 'analytics_dashboard_screenshot.png'
      });
    } else if (type === 'document') {
      onSendMessage(activeChat.id, 'Here is the requested SLA document', {
        mediaType: 'document',
        mediaName: 'Service_Level_Agreement_2026.pdf',
        mediaSize: '1.8 MB'
      });
    } else if (type === 'video') {
      onSendMessage(activeChat.id, 'Watch this 30s setup preview', {
        mediaType: 'video',
        mediaName: 'onboarding_quickstart.mp4',
        mediaSize: '8.4 MB'
      });
    }
    setIsAttachmentMenuOpen(false);
  };

  const commonEmojis = ['👋', '✅', '🚀', '🔥', '👍', '🙏', '💼', '⭐', '❤️', '🎉'];

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full overflow-hidden bg-[#0b0f19]">
      {/* ======================================================== */}
      {/* LEFT PANEL (350px): Chat List with Search & Filters     */}
      {/* ======================================================== */}
      <div className="w-[350px] border-r border-slate-800 bg-[#0f172a]/70 flex flex-col shrink-0 select-none">
        {/* Header & Search */}
        <div className="p-3.5 border-b border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white tracking-tight">Conversations</h2>
            <span className="text-[11px] text-slate-400 font-mono">
              {filteredChats.length} active
            </span>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search chat or phone..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Segmented Filter Controls */}
          <div className="flex items-center gap-1 p-1 bg-slate-900/90 rounded-lg border border-slate-800/80">
            <button
              onClick={() => setFilterType('all')}
              className={`flex-1 py-1 text-[11px] font-medium rounded-md transition-colors ${
                filterType === 'all'
                  ? 'bg-purple-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('unread')}
              className={`flex-1 py-1 text-[11px] font-medium rounded-md transition-colors ${
                filterType === 'unread'
                  ? 'bg-purple-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Unread
            </button>
            <button
              onClick={() => setFilterType('archived')}
              className={`flex-1 py-1 text-[11px] font-medium rounded-md transition-colors ${
                filterType === 'archived'
                  ? 'bg-purple-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Archived
            </button>
          </div>
        </div>

        {/* Chat List Scrollable */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/50">
          {filteredChats.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No conversations found.
            </div>
          ) : (
            filteredChats.map(chat => {
              const isActive = chat.id === activeChatId;
              const typingNow = isTyping[chat.id];

              return (
                <button
                  key={chat.id}
                  onClick={() => onSelectChat(chat.id)}
                  className={`w-full p-3.5 flex items-start gap-3 text-left transition-colors relative ${
                    isActive
                      ? 'bg-purple-900/25 border-l-4 border-purple-500'
                      : 'hover:bg-slate-900/50'
                  }`}
                >
                  {/* Contact Avatar */}
                  <div className="relative shrink-0">
                    <img
                      src={chat.avatar}
                      alt={chat.contactName}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover border border-slate-700 bg-slate-800"
                    />
                    {chat.online && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900" />
                    )}
                  </div>

                  {/* Name and Last Message */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between mb-0.5">
                      <h4
                        className={`text-xs font-semibold truncate ${
                          isActive ? 'text-purple-200' : 'text-slate-200'
                        }`}
                      >
                        {chat.contactName}
                      </h4>
                      <span className="text-[10px] text-slate-500 font-mono shrink-0 ml-1">
                        {chat.lastMessageTimestamp}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-1">
                      {typingNow ? (
                        <span className="text-[11px] text-emerald-400 font-medium italic flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                          typing auto-reply...
                        </span>
                      ) : (
                        <p className="text-[11px] text-slate-400 truncate flex-1">
                          {chat.lastMessage}
                        </p>
                      )}

                      {chat.unreadCount > 0 && (
                        <span className="w-4 h-4 rounded-full bg-purple-600 text-white text-[9px] font-bold flex items-center justify-center shrink-0">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* RIGHT PANEL: Conversation View & Live Simulation         */}
      {/* ======================================================== */}
      <div className="flex-1 flex flex-col h-full bg-[#0b0f19] relative">
        {/* Conversation Header */}
        {activeChat ? (
          <div className="h-16 border-b border-slate-800 bg-[#0f172a]/90 backdrop-blur-md px-5 flex items-center justify-between shrink-0 z-20">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={activeChat.avatar}
                  alt={activeChat.contactName}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover border border-purple-500/30"
                />
                {activeChat.online && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">{activeChat.contactName}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 font-mono">
                    {activeChat.contactNumber}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-2">
                  <span>{activeChat.online ? 'Online now' : 'Last seen recently'}</span>
                  <span>&middot;</span>
                  <span>Session: {activeSessionId}</span>
                </div>
              </div>
            </div>

            {/* Conversation Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsChatSearchOpen(!isChatSearchOpen)}
                className={`p-2 rounded-lg transition-colors ${
                  isChatSearchOpen
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
                title="Search inside this conversation"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="h-16 border-b border-slate-800 px-5 flex items-center text-xs text-slate-400">
            Select a conversation
          </div>
        )}

        {/* Search In Chat Bar (when opened) */}
        {isChatSearchOpen && (
          <div className="px-5 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between gap-3 animate-in slide-in-from-top-1">
            <div className="flex items-center gap-2 flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={chatSearchQuery}
                onChange={e => setChatSearchQuery(e.target.value)}
                placeholder="Search messages in this conversation..."
                className="w-full bg-transparent text-xs text-slate-200 focus:outline-none placeholder-slate-500"
                autoFocus
              />
            </div>
            {chatSearchQuery && (
              <span className="text-[10px] text-slate-400 font-mono">
                {displayedMessages.length} found
              </span>
            )}
            <button
              onClick={() => {
                setIsChatSearchOpen(false);
                setChatSearchQuery('');
              }}
              className="text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Customer Simulator Top Ribbon (Allows instant testing of auto-replies) */}
        {activeChat && (
          <div className="bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-slate-950 px-4 py-2 border-b border-purple-900/30 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-purple-300 shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span className="font-semibold text-[11px]">Simulate Customer:</span>
            </div>

            {/* Quick Keyword Buttons */}
            <div className="hidden sm:flex items-center gap-1.5 overflow-x-auto py-0.5">
              <button
                onClick={() => handleSimulateSubmit('hi')}
                className="px-2 py-0.5 rounded-md bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-mono whitespace-nowrap transition-colors"
              >
                &ldquo;hi&rdquo;
              </button>
              <button
                onClick={() => handleSimulateSubmit('what is the price?')}
                className="px-2 py-0.5 rounded-md bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-mono whitespace-nowrap transition-colors"
              >
                &ldquo;pricing?&rdquo;
              </button>
              <button
                onClick={() => handleSimulateSubmit('schedule a demo')}
                className="px-2 py-0.5 rounded-md bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-mono whitespace-nowrap transition-colors"
              >
                &ldquo;demo link&rdquo;
              </button>
              <button
                onClick={() => handleSimulateSubmit('order #1042')}
                className="px-2 py-0.5 rounded-md bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-mono whitespace-nowrap transition-colors"
              >
                &ldquo;order #1042&rdquo;
              </button>
            </div>

            {/* Custom simulation query input */}
            <div className="flex items-center gap-1.5 flex-1 max-w-xs">
              <input
                type="text"
                value={simulateInputText}
                onChange={e => setSimulateInputText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSimulateSubmit()}
                placeholder="Customer message..."
                className="w-full px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] text-slate-200 focus:outline-none focus:border-purple-500"
              />
              <button
                onClick={() => handleSimulateSubmit()}
                className="px-2.5 py-1 rounded-md bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-medium shrink-0"
              >
                Send
              </button>
            </div>
          </div>
        )}

        {/* Message Thread Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {displayedMessages.map(msg => {
            const isUser = msg.sender === 'user';
            const isBot = msg.sender === 'bot';
            const isContact = msg.sender === 'contact';

            return (
              <div
                key={msg.id}
                onContextMenu={e => handleContextMenu(e, msg)}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} group`}
              >
                {/* Sender Tag */}
                {isBot && (
                  <div className="flex items-center gap-1 text-[10px] text-purple-400 mb-1 ml-1 font-semibold">
                    <Bot className="w-3 h-3" />
                    <span>Auto-Reply Engine</span>
                  </div>
                )}

                {/* Bubble Container */}
                <div
                  className={`max-w-[75%] sm:max-w-md rounded-2xl p-3.5 text-xs shadow-md relative leading-relaxed ${
                    isUser
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-xs'
                      : isBot
                      ? 'bg-[#1e1b4b]/80 border border-purple-500/30 text-purple-100 rounded-bl-xs'
                      : 'bg-[#1e293b] text-slate-100 border border-slate-700/60 rounded-bl-xs'
                  }`}
                >
                  {/* Media Content: Image */}
                  {msg.mediaType === 'image' && msg.mediaUrl && (
                    <div className="mb-2 relative rounded-xl overflow-hidden group/media cursor-pointer">
                      <img
                        src={msg.mediaUrl}
                        alt="attachment"
                        referrerPolicy="no-referrer"
                        onClick={() => setActiveMediaLightbox(msg.mediaUrl!)}
                        className="w-full h-48 object-cover rounded-xl hover:scale-105 transition-transform"
                      />
                      <button
                        onClick={() => setActiveMediaLightbox(msg.mediaUrl!)}
                        className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/60 text-white opacity-0 group-hover/media:opacity-100 transition-opacity"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Media Content: Document */}
                  {msg.mediaType === 'document' && (
                    <div className="mb-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/60 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-200 truncate text-xs">
                            {msg.mediaName || 'Document.pdf'}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {msg.mediaSize || '2.1 MB'}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => alert(`Downloading ${msg.mediaName}...`)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                        title="Download attachment"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Media Content: Audio / Voice Note */}
                  {msg.mediaType === 'audio' && (
                    <div className="mb-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/60 flex items-center gap-3">
                      <button
                        onClick={() =>
                          setPlayingAudioId(playingAudioId === msg.id ? null : msg.id)
                        }
                        className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-md hover:scale-105 transition-transform"
                      >
                        {playingAudioId === msg.id ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4 ml-0.5" />
                        )}
                      </button>

                      {/* Simulated Audio Waveform */}
                      <div className="flex-1 flex items-center gap-0.5 h-6">
                        {[40, 70, 30, 90, 60, 45, 80, 50, 65, 35, 85, 45, 75, 55, 30, 90].map(
                          (val, idx) => (
                            <span
                              key={idx}
                              style={{ height: `${val}%` }}
                              className={`w-1 rounded-full transition-all ${
                                playingAudioId === msg.id
                                  ? 'bg-purple-400 animate-pulse'
                                  : 'bg-slate-600'
                              }`}
                            />
                          )
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">0:14</span>
                    </div>
                  )}

                  {/* Text Body */}
                  <div className="whitespace-pre-line leading-relaxed font-sans">{msg.text}</div>

                  {/* Timestamp & WhatsApp Status Ticks */}
                  <div className="mt-1 flex items-center justify-end gap-1 text-[10px] opacity-80 font-mono">
                    <span>{msg.timestamp}</span>

                    {/* Sent status ticks */}
                    {isUser && (
                      <span className="ml-0.5 inline-flex items-center">
                        {msg.status === 'read' ? (
                          <CheckCheck className="w-3.5 h-3.5 text-sky-300 stroke-[2.5]" />
                        ) : msg.status === 'delivered' ? (
                          <CheckCheck className="w-3.5 h-3.5 text-white/80" />
                        ) : (
                          <Check className="w-3.5 h-3.5 text-white/80" />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {activeChat && isTyping[activeChat.id] && (
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-900/80 border border-purple-500/30 text-xs text-purple-300 w-fit animate-in fade-in">
              <Bot className="w-4 h-4 text-purple-400 animate-bounce" />
              <span>Jeenash Bot is composing auto-reply...</span>
              <div className="flex items-center gap-1 ml-1">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" />
                <span
                  className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce"
                  style={{ animationDelay: '0.2s' }}
                />
                <span
                  className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce"
                  style={{ animationDelay: '0.4s' }}
                />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Bottom Message Composer */}
        {activeChat && (
          <div className="p-3 sm:p-4 bg-[#0f172a] border-t border-slate-800 shrink-0 relative">
            {/* Emoji Picker Popover */}
            {isEmojiPickerOpen && (
              <div
                onClick={e => e.stopPropagation()}
                className="absolute bottom-16 left-4 p-2 rounded-xl glass-dropdown border border-slate-700 flex gap-1 z-30 animate-in fade-in slide-in-from-bottom-2"
              >
                {commonEmojis.map(em => (
                  <button
                    key={em}
                    onClick={() => handleAddEmoji(em)}
                    className="p-1.5 hover:bg-slate-800 rounded text-base hover:scale-125 transition-transform"
                  >
                    {em}
                  </button>
                ))}
              </div>
            )}

            {/* Attachment Menu Popover */}
            {isAttachmentMenuOpen && (
              <div
                onClick={e => e.stopPropagation()}
                className="absolute bottom-16 left-12 p-2 rounded-xl glass-dropdown border border-slate-700 flex flex-col gap-1 w-44 z-30 animate-in fade-in slide-in-from-bottom-2"
              >
                <button
                  onClick={() => handleAttachDemoMedia('image')}
                  className="flex items-center gap-2.5 p-2 rounded-lg text-xs text-slate-200 hover:bg-slate-800 transition-colors"
                >
                  <ImageIcon className="w-4 h-4 text-purple-400" />
                  <span>Image / Photo</span>
                </button>
                <button
                  onClick={() => handleAttachDemoMedia('document')}
                  className="flex items-center gap-2.5 p-2 rounded-lg text-xs text-slate-200 hover:bg-slate-800 transition-colors"
                >
                  <FileText className="w-4 h-4 text-blue-400" />
                  <span>Document (PDF)</span>
                </button>
                <button
                  onClick={() => handleAttachDemoMedia('video')}
                  className="flex items-center gap-2.5 p-2 rounded-lg text-xs text-slate-200 hover:bg-slate-800 transition-colors"
                >
                  <Video className="w-4 h-4 text-teal-400" />
                  <span>Video Clip</span>
                </button>
              </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleSend} className="flex items-center gap-2">
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  setIsEmojiPickerOpen(!isEmojiPickerOpen);
                  setIsAttachmentMenuOpen(false);
                }}
                className="p-2 text-slate-400 hover:text-purple-400 transition-colors rounded-lg hover:bg-slate-800"
                title="Insert emoji"
              >
                <Smile className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  setIsAttachmentMenuOpen(!isAttachmentMenuOpen);
                  setIsEmojiPickerOpen(false);
                }}
                className="p-2 text-slate-400 hover:text-purple-400 transition-colors rounded-lg hover:bg-slate-800"
                title="Attach media"
              >
                <Paperclip className="w-5 h-5" />
              </button>

              <input
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder="Type a message (Press Enter to send)..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />

              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white disabled:opacity-40 transition-all shadow-md shadow-purple-600/20"
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* Right-Click Context Menu */}
        {contextMenu.visible && (
          <div
            style={{ top: contextMenu.y, left: contextMenu.x }}
            className="fixed z-50 w-44 rounded-xl glass-dropdown border border-slate-700 p-1 shadow-2xl animate-in zoom-in-95 duration-100"
          >
            <button
              onClick={handleCopyMessage}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-800 rounded-lg"
            >
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>Copy Message</span>
            </button>
            <button
              onClick={() => {
                if (contextMenu.message?.text) {
                  setInputText(`Replying to: "${contextMenu.message.text.slice(0, 30)}..." `);
                }
                setContextMenu({ visible: false, x: 0, y: 0, message: null });
              }}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-800 rounded-lg"
            >
              <CornerUpLeft className="w-3.5 h-3.5 text-slate-400" />
              <span>Reply</span>
            </button>
            <button
              onClick={() => {
                alert('Message forwarded to contacts.');
                setContextMenu({ visible: false, x: 0, y: 0, message: null });
              }}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-800 rounded-lg"
            >
              <Share2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Forward</span>
            </button>
          </div>
        )}

        {/* Media Lightbox Modal */}
        {activeMediaLightbox && (
          <div
            onClick={() => setActiveMediaLightbox(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <div className="relative max-w-3xl max-h-[85vh]">
              <img
                src={activeMediaLightbox}
                alt="Enlarged media"
                referrerPolicy="no-referrer"
                className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl"
              />
              <button
                onClick={() => setActiveMediaLightbox(null)}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white hover:bg-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
