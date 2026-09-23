import React, { useState } from 'react';
import {
  Server,
  Zap,
  Moon,
  Sun,
  LogOut,
  ChevronDown,
  Shield,
  Smartphone,
  Sparkles,
  Layers
} from 'lucide-react';
import { WhatsAppSession } from '../types';

interface NavbarProps {
  sessions: WhatsAppSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenDeploymentModal: () => void;
  onOpenTester: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  isDarkMode,
  onToggleDarkMode,
  onOpenDeploymentModal,
  onOpenTester,
  onLogout
}) => {
  const [isSessionDropdownOpen, setIsSessionDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];

  return (
    <header className="h-16 border-b border-slate-800 bg-[#0f172a]/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between z-30 sticky top-0">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-purple-400 via-indigo-300 to-blue-400 bg-clip-text text-transparent">
            Jeenash WA
          </span>
          <span className="text-[10px] text-slate-400 -mt-1 font-medium tracking-wide">
            Business Automation Engine
          </span>
        </div>
      </div>

      {/* Zone 2: Navigation / Context Controls */}
      <div className="hidden md:flex items-center gap-3">
        {/* Session Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsSessionDropdownOpen(!isSessionDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700/60 hover:border-slate-600 transition-colors text-xs font-medium text-slate-200"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                activeSession?.status === 'connected'
                  ? 'bg-emerald-400 animate-pulse'
                  : activeSession?.status === 'connecting'
                  ? 'bg-amber-400 animate-ping'
                  : 'bg-rose-400'
              }`}
            />
            <span className="max-w-[140px] truncate">
              {activeSession ? activeSession.name : 'No Session'}
            </span>
            <span className="text-slate-400 text-[11px] font-mono">
              {activeSession ? activeSession.phoneNumber : ''}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
          </button>

          {isSessionDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-64 rounded-xl glass-dropdown p-1.5 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-2.5 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Connected WhatsApp Sessions
              </div>
              {sessions.map(s => (
                <button
                  key={s.id}
                  onClick={() => {
                    onSelectSession(s.id);
                    setIsSessionDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left text-xs transition-colors ${
                    s.id === activeSessionId
                      ? 'bg-purple-600/20 text-purple-300 font-medium'
                      : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        s.status === 'connected'
                          ? 'bg-emerald-400'
                          : s.status === 'connecting'
                          ? 'bg-amber-400'
                          : 'bg-rose-400'
                      }`}
                    />
                    <div className="truncate">
                      <div className="truncate font-medium">{s.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{s.phoneNumber}</div>
                    </div>
                  </div>
                  <span className="text-[10px] capitalize text-slate-400 ml-2 shrink-0">
                    {s.status}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Live Socket Sync Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-medium text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Socket.io Live</span>
        </div>

        {/* Quick Test Auto-Reply Button */}
        <button
          onClick={onOpenTester}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-medium transition-colors"
          title="Interactive Keyword Tester sandbox"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Test Keyword</span>
        </button>
      </div>

      {/* Zone 3: Primary Actions */}
      <div className="flex items-center gap-2.5">
        {/* Production Deployment Files Button */}
        <button
          onClick={onOpenDeploymentModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-medium text-slate-200 transition-colors"
          title="View Nginx, PM2, Prisma & VPS setup files"
        >
          <Layers className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden sm:inline">Deployment Configs</span>
        </button>

        {/* Dark/Light mode toggle */}
        <button
          onClick={onToggleDarkMode}
          className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 hover:text-slate-100 transition-colors"
          title="Toggle theme mode"
          aria-label="Toggle theme"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-indigo-400" />}
        </button>

        {/* Admin Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-lg bg-slate-900/80 border border-slate-700/60 hover:border-slate-600 transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">
              JW
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-semibold text-slate-200 leading-tight">Admin</div>
              <div className="text-[10px] text-purple-400 leading-tight">@Jeenash123</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
          </button>

          {isProfileDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-52 rounded-xl glass-dropdown p-1.5 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-3 py-2 border-b border-slate-800 text-xs text-slate-400">
                Signed in as <strong className="text-slate-200">admin</strong>
                <div className="text-[10px] text-emerald-400 mt-0.5">JWT Auth Active (15m)</div>
              </div>
              <button
                onClick={() => {
                  setIsProfileDropdownOpen(false);
                  onLogout();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 mt-1 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
