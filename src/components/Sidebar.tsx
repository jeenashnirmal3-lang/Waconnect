import React from 'react';
import {
  LayoutDashboard,
  Smartphone,
  MessageSquare,
  Bot,
  Users,
  Settings,
  FileText,
  User,
  Activity,
  ShieldCheck
} from 'lucide-react';
import { ActiveTab } from '../store/useAppStore';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  unreadCountTotal: number;
  activeSessionsCount: number;
  rulesCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  unreadCountTotal,
  activeSessionsCount,
  rulesCount
}) => {
  const navItems = [
    {
      id: 'overview' as ActiveTab,
      label: 'Overview',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'sessions' as ActiveTab,
      label: 'Sessions',
      icon: Smartphone,
      badge: `${activeSessionsCount} Live`,
      badgeColor: 'text-emerald-400 bg-emerald-500/10'
    },
    {
      id: 'chats' as ActiveTab,
      label: 'Chats',
      icon: MessageSquare,
      badge: unreadCountTotal > 0 ? `${unreadCountTotal}` : null,
      badgeColor: 'text-purple-300 bg-purple-500/20'
    },
    {
      id: 'autoreply' as ActiveTab,
      label: 'Auto-Reply',
      icon: Bot,
      badge: `${rulesCount}`,
      badgeColor: 'text-sky-300 bg-sky-500/10'
    },
    {
      id: 'contacts' as ActiveTab,
      label: 'Contacts',
      icon: Users,
      badge: null
    },
    {
      id: 'settings' as ActiveTab,
      label: 'Settings',
      icon: Settings,
      badge: null
    },
    {
      id: 'logs' as ActiveTab,
      label: 'Logs',
      icon: FileText,
      badge: null
    },
    {
      id: 'profile' as ActiveTab,
      label: 'Profile',
      icon: User,
      badge: null
    }
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-[#0b0f19] flex flex-col justify-between shrink-0 h-[calc(100vh-4rem)] select-none">
      <div className="p-3 space-y-1">
        <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Platform Navigation
        </div>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-gradient-to-r from-purple-600/30 to-indigo-600/20 text-purple-200 border border-purple-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-purple-400' : 'text-slate-400 group-hover:text-slate-300'
                  }`}
                />
                <span className="whitespace-nowrap">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full font-mono tabular-nums ${item.badgeColor}`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer System Status Badge */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-slate-300">Engine Online</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">v6.7 Baileys</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Multi-session socket daemon with anti-ban delay active.
        </p>
      </div>
    </aside>
  );
};
