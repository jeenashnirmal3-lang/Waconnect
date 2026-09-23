import React, { useState } from 'react';
import {
  User,
  Shield,
  KeyRound,
  Lock,
  Copy,
  Check,
  LogOut,
  Laptop,
  Smartphone,
  Clock,
  Eye,
  EyeOff
} from 'lucide-react';

interface ProfilePageProps {
  onLogout: () => void;
  addToast: (arg1: string, arg2?: string, arg3?: 'success' | 'error' | 'warning' | 'info') => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onLogout, addToast }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [tokenCopied, setTokenCopied] = useState(false);

  // Simulated current JWT token
  const sampleToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiQURNSU4iLCJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNzg0ODEyMDAwLCJleHAiOjE3ODQ4MTI5MDB9.6e2b26090c2a297e6e5898d9e235a9fa123';

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      addToast('Password too short', 'New password must be at least 8 characters.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      addToast('Passwords mismatch', 'New password and confirmation do not match.', 'error');
      return;
    }

    addToast('Password Changed Successfully', 'Your master admin password has been updated.', 'success');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleCopyToken = () => {
    navigator.clipboard.writeText(sampleToken);
    setTokenCopied(true);
    setTimeout(() => setTokenCopied(false), 2000);
    addToast('Token Copied', 'Bearer JWT token copied to clipboard.', 'info');
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Admin Profile &amp; Security</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Manage system administrator credentials, security tokens, and active browser sessions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Admin Identity Badge */}
        <div className="p-6 rounded-2xl glass-card flex flex-col items-center text-center justify-between">
          <div className="w-full flex flex-col items-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 flex items-center justify-center text-2xl font-black text-white shadow-xl shadow-purple-600/30 mb-4">
              JW
            </div>
            <h3 className="text-base font-bold text-white">System Administrator</h3>
            <span className="text-xs text-purple-300 font-mono mt-0.5">admin@jeenashera.online</span>

            <div className="mt-4 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              Full Master Privileges (RBAC: ROOT)
            </div>
          </div>

          <div className="w-full mt-6 pt-6 border-t border-slate-800 space-y-2">
            <button
              onClick={onLogout}
              className="w-full py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out of Dashboard</span>
            </button>
          </div>
        </div>

        {/* Right Column: Password Change & Token Inspector */}
        <div className="md:col-span-2 space-y-6">
          {/* Change Password Form */}
          <div className="p-6 rounded-2xl glass-card space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <KeyRound className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-white">Change Master Password</h3>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Current Password (e.g. @Jeenash123)
                </label>
                <div className="relative">
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-purple-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showCurrent ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">New Password</label>
                  <div className="relative">
                    <input
                      type={showNew ? 'text' : 'password'}
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="Min 8 characters"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-purple-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      {showNew ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold shadow-md shadow-purple-600/20 transition-all"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>

          {/* JWT Token Inspector */}
          <div className="p-6 rounded-2xl glass-card space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Active JWT Bearer Token</h3>
              </div>
              <span className="text-[11px] text-emerald-400 font-mono">15m sliding window</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3">
              <span className="font-mono text-xs text-purple-300 truncate max-w-sm">
                {sampleToken}
              </span>
              <button
                onClick={handleCopyToken}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 shrink-0 transition-colors"
              >
                {tokenCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{tokenCopied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Use this Bearer token in the <code>Authorization: Bearer &lt;token&gt;</code> header for external API calls.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
