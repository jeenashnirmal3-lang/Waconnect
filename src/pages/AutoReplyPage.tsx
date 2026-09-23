import React, { useState } from 'react';
import {
  Bot,
  Plus,
  Trash2,
  Edit2,
  Copy,
  Download,
  Upload,
  Play,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Zap,
  Sliders,
  Filter,
  Shield,
  Layers,
  X
} from 'lucide-react';
import { AutoReplyRule, MatchType, ReplyType, WhatsAppSession } from '../types';

interface AutoReplyPageProps {
  rules: AutoReplyRule[];
  sessions: WhatsAppSession[];
  onAddRule: (rule: Omit<AutoReplyRule, 'id' | 'triggerCount' | 'createdAt'>) => void;
  onUpdateRule: (rule: AutoReplyRule) => void;
  onDeleteRule: (id: string) => void;
  onToggleRule: (id: string) => void;
  onImportRules: (rules: AutoReplyRule[]) => void;
  testRuleMatch: (rule: AutoReplyRule, text: string) => boolean;
  formatReply: (template: string, name: string) => string;
}

export const AutoReplyPage: React.FC<AutoReplyPageProps> = ({
  rules,
  sessions,
  onAddRule,
  onUpdateRule,
  onDeleteRule,
  onToggleRule,
  onImportRules,
  testRuleMatch,
  formatReply
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<AutoReplyRule | null>(null);

  // Form State
  const [ruleName, setRuleName] = useState('');
  const [keywordsInput, setKeywordsInput] = useState('');
  const [matchType, setMatchType] = useState<MatchType>('contains');
  const [replyType, setReplyType] = useState<ReplyType>('text');
  const [replyContent, setReplyContent] = useState('');
  const [delaySeconds, setDelaySeconds] = useState(3);
  const [workingHoursOnly, setWorkingHoursOnly] = useState(false);
  const [workingHoursStart, setWorkingHoursStart] = useState('09:00');
  const [workingHoursEnd, setWorkingHoursEnd] = useState('21:00');
  const [cooldownSeconds, setCooldownSeconds] = useState(60);
  const [priority, setPriority] = useState(50);
  const [applySession, setApplySession] = useState('all');

  // Preview / Sandbox Tester State
  const [testContactName, setTestContactName] = useState('John Doe');
  const [testInputText, setTestInputText] = useState('what is the price?');
  const [testResult, setTestResult] = useState<{
    matchedRule: AutoReplyRule | null;
    renderedReply: string;
    appliedDelay: number;
  } | null>(null);

  // Open modal for new rule or edit
  const handleOpenModal = (rule?: AutoReplyRule) => {
    if (rule) {
      setEditingRule(rule);
      setRuleName(rule.name);
      setKeywordsInput(rule.keywords.join(', '));
      setMatchType(rule.matchType);
      setReplyType(rule.replyType);
      setReplyContent(rule.replyContent);
      setDelaySeconds(rule.delaySeconds);
      setWorkingHoursOnly(rule.workingHoursOnly);
      setWorkingHoursStart(rule.workingHoursStart || '09:00');
      setWorkingHoursEnd(rule.workingHoursEnd || '21:00');
      setCooldownSeconds(rule.cooldownSeconds);
      setPriority(rule.priority);
      setApplySession(rule.applyToSessionIds[0] || 'all');
    } else {
      setEditingRule(null);
      setRuleName('');
      setKeywordsInput('');
      setMatchType('contains');
      setReplyType('text');
      setReplyContent('');
      setDelaySeconds(3);
      setWorkingHoursOnly(false);
      setWorkingHoursStart('09:00');
      setWorkingHoursEnd('21:00');
      setCooldownSeconds(60);
      setPriority(50);
      setApplySession('all');
    }
    setIsModalOpen(true);
  };

  const handleSaveRule = (e: React.FormEvent) => {
    e.preventDefault();
    const keywords = keywordsInput
      .split(',')
      .map(k => k.trim())
      .filter(k => k.length > 0);

    if (keywords.length === 0 || !replyContent.trim()) {
      alert('Please specify at least one keyword and a reply message.');
      return;
    }

    const payload = {
      name: ruleName.trim() || 'Auto-Reply Rule',
      keywords,
      matchType,
      replyType,
      replyContent,
      delaySeconds,
      workingHoursOnly,
      workingHoursStart,
      workingHoursEnd,
      cooldownSeconds,
      priority,
      enabled: true,
      applyToSessionIds: applySession === 'all' ? ['all'] : [applySession],
      contactFilterType: 'all' as const
    };

    if (editingRule) {
      onUpdateRule({
        ...editingRule,
        ...payload
      });
    } else {
      onAddRule(payload);
    }

    setIsModalOpen(false);
  };

  // Run Test Matcher
  const handleRunTest = () => {
    if (!testInputText.trim()) return;

    const sorted = [...rules].sort((a, b) => b.priority - a.priority);
    const matched = sorted.find(r => r.enabled && testRuleMatch(r, testInputText));

    if (matched) {
      const rendered = formatReply(matched.replyContent, testContactName);
      setTestResult({
        matchedRule: matched,
        renderedReply: rendered,
        appliedDelay: matched.delaySeconds
      });
    } else {
      setTestResult({
        matchedRule: null,
        renderedReply: 'No active rule matched this input string.',
        appliedDelay: 0
      });
    }
  };

  // Export JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(rules, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'jeenash_autoreply_rules.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          onImportRules(parsed);
        } else {
          alert('Invalid rules JSON format');
        }
      } catch (err) {
        alert('Failed to parse JSON file');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const insertPlaceholder = (tag: string) => {
    setReplyContent(prev => prev + tag);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Auto-Reply Rule Engine</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure keyword-triggered automated responses, variable templating, priority scheduling, and anti-ban cooldowns.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium cursor-pointer transition-colors">
            <Upload className="w-3.5 h-3.5 text-blue-400" />
            <span>Import JSON</span>
            <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
          </label>

          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-purple-400" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Rule</span>
          </button>
        </div>
      </div>

      {/* Interactive Keyword Tester / Preview Mode */}
      <div className="p-5 rounded-2xl glass-card border border-purple-500/20 bg-gradient-to-r from-purple-950/20 via-slate-900/60 to-slate-950">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Preview Mode &amp; Sandbox Tester</h3>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            Test how rules evaluate without sending real messages
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Customer Name</label>
            <input
              type="text"
              value={testContactName}
              onChange={e => setTestContactName(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[11px] text-slate-400 mb-1">Simulated Incoming Text</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={testInputText}
                onChange={e => setTestInputText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleRunTest()}
                placeholder="e.g. hello, what is the cost?, schedule demo"
                className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500 font-mono"
              />
              <button
                onClick={handleRunTest}
                className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Evaluate</span>
              </button>
            </div>
          </div>
        </div>

        {/* Test Evaluation Output */}
        {testResult && (
          <div className="mt-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800 animate-in fade-in">
            {testResult.matchedRule ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-white">
                      Matched Rule: &ldquo;{testResult.matchedRule.name}&rdquo;
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono">
                      Priority {testResult.matchedRule.priority}
                    </span>
                  </div>
                  <span className="text-slate-400 font-mono text-[11px]">
                    Simulated Delay: {testResult.appliedDelay}s
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-900 text-xs text-purple-200 font-sans whitespace-pre-line border border-purple-500/20">
                  {testResult.renderedReply}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-amber-400">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>No enabled auto-reply rule matched &ldquo;{testInputText}&rdquo;</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Rules Table */}
      <div className="rounded-2xl glass-card overflow-hidden border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/40 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Rule Name</th>
                <th className="py-3 px-4">Keywords</th>
                <th className="py-3 px-4">Match Type</th>
                <th className="py-3 px-4">Reply Preview</th>
                <th className="py-3 px-4">Delay</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {rules.map(rule => (
                <tr key={rule.id} className="hover:bg-slate-900/40 transition-colors">
                  {/* Name */}
                  <td className="py-3.5 px-4 font-semibold text-white">
                    <div className="flex items-center gap-2">
                      <Bot className="w-4 h-4 text-purple-400 shrink-0" />
                      <span>{rule.name}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                      Fired {rule.triggerCount} times
                    </div>
                  </td>

                  {/* Keywords */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {rule.keywords.slice(0, 3).map((kw, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700/60 text-[10px] font-mono text-purple-300"
                        >
                          {kw}
                        </span>
                      ))}
                      {rule.keywords.length > 3 && (
                        <span className="text-[10px] text-slate-500 self-center">
                          +{rule.keywords.length - 3} more
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Match Type */}
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 text-[10px] font-mono capitalize">
                      {rule.matchType}
                    </span>
                  </td>

                  {/* Reply Preview */}
                  <td className="py-3.5 px-4 max-w-xs">
                    <p className="truncate text-slate-400 font-sans" title={rule.replyContent}>
                      {rule.replyContent}
                    </p>
                  </td>

                  {/* Delay */}
                  <td className="py-3.5 px-4 font-mono text-slate-300">
                    {rule.delaySeconds}s
                  </td>

                  {/* Priority */}
                  <td className="py-3.5 px-4 font-mono font-bold text-purple-400">
                    {rule.priority}
                  </td>

                  {/* Status Toggle */}
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => onToggleRule(rule.id)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        rule.enabled ? 'bg-purple-600' : 'bg-slate-700'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          rule.enabled ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenModal(rule)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                        title="Edit rule"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteRule(rule.id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                        title="Delete rule"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Rule Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl glass-panel p-6 shadow-2xl relative border border-slate-700 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {editingRule ? 'Edit Auto-Reply Rule' : 'Create Auto-Reply Rule'}
                  </h3>
                  <p className="text-xs text-slate-400">Configure trigger conditions and automated reply</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRule} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Rule Name
                  </label>
                  <input
                    type="text"
                    value={ruleName}
                    onChange={e => setRuleName(e.target.value)}
                    placeholder="e.g. Welcome & Greeting"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Match Type
                  </label>
                  <select
                    value={matchType}
                    onChange={e => setMatchType(e.target.value as MatchType)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500 capitalize"
                  >
                    <option value="contains">Contains (e.g. &quot;hi&quot; anywhere in text)</option>
                    <option value="exact">Exact (strict full message match)</option>
                    <option value="startsWith">Starts With</option>
                    <option value="endsWith">Ends With</option>
                    <option value="regex">Regex Expression</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Trigger Keywords (Comma separated)
                </label>
                <input
                  type="text"
                  value={keywordsInput}
                  onChange={e => setKeywordsInput(e.target.value)}
                  placeholder="e.g. hi, hello, hey, start, pricing"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500 font-mono"
                  required
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Multiple keywords can trigger this single rule.
                </p>
              </div>

              {/* Reply Content */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Automated Response Message
                  </label>
                  {/* Dynamic Placeholder Insertion Chips */}
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <span className="text-slate-500">Insert tag:</span>
                    <button
                      type="button"
                      onClick={() => insertPlaceholder('{{name}}')}
                      className="px-2 py-0.5 rounded bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-[10px] font-mono"
                    >
                      {'{name}'}
                    </button>
                    <button
                      type="button"
                      onClick={() => insertPlaceholder('{{time}}')}
                      className="px-2 py-0.5 rounded bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-[10px] font-mono"
                    >
                      {'{time}'}
                    </button>
                    <button
                      type="button"
                      onClick={() => insertPlaceholder('{{date}}')}
                      className="px-2 py-0.5 rounded bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-[10px] font-mono"
                    >
                      {'{date}'}
                    </button>
                  </div>
                </div>
                <textarea
                  rows={4}
                  value={replyContent}
                  onChange={e => setReplyContent(e.target.value)}
                  placeholder="Type the message template with optional variables like Hello {{name}}..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              {/* Advanced Parameters: Delay, Cooldown, Priority */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">
                    Natural Delay: <span className="text-purple-400 font-mono">{delaySeconds}s</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="60"
                    value={delaySeconds}
                    onChange={e => setDelaySeconds(parseInt(e.target.value, 10))}
                    className="w-full accent-purple-600"
                  />
                  <span className="text-[10px] text-slate-500">Natural typing pause</span>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">
                    Cooldown: <span className="text-purple-400 font-mono">{cooldownSeconds}s</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="86400"
                    value={cooldownSeconds}
                    onChange={e => setCooldownSeconds(parseInt(e.target.value, 10))}
                    className="w-full px-2.5 py-1 rounded bg-slate-900 border border-slate-800 font-mono text-slate-200"
                  />
                  <span className="text-[10px] text-slate-500">Per-contact cooldown</span>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">
                    Priority: <span className="text-purple-400 font-mono">{priority}</span> (1-100)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={priority}
                    onChange={e => setPriority(parseInt(e.target.value, 10))}
                    className="w-full px-2.5 py-1 rounded bg-slate-900 border border-slate-800 font-mono text-slate-200"
                  />
                  <span className="text-[10px] text-slate-500">Higher numbers evaluate first</span>
                </div>
              </div>

              {/* Working Hours Toggle */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-slate-200">Restrict to Working Hours</div>
                  <div className="text-[11px] text-slate-400">
                    Only trigger during business operating windows
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {workingHoursOnly && (
                    <div className="flex items-center gap-1 font-mono text-[11px]">
                      <input
                        type="time"
                        value={workingHoursStart}
                        onChange={e => setWorkingHoursStart(e.target.value)}
                        className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-200"
                      />
                      <span>to</span>
                      <input
                        type="time"
                        value={workingHoursEnd}
                        onChange={e => setWorkingHoursEnd(e.target.value)}
                        className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-200"
                      />
                    </div>
                  )}
                  <input
                    type="checkbox"
                    checked={workingHoursOnly}
                    onChange={e => setWorkingHoursOnly(e.target.checked)}
                    className="w-4 h-4 accent-purple-600 rounded"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/20"
                >
                  {editingRule ? 'Save Changes' : 'Create Rule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
