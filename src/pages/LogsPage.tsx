import React, { useState } from 'react';
import {
  FileText,
  Search,
  Download,
  Trash2,
  Bot,
  Smartphone,
  Shield,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Info,
  XCircle,
  Filter
} from 'lucide-react';
import { AutoReplyLog, SystemLog, WhatsAppSession } from '../types';

interface LogsPageProps {
  autoReplyLogs: AutoReplyLog[];
  systemLogs: SystemLog[];
  sessions: WhatsAppSession[];
  onClearLogs: () => void;
}

export const LogsPage: React.FC<LogsPageProps> = ({
  autoReplyLogs,
  systemLogs,
  sessions,
  onClearLogs
}) => {
  const [activeTab, setActiveTab] = useState<'autoreply' | 'sessions' | 'system'>('autoreply');
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<'all' | 'info' | 'warn' | 'error'>('all');

  const filteredAutoReplyLogs = autoReplyLogs.filter(
    l =>
      l.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.contactNumber.includes(searchQuery) ||
      l.incomingText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.ruleName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSystemLogs = systemLogs.filter(l => {
    const category = l.category || l.type || '';
    const matchesSearch =
      l.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.toLowerCase().includes(searchQuery.toLowerCase());
    if (levelFilter !== 'all') return matchesSearch && l.level === levelFilter;
    return matchesSearch;
  });

  const handleExportJSON = () => {
    const exportData = {
      autoReplyLogs,
      systemLogs,
      exportedAt: new Date().toISOString()
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const a = document.createElement('a');
    a.setAttribute('href', dataStr);
    a.setAttribute('download', `jeenash_wa_logs_${Date.now()}.json`);
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Audit Trail &amp; System Logs</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time inspection of auto-reply executions, socket handshake events, and security access logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-purple-400" />
            <span>Export Logs (JSON)</span>
          </button>
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to clear current logs from memory?')) {
                onClearLogs();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-medium transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Logs</span>
          </button>
        </div>
      </div>

      {/* Tabs & Search Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl glass-card">
        {/* Log Category Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('autoreply')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'autoreply'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Auto-Reply Logs ({autoReplyLogs.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('sessions')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'sessions'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Session Events ({sessions.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('system')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'system'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>System &amp; Security ({systemLogs.length})</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative flex-1 max-w-xs">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search logs..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {/* TAB 1: Auto-Reply Logs */}
      {activeTab === 'autoreply' && (
        <div className="rounded-2xl glass-card overflow-hidden border border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/40 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Matched Rule</th>
                  <th className="py-3 px-4">Incoming Customer Message</th>
                  <th className="py-3 px-4">Dispatched Reply</th>
                  <th className="py-3 px-4">Delay</th>
                  <th className="py-3 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {filteredAutoReplyLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500 text-xs">
                      No auto-replies logged yet. Send a keyword message in Chats to trigger one!
                    </td>
                  </tr>
                ) : (
                  filteredAutoReplyLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-white">
                        <div>{log.contactName}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{log.contactNumber}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[10px] font-medium">
                          {log.ruleName}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 max-w-xs text-slate-300">
                        &ldquo;{log.incomingText}&rdquo;
                      </td>

                      <td className="py-3.5 px-4 max-w-sm text-purple-200 truncate" title={log.repliedText}>
                        {log.repliedText}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                        {log.delayAppliedMs}ms
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[10px] text-slate-500">
                        {log.timestamp}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Sessions Logs */}
      {activeTab === 'sessions' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sessions.map(s => (
              <div key={s.id} className="p-4 rounded-xl glass-card space-y-2 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-purple-400" />
                    <span className="font-bold text-white">{s.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{s.phoneNumber}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Current Socket Status:</span>
                  <span className="font-bold font-mono text-emerald-400 uppercase">{s.status}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Last Reconnect Handshake:</span>
                  <span className="font-mono text-slate-300">{s.lastActive}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Total Message Throughput:</span>
                  <span className="font-mono text-purple-300">
                    {s.totalMessagesSent + s.totalMessagesReceived} events
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: System & Security Logs */}
      {activeTab === 'system' && (
        <div className="rounded-2xl glass-card overflow-hidden border border-slate-800">
          <div className="p-3 border-b border-slate-800 flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Filter Level:
            </span>
            {(['all', 'info', 'warn', 'error'] as const).map(lvl => (
              <button
                key={lvl}
                onClick={() => setLevelFilter(lvl)}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold uppercase tracking-wider font-mono transition-colors ${
                  levelFilter === lvl
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          <div className="divide-y divide-slate-800/60 font-mono text-xs">
            {filteredSystemLogs.map(log => {
              let icon = <Info className="w-3.5 h-3.5 text-blue-400 shrink-0" />;
              let badgeClass = 'text-blue-400 bg-blue-500/10 border-blue-500/20';

              if (log.level === 'warn') {
                icon = <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
                badgeClass = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
              } else if (log.level === 'error') {
                icon = <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />;
                badgeClass = 'text-rose-400 bg-rose-500/10 border-rose-500/20';
              }

              return (
                <div key={log.id} className="p-3 flex items-start gap-3 hover:bg-slate-900/40">
                  {icon}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${badgeClass}`}>
                        {log.level}
                      </span>
                      <span className="text-[10px] text-purple-400 uppercase font-semibold">
                        [{log.category || log.type}]
                      </span>
                      <span className="text-[10px] text-slate-500 ml-auto">{log.timestamp}</span>
                    </div>
                    <p className="text-slate-200 font-mono text-xs">{log.message}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
