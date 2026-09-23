import React, { useState, useEffect } from 'react';
import {
  QrCode,
  KeyRound,
  Shield,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Copy,
  RefreshCw,
  Zap,
  ArrowRight,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  Layers,
  MessageSquare
} from 'lucide-react';

interface LoginPageProps {
  onLogin: (password: string) => boolean;
  onSessionConnected?: (sessionName: string, phone: string) => void;
  onOpenDeploymentModal: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLogin,
  onSessionConnected,
  onOpenDeploymentModal
}) => {
  const [activeTab, setActiveTab] = useState<'qr' | 'pairing' | 'admin'>('qr');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  // QR Code Tab State
  const [qrCountdown, setQrCountdown] = useState(20);
  const [qrState, setQrState] = useState<'waiting' | 'scanning' | 'connected'>('waiting');

  // Pairing Code Tab State
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [generatedPairingCode, setGeneratedPairingCode] = useState<string | null>(null);
  const [isGeneratingPairing, setIsGeneratingPairing] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [pairingState, setPairingState] = useState<'idle' | 'generated' | 'verifying' | 'connected'>('idle');

  // 20-second QR auto-refresh timer
  useEffect(() => {
    if (activeTab !== 'qr' || qrState === 'connected') return;

    const interval = setInterval(() => {
      setQrCountdown(prev => {
        if (prev <= 1) {
          return 20; // Refresh QR code
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTab, qrState]);

  // Handle Admin Login submission
  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;

    if (loginAttempts >= 4) {
      setIsLocked(true);
      setTimeout(() => {
        setIsLocked(false);
        setLoginAttempts(0);
      }, 15000); // 15s reset for demo
    }

    const success = onLogin(adminPassword);
    if (!success) {
      setLoginAttempts(prev => prev + 1);
    }
  };

  // Simulate scanning QR code
  const handleSimulateQRScan = () => {
    setQrState('scanning');
    setTimeout(() => {
      setQrState('connected');
      if (onSessionConnected) {
        onSessionConnected('WhatsApp Business Mobile', '+91 98234 56789');
      }
      setTimeout(() => {
        onLogin('@Jeenash123');
      }, 1200);
    }, 1600);
  };

  // Generate 8-digit Pairing Code
  const handleGeneratePairingCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 7) return;

    setIsGeneratingPairing(true);
    setTimeout(() => {
      // Generate formatted 8-char code: e.g. 7K49-B29L
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let part1 = '';
      let part2 = '';
      for (let i = 0; i < 4; i++) {
        part1 += chars.charAt(Math.floor(Math.random() * chars.length));
        part2 += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      setGeneratedPairingCode(`${part1}-${part2}`);
      setIsGeneratingPairing(false);
      setPairingState('generated');
    }, 1000);
  };

  const handleCopyPairingCode = () => {
    if (generatedPairingCode) {
      navigator.clipboard.writeText(generatedPairingCode.replace('-', ''));
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleConfirmPairingInWhatsApp = () => {
    setPairingState('verifying');
    setTimeout(() => {
      setPairingState('connected');
      if (onSessionConnected) {
        onSessionConnected('Paired Phone Session', `${countryCode} ${phoneNumber}`);
      }
      setTimeout(() => {
        onLogin('@Jeenash123');
      }, 1200);
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full bg-[#0b0f19] flex flex-col lg:flex-row overflow-hidden text-slate-100">
      {/* LEFT COLUMN: Animated Gradient & SaaS Branding */}
      <div className="lg:w-1/2 p-8 lg:p-16 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#1e1b4b] to-[#2e1065]">
        {/* Animated Background Glow Blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow" style={{ animationDelay: '3s' }} />
        <div className="absolute top-3/4 left-1/2 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow" style={{ animationDelay: '6s' }} />

        {/* Brand Top Header */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 flex items-center justify-center shadow-xl shadow-purple-500/30">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-purple-300 via-indigo-200 to-blue-300 bg-clip-text text-transparent">
                Jeenash WA
              </h1>
              <p className="text-xs text-purple-300/80 font-medium">Enterprise Automation Platform</p>
            </div>
          </div>
        </div>

        {/* Hero Copy & Value Props */}
        <div className="relative z-10 my-12 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Baileys Multi-Device Engine v6.7</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Scale WhatsApp Business without Boundaries.
          </h2>

          <p className="text-slate-300 text-sm sm:text-base mt-4 leading-relaxed">
            Connect unlimited phone numbers via instant QR scan or 8-digit pairing code. Trigger intelligent keyword auto-replies, protect against spam with anti-ban delays, and manage customer conversations in real-time.
          </p>

          {/* Highlights */}
          <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-slate-700/50">
            <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-700/40">
              <div className="text-lg font-bold text-purple-400 font-mono">0.0 ms</div>
              <div className="text-xs text-slate-400 mt-0.5">Socket.io Real-time Latency</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-700/40">
              <div className="text-lg font-bold text-emerald-400 font-mono">100% Anti-Ban</div>
              <div className="text-xs text-slate-400 mt-0.5">Randomized Natural Delay</div>
            </div>
          </div>
        </div>

        {/* Bottom Deployment Link */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 pt-6 border-t border-slate-800">
          <span>Target: wa.jeenashera.online</span>
          <button
            onClick={onOpenDeploymentModal}
            className="flex items-center gap-1.5 text-purple-400 hover:text-purple-300 transition-colors font-medium"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Nginx & PM2 Setup Guide</span>
          </button>
        </div>
      </div>

      {/* RIGHT COLUMN: Glassmorphism Login Card */}
      <div className="lg:w-1/2 p-6 sm:p-12 lg:p-16 flex items-center justify-center relative">
        <div className="w-full max-w-md rounded-2xl glass-panel p-6 sm:p-8 shadow-2xl relative">
          {/* Card Header & Tabs */}
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-white tracking-tight">Connect to Dashboard</h3>
            <p className="text-xs text-slate-400 mt-1">
              Select your preferred WhatsApp connection method or Admin Login
            </p>
          </div>

          {/* Connection Method Tabs */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-900/80 rounded-xl mb-6 border border-slate-800">
            <button
              onClick={() => setActiveTab('qr')}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'qr'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>QR Code</span>
            </button>
            <button
              onClick={() => setActiveTab('pairing')}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'pairing'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Pairing Code</span>
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'admin'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin JWT</span>
            </button>
          </div>

          {/* TAB 1: QR CODE */}
          {activeTab === 'qr' && (
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center p-6 bg-slate-950/60 rounded-2xl border border-slate-800/80 relative">
                {qrState === 'connected' ? (
                  <div className="py-8 text-center animate-in zoom-in-95 duration-200">
                    <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-3 animate-bounce" />
                    <h4 className="text-base font-bold text-white">Device Connected!</h4>
                    <p className="text-xs text-slate-400 mt-1">Redirecting to Dashboard...</p>
                  </div>
                ) : qrState === 'scanning' ? (
                  <div className="py-8 text-center">
                    <RefreshCw className="w-12 h-12 text-purple-400 mx-auto mb-3 animate-spin" />
                    <h4 className="text-base font-bold text-white">Verifying WhatsApp Session...</h4>
                    <p className="text-xs text-slate-400 mt-1">Synchronizing encryption keys</p>
                  </div>
                ) : (
                  <>
                    {/* Simulated High-Res Baileys QR Code */}
                    <div className="w-48 h-48 bg-white p-3 rounded-xl shadow-inner flex items-center justify-center relative group">
                      <svg
                        className="w-full h-full text-slate-900"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        {/* Realistic QR Pattern SVG */}
                        <path d="M2 2h7v7H2V2zm2 2v3h3V4H4zm11-2h7v7h-7V2zm2 2v3h3V4h-3zM2 15h7v7H2v-7zm2 2v3h3v-3H4zm13-2h2v2h-2v-2zm-2 2h2v2h-2v-2zm4 0h2v2h-2v-2zm-4 4h2v2h-2v-2zm4 0h2v2h-2v-2zm-2-2h2v2h-2v-2zm-6-2h2v2h-2v-2zm0-4h2v2h-2v-2zm2 2h2v2h-2v-2zm-2-6h2v2h-2V7zm6 2h2v2h-2V9zm-4 2h2v2h-2v-2z" />
                      </svg>
                      {/* Center Brand Badge */}
                      <div className="absolute inset-0 m-auto w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-md border-2 border-white">
                        WA
                      </div>
                    </div>

                    {/* Refresh Countdown */}
                    <div className="flex items-center justify-between w-full mt-4 px-2 text-xs">
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Baileys Live Stream</span>
                      </span>
                      <span className="font-mono text-purple-400">Auto-refresh: {qrCountdown}s</span>
                    </div>
                  </>
                )}
              </div>

              {/* Instructions */}
              <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1.5">
                <div className="font-semibold text-slate-200">How to link:</div>
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-purple-400 font-bold shrink-0">
                    1
                  </span>
                  <span>Open WhatsApp on your phone</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-purple-400 font-bold shrink-0">
                    2
                  </span>
                  <span>Tap <strong>Linked Devices</strong> &gt; <strong>Link a device</strong></span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-purple-400 font-bold shrink-0">
                    3
                  </span>
                  <span>Point your phone at this screen to scan the QR</span>
                </div>
              </div>

              {/* Instant Scan Simulation Button */}
              {qrState === 'waiting' && (
                <button
                  onClick={handleSimulateQRScan}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs transition-all shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Simulate Phone QR Scan & Connect</span>
                </button>
              )}
            </div>
          )}

          {/* TAB 2: PAIRING CODE */}
          {activeTab === 'pairing' && (
            <div className="space-y-4">
              {pairingState === 'connected' ? (
                <div className="p-8 text-center bg-slate-950/60 rounded-2xl border border-slate-800 animate-in zoom-in-95">
                  <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-3 animate-bounce" />
                  <h4 className="text-base font-bold text-white">Pairing Verified!</h4>
                  <p className="text-xs text-slate-400 mt-1">Connecting session to Baileys engine...</p>
                </div>
              ) : pairingState === 'verifying' ? (
                <div className="p-8 text-center bg-slate-950/60 rounded-2xl border border-slate-800">
                  <RefreshCw className="w-12 h-12 text-purple-400 mx-auto mb-3 animate-spin" />
                  <h4 className="text-base font-bold text-white">Awaiting WhatsApp Approval...</h4>
                  <p className="text-xs text-slate-400 mt-1">Tap &quot;Confirm&quot; on your WhatsApp notification</p>
                </div>
              ) : pairingState === 'generated' && generatedPairingCode ? (
                <div className="space-y-4">
                  <div className="p-6 bg-slate-950/80 rounded-2xl border border-purple-500/30 text-center">
                    <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                      Your 8-Digit Pairing Code
                    </span>
                    <div className="text-3xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-blue-400 tracking-widest my-3">
                      {generatedPairingCode}
                    </div>

                    <button
                      onClick={handleCopyPairingCode}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5 text-purple-400" />
                      <span>{copiedCode ? 'Copied to Clipboard!' : 'Copy Code'}</span>
                    </button>
                  </div>

                  <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1.5">
                    <div className="font-semibold text-slate-200">How to enter code:</div>
                    <p className="text-slate-400">
                      1. Open WhatsApp on <strong>{countryCode} {phoneNumber}</strong>
                    </p>
                    <p className="text-slate-400">
                      2. Tap <strong>Linked Devices</strong> &gt; <strong>Link with phone number instead</strong>
                    </p>
                    <p className="text-slate-400">
                      3. Enter the 8-character code shown above.
                    </p>
                  </div>

                  <button
                    onClick={handleConfirmPairingInWhatsApp}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Simulate Code Entered in WhatsApp</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleGeneratePairingCode} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Phone Number
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={countryCode}
                        onChange={e => setCountryCode(e.target.value)}
                        className="w-28 px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                      >
                        <option value="+91">🇮🇳 +91</option>
                        <option value="+1">🇺🇸 +1</option>
                        <option value="+44">🇬🇧 +44</option>
                        <option value="+971">🇦🇪 +971</option>
                        <option value="+61">🇦🇺 +61</option>
                        <option value="+65">🇸🇬 +65</option>
                        <option value="+49">🇩🇪 +49</option>
                      </select>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={e => setPhoneNumber(e.target.value)}
                        placeholder="98765 43210"
                        className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500 font-mono"
                        required
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Include country code without special characters.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isGeneratingPairing || !phoneNumber}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-semibold text-xs transition-all shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2"
                  >
                    {isGeneratingPairing ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <KeyRound className="w-4 h-4" />
                        <span>Generate 8-Digit Pairing Code</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: ADMIN JWT LOGIN */}
          {activeTab === 'admin' && (
            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">Admin Master Password</label>
                  <span className="text-[11px] text-purple-400 font-mono">Default: @Jeenash123</span>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={adminPassword}
                    onChange={e => setAdminPassword(e.target.value)}
                    placeholder="Enter admin dashboard password"
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {loginAttempts > 0 && (
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>
                    Failed attempts: {loginAttempts}/5. Rate limiter locks for 15m after 5 tries.
                  </span>
                </div>
              )}

              {isLocked && (
                <div className="p-2.5 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs">
                  Rate limit engaged! Please wait 15 seconds before trying again.
                </div>
              )}

              <button
                type="submit"
                disabled={isLocked}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-semibold text-xs transition-all shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>Verify &amp; Enter Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 pt-2">
                <Shield className="w-3.5 h-3.5 text-purple-400" />
                <span>bcrypt 12-rounds &middot; 15-minute JWT short expiry</span>
              </div>
            </form>
          )}

          {/* Quick Demo Access Bar */}
          <div className="mt-6 pt-5 border-t border-slate-800 text-center">
            <button
              onClick={() => onLogin('@Jeenash123')}
              className="text-xs text-purple-400 hover:text-purple-300 font-medium inline-flex items-center gap-1.5 transition-colors"
            >
              <span>Instant 1-Click Demo Login (@Jeenash123)</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
