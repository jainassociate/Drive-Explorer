/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect, DragEvent, MouseEvent } from "react";
import { DriveItem, ViewMode } from "../types";

interface FileGridProps {
  items: DriveItem[];
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
  onNavigateToFolder: (folderId: string, folderName: string) => void;
  viewMode: ViewMode;
  onDownloadItem: (item: DriveItem) => void;
  onRenameItem: (item: DriveItem) => void;
  onDeleteItem: (item: DriveItem) => void;
  onShareItem: (item: DriveItem) => void;
  onToggleFavorite: (item: DriveItem) => void;
  onUploadDroppedFiles: (files: FileList) => void;
  onMoveItem: (itemId: string, targetFolderId: string) => void;
  breadcrumbs: { id: string; name: string }[];
  onBreadcrumbClick: (index: number) => void;
}

export default function FileGrid({
  items,
  selectedIds,
  setSelectedIds,
  onNavigateToFolder,
  viewMode,
  onDownloadItem,
  onRenameItem,
  onDeleteItem,
  onShareItem,
  onToggleFavorite,
  onUploadDroppedFiles,
  onMoveItem,
  breadcrumbs,
  onBreadcrumbClick
}: FileGridProps) {
  const [dragOverWorkspace, setDragOverWorkspace] = useState(false);
  const [draggedItem, setDraggedItem] = useState<DriveItem | null>(null);
  const [dragOverFolderId, setDragOverFolderId] = useState<string | null>(null);

  // Context Menu State
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    item: DriveItem | null;
  } | null>(null);

  const workspaceRef = useRef<HTMLDivElement>(null);

  // Handle outside clicks to close context menu & clear selection
  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (contextMenu) {
        setContextMenu(null);
      }
      // If clicking completely outside of any file row or toolbar, clear selection
      if (
        workspaceRef.current &&
        workspaceRef.current.contains(e.target) &&
        !e.target.closest(".file-item-clickable") &&
        !e.target.closest("#onedrive-toolbar") &&
        !e.target.closest("#context-menu-container") &&
        !e.target.closest(".modal-backdrop-container")
      ) {
        setSelectedIds([]);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [contextMenu, setSelectedIds]);

  // Handle file item clicks (Single and Multi select)
  const handleItemClick = (e: MouseEvent, item: DriveItem) => {
    e.stopPropagation();
    if (e.ctrlKey || e.metaKey) {
      // Toggle selection
      if (selectedIds.includes(item.id)) {
        setSelectedIds(selectedIds.filter((id) => id !== item.id));
      } else {
        setSelectedIds([...selectedIds, item.id]);
      }
    } else if (e.shiftKey && selectedIds.length > 0) {
      // Range selection
      const lastSelectedId = selectedIds[selectedIds.length - 1];
      const lastIdx = items.findIndex((i) => i.id === lastSelectedId);
      const currentIdx = items.findIndex((i) => i.id === item.id);
      if (lastIdx !== -1 && currentIdx !== -1) {
        const start = Math.min(lastIdx, currentIdx);
        const end = Math.max(lastIdx, currentIdx);
        const rangeIds = items.slice(start, end + 1).map((i) => i.id);
        setSelectedIds([...new Set([...selectedIds, ...rangeIds])]);
      }
    } else {
      // Standard click
      setSelectedIds([item.id]);
    }
  };

  // Handle right click custom context menu
  const handleContextMenu = (e: MouseEvent, item: DriveItem | null) => {
    e.preventDefault();
    e.stopPropagation();

    if (item && !selectedIds.includes(item.id)) {
      setSelectedIds([item.id]);
    }

    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      item
    });
  };

  // Drag and Drop files from system workspace
  const handleDragOverWorkspace = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverWorkspace(true);
  };

  const handleDragLeaveWorkspace = () => {
    setDragOverWorkspace(false);
  };

  const handleDropWorkspace = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverWorkspace(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onUploadDroppedFiles(e.dataTransfer.files);
    }
  };

  // Drag items locally (to move folder to folder)
  const handleItemDragStart = (e: DragEvent, item: DriveItem) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleItemDragOver = (e: DragEvent, targetItem: DriveItem) => {
    e.preventDefault();
    if (targetItem.folder && draggedItem && draggedItem.id !== targetItem.id) {
      setDragOverFolderId(targetItem.id);
    }
  };

  const handleItemDragLeave = () => {
    setDragOverFolderId(null);
  };

  const handleItemDrop = (e: DragEvent, targetItem: DriveItem) => {
    e.preventDefault();
    setDragOverFolderId(null);

    if (
      draggedItem &&
      targetItem.folder &&
      draggedItem.id !== targetItem.id
    ) {
      onMoveItem(draggedItem.id, targetItem.id);
      setDraggedItem(null);
    }
  };

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

  const getMimeIcon = (item: DriveItem) => {
    if (item.folder) {
      return (
        <svg className="w-10 h-10 text-yellow-500 fill-yellow-500/10" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      );
    }

    const mime = item.file?.mimeType || "";
    if (mime.startsWith("image/")) {
      return (
        <svg className="w-10 h-10 text-emerald-500 fill-emerald-500/10" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    }
    if (mime.includes("spreadsheetml") || mime.includes("excel") || mime.includes("csv")) {
      return (
        <svg className="w-10 h-10 text-green-600 fill-green-600/10" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2a4 4 0 00-4-4H3m18 11V4a2 2 0 00-2-2H5a2 2 0 00-2 2v4" />
        </svg>
      );
    }
    if (mime.includes("pdf")) {
      return (
        <svg className="w-10 h-10 text-red-500 fill-red-500/10" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    }
    if (mime.includes("presentationml") || mime.includes("powerpoint")) {
      return (
        <svg className="w-10 h-10 text-orange-500 fill-orange-500/10" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      );
    }
    if (mime.startsWith("video/")) {
      return (
        <svg className="w-10 h-10 text-indigo-500 fill-indigo-500/10" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 00-2 2z" />
        </svg>
      );
    }
    if (mime.startsWith("audio/")) {
      return (
        <svg className="w-10 h-10 text-pink-500 fill-pink-500/10" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      );
    }
    return (
      <svg className="w-10 h-10 text-gray-400 fill-gray-400/10" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    );
  };

  const renderBreadcrumbs = () => {
    return (
      <nav className="flex items-center space-x-1.5 p-2.5 px-4.5 text-xs text-fluent-text-secondary dark:text-gray-400 border-b border-fluent-border dark:border-fluent-dark-border select-none bg-fluent-bg-sidebar/30 dark:bg-fluent-dark-sidebar/15" id="file-explorer-breadcrumb">
        {breadcrumbs.map((bc, idx) => {
          const isLast = idx === breadcrumbs.length - 1;
          return (
            <div key={bc.id} className="flex items-center space-x-1.5">
              {idx > 0 && (
                <svg className="w-3 h-3 text-fluent-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
              <button
                onClick={() => onBreadcrumbClick(idx)}
                disabled={isLast}
                className={`font-semibold transition-colors hover:text-fluent-brand dark:hover:text-fluent-brand ${
                  isLast ? "text-fluent-text dark:text-white" : "cursor-pointer"
                }`}
              >
                {bc.name === "root" ? "OneDrive" : bc.name}
              </button>
            </div>
          );
        })}
      </nav>
    );
  };

  const getGridCols = () => {
    if (viewMode === "grid") return "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 p-4.5";
    if (viewMode === "tiles") return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 p-4.5";
    return "grid-cols-1 gap-1 p-3";
  };

  return (
    <div
      ref={workspaceRef}
      onDragOver={handleDragOverWorkspace}
      onDragLeave={handleDragLeaveWorkspace}
      onDrop={handleDropWorkspace}
      onContextMenu={(e) => handleContextMenu(e, null)}
      className={`flex-1 flex flex-col min-w-0 overflow-y-auto relative bg-white dark:bg-fluent-dark-bg select-none transition-all duration-150 ${
        dragOverWorkspace ? "ring-[1px] ring-fluent-brand ring-inset bg-fluent-brand-light/10 dark:bg-fluent-brand/5" : ""
      }`}
      id="file-explorer-workspace"
    >
      {/* breadcrumb path header */}
      {renderBreadcrumbs()}

      {/* Drag & Drop Overlay */}
      {dragOverWorkspace && (
        <div className="absolute inset-0 bg-fluent-brand/5 dark:bg-fluent-brand/10 backdrop-blur-xs flex flex-col items-center justify-center pointer-events-none z-10 border-2 border-dashed border-fluent-brand m-2 rounded-sm">
          <svg className="w-12 h-12 text-fluent-brand animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <span className="text-base font-bold text-fluent-brand mt-4">Drop files to upload instantly</span>
          <span className="text-xs text-fluent-text-secondary mt-1">Accepts multiple files and structures</span>
        </div>
      )}

      {/* Main Files Display Panel */}
      {items.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center" id="empty-state-explorer">
          <div className="w-16 h-16 rounded-full bg-fluent-bg-sidebar dark:bg-fluent-dark-sidebar flex items-center justify-center border border-fluent-border dark:border-fluent-dark-border mb-4 animate-pulse">
            <svg className="w-8 h-8 text-fluent-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-sm font-bold text-fluent-text dark:text-white">This folder is empty</h3>
          <p className="text-[11px] text-fluent-text-secondary max-w-sm mt-1">
            Drag and drop items here to upload, or use the top menu to create dynamic new folders.
          </p>
        </div>
      ) : (
        <div className={`grid ${getGridCols()}`} id="file-items-container">
          {/* List/Details Header Row */}
          {viewMode === "details" && (
            <div className="flex items-center text-[10px] font-bold text-fluent-text-secondary dark:text-gray-400 border-b border-fluent-border dark:border-fluent-dark-border px-4 py-2 hover:bg-transparent tracking-tight">
              <div className="w-1/2 flex items-center">Name</div>
              <div className="w-1/6">Date Modified</div>
              <div className="w-1/6">Type</div>
              <div className="w-1/6 text-right">Size</div>
            </div>
          )}

          {/* Render each item */}
          {items.map((item) => {
            const isSelected = selectedIds.includes(item.id);
            const isFolder = !!item.folder;
            const isDragOver = dragOverFolderId === item.id;

            // Render GRID View item
            if (viewMode === "grid") {
              return (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleItemDragStart(e, item)}
                  onDragOver={(e) => handleItemDragOver(e, item)}
                  onDragLeave={handleItemDragLeave}
                  onDrop={(e) => handleItemDrop(e, item)}
                  onClick={(e) => handleItemClick(e, item)}
                  onDoubleClick={() => isFolder ? onNavigateToFolder(item.id, item.name) : setSelectedIds([item.id])}
                  onContextMenu={(e) => handleContextMenu(e, item)}
                  className={`file-item-clickable flex flex-col items-center justify-between p-3 rounded-sm border cursor-pointer select-none relative transition-all duration-100 ${
                    isSelected
                      ? "bg-fluent-brand-light/70 dark:bg-fluent-brand/10 border-fluent-brand dark:border-fluent-brand shadow-3xs"
                      : "bg-white dark:bg-fluent-dark-card border-fluent-border dark:border-fluent-dark-border hover:bg-fluent-bg-sidebar/30 dark:hover:bg-fluent-dark-sidebar/20 hover:border-fluent-brand/30"
                  } ${isDragOver ? "ring-[1px] ring-fluent-brand ring-inset bg-fluent-brand-light/60 dark:bg-fluent-brand/15" : ""}`}
                  id={`file-item-grid-${item.id}`}
                >
                  {/* Favorite Indicator Icon */}
                  {item.isFavorite && (
                    <div className="absolute top-1.5 right-1.5 text-amber-500">
                      <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                      </svg>
                    </div>
                  )}

                  <div className="mb-2.5">{getMimeIcon(item)}</div>
                  <span className="text-xs font-semibold text-fluent-text dark:text-white text-center truncate w-full px-1">
                    {item.name}
                  </span>
                  <span className="text-[10px] text-fluent-text-secondary mt-0.5">
                    {isFolder ? `${item.folder?.childCount || 0} items` : formatSize(item.size)}
                  </span>
                </div>
              );
            }

            // Render LIST View item
            if (viewMode === "list") {
              return (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleItemDragStart(e, item)}
                  onDragOver={(e) => handleItemDragOver(e, item)}
                  onDragLeave={handleItemDragLeave}
                  onDrop={(e) => handleItemDrop(e, item)}
                  onClick={(e) => handleItemClick(e, item)}
                  onDoubleClick={() => isFolder ? onNavigateToFolder(item.id, item.name) : setSelectedIds([item.id])}
                  onContextMenu={(e) => handleContextMenu(e, item)}
                  className={`file-item-clickable flex items-center justify-between p-1.5 px-3 rounded-sm border cursor-pointer select-none transition-all duration-100 ${
                    isSelected
                      ? "bg-fluent-brand-light/70 dark:bg-fluent-brand/10 border-fluent-brand dark:border-fluent-brand"
                      : "bg-white dark:bg-fluent-dark-card border-transparent hover:bg-fluent-bg-sidebar/30 dark:hover:bg-fluent-dark-sidebar/20"
                  } ${isDragOver ? "ring-[1px] ring-fluent-brand ring-inset bg-fluent-brand-light/60 dark:bg-fluent-brand/15" : ""}`}
                  id={`file-item-list-${item.id}`}
                >
                  <div className="flex items-center space-x-3 truncate">
                    <div className="scale-70 flex-shrink-0">{getMimeIcon(item)}</div>
                    <span className="text-xs font-semibold text-fluent-text dark:text-white truncate">
                      {item.name}
                    </span>
                  </div>
                  <div className="text-[10px] text-fluent-text-secondary flex-shrink-0 ml-3">
                    {isFolder ? `${item.folder?.childCount || 0} items` : formatSize(item.size)}
                  </div>
                </div>
              );
            }

            // Render DETAILS View item (Windows Explorer table style)
            if (viewMode === "details") {
              return (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleItemDragStart(e, item)}
                  onDragOver={(e) => handleItemDragOver(e, item)}
                  onDragLeave={handleItemDragLeave}
                  onDrop={(e) => handleItemDrop(e, item)}
                  onClick={(e) => handleItemClick(e, item)}
                  onDoubleClick={() => isFolder ? onNavigateToFolder(item.id, item.name) : setSelectedIds([item.id])}
                  onContextMenu={(e) => handleContextMenu(e, item)}
                  className={`file-item-clickable flex items-center text-xs text-fluent-text-secondary dark:text-gray-300 px-4 py-1.5 rounded-sm cursor-pointer select-none transition-all duration-100 border-b border-fluent-border/30 dark:border-fluent-dark-border/30 ${
                    isSelected
                      ? "bg-fluent-brand-light/60 dark:bg-fluent-brand/10 border-fluent-brand/50 dark:border-fluent-brand/50 text-fluent-brand font-medium"
                      : "hover:bg-fluent-bg-sidebar/30 dark:hover:bg-fluent-dark-sidebar/20"
                  } ${isDragOver ? "ring-[1px] ring-fluent-brand ring-inset bg-fluent-brand-light/60 dark:bg-fluent-brand/15" : ""}`}
                  id={`file-item-details-${item.id}`}
                >
                  <div className="w-1/2 flex items-center space-x-3 truncate">
                    <div className="scale-60 flex-shrink-0">{getMimeIcon(item)}</div>
                    <span className="font-semibold text-fluent-text dark:text-white truncate">
                      {item.name}
                    </span>
                  </div>
                  <div className="w-1/6 truncate text-fluent-text-secondary dark:text-gray-400 text-[11px]">
                    {formatDate(item.lastModifiedDateTime)}
                  </div>
                  <div className="w-1/6 truncate text-fluent-text-secondary dark:text-gray-400 text-[11px]">
                    {isFolder ? "Folder" : item.file?.mimeType?.split("/")[1]?.toUpperCase() || "File"}
                  </div>
                  <div className="w-1/6 text-right font-medium text-fluent-text-secondary dark:text-gray-400 text-[11px]">
                    {isFolder ? "" : formatSize(item.size)}
                  </div>
                </div>
              );
            }

            // Render TILES View item
            if (viewMode === "tiles") {
              return (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleItemDragStart(e, item)}
                  onDragOver={(e) => handleItemDragOver(e, item)}
                  onDragLeave={handleItemDragLeave}
                  onDrop={(e) => handleItemDrop(e, item)}
                  onClick={(e) => handleItemClick(e, item)}
                  onDoubleClick={() => isFolder ? onNavigateToFolder(item.id, item.name) : setSelectedIds([item.id])}
                  onContextMenu={(e) => handleContextMenu(e, item)}
                  className={`file-item-clickable flex items-center space-x-3 p-2.5 rounded-sm border cursor-pointer select-none transition-all duration-100 ${
                    isSelected
                      ? "bg-fluent-brand-light/70 dark:bg-fluent-brand/10 border-fluent-brand dark:border-fluent-brand shadow-3xs"
                      : "bg-white dark:bg-fluent-dark-card border-fluent-border dark:border-fluent-dark-border hover:bg-fluent-bg-sidebar/30 dark:hover:bg-fluent-dark-sidebar/20"
                  } ${isDragOver ? "ring-[1px] ring-fluent-brand ring-inset bg-fluent-brand-light/60 dark:bg-fluent-brand/15" : ""}`}
                  id={`file-item-tiles-${item.id}`}
                >
                  <div className="flex-shrink-0">{getMimeIcon(item)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-fluent-text dark:text-white truncate">
                      {item.name}
                    </p>
                    <p className="text-[10px] text-fluent-text-secondary dark:text-gray-400 truncate">
                      {isFolder ? "Folder" : item.file?.mimeType || "Binary Document"}
                    </p>
                    <p className="text-[9px] text-fluent-text-secondary mt-0.5">
                      {isFolder ? `${item.folder?.childCount || 0} items` : formatSize(item.size)}
                    </p>
                  </div>
                </div>
              );
            }

            return null;
          })}
        </div>
      )}

      {/* Custom Right-Click Context Menu Overlay */}
      {contextMenu && (
        <div
          id="context-menu-container"
          className="absolute z-50 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl p-1.5 w-52 select-none"
          style={{
            top: contextMenu.y - (workspaceRef.current?.getBoundingClientRect().top || 0) + (workspaceRef.current?.scrollTop || 0),
            left: contextMenu.x - (workspaceRef.current?.getBoundingClientRect().left || 0)
          }}
        >
          {contextMenu.item ? (
            <>
              {/* Item Specific Actions */}
              <button
                onClick={() => {
                  if (contextMenu.item?.folder) {
                    onNavigateToFolder(contextMenu.item.id, contextMenu.item.name);
                  }
                  setContextMenu(null);
                }}
                className="w-full flex items-center space-x-2.5 px-2.5 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-left"
              >
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
                <span>Open {contextMenu.item.folder ? "Folder" : "Item"}</span>
              </button>

              <button
                onClick={() => {
                  onToggleFavorite(contextMenu.item!);
                  setContextMenu(null);
                }}
                className="w-full flex items-center space-x-2.5 px-2.5 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-left"
              >
                <svg className="w-4 h-4 text-amber-500 fill-amber-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>{contextMenu.item.isFavorite ? "Remove Favorite" : "Add Favorite"}</span>
              </button>

              <button
                onClick={() => {
                  onShareItem(contextMenu.item!);
                  setContextMenu(null);
                }}
                className="w-full flex items-center space-x-2.5 px-2.5 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-left"
              >
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 10.742l4.636-2.318a2 2 0 11.832 1.664l-4.636 2.318a2 2 0 11-.832-1.664z" />
                </svg>
                <span>Share Link</span>
              </button>

              <button
                onClick={() => {
                  onDownloadItem(contextMenu.item!);
                  setContextMenu(null);
                }}
                className="w-full flex items-center space-x-2.5 px-2.5 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-left"
              >
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Download File</span>
              </button>

              <div className="h-[1px] bg-gray-100 dark:bg-gray-800 my-1"></div>

              <button
                onClick={() => {
                  onRenameItem(contextMenu.item!);
                  setContextMenu(null);
                }}
                className="w-full flex items-center space-x-2.5 px-2.5 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-left"
              >
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>Rename Item</span>
              </button>

              <button
                onClick={() => {
                  onDeleteItem(contextMenu.item!);
                  setContextMenu(null);
                }}
                className="w-full flex items-center space-x-2.5 px-2.5 py-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg text-left"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>Delete</span>
              </button>
            </>
          ) : (
            <>
              {/* Workspace Background Specific Actions */}
              <button
                onClick={() => {
                  setSelectedIds([]);
                  setContextMenu(null);
                }}
                className="w-full flex items-center space-x-2.5 px-2.5 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-left"
              >
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <span>Clear Selection</span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
