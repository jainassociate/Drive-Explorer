/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { AppSettings } from "../types";

interface ConnectionModalProps {
  settings: AppSettings;
  onClose: () => void;
  onConnectReal: (newSettings: AppSettings) => void;
  onConnectSimulation: () => void;
}

export default function ConnectionModal({
  settings,
  onClose,
  onConnectReal,
  onConnectSimulation
}: ConnectionModalProps) {
  const [connectionMode, setConnectionMode] = useState<"real" | "simulation">("real");
  const [clientId, setClientId] = useState(settings.clientId);
  const [clientSecret, setClientSecret] = useState(settings.clientSecret);
  const [tenantId, setTenantId] = useState(settings.tenantId || "common");
  const [copied, setCopied] = useState(false);

  const handleCopyCallback = () => {
    const callbackUrl = `${window.location.origin}/auth/callback`;
    navigator.clipboard.writeText(callbackUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (connectionMode === "simulation") {
      onConnectSimulation();
    } else {
      onConnectReal({
        clientId: clientId.trim(),
        clientSecret: clientSecret.trim(),
        tenantId: tenantId.trim(),
        useSimulation: false,
        theme: settings.theme,
        enableDevConsole: settings.enableDevConsole || false
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 modal-backdrop-container select-text animate-fade-in" id="connection-setup-dialog-overlay">
      <div className="bg-white dark:bg-fluent-dark-card border border-fluent-border dark:border-fluent-dark-border rounded-sm shadow-xl max-w-lg w-full overflow-hidden flex flex-col justify-between" id="connection-setup-dialog">
        
        {/* Header */}
        <div className="p-5 border-b border-fluent-border dark:border-fluent-dark-border flex items-center justify-between bg-fluent-bg-sidebar/40 dark:bg-fluent-dark-sidebar/10">
          <div>
            <h3 className="text-xs font-bold text-fluent-text dark:text-white uppercase tracking-wider">Connect to Microsoft OneDrive</h3>
            <p className="text-[10px] text-fluent-text-secondary mt-0.5">Choose how you want to explorer OneDrive storage structures.</p>
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

        {/* Tabs for Mode Selection */}
        <div className="flex border-b border-fluent-border dark:border-fluent-dark-border bg-fluent-bg-sidebar/10 dark:bg-fluent-dark-bg/40">
          <button
            type="button"
            onClick={() => setConnectionMode("real")}
            className={`flex-1 py-3 text-center text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              connectionMode === "real"
                ? "border-fluent-brand text-fluent-brand bg-white dark:bg-fluent-dark-card"
                : "border-transparent text-fluent-text-secondary hover:text-fluent-text dark:hover:text-white hover:bg-white/30 dark:hover:bg-fluent-dark-card/10"
            }`}
          >
            Real OneDrive (Production)
          </button>
          <button
            type="button"
            onClick={() => setConnectionMode("simulation")}
            className={`flex-1 py-3 text-center text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              connectionMode === "simulation"
                ? "border-fluent-brand text-fluent-brand bg-white dark:bg-fluent-dark-card"
                : "border-transparent text-fluent-text-secondary hover:text-fluent-text dark:hover:text-white hover:bg-white/30 dark:hover:bg-fluent-dark-card/10"
            }`}
          >
            Simulated Sandbox (Demo)
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {connectionMode === "real" ? (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-500/10 rounded-sm p-3 text-[11px] text-blue-700 dark:text-blue-300 leading-normal flex items-start space-x-2.5">
                <svg className="w-4.5 h-4.5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <span className="font-bold block mb-0.5">Azure Active Directory Integration</span>
                  To connect your real cloud files, register this application in your Microsoft Azure Portal (Entra ID) and provide your Client ID.
                </div>
              </div>

              {/* Client ID */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-fluent-text-muted font-bold uppercase tracking-wider block">Application (Client) ID</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 4072f5ea-65be-44b2-a403-ecdc4cbf8a8c"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="w-full text-xs font-mono px-3 py-2 bg-fluent-bg-sidebar dark:bg-fluent-dark-bg border border-fluent-border dark:border-fluent-dark-border rounded-sm text-fluent-text dark:text-white focus:outline-none focus:ring-1 focus:ring-fluent-brand"
                />
              </div>

              {/* Secret and Tenant */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-fluent-text-muted font-bold uppercase tracking-wider block">Tenant ID</label>
                  <input
                    type="text"
                    required
                    placeholder="common"
                    value={tenantId}
                    onChange={(e) => setTenantId(e.target.value)}
                    className="w-full text-xs font-mono px-3 py-2 bg-fluent-bg-sidebar dark:bg-fluent-dark-bg border border-fluent-border dark:border-fluent-dark-border rounded-sm text-fluent-text dark:text-white focus:outline-none focus:ring-1 focus:ring-fluent-brand"
                  />
                  <p className="text-[9px] text-fluent-text-secondary leading-tight mt-1">
                    Use <code className="bg-fluent-bg-sidebar dark:bg-fluent-dark-bg px-1 py-0.5 rounded-xs font-mono text-[8px]">common</code> for Multi-Tenant, or your specific Azure Directory ID if Single-Tenant.
                  </p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-fluent-text-muted font-bold uppercase tracking-wider block">Client Secret (Optional)</label>
                  <input
                    type="password"
                    placeholder="••••••••••••••••••••"
                    value={clientSecret}
                    onChange={(e) => setClientSecret(e.target.value)}
                    className="w-full text-xs font-mono px-3 py-2 bg-fluent-bg-sidebar dark:bg-fluent-dark-bg border border-fluent-border dark:border-fluent-dark-border rounded-sm text-fluent-text dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Redirect URI Display */}
              <div className="bg-fluent-bg-sidebar/40 dark:bg-fluent-dark-bg p-3 border border-fluent-border dark:border-fluent-dark-border rounded-sm space-y-1.5">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-fluent-text-muted font-bold uppercase tracking-wider">Required Azure Redirect URI</span>
                  <button
                    type="button"
                    onClick={handleCopyCallback}
                    className="text-fluent-brand hover:underline font-bold cursor-pointer"
                  >
                    {copied ? "Copied!" : "Copy URI"}
                  </button>
                </div>
                <p className="text-[10px] font-mono text-fluent-text dark:text-gray-300 bg-white dark:bg-fluent-dark-card p-2 rounded-sm border border-fluent-border dark:border-fluent-dark-border break-all select-all">
                  {window.location.origin}/auth/callback
                </p>
                <p className="text-[9px] text-fluent-text-secondary leading-normal">
                  Register this exact URL under the <strong>Web</strong> platform settings in your Azure App Registration portal.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-fade-in py-2">
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-500/10 rounded-sm p-3.5 text-[11px] text-amber-800 dark:text-amber-300 leading-normal flex items-start space-x-2.5">
                <svg className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <span className="font-bold block mb-0.5">High-Fidelity Simulated Sandbox</span>
                  No Azure credentials or Microsoft developer registration required. Explore full-featured file storage structures, upload/download capabilities, directory trees, sharing dashboards, and simulation logs.
                </div>
              </div>

              <div className="p-4 bg-fluent-bg-sidebar/20 dark:bg-fluent-dark-card/20 rounded-sm border border-fluent-border/60 dark:border-fluent-dark-border/60 flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-full bg-fluent-brand text-white flex items-center justify-center font-bold text-sm">
                  HJ
                </div>
                <div>
                  <p className="text-xs font-bold text-fluent-text dark:text-white">Himanshu Jain (Simulated)</p>
                  <p className="text-[10px] text-fluent-text-secondary">demo@onedrive.com • 1 TB Storage Quota</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-2.5 pt-3 border-t border-fluent-border dark:border-fluent-dark-border">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 bg-white hover:bg-fluent-bg-sidebar dark:bg-fluent-dark-bg text-fluent-text dark:text-gray-200 rounded-sm text-xs font-bold border border-fluent-border dark:border-fluent-dark-border transition-colors cursor-pointer shadow-3xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 bg-fluent-brand hover:bg-fluent-brand-hover text-white rounded-sm text-xs font-bold transition-colors cursor-pointer shadow-3xs flex items-center justify-center space-x-1.5"
            >
              {connectionMode === "real" ? (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span>Proceed to Authorize</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.7 15.3a1 1 0 01-1.4 1.4l-4-4a1 1 0 010-1.4l4-4a1 1 0 011.4 1.4L11.42 12l3.28 3.3z" />
                  </svg>
                  <span>Launch Demo Simulator</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
