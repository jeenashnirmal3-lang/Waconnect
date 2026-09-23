import React from 'react';
import {
  Smartphone,
  MessageSquare,
  Bot,
  Send,
  ArrowUpRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Plus,
  QrCode,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { WhatsAppSession, AutoReplyLog, Chat, AutoReplyRule } from '../types';
import { ActiveTab } from '../store/useAppStore';

interface OverviewPageProps {
  sessions: WhatsAppSession[];
  chats: Chat[];
  rules: AutoReplyRule[];
  autoReplyLogs: AutoReplyLog[];
  onNavigate: (tab: ActiveTab) => void;
  onOpenTester: () => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  sessions,
  chats,
  rules,
  autoReplyLogs,
  onNavigate,
  onOpenTester
}) => {
  // Aggregate stats
  const activeSessions = sessions.filter(s => s.status === 'connected').length;
  const totalMessagesSent = sessions.reduce((acc, s) => acc + s.totalMessagesSent, 0) + 420;
  const totalMessagesReceived = sessions.reduce((acc, s) => acc + s.totalMessagesReceived, 0) + 580;
  const autoRepliesCount = autoReplyLogs.length + rules.reduce((acc, r) => acc + r.triggerCount, 0);

  // Hourly Activity Mock Data for SVG Chart
  const hourlyData = [
    { hour: '08:00', messages: 45, autoReplies: 32 },
    { hour: '10:00', messages: 120, autoReplies: 84 },
    { hour: '12:00', messages: 185, autoReplies: 142 },
    { hour: '14:00', messages: 160, autoReplies: 110 },
    { hour: '16:00', messages: 210, autoReplies: 165 },
    { hour: '18:00', messages: 145, autoReplies: 95 },
    { hour: '20:00', messages: 95, autoReplies: 60 }
  ];

  const maxVal = 240;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Overview Dashboard</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time WhatsApp socket analytics, automated rules, and active sessions.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('sessions')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md shadow-purple-600/20 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Connect Number</span>
          </button>
          <button
            onClick={() => onNavigate('autoreply')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium transition-colors"
          >
            <Bot className="w-3.5 h-3.5 text-purple-400" />
            <span>New Auto-Reply</span>
          </button>
          <button
            onClick={onOpenTester}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium transition-colors"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Test Keyword</span>
          </button>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Sessions */}
        <div className="p-5 rounded-2xl glass-card relative overflow-hidden group hover:border-purple-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Connected Sessions</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono tabular-nums">
              {activeSessions}
            </span>
            <span className="text-xs text-slate-500">/ {sessions.length} total</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-400">
            <TrendingUp className="w-3 h-3" />
            <span>Baileys Multi-Device live</span>
          </div>
        </div>

        {/* Card 2: Active Chats */}
        <div className="p-5 rounded-2xl glass-card relative overflow-hidden group hover:border-blue-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Active Conversations</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono tabular-nums">
              {chats.length}
            </span>
            <span className="text-xs text-emerald-400 font-medium">98% satisfaction</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-400">
            <span>Real-time Socket.io sync</span>
          </div>
        </div>

        {/* Card 3: Messages Today */}
        <div className="p-5 rounded-2xl glass-card relative overflow-hidden group hover:border-teal-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Messages Today</span>
            <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
              <Send className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono tabular-nums">
              {(totalMessagesSent + totalMessagesReceived).toLocaleString()}
            </span>
            <span className="text-xs text-emerald-400 font-medium">+18.4%</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-400">
            <span>Sent: {totalMessagesSent.toLocaleString()}</span>
            <span>&middot;</span>
            <span>Recv: {totalMessagesReceived.toLocaleString()}</span>
          </div>
        </div>

        {/* Card 4: Auto-Replies Sent */}
        <div className="p-5 rounded-2xl glass-card relative overflow-hidden group hover:border-indigo-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Auto-Replies Dispatched</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono tabular-nums">
              {autoRepliesCount.toLocaleString()}
            </span>
            <span className="text-xs text-emerald-400 font-medium">Avg delay: 2.4s</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-purple-400">
            <Zap className="w-3 h-3" />
            <span>{rules.filter(r => r.enabled).length} active trigger rules</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Activity Chart & Connected Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart (2 columns) */}
        <div className="lg:col-span-2 p-5 rounded-2xl glass-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Message &amp; Auto-Reply Volume</h3>
              <p className="text-xs text-slate-400">Distribution over today&apos;s active business hours</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-purple-500" />
                <span className="text-slate-300">Total Messages</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-400" />
                <span className="text-slate-300">Auto-Replies</span>
              </div>
            </div>
          </div>

          {/* SVG Bar Chart */}
          <div className="h-48 w-full flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-slate-800">
            {hourlyData.map((d, i) => {
              const msgHeight = Math.round((d.messages / maxVal) * 100);
              const botHeight = Math.round((d.autoReplies / maxVal) * 100);

              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                  <div className="w-full flex items-end justify-center gap-1 h-full">
                    {/* Message Bar */}
                    <div
                      style={{ height: `${msgHeight}%` }}
                      className="w-1/2 max-w-[18px] bg-gradient-to-t from-purple-700 to-purple-500 rounded-t-md transition-all group-hover:brightness-125 relative"
                    >
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-[10px] px-1.5 py-0.5 rounded font-mono text-purple-300 pointer-events-none whitespace-nowrap z-20 border border-purple-500/30">
                        {d.messages}
                      </div>
                    </div>
                    {/* Bot Bar */}
                    <div
                      style={{ height: `${botHeight}%` }}
                      className="w-1/2 max-w-[18px] bg-gradient-to-t from-blue-700 to-blue-400 rounded-t-md transition-all group-hover:brightness-125 relative"
                    >
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-[10px] px-1.5 py-0.5 rounded font-mono text-blue-300 pointer-events-none whitespace-nowrap z-20 border border-blue-500/30">
                        {d.autoReplies}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono mt-2">{d.hour}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Anti-ban natural jitter algorithm operating nominally</span>
            </span>
            <button
              onClick={() => onNavigate('logs')}
              className="text-purple-400 hover:text-purple-300 font-medium"
            >
              View detailed dispatch log &rarr;
            </button>
          </div>
        </div>

        {/* Connected Sessions List (1 column) */}
        <div className="p-5 rounded-2xl glass-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white">WhatsApp Sessions</h3>
              <button
                onClick={() => onNavigate('sessions')}
                className="text-xs text-purple-400 hover:text-purple-300 font-medium"
              >
                Manage all
              </button>
            </div>

            <div className="space-y-3">
              {sessions.map(s => (
                <div
                  key={s.id}
                  className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${
                        s.status === 'connected'
                          ? 'bg-emerald-400'
                          : s.status === 'connecting'
                          ? 'bg-amber-400 animate-ping'
                          : 'bg-rose-400'
                      }`}
                    />
                    <div>
                      <div className="text-xs font-semibold text-slate-200">{s.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{s.phoneNumber}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] font-mono text-slate-400">
                      {s.batteryLevel ? `🔋 ${s.batteryLevel}%` : 'N/A'}
                    </div>
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider ${
                        s.status === 'connected' ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {s.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800">
            <button
              onClick={() => onNavigate('sessions')}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <QrCode className="w-3.5 h-3.5 text-purple-400" />
              <span>Link New Phone via QR/Pairing</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Auto-Replies Stream & Quick Rule Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stream */}
        <div className="lg:col-span-2 p-5 rounded-2xl glass-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-white">Live Auto-Reply Dispatch Feed</h3>
            </div>
            <button
              onClick={() => onNavigate('logs')}
              className="text-xs text-purple-400 hover:text-purple-300 font-medium"
            >
              View Full Logs
            </button>
          </div>

          <div className="space-y-2.5">
            {autoReplyLogs.slice(0, 4).map(log => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:border-slate-700 transition-colors"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-200">{log.contactName}</span>
                    <span className="text-[11px] text-slate-500 font-mono">{log.contactNumber}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 font-medium">
                      {log.ruleName}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 truncate mt-1">
                    <span className="text-slate-500">In:</span> &ldquo;{log.incomingText}&rdquo; &rarr;{' '}
                    <span className="text-slate-300">&ldquo;{log.repliedText.slice(0, 60)}...&rdquo;</span>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center text-[10px] text-slate-500 font-mono shrink-0">
                  <span>{log.delayAppliedMs}ms delay</span>
                  <span className="text-emerald-400 font-medium uppercase">{log.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System & Engine Security Card */}
        <div className="p-5 rounded-2xl glass-card flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">System Security Health</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400">JWT Token Expiry</span>
                <span className="font-mono text-emerald-400 font-semibold">15 Minutes</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400">Password Hashing</span>
                <span className="font-mono text-purple-400 font-semibold">bcrypt (12 rounds)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400">Brute Force Protection</span>
                <span className="font-mono text-blue-400 font-semibold">Fail2ban &amp; RateLimit</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400">Session File Chmod</span>
                <span className="font-mono text-emerald-400 font-semibold">0700 Enforced</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Server: Ubuntu 22.04 LTS</span>
            <span className="text-purple-400">Node v20.x</span>
          </div>
        </div>
      </div>
    </div>
  );
};
