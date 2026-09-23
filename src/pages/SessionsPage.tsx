import React, { useState } from 'react';
import {
  Smartphone,
  Plus,
  RefreshCw,
  PowerOff,
  QrCode,
  KeyRound,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  Copy,
  Clock,
  BatteryCharging,
  Layers,
  Zap,
  X
} from 'lucide-react';
import { WhatsAppSession } from '../types';
import { ActiveTab } from '../store/useAppStore';

interface SessionsPageProps {
  sessions: WhatsAppSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onAddSession: (name: string, phone: string) => WhatsAppSession;
  onDisconnectSession: (id: string) => void;
  onReconnectSession: (id: string) => void;
  onNavigate: (tab: ActiveTab) => void;
}

export const SessionsPage: React.FC<SessionsPageProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onAddSession,
  onDisconnectSession,
  onReconnectSession,
  onNavigate
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'qr' | 'pairing'>('qr');
  const [sessionName, setSessionName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [pairingCodeGenerated, setPairingCodeGenerated] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [qrCountdown, setQrCountdown] = useState(20);

  // Generate pairing code inside modal
  const handleGeneratePairing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return;

    setIsProcessing(true);
    setTimeout(() => {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let p1 = '', p2 = '';
      for (let i = 0; i < 4; i++) {
        p1 += chars.charAt(Math.floor(Math.random() * chars.length));
        p2 += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      setPairingCodeGenerated(`${p1}-${p2}`);
      setIsProcessing(false);
    }, 1000);
  };

  const handleCompleteConnection = () => {
    const finalName = sessionName.trim() || 'WhatsApp Business Line';
    const finalPhone = `${countryCode} ${phoneNumber.trim() || '98234 56789'}`;
    onAddSession(finalName, finalPhone);
    setIsAddModalOpen(false);
    setPairingCodeGenerated(null);
    setSessionName('');
    setPhoneNumber('');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">WhatsApp Sessions Manager</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage multi-device Baileys WhatsApp sockets, link new numbers, and monitor connection health.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Connect New Number</span>
        </button>
      </div>

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sessions.map(session => {
          const isSelected = session.id === activeSessionId;
          const isConnected = session.status === 'connected';

          return (
            <div
              key={session.id}
              className={`p-5 rounded-2xl glass-card relative overflow-hidden transition-all flex flex-col justify-between ${
                isSelected ? 'border-purple-500/50 shadow-lg shadow-purple-500/10' : 'hover:border-slate-700'
              }`}
            >
              <div>
                {/* Card Top: Status & Name */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isConnected
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white leading-tight">{session.name}</h3>
                      <div className="text-xs text-purple-300 font-mono mt-0.5">{session.phoneNumber}</div>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono ${
                      isConnected
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : session.status === 'connecting'
                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 animate-pulse'
                        : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isConnected ? 'bg-emerald-400' : 'bg-rose-400'
                      }`}
                    />
                    <span>{session.status}</span>
                  </span>
                </div>

                {/* Session Specs Grid */}
                <div className="grid grid-cols-2 gap-2 mt-4 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">Platform</span>
                    <div className="text-slate-300 font-medium truncate text-[11px] mt-0.5">
                      {session.platform || 'Baileys Multi-Device'}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">Battery</span>
                    <div className="text-slate-300 font-mono text-[11px] mt-0.5 flex items-center gap-1">
                      <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{session.batteryLevel ? `${session.batteryLevel}%` : 'N/A'}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">Messages Sent</span>
                    <div className="text-purple-400 font-mono font-bold text-xs mt-0.5 tabular-nums">
                      {session.totalMessagesSent.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">Received</span>
                    <div className="text-blue-400 font-mono font-bold text-xs mt-0.5 tabular-nums">
                      {session.totalMessagesReceived.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Last active: {session.lastActive}</span>
                  </span>
                  <span>ID: {session.id}</span>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  {isConnected ? (
                    <button
                      onClick={() => onDisconnectSession(session.id)}
                      className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-medium transition-colors flex items-center gap-1"
                      title="Disconnect socket"
                    >
                      <PowerOff className="w-3 h-3" />
                      <span>Disconnect</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onReconnectSession(session.id)}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs font-medium transition-colors flex items-center gap-1"
                      title="Reconnect socket credentials"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Reconnect</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      onSelectSession(session.id);
                      onNavigate('chats');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-medium transition-colors flex items-center gap-1"
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>Open Chats</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Session Modal (QR / Pairing Code) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl glass-panel p-6 shadow-2xl relative border border-slate-700">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Connect WhatsApp Session</h3>
                  <p className="text-xs text-slate-400">Add a new WhatsApp Business number via Baileys</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Session Name & Number Inputs */}
            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Session Identifier Name
                </label>
                <input
                  type="text"
                  value={sessionName}
                  onChange={e => setSessionName(e.target.value)}
                  placeholder="e.g. Sales Team Mumbai, Support Desk #2"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Method Switcher Tabs */}
              <div className="grid grid-cols-2 gap-1 p-1 bg-slate-900/80 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalTab('qr')}
                  className={`py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                    modalTab === 'qr'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Scan QR Code</span>
                </button>
                <button
                  type="button"
                  onClick={() => setModalTab('pairing')}
                  className={`py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                    modalTab === 'pairing'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>8-Digit Pairing Code</span>
                </button>
              </div>

              {/* QR Code Tab */}
              {modalTab === 'qr' && (
                <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 flex flex-col items-center justify-center text-center">
                  <div className="w-40 h-40 bg-white p-2.5 rounded-xl shadow-inner flex items-center justify-center mb-3">
                    <svg className="w-full h-full text-slate-900" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M2 2h7v7H2V2zm2 2v3h3V4H4zm11-2h7v7h-7V2zm2 2v3h3V4h-3zM2 15h7v7H2v-7zm2 2v3h3v-3H4zm13-2h2v2h-2v-2zm-2 2h2v2h-2v-2zm4 0h2v2h-2v-2zm-4 4h2v2h-2v-2zm4 0h2v2h-2v-2zm-2-2h2v2h-2v-2zm-6-2h2v2h-2v-2zm0-4h2v2h-2v-2zm2 2h2v2h-2v-2zm-2-6h2v2h-2V7zm6 2h2v2h-2V9zm-4 2h2v2h-2v-2z" />
                    </svg>
                  </div>
                  <div className="text-xs font-medium text-slate-300">
                    Open WhatsApp &gt; Linked Devices &gt; Scan this code
                  </div>
                  <span className="text-[11px] text-purple-400 font-mono mt-1">
                    Auto-refresh in 20s
                  </span>

                  <button
                    onClick={handleCompleteConnection}
                    className="mt-4 w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-md shadow-purple-600/20"
                  >
                    Simulate WhatsApp Scanned &amp; Connect
                  </button>
                </div>
              )}

              {/* Pairing Code Tab */}
              {modalTab === 'pairing' && (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <select
                      value={countryCode}
                      onChange={e => setCountryCode(e.target.value)}
                      className="w-24 px-2 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200"
                    >
                      <option value="+91">🇮🇳 +91</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+44">🇬🇧 +44</option>
                      <option value="+971">🇦🇪 +971</option>
                    </select>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={e => setPhoneNumber(e.target.value)}
                      placeholder="98765 43210"
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 font-mono"
                    />
                  </div>

                  {pairingCodeGenerated ? (
                    <div className="p-4 bg-slate-950/80 rounded-xl border border-purple-500/40 text-center">
                      <span className="text-xs text-slate-400">WhatsApp 8-Digit Pairing Code:</span>
                      <div className="text-2xl font-mono font-black text-purple-300 tracking-widest my-2">
                        {pairingCodeGenerated}
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Enter this code on your phone: WhatsApp &gt; Linked Devices &gt; Link with phone number
                      </p>
                      <button
                        onClick={handleCompleteConnection}
                        className="mt-3 w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs"
                      >
                        Confirm Linked &amp; Save Session
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleGeneratePairing}
                      disabled={isProcessing || !phoneNumber}
                      className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-semibold text-xs transition-all shadow-md shadow-purple-600/20"
                    >
                      {isProcessing ? 'Generating Pairing Code...' : 'Request Pairing Code'}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
