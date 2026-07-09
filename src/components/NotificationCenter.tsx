/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AppNotification, UploadTask, DownloadTask } from "../types";

interface NotificationCenterProps {
  notifications: AppNotification[];
  uploads: UploadTask[];
  downloads: DownloadTask[];
  onMarkAllAsRead: () => void;
  onClearNotifications: () => void;
  onClose: () => void;
  isOpen: boolean;
}

export default function NotificationCenter({
  notifications,
  uploads,
  downloads,
  onMarkAllAsRead,
  onClearNotifications,
  onClose,
  isOpen
}: NotificationCenterProps) {
  // Filter active/queued tasks
  const activeUploads = uploads.filter((u) => u.status === "uploading" || u.status === "queued");
  const activeDownloads = downloads.filter((d) => d.status === "downloading" || d.status === "queued");

  const hasActiveTasks = activeUploads.length > 0 || activeDownloads.length > 0;

  if (!isOpen && !hasActiveTasks) return null;

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 space-y-3 w-80 sm:w-96 select-none animate-fade-in" id="notification-center-container">
      
      {/* 1. Live Upload/Download Progress Floating Card */}
      {hasActiveTasks && (
        <div className="bg-white dark:bg-fluent-dark-card border border-fluent-border dark:border-fluent-dark-border rounded-sm shadow-md p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <div className="w-2 h-2 rounded-full bg-fluent-brand animate-ping"></div>
              <span className="text-xs font-bold text-fluent-text dark:text-white uppercase tracking-wider">Queue Operations</span>
            </div>
            <span className="text-[9px] bg-fluent-brand-light dark:bg-fluent-brand/10 text-fluent-brand px-2 py-0.5 rounded-sm font-bold">
              {activeUploads.length + activeDownloads.length} active
            </span>
          </div>

          <div className="space-y-2.5 max-h-44 overflow-y-auto pr-1">
            {/* Upload Tasks */}
            {activeUploads.map((up) => (
              <div key={up.id} className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="font-semibold text-fluent-text dark:text-gray-300 truncate mr-3">Upload: {up.name}</span>
                  <span className="text-fluent-brand font-bold">{up.progress}%</span>
                </div>
                <div className="w-full bg-fluent-border dark:bg-fluent-dark-border rounded-full h-1 overflow-hidden">
                  <div className="h-full bg-fluent-brand rounded-full transition-all duration-200" style={{ width: `${up.progress}%` }}></div>
                </div>
                <p className="text-[9px] text-fluent-text-muted">{formatSize(up.size)} • {up.status}</p>
              </div>
            ))}

            {/* Download Tasks */}
            {activeDownloads.map((dn) => (
              <div key={dn.id} className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="font-semibold text-fluent-text dark:text-gray-300 truncate mr-3">Download: {dn.name}</span>
                  <span className="text-fluent-brand font-bold">{dn.progress}%</span>
                </div>
                <div className="w-full bg-fluent-border dark:bg-fluent-dark-border rounded-full h-1 overflow-hidden">
                  <div className="h-full bg-fluent-brand rounded-full transition-all duration-200" style={{ width: `${dn.progress}%` }}></div>
                </div>
                <p className="text-[9px] text-fluent-text-muted">{formatSize(dn.size)} • {dn.status}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Notification Logger Flyout */}
      {isOpen && (
        <div className="bg-white dark:bg-fluent-dark-card border border-fluent-border dark:border-fluent-dark-border rounded-sm shadow-md overflow-hidden flex flex-col max-h-96 animate-slide-up">
          {/* Header */}
          <div className="p-3 border-b border-fluent-border dark:border-fluent-dark-border flex items-center justify-between bg-fluent-bg-sidebar/50 dark:bg-fluent-dark-sidebar/10">
            <div>
              <h4 className="text-xs font-bold text-fluent-text dark:text-white uppercase tracking-wider">Activity Notifications</h4>
              <p className="text-[9px] text-fluent-text-secondary">Status logging and operations feedback.</p>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={onMarkAllAsRead}
                className="text-[10px] text-fluent-brand hover:underline font-bold px-1.5 py-1"
                title="Mark all read"
              >
                Mark Read
              </button>
              <button
                onClick={onClearNotifications}
                className="text-[10px] text-fluent-text-muted hover:text-red-500 font-bold px-1.5 py-1"
                title="Clear all"
              >
                Clear
              </button>
              <button
                onClick={onClose}
                className="p-1 rounded-sm text-fluent-text-muted hover:text-fluent-text hover:bg-fluent-bg-sidebar dark:hover:bg-fluent-dark-border/40"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-72">
            {notifications.length === 0 ? (
              <p className="text-xs text-fluent-text-muted py-8 text-center">No notifications logged.</p>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-2.5 rounded-sm border text-xs relative flex items-start space-x-2.5 transition-colors ${
                    notif.read
                      ? "bg-white dark:bg-fluent-dark-card border-fluent-border dark:border-fluent-dark-border text-fluent-text-muted"
                      : "bg-fluent-brand-light/20 dark:bg-fluent-brand/5 border-fluent-brand/20 text-fluent-text"
                  }`}
                >
                  {/* Status Color Dot */}
                  <span
                    className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                      notif.type === "success"
                        ? "bg-emerald-500"
                        : notif.type === "error"
                        ? "bg-red-500"
                        : notif.type === "warning"
                        ? "bg-amber-500"
                        : "bg-fluent-brand"
                    }`}
                  ></span>

                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-fluent-text dark:text-white truncate">{notif.title}</p>
                    <p className="text-[10px] text-fluent-text-secondary mt-0.5 leading-relaxed">{notif.message}</p>
                    <span className="text-[8px] text-fluent-text-muted mt-1 block">{notif.timestamp}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
