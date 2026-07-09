/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SidebarTab, MicrosoftAccount } from "../types";

interface SidebarProps {
  activeTab: SidebarTab;
  setActiveTab: (tab: SidebarTab) => void;
  activeAccount: MicrosoftAccount | null;
  accounts: MicrosoftAccount[];
  setShowAccountSwitcher: (show: boolean) => void;
  enableDevConsole?: boolean;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  activeAccount,
  accounts,
  setShowAccountSwitcher,
  enableDevConsole = false
}: SidebarProps) {
  const menuItems = [
    {
      id: "dashboard" as SidebarTab,
      label: "Dashboard",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
        </svg>
      )
    },
    {
      id: "files" as SidebarTab,
      label: "My Files",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      )
    },
    {
      id: "shared" as SidebarTab,
      label: "Shared",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    {
      id: "recent" as SidebarTab,
      label: "Recent",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: "favorites" as SidebarTab,
      label: "Favorites",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      )
    },
    {
      id: "recycle-bin" as SidebarTab,
      label: "Recycle Bin",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      )
    },
    {
      id: "settings" as SidebarTab,
      label: "Settings",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      id: "developer-mode" as SidebarTab,
      label: "Developer Console",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    }
  ].filter((item) => item.id !== "developer-mode" || enableDevConsole);

  const getStoragePercentage = () => {
    if (!activeAccount || activeAccount.storageTotal === 0) return 0;
    return Math.min(100, Math.round((activeAccount.storageUsed / activeAccount.storageTotal) * 100));
  };

  const formatStorage = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <aside className="w-64 border-r border-fluent-border dark:border-fluent-dark-border bg-fluent-bg-sidebar dark:bg-fluent-dark-sidebar flex flex-col justify-between h-full select-none" id="onedrive-sidebar">
      {/* Brand & Account Header */}
      <div>
        <div className="p-4.5 border-b border-fluent-border dark:border-fluent-dark-border flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg className="w-5.5 h-5.5 text-fluent-brand" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95C8.08 7.14 9.94 6 12 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11c1.56.1 2.78 1.41 2.78 2.96 0 1.65-1.35 3-3 3z" />
            </svg>
            <span className="font-semibold text-fluent-text dark:text-white text-sm tracking-tight">
              OneDrive Explorer
            </span>
          </div>
          <span className="text-[9px] bg-fluent-brand-light dark:bg-fluent-brand/10 text-fluent-brand font-semibold px-2 py-0.5 rounded-sm uppercase tracking-wider">
            Graph
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="p-2 space-y-0.5">
          {menuItems.map((item) => {
            const isSelected = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-item-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-sm text-xs font-medium transition-all duration-100 ${
                  isSelected
                    ? "bg-white dark:bg-fluent-dark-card text-fluent-brand border-l-[3px] border-fluent-brand pl-[9px] shadow-xs"
                    : "text-fluent-text-secondary dark:text-gray-400 hover:bg-white/40 dark:hover:bg-fluent-dark-card/40 hover:text-fluent-text dark:hover:text-white border-l-[3px] border-transparent"
                }`}
              >
                <span className={`${isSelected ? "text-fluent-brand" : "text-fluent-text-muted"}`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Account Info and Storage Footer */}
      <div className="p-4 border-t border-fluent-border dark:border-fluent-dark-border space-y-4">
        {/* Account Switcher Trigger */}
        {activeAccount ? (
          <div
            id="sidebar-account-section"
            onClick={() => setShowAccountSwitcher(true)}
            className="flex items-center space-x-3 p-2 rounded-sm bg-white dark:bg-fluent-dark-card border border-fluent-border/60 dark:border-fluent-dark-border/60 hover:border-fluent-brand cursor-pointer transition-colors duration-100 group shadow-2xs"
          >
            {activeAccount.avatarUrl ? (
              <img
                src={activeAccount.avatarUrl}
                alt={activeAccount.name}
                className="w-8 h-8 rounded-full border border-fluent-border dark:border-fluent-dark-border object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-fluent-brand text-white flex items-center justify-center font-bold text-xs">
                {activeAccount.name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-fluent-text dark:text-white truncate group-hover:text-fluent-brand">
                {activeAccount.name}
              </p>
              <p className="text-[10px] text-fluent-text-secondary dark:text-gray-400 truncate">
                {activeAccount.email}
              </p>
            </div>
            <svg className="w-3.5 h-3.5 text-fluent-text-muted flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
            </svg>
          </div>
        ) : (
          <button
            id="sidebar-sign-in-btn"
            onClick={() => setShowAccountSwitcher(true)}
            className="w-full py-2 px-3 bg-fluent-brand hover:bg-fluent-brand-hover text-white font-semibold text-xs rounded-sm flex items-center justify-center space-x-2 transition-colors shadow-xs"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            <span>Connect Account</span>
          </button>
        )}

        {/* Storage Space Quota Meter */}
        {activeAccount && (
          <div className="space-y-1.5 px-0.5" id="sidebar-storage-section">
            <div className="flex items-center justify-between text-[10px] text-fluent-text-secondary dark:text-gray-400">
              <span className="font-medium">Storage Quota</span>
              <span>{getStoragePercentage()}% used</span>
            </div>
            <div className="w-full bg-fluent-border dark:bg-fluent-dark-border rounded-full h-1 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  getStoragePercentage() > 90
                    ? "bg-red-500"
                    : getStoragePercentage() > 75
                    ? "bg-amber-500"
                    : "bg-fluent-brand"
                }`}
                style={{ width: `${getStoragePercentage()}%` }}
              ></div>
            </div>
            <div className="text-[9px] text-fluent-text-muted flex justify-between">
              <span>{formatStorage(activeAccount.storageUsed)}</span>
              <span>{formatStorage(activeAccount.storageTotal)}</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
