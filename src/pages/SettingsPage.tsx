import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Clock,
  Shield,
  Zap,
  Bell,
  Save,
  Moon,
  Globe,
  CheckCircle2,
  Sliders,
  Sparkles
} from 'lucide-react';
import { AppSettings } from '../types';

interface SettingsPageProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  settings,
  onUpdateSettings,
  isDarkMode,
  onToggleDarkMode
}) => {
  const [formData, setFormData] = useState<AppSettings>(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Platform Settings</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure global anti-ban delays, working hours schedules, webhooks, and dashboard behavior.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings saved successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card 1: Anti-Ban & Natural Delays */}
        <div className="p-6 rounded-2xl glass-card space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Anti-Ban Protection &amp; Natural Typing Jitter</h3>
              <p className="text-xs text-slate-400">
                Randomizes response intervals to mimic human typing rhythm and prevent WhatsApp flagging.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Default Response Delay (seconds)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={formData.defaultDelaySeconds}
                onChange={e =>
                  setFormData({ ...formData, defaultDelaySeconds: parseInt(e.target.value, 10) || 1 })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Randomize Natural Delay (Anti-Ban)
              </label>
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  checked={formData.randomizeDelay}
                  onChange={e => setFormData({ ...formData, randomizeDelay: e.target.checked })}
                  className="w-4 h-4 accent-purple-600 rounded"
                />
                <span className="text-slate-400">Add 1-4s randomized jitter to every message</span>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Max Messages per Hour (Per Contact)
              </label>
              <input
                type="number"
                min="1"
                max="500"
                value={formData.maxMessagesPerHourPerContact}
                onChange={e =>
                  setFormData({
                    ...formData,
                    maxMessagesPerHourPerContact: parseInt(e.target.value, 10) || 30
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Global Contact Cooldown (seconds)
              </label>
              <input
                type="number"
                min="10"
                max="3600"
                value={formData.cooldownSeconds}
                onChange={e =>
                  setFormData({
                    ...formData,
                    cooldownSeconds: parseInt(e.target.value, 10) || 60
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Operating Hours & Timezone */}
        <div className="p-6 rounded-2xl glass-card space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Default Business Working Hours</h3>
              <p className="text-xs text-slate-400">
                Applied to rules flagged with &quot;Working hours only&quot;.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Start Time</label>
              <input
                type="time"
                value={formData.workingHoursStart}
                onChange={e => setFormData({ ...formData, workingHoursStart: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">End Time</label>
              <input
                type="time"
                value={formData.workingHoursEnd}
                onChange={e => setFormData({ ...formData, workingHoursEnd: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Timezone</label>
              <select
                value={formData.timezone}
                onChange={e => setFormData({ ...formData, timezone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200"
              >
                <option value="Asia/Kolkata">Asia/Kolkata (IST +5:30)</option>
                <option value="Asia/Dubai">Asia/Dubai (GST +4:00)</option>
                <option value="Europe/London">Europe/London (GMT/BST)</option>
                <option value="America/New_York">America/New_York (EST)</option>
                <option value="UTC">UTC Universal</option>
              </select>
            </div>
          </div>
        </div>

        {/* Card 3: External Webhooks */}
        <div className="p-6 rounded-2xl glass-card space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">External Webhooks &amp; Event Forwarding</h3>
              <p className="text-xs text-slate-400">
                Forward incoming WhatsApp messages and dispatched auto-replies to external CRM endpoints.
              </p>
            </div>
          </div>

          <div className="text-xs space-y-2">
            <label className="block text-slate-300 font-semibold">Webhook Destination URL</label>
            <input
              type="url"
              value={formData.webhookUrl || ''}
              onChange={e => setFormData({ ...formData, webhookUrl: e.target.value })}
              placeholder="https://crm.yourcompany.com/api/webhooks/whatsapp"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-mono focus:outline-none focus:border-purple-500"
            />
            <p className="text-[11px] text-slate-500">
              Payload includes: sessionId, remoteJid, sender, text, timestamp, and metadata.
            </p>
          </div>
        </div>

        {/* Card 4: UI & Sound Preferences */}
        <div className="p-6 rounded-2xl glass-card space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">User Interface &amp; Notifications</h3>
              <p className="text-xs text-slate-400">Manage audio alerts and color aesthetics.</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
            <div>
              <div className="font-semibold text-slate-200">Play Sound on Incoming Message</div>
              <div className="text-[11px] text-slate-400">Chime alert when customer sends inquiry</div>
            </div>
            <input
              type="checkbox"
              checked={formData.notificationsSound}
              onChange={e => setFormData({ ...formData, notificationsSound: e.target.checked })}
              className="w-4 h-4 accent-purple-600 rounded"
            />
          </div>
        </div>

        {/* Save Changes Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/20 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save All Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
