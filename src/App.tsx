import React, { useState } from 'react';
import { useAppStore } from './store/useAppStore';
import { ToastContainer } from './components/ToastContainer';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LoginPage } from './pages/LoginPage';
import { OverviewPage } from './pages/OverviewPage';
import { SessionsPage } from './pages/SessionsPage';
import { ChatsPage } from './pages/ChatsPage';
import { AutoReplyPage } from './pages/AutoReplyPage';
import { ContactsPage } from './pages/ContactsPage';
import { SettingsPage } from './pages/SettingsPage';
import { LogsPage } from './pages/LogsPage';
import { ProfilePage } from './pages/ProfilePage';
import { DeploymentModal } from './components/DeploymentModal';

export const App: React.FC = () => {
  const {
    isAuthenticated,
    activeTab,
    sessions,
    activeSessionId,
    chats,
    activeChatId,
    messages,
    rules,
    contacts,
    settings,
    autoReplyLogs,
    systemLogs,
    isTyping,
    toasts,
    isDarkMode,
    login,
    logout,
    setActiveTab,
    setActiveSessionId,
    setActiveChatId,
    addSession,
    disconnectSession,
    reconnectSession,
    sendMessage,
    simulateCustomerMessage,
    addRule,
    updateRule,
    deleteRule,
    toggleRule,
    importRules,
    testRuleMatch,
    formatReply,
    addContact,
    updateContact,
    toggleContactBlacklist,
    toggleContactWhitelist,
    updateSettings,
    clearLogs,
    toggleDarkMode,
    addToast,
    removeToast
  } = useAppStore();

  const [isDeploymentModalOpen, setIsDeploymentModalOpen] = useState(false);

  // If not authenticated, display modern split-screen login page
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0b0f19] text-slate-100 font-sans">
        <LoginPage
          onLogin={login}
          onSessionConnected={(name, phone) => {
            addSession(name, phone);
          }}
          onOpenDeploymentModal={() => setIsDeploymentModalOpen(true)}
        />
        <ToastContainer toasts={toasts} onRemove={removeToast} />
        <DeploymentModal
          isOpen={isDeploymentModalOpen}
          onClose={() => setIsDeploymentModalOpen(false)}
        />
      </div>
    );
  }

  // Calculate badges
  const unreadTotal = chats.reduce((acc, c) => acc + c.unreadCount, 0);
  const activeSessionsCount = sessions.filter(s => s.status === 'connected').length;

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? 'dark bg-[#0b0f19] text-slate-100' : 'bg-slate-900 text-slate-100'
      } font-sans flex flex-col`}
    >
      {/* 3-Zone Top Navigation Bar */}
      <Navbar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={setActiveSessionId}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        onOpenDeploymentModal={() => setIsDeploymentModalOpen(true)}
        onOpenTester={() => setActiveTab('autoreply')}
        onLogout={logout}
      />

      {/* Main Body with Sidebar + Active Page */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          unreadCountTotal={unreadTotal}
          activeSessionsCount={activeSessionsCount}
          rulesCount={rules.length}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 overflow-y-auto">
          {activeTab === 'overview' && (
            <OverviewPage
              sessions={sessions}
              chats={chats}
              rules={rules}
              autoReplyLogs={autoReplyLogs}
              onNavigate={setActiveTab}
              onOpenTester={() => setActiveTab('autoreply')}
            />
          )}

          {activeTab === 'sessions' && (
            <SessionsPage
              sessions={sessions}
              activeSessionId={activeSessionId}
              onSelectSession={setActiveSessionId}
              onAddSession={addSession}
              onDisconnectSession={disconnectSession}
              onReconnectSession={reconnectSession}
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === 'chats' && (
            <ChatsPage
              chats={chats}
              activeChatId={activeChatId}
              onSelectChat={setActiveChatId}
              messages={messages}
              isTyping={isTyping}
              onSendMessage={sendMessage}
              onSimulateCustomerMessage={simulateCustomerMessage}
              sessions={sessions}
              activeSessionId={activeSessionId}
            />
          )}

          {activeTab === 'autoreply' && (
            <AutoReplyPage
              rules={rules}
              sessions={sessions}
              onAddRule={addRule}
              onUpdateRule={updateRule}
              onDeleteRule={deleteRule}
              onToggleRule={toggleRule}
              onImportRules={importRules}
              testRuleMatch={testRuleMatch}
              formatReply={formatReply}
            />
          )}

          {activeTab === 'contacts' && (
            <ContactsPage
              contacts={contacts}
              onAddContact={addContact}
              onUpdateContact={updateContact}
              onToggleBlacklist={toggleContactBlacklist}
              onToggleWhitelist={toggleContactWhitelist}
              onSelectChatByPhone={phone => {
                const targetChat = chats.find(c => c.contactNumber === phone);
                if (targetChat) {
                  setActiveChatId(targetChat.id);
                }
              }}
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsPage
              settings={settings}
              onUpdateSettings={updateSettings}
              isDarkMode={isDarkMode}
              onToggleDarkMode={toggleDarkMode}
            />
          )}

          {activeTab === 'logs' && (
            <LogsPage
              autoReplyLogs={autoReplyLogs}
              systemLogs={systemLogs}
              sessions={sessions}
              onClearLogs={clearLogs}
            />
          )}

          {activeTab === 'profile' && (
            <ProfilePage onLogout={logout} addToast={addToast} />
          )}
        </main>
      </div>

      {/* Global Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Production Deployment Modal */}
      <DeploymentModal
        isOpen={isDeploymentModalOpen}
        onClose={() => setIsDeploymentModalOpen(false)}
      />
    </div>
  );
};

export default App;
