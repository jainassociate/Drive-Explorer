/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { DriveItem } from "../types";

interface DetailsPanelProps {
  selectedItem: DriveItem | null;
  onClose: () => void;
  onDownload: () => void;
  onShare: () => void;
  onToggleFavorite: () => void;
}

export default function DetailsPanel({
  selectedItem,
  onClose,
  onDownload,
  onShare,
  onToggleFavorite
}: DetailsPanelProps) {
  const [activeTab, setActiveTab] = useState<"details" | "versions" | "access">("details");

  if (!selectedItem) {
    return (
      <div className="w-80 border-l border-fluent-border dark:border-fluent-dark-border bg-white dark:bg-fluent-dark-card flex flex-col items-center justify-center p-6 text-center select-none" id="onedrive-detailspanel-empty">
        <svg className="w-10 h-10 text-fluent-text-muted mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h4 className="text-xs font-bold text-fluent-text dark:text-gray-300">Select an item</h4>
        <p className="text-[11px] text-fluent-text-secondary mt-1 max-w-xs leading-normal">
          Select a file or folder to view its properties, dynamic preview, and version history.
        </p>
      </div>
    );
  }

  const isFolder = !!selectedItem.folder;
  const mime = selectedItem.file?.mimeType || "";

  const formatSize = (bytes?: number) => {
    if (bytes === undefined) return "--";
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const formatDate = (isoStr?: string) => {
    if (!isoStr) return "--";
    const d = new Date(isoStr);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Helper to render inline previews
  const renderFilePreview = () => {
    if (isFolder) {
      return (
        <div className="flex flex-col items-center justify-center h-32 bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 rounded-sm p-4">
          <svg className="w-10 h-10 text-amber-500 fill-amber-500/10" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          <span className="text-xs font-semibold text-fluent-text dark:text-amber-400 mt-2 truncate max-w-full">
            {selectedItem.name}
          </span>
          <span className="text-[10px] text-fluent-text-secondary mt-0.5">
            {selectedItem.folder?.childCount || 0} items inside
          </span>
        </div>
      );
    }

    if (mime.startsWith("image/")) {
      const displayUrl = selectedItem["@microsoft.graph.downloadUrl"] || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80";
      return (
        <div className="relative group overflow-hidden border border-fluent-border dark:border-fluent-dark-border rounded-sm h-36 bg-fluent-bg-sidebar dark:bg-fluent-dark-bg flex items-center justify-center">
          <img
            src={displayUrl}
            alt={selectedItem.name}
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-102"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-150">
            <span className="text-[9px] text-white font-semibold bg-gray-950/80 px-2 py-1 rounded-sm">Image Preview</span>
          </div>
        </div>
      );
    }

    if (mime.startsWith("audio/")) {
      return (
        <div className="p-3 bg-pink-500/5 dark:bg-pink-500/10 border border-pink-500/20 rounded-sm space-y-2">
          <div className="flex items-center space-x-3">
            <svg className="w-8 h-8 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-pink-700 dark:text-pink-400 truncate">{selectedItem.name}</p>
              <p className="text-[9px] text-fluent-text-secondary">Inline Audio Track</p>
            </div>
          </div>
          <audio controls className="w-full h-8 scale-90" src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3">
            Your browser does not support audio playback.
          </audio>
        </div>
      );
    }

    if (mime.startsWith("video/")) {
      return (
        <div className="rounded-sm overflow-hidden border border-indigo-500/20 bg-gray-950 relative">
          <video controls className="w-full h-32 object-cover" src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" poster="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400">
            Your browser does not support video playback.
          </video>
        </div>
      );
    }

    if (mime.includes("pdf")) {
      return (
        <div className="flex flex-col items-center justify-center h-32 bg-red-500/5 dark:bg-red-500/10 border border-red-500/20 rounded-sm p-4">
          <svg className="w-8 h-8 text-red-500 fill-red-500/10" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-[10px] font-bold text-red-700 dark:text-red-400 mt-2 text-center truncate max-w-full">
            {selectedItem.name}
          </span>
          <span className="text-[9px] text-fluent-text-secondary mt-0.5">Portable Document (PDF)</span>
        </div>
      );
    }

    if (mime.startsWith("text/")) {
      return (
        <div className="bg-fluent-bg-sidebar/50 dark:bg-fluent-dark-bg border border-fluent-border dark:border-fluent-dark-border rounded-sm p-3 h-32 overflow-y-auto text-left">
          <p className="text-[10px] font-mono text-fluent-text-secondary leading-normal whitespace-pre-wrap">
            {selectedItem.name === "Welcome to OneDrive.txt" ? (
              `Welcome to OneDrive Explorer!\n\nThis premium application connects directly to your OneDrive for Business or Personal account through Microsoft Graph.\n\nEnjoy desktop-class features including Drag-and-Drop, inline previews, version history, and real-time developer logging.`
            ) : (
              `# Text Preview\n\nThis is a plain text file preview.\nYou can double-click this item in the files list to highlight, edit or share with your external enterprise organization.`
            )}
          </p>
        </div>
      );
    }

    // Default office/file placeholder
    return (
      <div className="flex flex-col items-center justify-center h-32 bg-fluent-brand-light/20 dark:bg-fluent-brand/10 border border-fluent-brand/20 rounded-sm p-4">
        <svg className="w-8 h-8 text-fluent-brand fill-fluent-brand/10" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        <span className="text-[10px] font-bold text-fluent-brand mt-2 text-center truncate max-w-full">
          {selectedItem.name}
        </span>
        <span className="text-[9px] text-fluent-text-secondary mt-0.5">
          {mime || "Unknown Binary File"}
        </span>
      </div>
    );
  };

  return (
    <aside className="w-80 border-l border-fluent-border dark:border-fluent-dark-border bg-white dark:bg-fluent-dark-card flex flex-col justify-between h-full select-none" id="onedrive-detailspanel">
      {/* Panel Header */}
      <div>
        <div className="p-4 border-b border-fluent-border dark:border-fluent-dark-border flex items-center justify-between">
          <span className="font-semibold text-fluent-text dark:text-white text-xs uppercase tracking-wider">Item Details</span>
          <button
            onClick={onClose}
            className="p-1 rounded-sm hover:bg-fluent-bg-sidebar dark:hover:bg-fluent-dark-border/40 text-fluent-text-muted hover:text-fluent-text transition-colors"
            id="detailspanel-btn-close"
          >
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tab Controls (Details vs Version History) */}
        <div className="flex border-b border-fluent-border dark:border-fluent-dark-border bg-fluent-bg-sidebar/40 dark:bg-fluent-dark-sidebar/10 p-1">
          {(["details", "versions", "access"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 text-center py-1.5 text-[10px] font-bold rounded-sm capitalize transition-all ${
                activeTab === tab
                  ? "bg-white dark:bg-fluent-dark-card text-fluent-brand shadow-3xs"
                  : "text-fluent-text-secondary hover:text-fluent-text dark:hover:text-gray-200"
              }`}
              id={`detailspanel-tab-${tab}`}
            >
              {tab === "access" ? "Sharing" : tab}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-240px)]">
          {activeTab === "details" && (
            <>
              {/* Preview Panel Section */}
              {renderFilePreview()}

              {/* Action Buttons list */}
              <div className="grid grid-cols-3 gap-1.5 pt-1">
                <button
                  onClick={onDownload}
                  className="py-1.5 px-2 bg-white dark:bg-fluent-dark-bg hover:bg-fluent-bg-sidebar dark:hover:bg-fluent-dark-border text-fluent-text-secondary rounded-sm text-[9px] font-bold border border-fluent-border dark:border-fluent-dark-border flex flex-col items-center space-y-1 transition-colors shadow-3xs"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Download</span>
                </button>
                <button
                  onClick={onShare}
                  className="py-1.5 px-2 bg-white dark:bg-fluent-dark-bg hover:bg-fluent-bg-sidebar dark:hover:bg-fluent-dark-border text-fluent-text-secondary rounded-sm text-[9px] font-bold border border-fluent-border dark:border-fluent-dark-border flex flex-col items-center space-y-1 transition-colors shadow-3xs"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 10.742l4.636-2.318a2 2 0 11.832 1.664l-4.636 2.318a2 2 0 11-.832-1.664z" />
                  </svg>
                  <span>Share Link</span>
                </button>
                <button
                  onClick={onToggleFavorite}
                  className="py-1.5 px-2 bg-white dark:bg-fluent-dark-bg hover:bg-fluent-bg-sidebar dark:hover:bg-fluent-dark-border text-fluent-text-secondary rounded-sm text-[9px] font-bold border border-fluent-border dark:border-fluent-dark-border flex flex-col items-center space-y-1 transition-colors shadow-3xs"
                >
                  <svg className={`w-3.5 h-3.5 ${selectedItem.isFavorite ? "text-amber-500 fill-amber-500" : "text-fluent-text-muted"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  <span>{selectedItem.isFavorite ? "Favorited" : "Favorite"}</span>
                </button>
              </div>

              {/* Core Properties List */}
              <div className="space-y-3 pt-2 text-[11px] text-fluent-text-secondary">
                <div className="border-b border-fluent-border/40 dark:border-fluent-dark-border/40 pb-2">
                  <span className="block text-[9px] text-fluent-text-muted font-bold uppercase tracking-wider">Item Name</span>
                  <span className="font-semibold text-fluent-text dark:text-white mt-0.5 break-all">{selectedItem.name}</span>
                </div>
                <div className="border-b border-fluent-border/40 dark:border-fluent-dark-border/40 pb-2">
                  <span className="block text-[9px] text-fluent-text-muted font-bold uppercase tracking-wider">Item ID</span>
                  <span className="font-mono text-[9px] bg-fluent-bg-sidebar dark:bg-fluent-dark-bg p-1 rounded-sm border border-fluent-border dark:border-fluent-dark-border select-all block mt-1 break-all">
                    {selectedItem.id}
                  </span>
                </div>
                <div className="border-b border-fluent-border/40 dark:border-fluent-dark-border/40 pb-2">
                  <span className="block text-[9px] text-fluent-text-muted font-bold uppercase tracking-wider">Created Date</span>
                  <span className="text-fluent-text dark:text-white font-medium">{formatDate(selectedItem.createdDateTime)}</span>
                </div>
                <div className="border-b border-fluent-border/40 dark:border-fluent-dark-border/40 pb-2">
                  <span className="block text-[9px] text-fluent-text-muted font-bold uppercase tracking-wider">Last Modified</span>
                  <span className="text-fluent-text dark:text-white font-medium">{formatDate(selectedItem.lastModifiedDateTime)}</span>
                </div>
                <div className="border-b border-fluent-border/40 dark:border-fluent-dark-border/40 pb-2">
                  <span className="block text-[9px] text-fluent-text-muted font-bold uppercase tracking-wider">Size</span>
                  <span className="text-fluent-text dark:text-white font-semibold">{isFolder ? "Folder directory" : formatSize(selectedItem.size)}</span>
                </div>
                {!isFolder && selectedItem.file?.mimeType && (
                  <div className="border-b border-fluent-border/40 dark:border-fluent-dark-border/40 pb-2">
                    <span className="block text-[9px] text-fluent-text-muted font-bold uppercase tracking-wider">MIME Content Type</span>
                    <span className="text-fluent-text dark:text-white font-medium break-all">{selectedItem.file.mimeType}</span>
                  </div>
                )}
                {selectedItem.createdBy?.user?.displayName && (
                  <div className="pb-1">
                    <span className="block text-[9px] text-fluent-text-muted font-bold uppercase tracking-wider">Owner / Creator</span>
                    <span className="text-fluent-text dark:text-white font-semibold">{selectedItem.createdBy.user.displayName}</span>
                    <span className="block text-[10px] text-fluent-text-muted">{selectedItem.createdBy.user.email || ""}</span>
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === "versions" && (
            <div className="space-y-3">
              <span className="block text-[9px] text-fluent-text-muted font-bold uppercase tracking-wider">Version History</span>
              
              <div className="space-y-2">
                {/* Active version */}
                <div className="p-2.5 bg-fluent-brand-light/30 dark:bg-fluent-brand/10 border border-fluent-brand/20 rounded-sm flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-fluent-brand">v{selectedItem.version || "2.1"} (Active)</p>
                    <p className="text-[10px] text-fluent-text-secondary mt-0.5">Modified by you</p>
                    <p className="text-[9px] text-fluent-text-muted">{formatDate(selectedItem.lastModifiedDateTime)}</p>
                  </div>
                  <span className="text-[9px] bg-fluent-brand/15 text-fluent-brand px-1.5 py-0.5 font-bold rounded-xs">Current</span>
                </div>

                {/* Older versions */}
                <div className="p-2.5 bg-fluent-bg-sidebar/40 dark:bg-fluent-dark-bg/40 border border-fluent-border dark:border-fluent-dark-border rounded-sm flex items-center justify-between hover:bg-fluent-bg-sidebar transition-colors">
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold text-fluent-text">v1.0 (Initial Commit)</p>
                    <p className="text-[10px] text-fluent-text-secondary mt-0.5">Created by you</p>
                    <p className="text-[9px] text-fluent-text-muted">{formatDate(selectedItem.createdDateTime)}</p>
                  </div>
                  <button className="text-[10px] text-fluent-brand hover:underline font-semibold">Restore</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "access" && (
            <div className="space-y-4">
              <span className="block text-[9px] text-fluent-text-muted font-bold uppercase tracking-wider">Sharing & Access Link</span>

              {selectedItem.sharingLink ? (
                <div className="space-y-3">
                  <div className="p-2.5 bg-green-500/5 border border-green-500/20 rounded-sm">
                    <span className="text-[9px] bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-sm font-bold">
                      {selectedItem.sharingType === "organization" ? "Organization Access" : "Anyone with link"}
                    </span>
                    <p className="text-[10px] text-fluent-text-secondary mt-1.5 break-all font-medium">
                      {selectedItem.sharingLink}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(selectedItem.sharingLink || "");
                      }}
                      className="flex-1 py-1 px-2 bg-white dark:bg-fluent-dark-bg hover:bg-fluent-bg-sidebar text-[11px] font-bold rounded-sm border border-fluent-border dark:border-fluent-dark-border text-fluent-text-secondary transition-colors"
                    >
                      Copy Link
                    </button>
                    <button
                      onClick={onShare} // reopen sharing config modal
                      className="py-1 px-2 bg-white dark:bg-fluent-dark-bg hover:bg-fluent-bg-sidebar text-[11px] font-bold rounded-sm border border-fluent-border dark:border-fluent-dark-border text-fluent-text-secondary transition-colors"
                    >
                      Settings
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center p-4 border border-dashed border-fluent-border dark:border-fluent-dark-border rounded-sm space-y-2.5">
                  <p className="text-xs text-fluent-text-secondary">This item isn't shared yet.</p>
                  <button
                    onClick={onShare}
                    className="py-1.5 px-3 bg-fluent-brand hover:bg-fluent-brand-hover text-white font-semibold text-xs rounded-sm shadow-2xs transition-colors"
                  >
                    Generate Link
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer Details action */}
      <div className="p-4 border-t border-fluent-border dark:border-fluent-dark-border flex justify-end bg-fluent-bg-sidebar/30 dark:bg-fluent-dark-sidebar/15">
        <button
          onClick={() => {
            window.open(selectedItem.webUrl, "_blank", "referrerpolicy=no-referrer");
          }}
          className="text-xs text-fluent-brand hover:underline font-bold flex items-center space-x-1"
        >
          <span>Open on OneDrive Web</span>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </button>
      </div>
    </aside>
  );
}
