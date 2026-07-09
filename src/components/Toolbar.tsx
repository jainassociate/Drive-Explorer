/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ViewMode, SortField, SortOrder, SidebarTab } from "../types";

interface ToolbarProps {
  activeTab: SidebarTab;
  currentFolderId: string;
  selectedCount: number;
  onNavigateBack: () => void;
  onNavigateForward: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
  onRefresh: () => void;
  onNewFolder: () => void;
  onUploadFile: () => void;
  onUploadFolder: () => void;
  onDownload: () => void;
  onRename: () => void;
  onDelete: () => void;
  onShare: () => void;
  onToggleFavorite: () => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  sortField: SortField;
  setSortField: (field: SortField) => void;
  sortOrder: SortOrder;
  setSortOrder: (order: SortOrder) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onAdvancedSearch: () => void;
  isDetailsOpen?: boolean;
}

export default function Toolbar({
  activeTab,
  currentFolderId,
  selectedCount,
  onNavigateBack,
  onNavigateForward,
  canGoBack,
  canGoForward,
  onRefresh,
  onNewFolder,
  onUploadFile,
  onUploadFolder,
  onDownload,
  onRename,
  onDelete,
  onShare,
  onToggleFavorite,
  viewMode,
  setViewMode,
  sortField,
  setSortField,
  sortOrder,
  setSortOrder,
  searchQuery,
  setSearchQuery,
  onAdvancedSearch,
  isDetailsOpen = false
}: ToolbarProps) {
  const isFilesTab = activeTab === "files";

  const newFolderText = isDetailsOpen ? "hidden xl:inline-block" : "hidden sm:inline-block";
  const uploadFileText = isDetailsOpen ? "hidden xl:inline-block" : "hidden md:inline-block";
  const uploadFolderText = isDetailsOpen ? "hidden xl:inline-block" : "hidden lg:inline-block";
  const downloadText = isDetailsOpen ? "hidden lg:inline-block" : "hidden sm:inline-block";
  const renameText = isDetailsOpen ? "hidden lg:inline-block" : "hidden md:inline-block";
  const shareText = isDetailsOpen ? "hidden lg:inline-block" : "hidden md:inline-block";
  const favoriteText = isDetailsOpen ? "hidden xl:inline-block" : "hidden lg:inline-block";
  const deleteText = isDetailsOpen ? "hidden lg:inline-block" : "hidden sm:inline-block";

  return (
    <div className="bg-white dark:bg-fluent-dark-card border-b border-fluent-border dark:border-fluent-dark-border p-2.5 flex flex-wrap items-center justify-between gap-3 select-none" id="onedrive-toolbar">
      {/* Navigation & Basic Operations */}
      <div className="flex flex-wrap items-center gap-1.5 min-w-0 flex-1 sm:flex-initial">
        <button
          onClick={onNavigateBack}
          disabled={!canGoBack}
          className="p-1.5 rounded-sm hover:bg-fluent-bg-sidebar dark:hover:bg-fluent-dark-border/40 text-fluent-text-secondary dark:text-gray-400 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
          title="Back"
          id="toolbar-btn-back"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={onNavigateForward}
          disabled={!canGoForward}
          className="p-1.5 rounded-sm hover:bg-fluent-bg-sidebar dark:hover:bg-fluent-dark-border/40 text-fluent-text-secondary dark:text-gray-400 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
          title="Forward"
          id="toolbar-btn-forward"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <button
          onClick={onRefresh}
          className="p-1.5 rounded-sm hover:bg-fluent-bg-sidebar dark:hover:bg-fluent-dark-border/40 text-fluent-text-secondary dark:text-gray-400 transition-all"
          title="Refresh"
          id="toolbar-btn-refresh"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 6H16" />
          </svg>
        </button>

        <div className="h-4 w-[1px] bg-fluent-border dark:bg-fluent-dark-border mx-1"></div>

        {/* Create and Upload actions (Active in Files tab) */}
        {isFilesTab && (
          <div className="flex flex-wrap items-center gap-1">
            <button
              onClick={onNewFolder}
              className="px-2.5 py-1.5 rounded-sm text-fluent-brand hover:bg-fluent-brand-light dark:hover:bg-fluent-brand/10 text-xs font-semibold flex items-center space-x-1.5 transition-colors border border-transparent"
              id="toolbar-btn-newfolder"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              <span className={newFolderText}>New folder</span>
            </button>

            <button
              onClick={onUploadFile}
              className="px-2.5 py-1.5 rounded-sm text-fluent-text-secondary dark:text-gray-300 hover:bg-fluent-bg-sidebar dark:hover:bg-fluent-dark-border/30 text-xs font-semibold flex items-center space-x-1.5 transition-colors border border-transparent"
              id="toolbar-btn-uploadfile"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span className={uploadFileText}>Upload file</span>
            </button>

            <button
              onClick={onUploadFolder}
              className="px-2.5 py-1.5 rounded-sm text-fluent-text-secondary dark:text-gray-300 hover:bg-fluent-bg-sidebar dark:hover:bg-fluent-dark-border/30 text-xs font-semibold flex items-center space-x-1.5 transition-colors border border-transparent"
              id="toolbar-btn-uploadfolder"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5M5 19v-2m16 2v-4m0 4h-2m2-4l-3-3m0 0l-3 3m3-3v8" />
              </svg>
              <span className={uploadFolderText}>Upload folder</span>
            </button>
          </div>
        )}

        {/* Selection Specific Context Actions */}
        {selectedCount > 0 && (
          <div className="flex flex-wrap items-center gap-0.5 bg-fluent-bg-sidebar dark:bg-fluent-dark-bg rounded-sm p-0.5 border border-fluent-border dark:border-fluent-dark-border">
            {selectedCount === 1 && (
              <>
                <button
                  onClick={onDownload}
                  className="px-2 py-1 rounded-sm text-fluent-text-secondary dark:text-gray-300 hover:bg-white dark:hover:bg-fluent-dark-card text-xs font-semibold flex items-center space-x-1 transition-all"
                  id="toolbar-btn-download"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span className={downloadText}>Download</span>
                </button>
                <button
                  onClick={onRename}
                  className="px-2 py-1 rounded-sm text-fluent-text-secondary dark:text-gray-300 hover:bg-white dark:hover:bg-fluent-dark-card text-xs font-semibold flex items-center space-x-1 transition-all"
                  id="toolbar-btn-rename"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span className={renameText}>Rename</span>
                </button>
                <button
                  onClick={onShare}
                  className="px-2 py-1 rounded-sm text-fluent-text-secondary dark:text-gray-300 hover:bg-white dark:hover:bg-fluent-dark-card text-xs font-semibold flex items-center space-x-1 transition-all"
                  id="toolbar-btn-share"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 10.742l4.636-2.318a2 2 0 11.832 1.664l-4.636 2.318a2 2 0 11-.832-1.664z" />
                  </svg>
                  <span className={shareText}>Share</span>
                </button>
                {activeTab !== "recycle-bin" && (
                  <button
                    onClick={onToggleFavorite}
                    className="px-2 py-1 rounded-sm text-fluent-text-secondary dark:text-gray-300 hover:bg-white dark:hover:bg-fluent-dark-card text-xs font-semibold flex items-center space-x-1 transition-all"
                    id="toolbar-btn-favorite"
                  >
                    <svg className="w-3.5 h-3.5 text-amber-500 fill-amber-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className={favoriteText}>Favorite</span>
                  </button>
                )}
              </>
            )}
            <button
              onClick={onDelete}
              className="px-2 py-1 rounded-sm text-red-600 dark:text-red-400 hover:bg-white dark:hover:bg-fluent-dark-card text-xs font-semibold flex items-center space-x-1 transition-all"
              id="toolbar-btn-delete"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span className={deleteText}>{activeTab === "recycle-bin" ? "Delete Permanently" : "Delete"}</span>
            </button>
          </div>
        )}
      </div>

      {/* Advanced Search, View Switcher & Sorting */}
      <div className="flex flex-wrap items-center gap-2 max-w-full">
        {/* Search Input */}
        <div className="relative w-48 sm:w-60 max-w-full">
          <input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-8 pr-8 py-1.5 bg-fluent-bg-sidebar/40 dark:bg-fluent-dark-bg border border-fluent-border dark:border-fluent-dark-border rounded-sm text-fluent-text dark:text-white focus:outline-none focus:ring-[1px] focus:ring-fluent-brand focus:border-fluent-brand transition-all"
            id="toolbar-search-input"
          />
          <span className="absolute left-2.5 top-2 text-fluent-text-muted">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-2 text-fluent-text-muted hover:text-fluent-text"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Filter / Advanced Search */}
        <button
          onClick={onAdvancedSearch}
          className="p-1.5 rounded-sm hover:bg-fluent-bg-sidebar dark:hover:bg-fluent-dark-border/40 text-fluent-text-secondary dark:text-gray-400 transition-all border border-fluent-border dark:border-fluent-dark-border"
          title="Advanced Filters"
          id="toolbar-advanced-search"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
        </button>

        <div className="h-4 w-[1px] bg-fluent-border dark:bg-fluent-dark-border mx-1"></div>

        {/* Sorting Dropdown */}
        <div className="flex items-center space-x-1" id="toolbar-sort-selector">
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value as SortField)}
            className="text-xs bg-white dark:bg-fluent-dark-bg border border-fluent-border dark:border-fluent-dark-border text-fluent-text-secondary dark:text-gray-300 px-2 py-1 rounded-sm focus:outline-none focus:ring-[1px] focus:ring-fluent-brand cursor-pointer"
          >
            <option value="name">Name</option>
            <option value="size">Size</option>
            <option value="lastModifiedDateTime">Modified Date</option>
            <option value="mimeType">File Type</option>
          </select>

          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="p-1.5 rounded-sm hover:bg-fluent-bg-sidebar dark:hover:bg-fluent-dark-border/40 text-fluent-text-secondary dark:text-gray-400 border border-fluent-border dark:border-fluent-dark-border"
            title={sortOrder === "asc" ? "Ascending" : "Descending"}
            id="toolbar-btn-sortorder"
          >
            {sortOrder === "asc" ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
              </svg>
            )}
          </button>
        </div>

        <div className="h-4 w-[1px] bg-fluent-border dark:bg-fluent-dark-border mx-1"></div>

        {/* View Mode Selection */}
        <div className="flex bg-fluent-bg-sidebar dark:bg-fluent-dark-bg rounded-sm p-0.5 border border-fluent-border dark:border-fluent-dark-border" id="toolbar-viewmode-toggle">
          {(["grid", "list", "details", "tiles"] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`p-1 rounded-sm text-fluent-text-secondary dark:text-gray-400 transition-all ${
                viewMode === mode
                  ? "bg-white dark:bg-fluent-dark-card text-fluent-brand shadow-2xs font-semibold"
                  : "hover:bg-fluent-bg-sidebar/50 dark:hover:bg-fluent-dark-border/30"
              }`}
              title={`${mode.charAt(0).toUpperCase() + mode.slice(1)} View`}
              id={`toolbar-viewmode-${mode}`}
            >
              {mode === "grid" && (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
                </svg>
              )}
              {mode === "list" && (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
              {mode === "details" && (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6h16M4 12h16M4 18h7m-7-6h7" />
                </svg>
              )}
              {mode === "tiles" && (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 17v-2a4 4 0 00-4-4H3m18 11V4a2 2 0 00-2-2H5a2 2 0 00-2 2v4" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
