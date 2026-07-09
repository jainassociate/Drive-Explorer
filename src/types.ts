/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface DriveItem {
  id: string;
  name: string;
  size: number;
  createdDateTime: string;
  lastModifiedDateTime: string;
  folder?: {
    childCount: number;
  };
  file?: {
    mimeType: string;
    hashes?: {
      quickXorHash?: string;
      sha1Hash?: string;
    };
  };
  parentReference?: {
    driveId: string;
    id: string;
    path?: string;
  };
  webUrl: string;
  "@microsoft.graph.downloadUrl"?: string;
  createdBy?: {
    user?: {
      displayName: string;
      email?: string;
    };
  };
  lastModifiedBy?: {
    user?: {
      displayName: string;
      email?: string;
    };
  };
  // UI-specific properties
  isFavorite?: boolean;
  isRecent?: boolean;
  isShared?: boolean;
  isRecycleBin?: boolean;
  version?: string;
  sharingLink?: string;
  sharingType?: string;
}

export interface MicrosoftAccount {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  storageUsed: number;
  storageTotal: number;
  driveType: "personal" | "business";
  lastLogin: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
  clientId?: string;
  clientSecret?: string;
  tenantId?: string;
}

export interface DevLog {
  id: string;
  timestamp: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  url: string;
  statusCode: number;
  responseTimeMs: number;
  requestHeaders: Record<string, string>;
  requestBody: string;
  responseHeaders: Record<string, string>;
  responseBody: string;
}

export interface AppNotification {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface UploadTask {
  id: string;
  name: string;
  size: number;
  progress: number; // 0 to 100
  status: "queued" | "uploading" | "completed" | "failed";
  error?: string;
}

export interface DownloadTask {
  id: string;
  name: string;
  size: number;
  progress: number; // 0 to 100
  status: "queued" | "downloading" | "completed" | "failed";
}

export interface AppSettings {
  clientId: string;
  clientSecret: string;
  tenantId: string;
  useSimulation: boolean;
  theme: "light" | "dark";
  enableDevConsole: boolean;
}

export type SidebarTab =
  | "dashboard"
  | "files"
  | "shared"
  | "recent"
  | "favorites"
  | "recycle-bin"
  | "settings"
  | "developer-mode";

export type ViewMode = "grid" | "list" | "details" | "tiles";

export type SortField = "name" | "size" | "lastModifiedDateTime" | "mimeType";
export type SortOrder = "asc" | "desc";
