/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AppSettings } from "../types";

interface NotConnectedViewProps {
  onOpenConnect: () => void;
  onLaunchDemo: () => void;
}

export default function NotConnectedView({
  onOpenConnect,
  onLaunchDemo
}: NotConnectedViewProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-fluent-bg dark:bg-fluent-dark-bg text-center select-none max-w-3xl mx-auto space-y-6" id="onedrive-not-connected-view">
      
      {/* Decorative Cloud Graphic with Waves */}
      <div className="relative flex items-center justify-center">
        <div className="absolute w-36 h-36 rounded-full bg-fluent-brand/10 dark:bg-fluent-brand/5 animate-ping duration-1000"></div>
        <div className="absolute w-28 h-28 rounded-full bg-fluent-brand/15 dark:bg-fluent-brand/10 animate-pulse"></div>
        <div className="relative p-6 bg-white dark:bg-fluent-dark-card border border-fluent-border dark:border-fluent-dark-border rounded-full shadow-md z-10 text-fluent-brand">
          <svg className="w-16 h-16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95C8.08 7.14 9.94 6 12 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11c1.56.1 2.78 1.41 2.78 2.96 0 1.65-1.35 3-3 3z" />
          </svg>
        </div>
      </div>

      {/* Hero Headings */}
      <div className="space-y-2.5">
        <h2 className="text-xl font-bold text-fluent-text dark:text-white tracking-tight">Connect your OneDrive Explorer</h2>
        <p className="text-xs text-fluent-text-secondary dark:text-gray-400 max-w-lg mx-auto leading-relaxed">
          Inspect storage breakdown metrics, manage, search, and navigate files, upload local folder structures, or download real documents using Microsoft Graph secure endpoints.
        </p>
      </div>

      {/* Segmented Option Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl pt-4">
        {/* Real Mode Option */}
        <div className="bg-white dark:bg-fluent-dark-card border border-fluent-border dark:border-fluent-dark-border rounded-sm p-5 flex flex-col justify-between space-y-4 hover:border-fluent-brand transition-all shadow-3xs text-left">
          <div className="space-y-1.5">
            <span className="bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 font-bold text-[8px] px-2 py-0.5 rounded-sm uppercase tracking-wider inline-block">Production Ready</span>
            <h4 className="text-xs font-bold text-fluent-text dark:text-white">Real OneDrive Storage</h4>
            <p className="text-[10.5px] text-fluent-text-secondary dark:text-gray-400 leading-normal">
              Authorize securely with your Microsoft credentials. Requires Azure Application ID (Client ID) configuration.
            </p>
          </div>
          <button
            onClick={onOpenConnect}
            className="w-full py-2 bg-fluent-brand hover:bg-fluent-brand-hover text-white text-xs font-bold rounded-sm shadow-2xs cursor-pointer transition-colors flex items-center justify-center space-x-1.5"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            <span>Connect Microsoft Account</span>
          </button>
        </div>

        {/* Simulated Demo Mode Option */}
        <div className="bg-white dark:bg-fluent-dark-card border border-fluent-border dark:border-fluent-dark-border rounded-sm p-5 flex flex-col justify-between space-y-4 hover:border-fluent-brand/60 transition-all shadow-3xs text-left">
          <div className="space-y-1.5">
            <span className="bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-bold text-[8px] px-2 py-0.5 rounded-sm uppercase tracking-wider inline-block">Instant Access</span>
            <h4 className="text-xs font-bold text-fluent-text dark:text-white">High-Fidelity Simulator</h4>
            <p className="text-[10.5px] text-fluent-text-secondary dark:text-gray-400 leading-normal">
              Explore all panels, list files, view dashboards, test uploading, and inspect mock Graph requests instantly.
            </p>
          </div>
          <button
            onClick={onLaunchDemo}
            className="w-full py-2 bg-white dark:bg-fluent-dark-bg hover:bg-fluent-bg-sidebar/50 dark:hover:bg-fluent-dark-border/40 text-fluent-text dark:text-gray-200 border border-fluent-border dark:border-fluent-dark-border text-xs font-bold rounded-sm shadow-3xs cursor-pointer transition-colors flex items-center justify-center space-x-1.5"
          >
            <svg className="w-4 h-4 text-fluent-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.7 15.3a1 1 0 01-1.4 1.4l-4-4a1 1 0 010-1.4l4-4a1 1 0 011.4 1.4L11.42 12l3.28 3.3z" />
            </svg>
            <span>Launch Simulated Demo</span>
          </button>
        </div>
      </div>
    </div>
  );
}
