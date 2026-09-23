import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Download,
  Upload,
  ShieldCheck,
  ShieldAlert,
  MessageSquare,
  Edit2,
  Trash2,
  Tag,
  Check,
  X
} from 'lucide-react';
import { Contact } from '../types';
import { ActiveTab } from '../store/useAppStore';

interface ContactsPageProps {
  contacts: Contact[];
  onAddContact: (contact: Omit<Contact, 'id' | 'createdAt'>) => void;
  onUpdateContact: (contact: Contact) => void;
  onToggleBlacklist: (id: string) => void;
  onToggleWhitelist: (id: string) => void;
  onSelectChatByPhone: (phone: string) => void;
  onNavigate: (tab: ActiveTab) => void;
}

export const ContactsPage: React.FC<ContactsPageProps> = ({
  contacts,
  onAddContact,
  onUpdateContact,
  onToggleBlacklist,
  onToggleWhitelist,
  onSelectChatByPhone,
  onNavigate
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [tagInput, setTagInput] = useState('Lead');
  const [notes, setNotes] = useState('');

  const filteredContacts = contacts.filter(c => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phoneNumber.includes(searchQuery);

    if (filterTag === 'whitelisted') return matchesSearch && c.isWhitelisted;
    if (filterTag === 'blacklisted') return matchesSearch && c.isBlacklisted;
    if (filterTag !== 'all') return matchesSearch && c.tags.includes(filterTag);
    return matchesSearch;
  });

  const handleOpenModal = (contact?: Contact) => {
    if (contact) {
      setEditingContact(contact);
      setName(contact.name);
      setPhoneNumber(contact.phoneNumber);
      setTagInput(contact.tags[0] || 'Lead');
      setNotes(contact.notes || '');
    } else {
      setEditingContact(null);
      setName('');
      setPhoneNumber('');
      setTagInput('Lead');
      setNotes('');
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phoneNumber.trim()) return;

    if (editingContact) {
      onUpdateContact({
        ...editingContact,
        name: name.trim(),
        phoneNumber: phoneNumber.trim(),
        tags: [tagInput],
        notes: notes.trim()
      });
    } else {
      onAddContact({
        name: name.trim(),
        phoneNumber: phoneNumber.trim(),
        tags: [tagInput],
        notes: notes.trim(),
        isWhitelisted: false,
        isBlacklisted: false
      });
    }
    setIsModalOpen(false);
  };

  const handleExportCSV = () => {
    const headers = ['Name', 'PhoneNumber', 'Tags', 'IsWhitelisted', 'IsBlacklisted', 'Notes'];
    const rows = contacts.map(c => [
      `"${c.name}"`,
      `"${c.phoneNumber}"`,
      `"${c.tags.join(';')}"`,
      c.isWhitelisted ? 'true' : 'false',
      c.isBlacklisted ? 'true' : 'false',
      `"${c.notes || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', 'jeenash_wa_contacts.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = evt => {
      const text = evt.target?.result as string;
      const lines = text.split('\n').filter(l => l.trim().length > 0);
      let count = 0;
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',').map(s => s.replace(/"/g, '').trim());
        if (parts[0] && parts[1]) {
          onAddContact({
            name: parts[0],
            phoneNumber: parts[1],
            tags: parts[2] ? parts[2].split(';') : ['Imported'],
            isWhitelisted: parts[3] === 'true',
            isBlacklisted: parts[4] === 'true',
            notes: parts[5] || ''
          });
          count++;
        }
      }
      alert(`Imported ${count} contacts from CSV!`);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Customer Contacts Directory</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage phone books, configure whitelist and blacklist rules, and import customer leads via CSV.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium cursor-pointer transition-colors">
            <Upload className="w-3.5 h-3.5 text-blue-400" />
            <span>Import CSV</span>
            <input type="file" accept=".csv" onChange={handleImportCSV} className="hidden" />
          </label>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-purple-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Contact</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl glass-card">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by contact name or number..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {['all', 'VIP', 'Lead', 'Customer', 'whitelisted', 'blacklisted'].map(tag => (
            <button
              key={tag}
              onClick={() => setFilterTag(tag)}
              className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-colors whitespace-nowrap ${
                filterTag === tag
                  ? 'bg-purple-600 text-white font-semibold'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Contacts Table */}
      <div className="rounded-2xl glass-card overflow-hidden border border-slate-800">
        <table className="w-full text-left text-xs text-slate-300 border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/40 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-4">Contact</th>
              <th className="py-3 px-4">Phone Number</th>
              <th className="py-3 px-4">Tags</th>
              <th className="py-3 px-4">Notes</th>
              <th className="py-3 px-4">Whitelist</th>
              <th className="py-3 px-4">Blacklist</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredContacts.map(c => (
              <tr key={c.id} className="hover:bg-slate-900/40 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-white">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-xs text-white">
                      {c.name.charAt(0)}
                    </div>
                    <span>{c.name}</span>
                  </div>
                </td>

                <td className="py-3.5 px-4 font-mono text-purple-300">{c.phoneNumber}</td>

                <td className="py-3.5 px-4">
                  <div className="flex gap-1">
                    {c.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[10px]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </td>

                <td className="py-3.5 px-4 text-slate-400 max-w-xs truncate">{c.notes || '—'}</td>

                {/* Whitelist Toggle */}
                <td className="py-3.5 px-4">
                  <button
                    onClick={() => onToggleWhitelist(c.id)}
                    className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors ${
                      c.isWhitelisted
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                    title="Allow auto-replies exclusively or prioritize"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>{c.isWhitelisted ? 'Active' : 'Off'}</span>
                  </button>
                </td>

                {/* Blacklist Toggle */}
                <td className="py-3.5 px-4">
                  <button
                    onClick={() => onToggleBlacklist(c.id)}
                    className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors ${
                      c.isBlacklisted
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                    title="Block all automated auto-replies to this contact"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    <span>{c.isBlacklisted ? 'Blocked' : 'Off'}</span>
                  </button>
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => {
                        onSelectChatByPhone(c.phoneNumber);
                        onNavigate('chats');
                      }}
                      className="p-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 transition-colors"
                      title="Open conversation"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleOpenModal(c)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                      title="Edit contact"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Contact Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl glass-panel p-6 shadow-2xl relative border border-slate-700">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                {editingContact ? 'Edit Contact' : 'Add Contact'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">WhatsApp Phone Number</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={e => setPhoneNumber(e.target.value)}
                  placeholder="+91 98234 56789"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-purple-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Category Tag</label>
                <select
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-purple-500"
                >
                  <option value="Lead">Lead</option>
                  <option value="VIP">VIP</option>
                  <option value="Customer">Customer</option>
                  <option value="Support">Support</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Enterprise client inquiry notes..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
