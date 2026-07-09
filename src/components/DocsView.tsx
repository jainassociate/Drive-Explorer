/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";

interface DocsViewProps {
  onBackToSettings?: () => void;
}

export default function DocsView({ onBackToSettings }: DocsViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<"setup" | "approval" | "simulation">("setup");
  const [copied, setCopied] = useState(false);

  const callbackUrl = `${window.location.origin}/auth/callback`;

  const handleCopyCallback = () => {
    navigator.clipboard.writeText(callbackUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 bg-fluent-bg-sidebar/20 dark:bg-fluent-dark-bg/20 overflow-y-auto select-text" id="onedrive-docs-view">
      {/* Header Panel */}
      <div className="bg-white dark:bg-fluent-dark-card border-b border-fluent-border dark:border-fluent-dark-border p-6 shadow-4xs">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-fluent-brand font-bold text-[10px] uppercase tracking-wider mb-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span>OneDrive Integration Guide & Support Hub</span>
            </div>
            <h1 className="text-xl font-bold text-fluent-text dark:text-white tracking-tight">Documentation & Setup Guides</h1>
            <p className="text-xs text-fluent-text-secondary mt-1">
              Learn how to easily register your Azure App, authorize accounts, and troubleshoot Azure AD tenant restrictions.
            </p>
          </div>
          {onBackToSettings && (
            <button
              onClick={onBackToSettings}
              className="px-3.5 py-1.5 bg-fluent-bg-sidebar dark:bg-fluent-dark-bg hover:bg-fluent-border dark:hover:bg-fluent-dark-border border border-fluent-border dark:border-fluent-dark-border text-fluent-text dark:text-white text-xs font-semibold rounded-sm transition-colors cursor-pointer flex items-center space-x-1.5 self-start md:self-auto"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Settings</span>
            </button>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex border-b border-fluent-border dark:border-fluent-dark-border bg-white dark:bg-fluent-dark-card rounded-t-sm overflow-hidden shadow-5xs">
          <button
            onClick={() => setActiveSubTab("setup")}
            className={`flex-1 py-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center justify-center space-x-2 cursor-pointer ${
              activeSubTab === "setup"
                ? "border-fluent-brand text-fluent-brand bg-fluent-brand-light/20 dark:bg-fluent-brand/5"
                : "border-transparent text-fluent-text-secondary hover:text-fluent-text dark:hover:text-white hover:bg-fluent-bg-sidebar/50 dark:hover:bg-fluent-dark-sidebar/30"
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span>1. Azure App Registration</span>
          </button>
          
          <button
            onClick={() => setActiveSubTab("approval")}
            className={`flex-1 py-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center justify-center space-x-2 cursor-pointer ${
              activeSubTab === "approval"
                ? "border-amber-500 text-amber-600 dark:text-amber-400 bg-amber-500/5"
                : "border-transparent text-fluent-text-secondary hover:text-fluent-text dark:hover:text-white hover:bg-fluent-bg-sidebar/50 dark:hover:bg-fluent-dark-sidebar/30"
            }`}
          >
            <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>2. Fix "Need Admin Approval"</span>
          </button>

          <button
            onClick={() => setActiveSubTab("simulation")}
            className={`flex-1 py-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center justify-center space-x-2 cursor-pointer ${
              activeSubTab === "simulation"
                ? "border-fluent-brand text-fluent-brand bg-fluent-brand-light/20 dark:bg-fluent-brand/5"
                : "border-transparent text-fluent-text-secondary hover:text-fluent-text dark:hover:text-white hover:bg-fluent-bg-sidebar/50 dark:hover:bg-fluent-dark-sidebar/30"
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>3. Simulated Demo Mode</span>
          </button>
        </div>

        {/* Tab 1: Azure Setup Guide */}
        {activeSubTab === "setup" && (
          <div className="bg-white dark:bg-fluent-dark-card p-6 rounded-b-sm shadow-5xs border-x border-b border-fluent-border dark:border-fluent-dark-border space-y-6">
            <div className="flex items-start space-x-3 bg-fluent-brand-light/10 dark:bg-fluent-brand/5 p-4 rounded border border-fluent-brand/10">
              <span className="p-1.5 bg-fluent-brand/10 rounded text-fluent-brand mt-0.5">
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <div className="text-xs">
                <p className="font-bold text-fluent-text dark:text-white mb-0.5">Why is an Azure App Registration required?</p>
                <p className="text-fluent-text-secondary leading-relaxed">
                  Microsoft OneDrive uses secure OAuth 2.0 protocol. Instead of inputting your email & password directly into third-party apps, you construct a sandboxed integration. Creating a free Azure Application Client ID takes less than 2 minutes and ensures Microsoft's servers directly manage login credentials.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-fluent-text dark:text-white border-b border-fluent-border dark:border-fluent-dark-border pb-1.5">
                Step-by-Step App Registration Flow
              </h3>

              <div className="relative border-l-2 border-fluent-border dark:border-fluent-dark-border ml-3.5 pl-6 space-y-6">
                {/* Step 1 */}
                <div className="relative">
                  <span className="absolute -left-[31px] top-0 w-5 h-5 rounded-full bg-fluent-brand text-white text-[10px] font-bold flex items-center justify-center shadow-3xs">1</span>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-fluent-text dark:text-white">Access the Azure Portal</h4>
                    <p className="text-xs text-fluent-text-secondary leading-relaxed">
                      Go to the free <a href="https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade" target="_blank" rel="noreferrer" className="text-fluent-brand hover:underline font-semibold">Azure Portal App Registrations</a> list. If you do not have an active subscription, Azure registrations remain 100% free forever for development.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative">
                  <span className="absolute -left-[31px] top-0 w-5 h-5 rounded-full bg-fluent-brand text-white text-[10px] font-bold flex items-center justify-center shadow-3xs">2</span>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-fluent-text dark:text-white">Create a New Registration</h4>
                    <p className="text-xs text-fluent-text-secondary leading-relaxed">
                      Click the <span className="font-semibold text-fluent-text dark:text-white">➕ New registration</span> button at the top toolbar of the page.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative">
                  <span className="absolute -left-[31px] top-0 w-5 h-5 rounded-full bg-fluent-brand text-white text-[10px] font-bold flex items-center justify-center shadow-3xs">3</span>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-fluent-text dark:text-white">Name Your Integration</h4>
                    <p className="text-xs text-fluent-text-secondary leading-relaxed">
                      Enter a recognizable name (e.g., <code className="bg-fluent-bg-sidebar dark:bg-fluent-dark-bg px-1 rounded font-mono text-[10px]">OneDrive Vault Manager</code>).
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="relative">
                  <span className="absolute -left-[31px] top-0 w-5 h-5 rounded-full bg-fluent-brand text-white text-[10px] font-bold flex items-center justify-center shadow-3xs">4</span>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-fluent-text dark:text-white">Set Supported Account Types (Critical)</h4>
                    <p className="text-xs text-fluent-text-secondary leading-relaxed">
                      Under "Supported account types", choose the <strong>third option</strong>:
                    </p>
                    <div className="bg-fluent-bg-sidebar/50 dark:bg-fluent-dark-bg p-3 rounded border border-fluent-border dark:border-fluent-dark-border text-xs mt-1">
                      <p className="font-bold text-fluent-brand text-[11px] leading-snug">
                        "Accounts in any organizational directory (Any Microsoft Entra ID tenant - Multitenant) and personal Microsoft accounts (e.g. Skype, Xbox, Outlook)"
                      </p>
                      <p className="text-[10px] text-fluent-text-muted mt-1 leading-normal">
                        💡 <strong>Why:</strong> Selecting this multitenant + personal option allows you to keep the App Tenant ID configured to <code className="font-mono px-0.5">common</code>, supporting any consumer Outlook account alongside workplace logins.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="relative">
                  <span className="absolute -left-[31px] top-0 w-5 h-5 rounded-full bg-fluent-brand text-white text-[10px] font-bold flex items-center justify-center shadow-3xs">5</span>
                  <div className="space-y-1 flex-1">
                    <h4 className="text-xs font-bold text-fluent-text dark:text-white">Configure the Web Redirect URL</h4>
                    <p className="text-xs text-fluent-text-secondary leading-relaxed">
                      Under the "Redirect URI" heading:
                    </p>
                    <ul className="list-disc pl-5 text-xs text-fluent-text-secondary space-y-1 mt-1">
                      <li>Choose <strong>Web</strong> in the dropdown box.</li>
                      <li>Paste this exact applet redirect address inside the text block:</li>
                    </ul>
                    <div className="flex items-center space-x-1.5 mt-2 max-w-xl">
                      <code className="block flex-1 bg-fluent-bg-sidebar dark:bg-fluent-dark-bg/80 p-2 rounded border border-fluent-border dark:border-fluent-dark-border font-mono text-[10px] break-all select-all text-fluent-text dark:text-white leading-tight">
                        {callbackUrl}
                      </code>
                      <button
                        type="button"
                        onClick={handleCopyCallback}
                        className="px-3 py-1.5 bg-fluent-brand text-white text-xs rounded-sm font-semibold hover:bg-fluent-brand-hover transition-colors flex-shrink-0 cursor-pointer shadow-3xs"
                      >
                        {copied ? "Copied!" : "Copy URL"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Step 6 */}
                <div className="relative">
                  <span className="absolute -left-[31px] top-0 w-5 h-5 rounded-full bg-fluent-brand text-white text-[10px] font-bold flex items-center justify-center shadow-3xs">6</span>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-fluent-text dark:text-white">Save & Register</h4>
                    <p className="text-xs text-fluent-text-secondary leading-relaxed">
                      Click the blue <strong>Register</strong> button at the bottom of the page.
                    </p>
                  </div>
                </div>

                {/* Step 7 */}
                <div className="relative">
                  <span className="absolute -left-[31px] top-0 w-5 h-5 rounded-full bg-fluent-brand text-white text-[10px] font-bold flex items-center justify-center shadow-3xs">7</span>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-fluent-text dark:text-white">Copy Client ID to App</h4>
                    <p className="text-xs text-fluent-text-secondary leading-relaxed">
                      In the registered application Overview screen, copy the <strong>Application (Client) ID</strong> (a string of alphanumeric characters with hyphens). Paste it in the <strong>Client ID</strong> input field inside the **Settings** view of this app, keep the Tenant ID set to <code className="font-mono bg-fluent-bg-sidebar dark:bg-fluent-dark-bg px-1 py-0.5 rounded text-[10px]">common</code>, and click <strong>Save System Settings</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Fixing Need Admin Approval */}
        {activeSubTab === "approval" && (
          <div className="bg-white dark:bg-fluent-dark-card p-6 rounded-b-sm shadow-5xs border-x border-b border-fluent-border dark:border-fluent-dark-border space-y-6">
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded flex items-start space-x-3">
              <span className="p-1 bg-amber-500/20 text-amber-700 dark:text-amber-400 rounded mt-0.5">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </span>
              <div className="text-xs space-y-1">
                <h4 className="font-bold text-amber-800 dark:text-amber-300">Understanding "Need Admin Approval" Screen</h4>
                <p className="text-amber-900/80 dark:text-amber-200/80 leading-relaxed">
                  When logging into standard custom registered apps, corporate enterprise tenants (such as Azure directories ending in <code className="bg-amber-500/15 px-1 py-0.2 rounded font-mono text-[9px]">onmicrosoft.com</code>) enforce a tenant-wide security setting. By default, standard staff users are restricted from authorizing new third-party applications without explicit permission from their team IT administrator.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-bold text-fluent-text dark:text-white uppercase tracking-wider text-fluent-text-secondary border-b border-fluent-border dark:border-fluent-dark-border pb-1">
                Three Instant Ways to bypass this screen
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Option 1 */}
                <div className="p-4 border border-fluent-border dark:border-fluent-dark-border rounded-sm bg-fluent-bg-sidebar/20 dark:bg-fluent-dark-bg/40 flex flex-col justify-between h-full space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 bg-fluent-brand text-white text-[9px] font-bold rounded-xs">Option 1</span>
                      <span className="text-xs font-bold text-fluent-text dark:text-white">Personal Account</span>
                    </div>
                    <p className="text-[11px] text-fluent-text-secondary leading-relaxed">
                      Log in using a <strong>personal Microsoft account</strong> (such as emails ending with <code className="font-mono text-[9px]">@outlook.com</code>, <code className="font-mono text-[9px]">@hotmail.com</code>, <code className="font-mono text-[9px]">@live.com</code>, or <code className="font-mono text-[9px]">@msn.com</code>).
                    </p>
                    <p className="text-[10px] text-fluent-text-muted leading-relaxed">
                      💡 Personal consumer vaults do not have corporate tenant restriction policies, allowing you to grant consent and start exploring immediately.
                    </p>
                  </div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center space-x-1 pt-2 border-t border-fluent-border/40 dark:border-fluent-dark-border/40">
                    <span>⭐⭐ Recommended for testing</span>
                  </div>
                </div>

                {/* Option 2 */}
                <div className="p-4 border border-fluent-border dark:border-fluent-dark-border rounded-sm bg-fluent-bg-sidebar/20 dark:bg-fluent-dark-bg/40 flex flex-col justify-between h-full space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 bg-amber-600 text-white text-[9px] font-bold rounded-xs">Option 2</span>
                      <span className="text-xs font-bold text-fluent-text dark:text-white">Admin Consent</span>
                    </div>
                    <p className="text-[11px] text-fluent-text-secondary leading-relaxed">
                      Have a <strong>Tenant Administrator</strong> log in once to authorize the integration.
                    </p>
                    <ul className="list-decimal pl-4 text-[10px] text-fluent-text-muted space-y-1 leading-normal">
                      <li>Click the link "Have an admin account? Sign in with that account" shown on Microsoft's approval screen.</li>
                      <li>Log in with a Global Admin account.</li>
                      <li>Check the box <strong>"Consent on behalf of your organization"</strong> and accept.</li>
                    </ul>
                  </div>
                  <div className="text-[10px] text-fluent-brand font-bold pt-2 border-t border-fluent-border/40 dark:border-fluent-dark-border/40">
                    🏢 For team-wide workflows
                  </div>
                </div>

                {/* Option 3 */}
                <div className="p-4 border border-fluent-border dark:border-fluent-dark-border rounded-sm bg-fluent-bg-sidebar/20 dark:bg-fluent-dark-bg/40 flex flex-col justify-between h-full space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 bg-purple-600 text-white text-[9px] font-bold rounded-xs">Option 3</span>
                      <span className="text-xs font-bold text-fluent-text dark:text-white">Developer Sandbox</span>
                    </div>
                    <p className="text-[11px] text-fluent-text-secondary leading-relaxed">
                      Sign up for the free <a href="https://developer.microsoft.com/en-us/microsoft-365/dev-program" target="_blank" rel="noreferrer" className="text-fluent-brand hover:underline font-semibold">Microsoft 365 Developer Program</a>.
                    </p>
                    <p className="text-[10px] text-fluent-text-muted leading-relaxed">
                      This grants you a private sandbox tenant where you are the Global Administrator. You gain full dashboard permissions to test complex multitenant integrations instantly without corporate restrictions.
                    </p>
                  </div>
                  <div className="text-[10px] text-purple-600 dark:text-purple-400 font-bold pt-2 border-t border-fluent-border/40 dark:border-fluent-dark-border/40">
                    🛠️ Best for engineers
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Simulation */}
        {activeSubTab === "simulation" && (
          <div className="bg-white dark:bg-fluent-dark-card p-6 rounded-b-sm shadow-5xs border-x border-b border-fluent-border dark:border-fluent-dark-border space-y-4 text-xs text-fluent-text dark:text-gray-300">
            <h3 className="text-sm font-bold text-fluent-text dark:text-white">High-Fidelity Simulation Features</h3>
            <p className="text-fluent-text-secondary leading-relaxed">
              If you don't have access to an Azure Active Directory tenant or want to test features safely without affecting your live OneDrive files, we've built a <strong>Full-Fidelity offline simulator</strong>.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
              <div className="p-3 border border-fluent-border/60 dark:border-fluent-dark-border/60 rounded bg-fluent-bg-sidebar/10">
                <span className="font-bold text-fluent-text dark:text-white block mb-1">📁 Interactive Sandbox Tree</span>
                <span className="text-fluent-text-secondary leading-relaxed block">
                  Simulates nested directory creation, recursive file dragging-and-dropping, batch downloading, sharing logs, and items renaming.
                </span>
              </div>
              <div className="p-3 border border-fluent-border/60 dark:border-fluent-dark-border/60 rounded bg-fluent-bg-sidebar/10">
                <span className="font-bold text-fluent-text dark:text-white block mb-1">🖥️ Interactive Dev Console</span>
                <span className="text-fluent-text-secondary leading-relaxed block">
                  Every simulation click logs exact Graph requests (e.g. <code className="bg-fluent-bg-sidebar dark:bg-fluent-dark-bg p-0.5 rounded font-mono text-[10px]">GET /me/drive/items/{'{'}id{'}'}</code>) in the real-time Dev Console tab, letting you inspect headers, durations, and response bodies immediately.
                </span>
              </div>
            </div>

            <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-fluent-text dark:text-amber-200 rounded text-xs space-y-2">
              <p className="font-bold">⚠️ Fresh Reset Safety Built-In</p>
              <p className="leading-relaxed">
                By user request, modifications, deletions, and additions in the simulated environment are now stored in safe, isolated <code className="font-semibold">sessionStorage</code>. If you accidentally delete simulated folders or edit sheets, simply refresh the browser or click the **Reset Demo Files** button on the Settings screen to restore the original beautiful sandbox documents!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
