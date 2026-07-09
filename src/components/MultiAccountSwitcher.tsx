/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MicrosoftAccount } from "../types";

interface MultiAccountSwitcherProps {
  accounts: MicrosoftAccount[];
  activeAccountId: string | null;
  onSelectAccount: (accountId: string) => void;
  onAddAccount: () => void;
  onLogoutAccount: (accountId: string) => void;
  onClose: () => void;
}

export default function MultiAccountSwitcher({
  accounts,
  activeAccountId,
  onSelectAccount,
  onAddAccount,
  onLogoutAccount,
  onClose
}: MultiAccountSwitcherProps) {
  const formatStorage = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 modal-backdrop-container select-none animate-fade-in">
      <div className="bg-white dark:bg-fluent-dark-card border border-fluent-border dark:border-fluent-dark-border rounded-sm shadow-md max-w-md w-full overflow-hidden flex flex-col justify-between" id="account-switcher-dialog">
        {/* Header */}
        <div className="p-4 border-b border-fluent-border dark:border-fluent-dark-border flex items-center justify-between bg-fluent-bg-sidebar/50 dark:bg-fluent-dark-sidebar/10">
          <div>
            <h3 className="text-xs font-bold text-fluent-text dark:text-white uppercase tracking-wider">Microsoft 365 Accounts</h3>
            <p className="text-[10px] text-fluent-text-secondary mt-0.5">Switch instantly or connect a new corporate tenant.</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-sm hover:bg-fluent-bg-sidebar dark:hover:bg-fluent-dark-border/40 text-fluent-text-muted hover:text-fluent-text dark:hover:text-gray-200 transition-colors"
          >
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Accounts List */}
        <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
          {accounts.length === 0 ? (
            <div className="text-center py-6 text-fluent-text-secondary text-xs">
              No accounts connected. Connect your OneDrive to get started.
            </div>
          ) : (
            accounts.map((acc) => {
              const isActive = acc.id === activeAccountId;
              const storagePercentage = acc.storageTotal > 0 ? Math.round((acc.storageUsed / acc.storageTotal) * 100) : 0;
              return (
                <div
                  key={acc.id}
                  onClick={() => !isActive && onSelectAccount(acc.id)}
                  className={`p-3.5 rounded-sm border flex flex-col justify-between transition-all relative ${
                    isActive
                      ? "bg-fluent-brand-light/30 dark:bg-fluent-brand/10 border-fluent-brand shadow-3xs"
                      : "bg-white dark:bg-fluent-dark-card border-fluent-border dark:border-fluent-dark-border hover:bg-fluent-bg-sidebar/50 dark:hover:bg-fluent-dark-border/30 cursor-pointer"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {acc.avatarUrl ? (
                      <img
                        src={acc.avatarUrl}
                        alt={acc.name}
                        className="w-10 h-10 rounded-full object-cover border border-fluent-border dark:border-fluent-dark-border"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-fluent-brand text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                        {acc.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-1.5">
                        <p className="text-xs font-bold text-fluent-text dark:text-white truncate">{acc.name}</p>
                        {isActive && (
                          <span className="bg-fluent-brand-light dark:bg-fluent-brand/15 text-fluent-brand font-bold text-[8px] px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-fluent-text-muted truncate">{acc.email}</p>
                      <p className="text-[9px] text-fluent-text-muted mt-0.5">Last login: {acc.lastLogin}</p>
                    </div>

                    {/* Logout Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onLogoutAccount(acc.id);
                      }}
                      className="p-1 text-fluent-text-muted hover:text-red-500 rounded-sm hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                      title="Disconnect Account"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                    </button>
                  </div>

                  {/* Account storage summary */}
                  <div className="mt-3 pt-3 border-t border-fluent-border/40 dark:border-fluent-dark-border/40 flex items-center justify-between text-[10px] text-fluent-text-secondary">
                    <div className="flex-1 mr-4">
                      <div className="flex justify-between font-medium">
                        <span>Storage ({storagePercentage}%)</span>
                        <span>{formatStorage(acc.storageUsed)} of {formatStorage(acc.storageTotal)}</span>
                      </div>
                      <div className="w-full bg-fluent-border dark:bg-fluent-dark-border rounded-full h-1 mt-1 overflow-hidden">
                        <div className="h-full bg-fluent-brand" style={{ width: `${storagePercentage}%` }}></div>
                      </div>
                    </div>
                    <span className="text-[9px] bg-fluent-bg-sidebar dark:bg-fluent-dark-bg px-1.5 py-0.5 rounded-sm text-fluent-text-secondary font-bold uppercase tracking-wider">
                      {acc.driveType}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Connect Action Footer */}
        <div className="p-4 border-t border-fluent-border dark:border-fluent-dark-border flex flex-col space-y-2 bg-fluent-bg-sidebar/30 dark:bg-fluent-dark-sidebar/10">
          <button
            onClick={onAddAccount}
            className="w-full py-2 bg-fluent-brand hover:bg-fluent-brand-hover text-white rounded-sm text-xs font-bold transition-all flex items-center justify-center space-x-2 shadow-2xs"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Connect Microsoft Account</span>
          </button>
          <p className="text-[9px] text-fluent-text-muted text-center leading-normal">
            Requires standard Azure Application authorization scopes to connect to personal or commercial Microsoft 365 OneDrive vaults.
          </p>
        </div>
      </div>
    </div>
  );
}
