/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { DriveItem, MicrosoftAccount, UploadTask, DownloadTask } from "../types";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface StorageDashboardProps {
  account: MicrosoftAccount | null;
  items: DriveItem[];
  uploads: UploadTask[];
  downloads: DownloadTask[];
}

interface CategoryDetail {
  label: string;
  color: string; // Tailwind class
  hex: string;   // Hex code for recharts
  size: number;
  count: number;
}

export default function StorageDashboard({
  account,
  items,
  uploads,
  downloads
}: StorageDashboardProps) {
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<string | null>(null);

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

  const categories: Record<string, CategoryDetail> = {
    images: { label: "Photos & Images", color: "bg-emerald-500", hex: "#10b981", size: 0, count: 0 },
    videos: { label: "Videos & Movies", color: "bg-indigo-500", hex: "#6366f1", size: 0, count: 0 },
    documents: { label: "Documents & PDFs", color: "bg-red-500", hex: "#ef4444", size: 0, count: 0 },
    code: { label: "Code & Projects", color: "bg-blue-500", hex: "#3b82f6", size: 0, count: 0 },
    audio: { label: "Music & Audio", color: "bg-pink-500", hex: "#ec4899", size: 0, count: 0 },
    others: { label: "Other Files", color: "bg-gray-400", hex: "#9ca3af", size: 0, count: 0 }
  };

  const getFileCategoryKey = (file: DriveItem): string => {
    const name = file.name.toLowerCase();
    const mime = file.file?.mimeType || "";

    if (mime.startsWith("image/") || name.endsWith(".jpg") || name.endsWith(".jpeg") || name.endsWith(".png") || name.endsWith(".gif") || name.endsWith(".svg")) {
      return "images";
    }
    if (mime.startsWith("video/") || name.endsWith(".mp4") || name.endsWith(".mov") || name.endsWith(".avi") || name.endsWith(".mkv")) {
      return "videos";
    }
    if (name.endsWith(".js") || name.endsWith(".ts") || name.endsWith(".tsx") || name.endsWith(".jsx") || name.endsWith(".json") || name.endsWith(".html") || name.endsWith(".css") || name.endsWith(".py") || name.endsWith(".md") || name.endsWith(".txt")) {
      return "code";
    }
    if (mime.startsWith("audio/") || name.endsWith(".mp3") || name.endsWith(".wav") || name.endsWith(".aac")) {
      return "audio";
    }
    if (
      mime.includes("pdf") || 
      mime.includes("vnd.openxmlformats-officedocument") || 
      mime.includes("ms-") || 
      name.endsWith(".pdf") || 
      name.endsWith(".docx") || 
      name.endsWith(".xlsx") || 
      name.endsWith(".pptx") || 
      name.endsWith(".doc") || 
      name.endsWith(".xls") || 
      name.endsWith(".ppt")
    ) {
      return "documents";
    }
    return "others";
  };

  allFiles.forEach((file) => {
    const key = getFileCategoryKey(file);
    if (categories[key]) {
      categories[key].size += file.size || 0;
      categories[key].count += 1;
    }
  });

  // Calculate percentages
  const storageTotal = account.storageTotal || 1;
  const storageUsed = account.storageUsed || 0;
  const usedPercentage = Math.min(100, Math.round((storageUsed / storageTotal) * 100));
  const remainingStorage = Math.max(0, storageTotal - storageUsed);

  // Sorting and filtering largest files by selected category
  const filteredFilesForRankings = selectedCategoryKey
    ? allFiles.filter((file) => getFileCategoryKey(file) === selectedCategoryKey)
    : allFiles;

  const largestFiles = [...filteredFilesForRankings]
    .sort((a, b) => (b.size || 0) - (a.size || 0))
    .slice(0, 5);

  const formatStorage = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  // Recharts Data Format
  const chartData = Object.entries(categories)
    .map(([key, cat]) => ({
      key,
      name: cat.label,
      value: cat.size,
      count: cat.count,
      color: cat.hex
    }))
    .filter((d) => d.value > 0);

  // Fallback for empty state or zero usage chart
  const emptyChartData = [{ name: "Available Space", value: remainingStorage, color: "#e2e8f0" }];

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

      {/* Interactive Pie Chart & Breakdown Panel */}
      <div className="bg-white dark:bg-fluent-dark-card p-5 rounded-sm border border-fluent-border dark:border-fluent-dark-border shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h4 className="text-xs font-bold text-fluent-text dark:text-white uppercase tracking-wider">Interactive Storage Distribution</h4>
            <p className="text-[11px] text-fluent-text-secondary mt-0.5">Click any slice or category list item below to filter the largest files view.</p>
          </div>
          
          {selectedCategoryKey && (
            <button
              onClick={() => setSelectedCategoryKey(null)}
              className="self-start sm:self-auto text-[10px] font-bold bg-fluent-brand-light dark:bg-fluent-brand/10 hover:bg-fluent-brand/20 text-fluent-brand px-2.5 py-1 rounded-sm border border-fluent-brand/20 transition-all flex items-center space-x-1 cursor-pointer"
            >
              <span>Filtered by {categories[selectedCategoryKey].label}</span>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Recharts Pie Chart Stage */}
          <div className="md:col-span-5 h-56 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData.length > 0 ? chartData : emptyChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  onClick={(data: any) => {
                    if (data && data.key) {
                      setSelectedCategoryKey(selectedCategoryKey === data.key ? null : data.key);
                    }
                  }}
                  className="cursor-pointer outline-none"
                >
                  {(chartData.length > 0 ? chartData : emptyChartData).map((entry: any, index) => {
                    const isSelected = selectedCategoryKey === entry.key;
                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke={isSelected ? "#2b579a" : "transparent"}
                        strokeWidth={isSelected ? 3 : 0}
                        opacity={selectedCategoryKey && !isSelected ? 0.35 : 1}
                        className="transition-all duration-200 outline-none"
                      />
                    );
                  })}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [formatStorage(value), "Storage Allocated"]}
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    borderRadius: "4px",
                    border: "none",
                    color: "#f8fafc",
                    fontSize: "11px",
                    padding: "6px 12px"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Inner Ring Text */}
            <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none select-none">
              <span className="text-[10px] text-fluent-text-muted font-semibold uppercase tracking-wide">
                {selectedCategoryKey ? categories[selectedCategoryKey].label : "Total Used"}
              </span>
              <span className="text-base font-bold text-fluent-text dark:text-white mt-1">
                {selectedCategoryKey 
                  ? formatStorage(categories[selectedCategoryKey].size)
                  : formatStorage(storageUsed)
                }
              </span>
              <span className="text-[9px] text-fluent-text-secondary mt-0.5">
                {selectedCategoryKey
                  ? `${categories[selectedCategoryKey].count} active items`
                  : `${totalFilesCount} total files`
                }
              </span>
            </div>
          </div>

          {/* Slices / Category Selector list */}
          <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {Object.entries(categories).map(([key, cat]) => {
              const pct = storageUsed > 0 ? Math.round((cat.size / storageUsed) * 100) : 0;
              const isSelected = selectedCategoryKey === key;
              const isAnySelected = selectedCategoryKey !== null;

              return (
                <div
                  key={key}
                  onClick={() => setSelectedCategoryKey(isSelected ? null : key)}
                  className={`p-3 border rounded-sm cursor-pointer transition-all flex items-start space-x-3 select-none ${
                    isSelected
                      ? "bg-fluent-brand-light/30 border-fluent-brand dark:bg-fluent-brand/10 dark:border-fluent-brand shadow-3xs"
                      : isAnySelected
                      ? "bg-white dark:bg-fluent-dark-card border-fluent-border/40 dark:border-fluent-dark-border/40 opacity-40 hover:opacity-80"
                      : "bg-white dark:bg-fluent-dark-card border-fluent-border dark:border-fluent-dark-border hover:bg-fluent-bg-sidebar/20"
                  }`}
                >
                  <span className={`w-3 h-3 rounded-full ${cat.color} mt-1 flex-shrink-0`}></span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[11px] font-bold text-fluent-text dark:text-white truncate">{cat.label}</p>
                      <span className="text-[10px] font-bold text-fluent-text-secondary">{pct}%</span>
                    </div>
                    <p className="text-[9px] text-fluent-text-secondary mt-1">{cat.count} items • {formatStorage(cat.size)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Largest Files Ranking & Recent Operations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Largest Files Panel */}
        <div className="bg-white dark:bg-fluent-dark-card p-5 rounded-sm border border-fluent-border dark:border-fluent-dark-border shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-fluent-text dark:text-white uppercase tracking-wider">
              {selectedCategoryKey ? `${categories[selectedCategoryKey].label} Rankings` : "Largest Files Rankings"}
            </h4>
            {selectedCategoryKey && (
              <span className="text-[9px] font-bold bg-fluent-border dark:bg-fluent-dark-border text-fluent-text-secondary px-1.5 py-0.5 rounded-xs">
                Filter Active
              </span>
            )}
          </div>
          {largestFiles.length === 0 ? (
            <p className="text-xs text-fluent-text-muted py-8 text-center">No files found in this category.</p>
          ) : (
            <div className="divide-y divide-fluent-border/40 dark:divide-fluent-dark-border/40 space-y-1">
              {largestFiles.map((file, idx) => (
                <div key={file.id} className="flex items-center justify-between py-2.5 text-xs hover:bg-fluent-bg-sidebar/10 rounded-sm px-1.5 transition-colors">
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
              <p className="text-xs text-fluent-text-muted py-8 text-center">No current operations queueing.</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {uploads.map((up) => (
                  <div key={up.id} className="p-2 bg-fluent-bg-sidebar/50 dark:bg-fluent-dark-bg/50 border border-fluent-border dark:border-fluent-dark-border rounded-sm text-xs flex justify-between items-center animate-pulse">
                    <div className="min-w-0 flex-1 pr-3">
                      <p className="font-semibold text-fluent-text dark:text-white truncate">Upload: {up.name}</p>
                      <p className="text-[10px] text-fluent-text-secondary mt-0.5">{formatStorage(up.size)} • {up.status}</p>
                    </div>
                    <span className={`text-[10px] font-bold ${up.status === "completed" ? "text-green-500" : "text-fluent-brand"}`}>
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
                    <span className={`text-[10px] font-bold ${dn.status === "completed" ? "text-green-500" : "text-fluent-brand"}`}>
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
