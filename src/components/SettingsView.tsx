/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { AppSettings, MicrosoftAccount } from "../types";

interface SettingsViewProps {
  settings: AppSettings;
  onSave: (settings: AppSettings) => void;
  account: MicrosoftAccount | null;
  onDisconnect: (id: string) => void;
  onConnect: () => void;
  onResetDemoData: () => void;
  onNavigateToDocs?: () => void;
}

export default function SettingsView({
  settings,
  onSave,
  account,
  onDisconnect,
  onConnect,
  onResetDemoData,
  onNavigateToDocs
}: SettingsViewProps) {
  const [clientId, setClientId] = useState(settings.clientId);
  const [clientSecret, setClientSecret] = useState(settings.clientSecret);
  const [tenantId, setTenantId] = useState(settings.tenantId);
  const [useSimulation, setUseSimulation] = useState(settings.useSimulation);
  const [theme, setTheme] = useState(settings.theme);
  const [enableDevConsole, setEnableDevConsole] = useState(settings.enableDevConsole || false);

  const [copied, setCopied] = useState(false);
  const [showGuide, setShowGuide] = useState(true);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

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
    setShowSuccessPopup(true);
  };

  const handleCopyCallback = () => {
    const callbackUrl = `${window.location.origin}/auth/callback`;
    navigator.clipboard.writeText(callbackUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-fluent-bg-sidebar/10 dark:bg-fluent-dark-bg/20 p-6 space-y-6 select-text" id="settings-view-wrapper">
      <div className="max-w-2xl bg-white dark:bg-fluent-dark-card border border-fluent-border dark:border-fluent-dark-border rounded-sm shadow-xs p-6 space-y-6 animate-fade-in">
        
        {/* Header */}
        <div>
          <h2 className="text-sm font-bold text-fluent-text dark:text-white uppercase tracking-wider">OneDrive Explorer Settings</h2>
          <p className="text-xs text-fluent-text-secondary mt-1">Configure Microsoft Graph API credentials and visual theme preferences.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Visual Theme Selection */}
          <div className="space-y-2">
            <label className="text-[10px] text-fluent-text-muted font-bold uppercase tracking-wider block">Visual Theme Palette</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleThemeChange("light")}
                className={`py-2.5 px-4 border rounded-sm text-xs font-semibold text-center transition-all cursor-pointer ${
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
                className={`py-2.5 px-4 border rounded-sm text-xs font-semibold text-center transition-all cursor-pointer ${
                  theme === "dark"
                    ? "bg-fluent-brand-light/30 dark:bg-fluent-brand/10 border-fluent-brand text-fluent-brand shadow-3xs"
                    : "bg-white dark:bg-fluent-dark-card border-fluent-border dark:border-fluent-dark-border text-fluent-text-secondary hover:bg-fluent-bg-sidebar/50"
                }`}
              >
                Slate Dark Theme
              </button>
            </div>
          </div>

          <div className="h-[1px] bg-fluent-border dark:bg-fluent-dark-border/40"></div>

          {/* Simulation Toggle */}
          <div className="flex items-center justify-between py-2 bg-fluent-bg-sidebar/50 dark:bg-fluent-dark-bg p-4 rounded-sm border border-fluent-border dark:border-fluent-dark-border">
            <div>
              <span className="text-xs font-bold text-fluent-text dark:text-white">Enable High-Fidelity Simulation</span>
              <p className="text-[10px] text-fluent-text-secondary mt-0.5 max-w-md leading-relaxed">
                Run local storage cache simulation with sample OneDrive files without requiring Azure Active Directory configuration.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setUseSimulation(!useSimulation)}
              className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${
                useSimulation ? "bg-fluent-brand" : "bg-gray-300 dark:bg-gray-800"
              }`}
            >
              <div
                className={`bg-white w-5 h-5 rounded-full shadow-3xs transform transition-transform duration-200 ${
                  useSimulation ? "translate-x-5" : "translate-x-0"
                }`}
              ></div>
            </button>
          </div>

          {/* Developer Console Toggle */}
          <div className="flex items-center justify-between py-2 bg-fluent-bg-sidebar/50 dark:bg-fluent-dark-bg p-4 rounded-sm border border-fluent-border dark:border-fluent-dark-border">
            <div>
              <span className="text-xs font-bold text-fluent-text dark:text-white">Enable Developer Console</span>
              <p className="text-[10px] text-fluent-text-secondary mt-0.5 max-w-md leading-relaxed">
                Show the Developer Console tab in the left sidebar to inspect and audit Microsoft Graph API request and response payloads.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setEnableDevConsole(!enableDevConsole)}
              className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${
                enableDevConsole ? "bg-fluent-brand" : "bg-gray-300 dark:bg-gray-800"
              }`}
            >
              <div
                className={`bg-white w-5 h-5 rounded-full shadow-3xs transform transition-transform duration-200 ${
                  enableDevConsole ? "translate-x-5" : "translate-x-0"
                }`}
              ></div>
            </button>
          </div>

          {/* Credentials Inputs */}
          <div className={`space-y-4 transition-opacity duration-200 ${useSimulation ? "opacity-40 pointer-events-none" : ""}`}>
            <span className="text-[10px] text-fluent-text-muted font-bold uppercase tracking-wider block">Microsoft Azure App Registration</span>

            {/* Setup Guide & Troubleshooting Banner */}
            <div className="border border-fluent-brand/25 dark:border-fluent-brand/15 rounded-sm p-4 bg-fluent-brand-light/10 dark:bg-fluent-brand/5 space-y-2.5">
              <div className="flex items-start space-x-2.5">
                <span className="p-1.5 bg-fluent-brand/10 text-fluent-brand rounded-sm mt-0.5">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </span>
                <div className="text-xs flex-1">
                  <p className="font-bold text-fluent-text dark:text-white">Need Help? Visual Setup Guide & FAQs</p>
                  <p className="text-fluent-text-secondary leading-relaxed mt-0.5">
                    Includes step-by-step screenshots guide, client ID instructions, and <strong>3 instant solutions for "Need Admin Approval"</strong> restriction errors.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onNavigateToDocs}
                className="w-full py-1.5 bg-fluent-brand hover:bg-fluent-brand-hover text-white text-xs font-semibold rounded-sm transition-colors flex items-center justify-center space-x-1.5 shadow-3xs cursor-pointer"
              >
                <span>Open Interactive Setup Guide & Support Docs</span>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-fluent-text-secondary block">Client ID (Application ID)</label>
              <input
                type="text"
                disabled={useSimulation}
                placeholder="e.g. 4072f5ea-65be-44b2-a403-ecdc4cbf8a8c"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full text-xs font-mono px-3 py-2 bg-fluent-bg-sidebar dark:bg-fluent-dark-bg border border-fluent-border dark:border-fluent-dark-border rounded-sm text-fluent-text dark:text-white focus:outline-none focus:ring-1 focus:ring-fluent-brand"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-fluent-text-secondary block">Client Secret Value (Optional for SPA-PKCE / Server Flow)</label>
              <input
                type="password"
                disabled={useSimulation}
                placeholder="••••••••••••••••••••"
                value={clientSecret}
                onChange={(e) => setClientSecret(e.target.value)}
                className="w-full text-xs font-mono px-3 py-2 bg-fluent-bg-sidebar dark:bg-fluent-dark-bg border border-fluent-border dark:border-fluent-dark-border rounded-sm text-fluent-text dark:text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-fluent-text-secondary block">Tenant ID (or "common" / "consumers" / "organizations")</label>
              <input
                type="text"
                disabled={useSimulation}
                placeholder="common"
                value={tenantId}
                onChange={(e) => setTenantId(e.target.value)}
                className="w-full text-xs font-mono px-3 py-2 bg-fluent-bg-sidebar dark:bg-fluent-dark-bg border border-fluent-border dark:border-fluent-dark-border rounded-sm text-fluent-text dark:text-white focus:outline-none"
              />
            </div>

            {/* Redirect URI Display */}
            <div className="bg-fluent-bg-sidebar/50 dark:bg-fluent-dark-bg p-3.5 border border-fluent-border dark:border-fluent-dark-border rounded-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-fluent-text-muted font-bold uppercase tracking-wider">Required Azure Redirect URI</span>
                <button
                  type="button"
                  onClick={handleCopyCallback}
                  className="text-[10px] text-fluent-brand hover:underline font-bold"
                >
                  {copied ? "Copied!" : "Copy URI"}
                </button>
              </div>
              <p className="text-[11px] font-mono text-fluent-text dark:text-gray-300 bg-white dark:bg-fluent-dark-card p-2 rounded-sm border border-fluent-border dark:border-fluent-dark-border break-all select-all">
                {window.location.origin}/auth/callback
              </p>
              <p className="text-[10px] text-fluent-text-secondary leading-normal">
                Register this exact callback URL in your Microsoft Entra ID (Azure AD) Portal as a <strong>Web</strong> redirect URI to allow successful OAuth connections.
              </p>
            </div>
          </div>

          {/* Reset Simulated Drive Data Card */}
          <div className="p-4 border border-amber-500/20 rounded-sm bg-amber-500/5 dark:bg-amber-500/5 space-y-3">
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider block">Simulated Drive Maintenance</span>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-fluent-text dark:text-white">Reset Demo Files to Default State</p>
                <p className="text-[10px] text-fluent-text-secondary mt-0.5 leading-relaxed max-w-md">
                  If files were deleted or updated during the simulation, you can instantly restore all original folders, sheets, videos, and presentations.
                </p>
              </div>
              <button
                type="button"
                onClick={onResetDemoData}
                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-sm transition-colors cursor-pointer shadow-3xs whitespace-nowrap self-start sm:self-center"
              >
                Reset Demo Files
              </button>
            </div>
          </div>

          {/* Account Status Card */}
          <div className="p-4 border border-fluent-border dark:border-fluent-dark-border rounded-sm bg-fluent-bg-sidebar/30 dark:bg-fluent-dark-card/50 space-y-3">
            <span className="text-[10px] text-fluent-text-muted font-bold uppercase tracking-wider block">Connection Status</span>
            
            {account ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-fluent-brand text-white flex items-center justify-center font-bold text-xs select-none">
                    {account.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-fluent-text dark:text-white">{account.name}</p>
                    <p className="text-[10px] text-fluent-text-secondary">{account.email}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onDisconnect(account.id)}
                  className="px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 border border-red-500/20 rounded-sm transition-colors cursor-pointer"
                >
                  Disconnect Account
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-fluent-text dark:text-gray-300">No account connected</p>
                  <p className="text-[10px] text-fluent-text-secondary">Authorize OneDrive to explore your real-time cloud files.</p>
                </div>
                <button
                  type="button"
                  onClick={onConnect}
                  className="px-4 py-1.5 bg-fluent-brand hover:bg-fluent-brand-hover text-white text-xs font-bold rounded-sm transition-colors cursor-pointer shadow-3xs"
                >
                  Connect Account
                </button>
              </div>
            )}
          </div>

          {/* Footer buttons */}
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="submit"
              className="px-6 py-2 bg-fluent-brand hover:bg-fluent-brand-hover text-white rounded-sm text-xs font-bold transition-colors cursor-pointer shadow-3xs"
            >
              Save Configuration
            </button>
          </div>
        </form>
      </div>

      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black/40 dark:bg-black/60 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white dark:bg-fluent-dark-card border border-fluent-border dark:border-fluent-dark-border rounded-sm shadow-xl p-5 max-w-sm w-full mx-4 space-y-4 animate-slide-up">
            <div className="flex items-center space-x-3 text-emerald-600 dark:text-emerald-400">
              <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <h3 className="font-bold text-sm text-fluent-text dark:text-white">Settings Saved Successfully</h3>
            </div>
            <p className="text-xs text-fluent-text-secondary leading-relaxed">
              Your OneDrive Explorer configuration and theme preferences have been stored. The application interface has been updated.
            </p>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowSuccessPopup(false)}
                className="px-4 py-1.5 bg-fluent-brand hover:bg-fluent-brand-hover text-white rounded-sm text-xs font-bold transition-colors cursor-pointer shadow-3xs"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
