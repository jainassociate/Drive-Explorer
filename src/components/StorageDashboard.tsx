/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DriveItem, MicrosoftAccount, UploadTask, DownloadTask } from "../types";

interface StorageDashboardProps {
  account: MicrosoftAccount | null;
  items: DriveItem[];
  uploads: UploadTask[];
  downloads: DownloadTask[];
}

export default function StorageDashboard({
  account,
  items,
  uploads,
  downloads
}: StorageDashboardProps) {
  if (!account) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-fluent-dark-bg select-none">
        <svg className="w-12 h-12 text-fluent-text-muted mb-4 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
        </svg>
        <h3 className="text-sm font-bold text-fluent-text dark:text-white">Connect OneDrive to View Dashboard</h3>
        <p className="text-xs text-fluent-text-secondary max-w-sm mt-1 leading-normal">
          Once an active Microsoft Account is connected, you can inspect real-time storage breakdowns, largest file rankings, upload buffers, and live system activities.
        </p>
      </div>
    );
  }

  // Calculate file distributions
  const allFiles = items.filter((i) => !i.folder && !i.isRecycleBin);
  const totalFilesCount = allFiles.length;
  const totalFoldersCount = items.filter((i) => i.folder && !i.isRecycleBin).length;

  const categories = {
    images: { label: "Photos & Images", color: "bg-emerald-500", size: 0, count: 0, mimes: ["image/"] },
    videos: { label: "Videos & Movies", color: "bg-indigo-500", size: 0, count: 0, mimes: ["video/"] },
    documents: { label: "Documents & PDFs", color: "bg-red-500", size: 0, count: 0, mimes: ["application/pdf", "application/vnd", "text/"] },
    audio: { label: "Music & Audio", color: "bg-pink-500", size: 0, count: 0, mimes: ["audio/"] },
    others: { label: "Other Files", color: "bg-gray-400", size: 0, count: 0, mimes: [] }
  };

  allFiles.forEach((file) => {
    const mime = file.file?.mimeType || "";
    let matched = false;

    for (const [key, cat] of Object.entries(categories)) {
      if (key === "others") continue;
      const matches = cat.mimes.some((m) => mime.startsWith(m) || mime.includes(m));
      if (matches) {
        cat.size += file.size || 0;
        cat.count += 1;
        matched = true;
        break;
      }
    }

    if (!matched) {
      categories.others.size += file.size || 0;
      categories.others.count += 1;
    }
  });

  // Calculate percentages
  const storageTotal = account.storageTotal || 1;
  const storageUsed = account.storageUsed || 0;
  const usedPercentage = Math.min(100, Math.round((storageUsed / storageTotal) * 100));
  const remainingStorage = Math.max(0, storageTotal - storageUsed);

  // Sorting largest files
  const largestFiles = [...allFiles]
    .sort((a, b) => (b.size || 0) - (a.size || 0))
    .slice(0, 5);

  const formatStorage = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className="flex-1 overflow-y-auto bg-fluent-bg-sidebar/10 dark:bg-fluent-dark-bg/20 p-6 space-y-6 select-none" id="storage-dashboard-wrapper">
      {/* Overview stats layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Storage Summary Glassmorphic Card */}
        <div className="bg-white dark:bg-fluent-dark-card p-5 rounded-sm border border-fluent-border dark:border-fluent-dark-border shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-[10px] text-fluent-text-muted font-bold uppercase tracking-wider block">Total Disk Quota</span>
            <div className="flex items-baseline space-x-1.5 mt-2">
              <span className="text-xl font-bold text-fluent-text dark:text-white">{formatStorage(storageUsed)}</span>
              <span className="text-[10px] text-fluent-text-muted">used of {formatStorage(storageTotal)}</span>
            </div>
          </div>
          
          {/* Chart Ring/Bar */}
          <div className="mt-5 space-y-2">
            <div className="w-full bg-fluent-border dark:bg-fluent-dark-border rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full bg-fluent-brand rounded-full transition-all duration-500"
                style={{ width: `${usedPercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[10px] text-fluent-text-secondary">
              <span className="font-semibold text-fluent-brand">{usedPercentage}% capacity</span>
              <span>{formatStorage(remainingStorage)} remaining</span>
            </div>
          </div>
        </div>

        {/* Directory Item Summaries */}
        <div className="bg-white dark:bg-fluent-dark-card p-5 rounded-sm border border-fluent-border dark:border-fluent-dark-border shadow-xs grid grid-cols-2 gap-4">
          <div className="flex flex-col justify-center p-3.5 bg-fluent-bg-sidebar/30 dark:bg-fluent-dark-bg border border-fluent-border/60 dark:border-fluent-dark-border/60 rounded-sm text-center">
            <svg className="w-5 h-5 text-yellow-500 mx-auto mb-1.5 fill-yellow-500/10" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <span className="text-lg font-bold text-fluent-text dark:text-white block">{totalFoldersCount}</span>
            <span className="text-[9px] font-bold text-fluent-text-muted uppercase mt-0.5">Folders</span>
          </div>

          <div className="flex flex-col justify-center p-3.5 bg-fluent-bg-sidebar/30 dark:bg-fluent-dark-bg border border-fluent-border/60 dark:border-fluent-dark-border/60 rounded-sm text-center">
            <svg className="w-5 h-5 text-fluent-brand mx-auto mb-1.5 fill-fluent-brand/10" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span className="text-lg font-bold text-fluent-text dark:text-white block">{totalFilesCount}</span>
            <span className="text-[9px] font-bold text-fluent-text-muted uppercase mt-0.5">Active Files</span>
          </div>
        </div>

        {/* Dynamic Drive Model info */}
        <div className="bg-white dark:bg-fluent-dark-card p-5 rounded-sm border border-fluent-border dark:border-fluent-dark-border shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] text-fluent-text-muted font-bold uppercase tracking-wider block">Drive Profile Mode</span>
              <span className="text-sm font-bold text-fluent-text dark:text-white mt-1 block capitalize">
                OneDrive {account.driveType}
              </span>
            </div>
            <span className="bg-fluent-brand-light dark:bg-fluent-brand/10 text-fluent-brand font-bold text-[9px] px-2 py-0.5 rounded-sm uppercase">
              Connected
            </span>
          </div>
          <div className="text-[10px] text-fluent-text-secondary pt-4 leading-relaxed space-y-1">
            <p>• Client Id: <span className="font-mono text-[9px] bg-fluent-bg-sidebar dark:bg-fluent-dark-bg px-1 py-0.5 border border-fluent-border dark:border-fluent-dark-border rounded-xs">{account.clientId || "standard-auth"}</span></p>
            <p>• Connected On: <span className="font-semibold">{account.lastLogin}</span></p>
          </div>
        </div>
      </div>

      {/* Segmented Category File Distribution Meter */}
      <div className="bg-white dark:bg-fluent-dark-card p-5 rounded-sm border border-fluent-border dark:border-fluent-dark-border shadow-xs space-y-4">
        <div>
          <h4 className="text-xs font-bold text-fluent-text dark:text-white uppercase tracking-wider">Storage Breakdown by File Type</h4>
          <p className="text-[11px] text-fluent-text-secondary mt-0.5">Visualize files categorized by exact MIME-Type signatures.</p>
        </div>

        {/* CSS Segment Bar */}
        <div className="w-full flex rounded-full h-3 overflow-hidden bg-fluent-border dark:bg-fluent-dark-border border border-fluent-border/20">
          {Object.entries(categories).map(([key, cat]) => {
            const pct = storageUsed > 0 ? Math.round((cat.size / storageUsed) * 100) : 0;
            if (pct === 0) return null;
            return (
              <div
                key={key}
                className={`h-full ${cat.color} transition-all duration-300`}
                style={{ width: `${pct}%` }}
                title={`${cat.label}: ${formatStorage(cat.size)} (${pct}%)`}
              ></div>
            );
          })}
        </div>

        {/* Legend grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 pt-2">
          {Object.entries(categories).map(([key, cat]) => {
            const pct = storageUsed > 0 ? Math.round((cat.size / storageUsed) * 100) : 0;
            return (
              <div key={key} className="flex items-start space-x-2">
                <span className={`w-2.5 h-2.5 rounded-full ${cat.color} mt-0.5 flex-shrink-0`}></span>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold text-fluent-text dark:text-white truncate">{cat.label}</p>
                  <p className="text-[9px] text-fluent-text-secondary mt-0.5">{cat.count} items • {formatStorage(cat.size)} ({pct}%)</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Largest Files Ranking & Recent Operations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Largest Files Panel */}
        <div className="bg-white dark:bg-fluent-dark-card p-5 rounded-sm border border-fluent-border dark:border-fluent-dark-border shadow-xs space-y-3">
          <h4 className="text-xs font-bold text-fluent-text dark:text-white uppercase tracking-wider">Largest Files Rankings</h4>
          {largestFiles.length === 0 ? (
            <p className="text-xs text-fluent-text-muted py-6 text-center">No files uploaded yet.</p>
          ) : (
            <div className="divide-y divide-fluent-border/40 dark:divide-fluent-dark-border/40 space-y-1">
              {largestFiles.map((file, idx) => (
                <div key={file.id} className="flex items-center justify-between py-2 text-xs">
                  <div className="flex items-center space-x-2.5 truncate">
                    <span className="font-bold text-fluent-text-muted w-4">{idx + 1}</span>
                    <span className="font-semibold text-fluent-text dark:text-white truncate">{file.name}</span>
                  </div>
                  <span className="font-bold text-fluent-brand flex-shrink-0 ml-3">{formatStorage(file.size)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activities Panel */}
        <div className="bg-white dark:bg-fluent-dark-card p-5 rounded-sm border border-fluent-border dark:border-fluent-dark-border shadow-xs space-y-3">
          <h4 className="text-xs font-bold text-fluent-text dark:text-white uppercase tracking-wider">Active Queue Activity</h4>
          <div className="space-y-2">
            {uploads.length === 0 && downloads.length === 0 ? (
              <p className="text-xs text-fluent-text-muted py-6 text-center">No current operations queueing.</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {uploads.map((up) => (
                  <div key={up.id} className="p-2 bg-fluent-bg-sidebar/50 dark:bg-fluent-dark-bg/50 border border-fluent-border dark:border-fluent-dark-border rounded-sm text-xs flex justify-between items-center">
                    <div className="min-w-0 flex-1 pr-3">
                      <p className="font-semibold text-fluent-text dark:text-white truncate">Upload: {up.name}</p>
                      <p className="text-[10px] text-fluent-text-secondary mt-0.5">{formatStorage(up.size)} • {up.status}</p>
                    </div>
                    <span className={`text-[10px] font-bold ${up.status === "completed" ? "text-green-500" : "text-fluent-brand animate-pulse"}`}>
                      {up.status === "completed" ? "Done" : `${up.progress}%`}
                    </span>
                  </div>
                ))}
                {downloads.map((dn) => (
                  <div key={dn.id} className="p-2 bg-fluent-bg-sidebar/50 dark:bg-fluent-dark-bg/50 border border-fluent-border dark:border-fluent-dark-border rounded-sm text-xs flex justify-between items-center">
                    <div className="min-w-0 flex-1 pr-3">
                      <p className="font-semibold text-fluent-text dark:text-white truncate">Download: {dn.name}</p>
                      <p className="text-[10px] text-fluent-text-secondary mt-0.5">{formatStorage(dn.size)} • {dn.status}</p>
                    </div>
                    <span className={`text-[10px] font-bold ${dn.status === "completed" ? "text-green-500" : "text-fluent-brand animate-pulse"}`}>
                      {dn.status === "completed" ? "Done" : `${dn.progress}%`}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
