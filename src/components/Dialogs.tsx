/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { AppSettings, DriveItem } from "../types";

// ==========================================
// 1. CREATE FOLDER MODAL
// ==========================================
interface CreateFolderProps {
  onClose: () => void;
  onSubmit: (name: string) => void;
}
export function CreateFolderModal({ onClose, onSubmit }: CreateFolderProps) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 modal-backdrop-container animate-fade-in">
      <div className="bg-white dark:bg-fluent-dark-card border border-fluent-border dark:border-fluent-dark-border rounded-sm shadow-md max-w-sm w-full p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-fluent-text dark:text-white uppercase tracking-wider">Create New Folder</h3>
          <button onClick={onClose} className="p-1 rounded-sm text-fluent-text-muted hover:text-fluent-text hover:bg-fluent-bg-sidebar dark:hover:bg-fluent-dark-border/40">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[9px] text-fluent-text-muted font-bold uppercase tracking-wider block">Folder Name</label>
            <input
              type="text"
              required
              autoFocus
              placeholder="e.g. Q3 Financial Reports"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-fluent-bg-sidebar dark:bg-fluent-dark-bg border border-fluent-border dark:border-fluent-dark-border rounded-sm text-fluent-text dark:text-white focus:outline-none focus:ring-1 focus:ring-fluent-brand focus:border-fluent-brand transition-all"
            />
          </div>

          <div className="flex space-x-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 bg-white hover:bg-fluent-bg-sidebar dark:bg-fluent-dark-bg text-fluent-text rounded-sm text-xs font-bold border border-fluent-border dark:border-fluent-dark-border transition-colors shadow-3xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 py-2 bg-fluent-brand hover:bg-fluent-brand-hover text-white rounded-sm text-xs font-bold transition-colors disabled:opacity-50 shadow-3xs"
            >
              Create Folder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// 2. RENAME ITEM MODAL
// ==========================================
interface RenameProps {
  item: DriveItem;
  onClose: () => void;
  onSubmit: (id: string, newName: string) => void;
}
export function RenameModal({ item, onClose, onSubmit }: RenameProps) {
  const [name, setName] = useState(item.name);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && name.trim() !== item.name) {
      onSubmit(item.id, name.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 modal-backdrop-container animate-fade-in">
      <div className="bg-white dark:bg-fluent-dark-card border border-fluent-border dark:border-fluent-dark-border rounded-sm shadow-md max-w-sm w-full p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-fluent-text dark:text-white uppercase tracking-wider">Rename {item.folder ? "Folder" : "File"}</h3>
          <button onClick={onClose} className="p-1 rounded-sm text-fluent-text-muted hover:text-fluent-text hover:bg-fluent-bg-sidebar dark:hover:bg-fluent-dark-border/40">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[9px] text-fluent-text-muted font-bold uppercase tracking-wider block">New Name</label>
            <input
              type="text"
              required
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-fluent-bg-sidebar dark:bg-fluent-dark-bg border border-fluent-border dark:border-fluent-dark-border rounded-sm text-fluent-text dark:text-white focus:outline-none focus:ring-1 focus:ring-fluent-brand focus:border-fluent-brand transition-all"
            />
          </div>

          <div className="flex space-x-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 bg-white hover:bg-fluent-bg-sidebar dark:bg-fluent-dark-bg text-fluent-text rounded-sm text-xs font-bold border border-fluent-border dark:border-fluent-dark-border transition-colors shadow-3xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || name.trim() === item.name}
              className="flex-1 py-2 bg-fluent-brand hover:bg-fluent-brand-hover text-white rounded-sm text-xs font-bold transition-colors disabled:opacity-50 shadow-3xs"
            >
              Apply Rename
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// 3. SHARE LINK GENERATOR MODAL
// ==========================================
interface ShareProps {
  item: DriveItem;
  onClose: () => void;
  onSubmit: (id: string, type: "anonymous" | "organization", expiration?: string, password?: string) => void;
  onRemoveLink: (id: string) => void;
}
export function ShareModal({ item, onClose, onSubmit, onRemoveLink }: ShareProps) {
  const [type, setType] = useState<"anonymous" | "organization">("anonymous");
  const [expiration, setExpiration] = useState("");
  const [password, setPassword] = useState("");

  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(item.id, type, expiration || undefined, password || undefined);
  };

  const handleCopy = () => {
    if (item.sharingLink) {
      navigator.clipboard.writeText(item.sharingLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 modal-backdrop-container animate-fade-in">
      <div className="bg-white dark:bg-fluent-dark-card border border-fluent-border dark:border-fluent-dark-border rounded-sm shadow-md max-w-md w-full p-5 space-y-4 select-none">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-fluent-text dark:text-white uppercase tracking-wider">Share: {item.name}</h3>
            <p className="text-[9px] text-fluent-text-secondary">Configure Microsoft Graph access permissions.</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-sm text-fluent-text-muted hover:text-fluent-text hover:bg-fluent-bg-sidebar dark:hover:bg-fluent-dark-border/40">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {item.sharingLink ? (
          <div className="space-y-4">
            <div className="p-3 bg-green-500/5 border border-green-500/20 rounded-sm space-y-1.5 animate-slide-up">
              <span className="text-[9px] bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-sm font-bold uppercase tracking-wider">
                {item.sharingType === "organization" ? "Organization only" : "Anyone with link"}
              </span>
              <p className="text-xs font-mono break-all text-fluent-text dark:text-gray-300 font-medium select-text pt-1">
                {item.sharingLink}
              </p>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={handleCopy}
                className="flex-1 py-2 bg-fluent-brand hover:bg-fluent-brand-hover text-white rounded-sm text-xs font-bold transition-all shadow-3xs"
              >
                {copied ? "Copied to Clipboard!" : "Copy Link"}
              </button>
              <button
                onClick={() => onRemoveLink(item.id)}
                className="py-2 px-3 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-sm text-xs font-bold transition-colors"
              >
                Revoke Link
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Link Type Select */}
            <div className="space-y-1.5">
              <label className="text-[9px] text-fluent-text-muted font-bold uppercase tracking-wider block">Access Permissions Scope</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setType("anonymous")}
                  className={`py-2 px-3 border rounded-sm text-xs font-semibold text-center transition-all ${
                    type === "anonymous"
                      ? "bg-fluent-brand-light/30 dark:bg-fluent-brand/10 border-fluent-brand text-fluent-brand shadow-3xs"
                      : "bg-white dark:bg-fluent-dark-card border-fluent-border dark:border-fluent-dark-border text-fluent-text-secondary hover:bg-fluent-bg-sidebar/50"
                  }`}
                >
                  Anyone with link
                </button>
                <button
                  type="button"
                  onClick={() => setType("organization")}
                  className={`py-2 px-3 border rounded-sm text-xs font-semibold text-center transition-all ${
                    type === "organization"
                      ? "bg-fluent-brand-light/30 dark:bg-fluent-brand/10 border-fluent-brand text-fluent-brand shadow-3xs"
                      : "bg-white dark:bg-fluent-dark-card border-fluent-border dark:border-fluent-dark-border text-fluent-text-secondary hover:bg-fluent-bg-sidebar/50"
                  }`}
                >
                  My Organization
                </button>
              </div>
            </div>

            {/* Optional Settings */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[9px] text-fluent-text-muted font-bold uppercase tracking-wider block">Expiration Date</label>
                <input
                  type="date"
                  value={expiration}
                  onChange={(e) => setExpiration(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 bg-fluent-bg-sidebar dark:bg-fluent-dark-bg border border-fluent-border dark:border-fluent-dark-border rounded-sm text-fluent-text dark:text-white focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] text-fluent-text-muted font-bold uppercase tracking-wider block">Optional Password</label>
                <input
                  type="password"
                  placeholder="Set Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 bg-fluent-bg-sidebar dark:bg-fluent-dark-bg border border-fluent-border dark:border-fluent-dark-border rounded-sm text-fluent-text dark:text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 bg-white hover:bg-fluent-bg-sidebar dark:bg-fluent-dark-bg text-fluent-text-secondary rounded-sm text-xs font-bold border border-fluent-border dark:border-fluent-dark-border transition-colors shadow-3xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 bg-fluent-brand hover:bg-fluent-brand-hover text-white rounded-sm text-xs font-bold transition-colors shadow-3xs"
              >
                Generate Link
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 4. CONFIRMATION DESTRUCTIVE MODAL
// ==========================================
interface ConfirmProps {
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onClose: () => void;
}
export function ConfirmationModal({ title, message, confirmLabel, onConfirm, onClose }: ConfirmProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 modal-backdrop-container animate-fade-in">
      <div className="bg-white dark:bg-fluent-dark-card border border-fluent-border dark:border-fluent-dark-border rounded-sm shadow-md max-w-sm w-full p-5 space-y-4">
        <div className="flex items-center space-x-2.5 text-red-600 dark:text-red-400">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-xs font-bold text-fluent-text dark:text-white uppercase tracking-wider">{title}</h3>
        </div>

        <p className="text-xs text-fluent-text-secondary leading-relaxed">{message}</p>

        <div className="flex space-x-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 bg-white hover:bg-fluent-bg-sidebar dark:bg-fluent-dark-bg text-fluent-text rounded-sm text-xs font-bold border border-fluent-border dark:border-fluent-dark-border transition-colors shadow-3xs"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-sm text-xs font-bold transition-colors shadow-3xs"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 5. ADVANCED SEARCH & FILTER MODAL
// ==========================================
interface AdvancedSearchProps {
  onSearch: (filters: { extension: string; minSizeMb: number; modifiedAfter: string }) => void;
  onClose: () => void;
}
export function AdvancedSearchModal({ onSearch, onClose }: AdvancedSearchProps) {
  const [extension, setExtension] = useState("");
  const [minSizeMb, setMinSizeMb] = useState<number>(0);
  const [modifiedAfter, setModifiedAfter] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ extension, minSizeMb, modifiedAfter });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 modal-backdrop-container animate-fade-in">
      <div className="bg-white dark:bg-fluent-dark-card border border-fluent-border dark:border-fluent-dark-border rounded-sm shadow-md max-w-sm w-full p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-fluent-text dark:text-white uppercase tracking-wider">Advanced Filter Options</h3>
            <p className="text-[9px] text-fluent-text-secondary">Narrow down target OneDrive results.</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-sm text-fluent-text-muted hover:text-fluent-text hover:bg-fluent-bg-sidebar dark:hover:bg-fluent-dark-border/40">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[9px] text-fluent-text-muted font-bold uppercase tracking-wider block">File Extension</label>
            <input
              type="text"
              placeholder="e.g. pdf, xlsx, zip"
              value={extension}
              onChange={(e) => setExtension(e.target.value)}
              className="w-full text-xs px-3 py-1.5 bg-fluent-bg-sidebar dark:bg-fluent-dark-bg border border-fluent-border dark:border-fluent-dark-border rounded-sm text-fluent-text dark:text-white focus:outline-none focus:ring-1 focus:ring-fluent-brand"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[9px] text-fluent-text-muted font-bold uppercase tracking-wider block">Minimum Size (MB)</label>
            <input
              type="number"
              min="0"
              placeholder="e.g. 10"
              value={minSizeMb || ""}
              onChange={(e) => setMinSizeMb(parseFloat(e.target.value) || 0)}
              className="w-full text-xs px-3 py-1.5 bg-fluent-bg-sidebar dark:bg-fluent-dark-bg border border-fluent-border dark:border-fluent-dark-border rounded-sm text-fluent-text dark:text-white focus:outline-none focus:ring-1 focus:ring-fluent-brand"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[9px] text-fluent-text-muted font-bold uppercase tracking-wider block">Modified Since</label>
            <input
              type="date"
              value={modifiedAfter}
              onChange={(e) => setModifiedAfter(e.target.value)}
              className="w-full text-xs px-3 py-1.5 bg-fluent-bg-sidebar dark:bg-fluent-dark-bg border border-fluent-border dark:border-fluent-dark-border rounded-sm text-fluent-text dark:text-white focus:outline-none focus:ring-1 focus:ring-fluent-brand"
            />
          </div>

          <div className="flex space-x-2 pt-1">
            <button
              type="button"
              onClick={() => {
                setExtension("");
                setMinSizeMb(0);
                setModifiedAfter("");
              }}
              className="py-2 px-3 bg-white hover:bg-fluent-bg-sidebar dark:bg-fluent-dark-bg text-fluent-text-secondary rounded-sm text-xs font-bold border border-fluent-border dark:border-fluent-dark-border transition-colors shadow-3xs"
            >
              Reset
            </button>
            <button
              type="submit"
              className="flex-1 py-2 bg-fluent-brand hover:bg-fluent-brand-hover text-white rounded-sm text-xs font-bold transition-colors shadow-3xs"
            >
              Apply Filter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// 6. GENERAL CONFIG SETTINGS MODAL
// ==========================================
interface SettingsProps {
  settings: AppSettings;
  onSave: (settings: AppSettings) => void;
  onClose: () => void;
}
export function SettingsModal({ settings, onSave, onClose }: SettingsProps) {
  const [clientId, setClientId] = useState(settings.clientId);
  const [clientSecret, setClientSecret] = useState(settings.clientSecret);
  const [tenantId, setTenantId] = useState(settings.tenantId);
  const [useSimulation, setUseSimulation] = useState(settings.useSimulation);
  const [theme, setTheme] = useState(settings.theme);
  const [enableDevConsole, setEnableDevConsole] = useState(settings.enableDevConsole || false);

  const handleThemeChange = (newTheme: "light" | "dark") => {
    setTheme(newTheme);
    onSave({
      clientId: clientId.trim(),
      clientSecret: clientSecret.trim(),
      tenantId: tenantId.trim(),
      useSimulation,
      theme: newTheme,
      enableDevConsole
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      clientId: clientId.trim(),
      clientSecret: clientSecret.trim(),
      tenantId: tenantId.trim(),
      useSimulation,
      theme,
      enableDevConsole
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 modal-backdrop-container animate-fade-in">
      <div className="bg-white dark:bg-fluent-dark-card border border-fluent-border dark:border-fluent-dark-border rounded-sm shadow-md max-w-md w-full p-5 space-y-4 select-none">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-fluent-text dark:text-white uppercase tracking-wider">OneDrive Explorer Settings</h3>
            <p className="text-[9px] text-fluent-text-secondary">Configure Graph credentials and visual parameters.</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-sm text-fluent-text-muted hover:text-fluent-text hover:bg-fluent-bg-sidebar dark:hover:bg-fluent-dark-border/40">
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Visual Theme setting */}
          <div className="space-y-1.5">
            <label className="text-[9px] text-fluent-text-muted font-bold uppercase tracking-wider block">Visual Theme Palette</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleThemeChange("light")}
                className={`py-2 px-3 border rounded-sm text-xs font-semibold text-center transition-all ${
                  theme === "light"
                    ? "bg-fluent-brand-light/30 dark:bg-fluent-brand/10 border-fluent-brand text-fluent-brand shadow-3xs"
                    : "bg-white dark:bg-fluent-dark-card border-fluent-border dark:border-fluent-dark-border text-fluent-text-secondary hover:bg-fluent-bg-sidebar/50"
                }`}
              >
                Modern Light Theme
              </button>
              <button
                type="button"
                onClick={() => handleThemeChange("dark")}
                className={`py-2 px-3 border rounded-sm text-xs font-semibold text-center transition-all ${
                  theme === "dark"
                    ? "bg-fluent-brand-light/30 dark:bg-fluent-brand/10 border-fluent-brand text-fluent-brand shadow-3xs"
                    : "bg-white dark:bg-fluent-dark-card border-fluent-border dark:border-fluent-dark-border text-fluent-text-secondary hover:bg-fluent-bg-sidebar/50"
                }`}
              >
                Slate Dark Theme
              </button>
            </div>
          </div>

          <div className="h-[1px] bg-fluent-border dark:bg-fluent-dark-border/40 my-2"></div>

          {/* Simulation Toggle */}
          <div className="flex items-center justify-between py-1 bg-fluent-bg-sidebar dark:bg-fluent-dark-bg p-3 rounded-sm border border-fluent-border dark:border-fluent-dark-border">
            <div>
              <span className="text-xs font-bold text-fluent-text dark:text-white">Enable High-Fidelity Simulation</span>
              <p className="text-[9px] text-fluent-text-secondary">Run local storage cache simulation without Azure AD configs.</p>
            </div>
            <button
              type="button"
              onClick={() => setUseSimulation(!useSimulation)}
              className={`w-10 h-5.5 flex items-center rounded-full p-0.5 transition-colors duration-200 ${
                useSimulation ? "bg-fluent-brand" : "bg-gray-300 dark:bg-gray-800"
              }`}
            >
              <div
                className={`bg-white w-4.5 h-4.5 rounded-full shadow-3xs transform transition-transform duration-200 ${
                  useSimulation ? "translate-x-4.5" : "translate-x-0"
                }`}
              ></div>
            </button>
          </div>

          {/* Developer Console Toggle */}
          <div className="flex items-center justify-between py-1 bg-fluent-bg-sidebar dark:bg-fluent-dark-bg p-3 rounded-sm border border-fluent-border dark:border-fluent-dark-border">
            <div>
              <span className="text-xs font-bold text-fluent-text dark:text-white">Enable Developer Console</span>
              <p className="text-[9px] text-fluent-text-secondary">Show Developer Console in sidebar to inspect Graph payloads.</p>
            </div>
            <button
              type="button"
              onClick={() => setEnableDevConsole(!enableDevConsole)}
              className={`w-10 h-5.5 flex items-center rounded-full p-0.5 transition-colors duration-200 ${
                enableDevConsole ? "bg-fluent-brand" : "bg-gray-300 dark:bg-gray-800"
              }`}
            >
              <div
                className={`bg-white w-4.5 h-4.5 rounded-full shadow-3xs transform transition-transform duration-200 ${
                  enableDevConsole ? "translate-x-4.5" : "translate-x-0"
                }`}
              ></div>
            </button>
          </div>

          {/* Credentials Inputs (Disabled in Simulation) */}
          <div className={`space-y-3 transition-opacity duration-200 ${useSimulation ? "opacity-35 pointer-events-none" : ""}`}>
            <span className="text-[9px] text-fluent-text-muted font-bold uppercase tracking-wider block">Microsoft Azure App Credentials</span>

            <div className="space-y-1">
              <label className="text-[10px] text-fluent-text-secondary">Client ID (Application ID)</label>
              <input
                type="text"
                placeholder="e.g. 4072f5ea-65be-44b2-a403-ecdc4cbf8a8c"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full text-xs font-mono px-3 py-1.5 bg-fluent-bg-sidebar dark:bg-fluent-dark-bg border border-fluent-border dark:border-fluent-dark-border rounded-sm text-fluent-text dark:text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-fluent-text-secondary">Client Secret Value (Optional for SPA-PKCE)</label>
              <input
                type="password"
                placeholder="••••••••••••••••••••"
                value={clientSecret}
                onChange={(e) => setClientSecret(e.target.value)}
                className="w-full text-xs font-mono px-3 py-1.5 bg-fluent-bg-sidebar dark:bg-fluent-dark-bg border border-fluent-border dark:border-fluent-dark-border rounded-sm text-fluent-text dark:text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-fluent-text-secondary">Tenant ID (or "common" / "consumers")</label>
              <input
                type="text"
                placeholder="common"
                value={tenantId}
                onChange={(e) => setTenantId(e.target.value)}
                className="w-full text-xs font-mono px-3 py-1.5 bg-fluent-bg-sidebar dark:bg-fluent-dark-bg border border-fluent-border dark:border-fluent-dark-border rounded-sm text-fluent-text dark:text-white focus:outline-none"
              />
            </div>
            
            <p className="text-[9px] text-fluent-text-muted leading-normal">
              Note: Make sure to add <code className="bg-fluent-bg-sidebar dark:bg-fluent-dark-bg p-0.5 border border-fluent-border dark:border-fluent-dark-border rounded-xs font-mono text-[8px]">{window.location.origin}/auth/callback</code> to your Azure portal Redirect URIs list.
            </p>
          </div>

          {/* Footer buttons */}
          <div className="flex space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 bg-white hover:bg-fluent-bg-sidebar dark:bg-fluent-dark-bg text-fluent-text-secondary rounded-sm text-xs font-bold border border-fluent-border dark:border-fluent-dark-border transition-colors shadow-3xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 bg-fluent-brand hover:bg-fluent-brand-hover text-white rounded-sm text-xs font-bold transition-colors shadow-3xs"
            >
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
