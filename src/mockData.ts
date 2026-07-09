/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DriveItem } from "./types";

const INITIAL_MOCK_ITEMS: DriveItem[] = [
  // Root Level Folders
  {
    id: "folder_demo",
    name: "Demo Folder",
    size: 204857600, // 200MB
    createdDateTime: "2026-07-09T00:00:00Z",
    lastModifiedDateTime: "2026-07-09T05:00:00Z",
    folder: { childCount: 3 },
    webUrl: "https://onedrive.live.com/?id=folder_demo",
    createdBy: { user: { displayName: "Himanshu Jain (Simulated)", email: "demo@onedrive.com" } },
    lastModifiedBy: { user: { displayName: "Himanshu Jain (Simulated)", email: "demo@onedrive.com" } },
    parentReference: { driveId: "drive_1", id: "root", path: "/drive/root:" },
    isFavorite: true,
    isRecent: true,
    isShared: true
  },
  {
    id: "folder_documents",
    name: "Documents",
    size: 24590012,
    createdDateTime: "2026-01-10T10:30:00Z",
    lastModifiedDateTime: "2026-07-08T15:20:00Z",
    folder: { childCount: 4 },
    webUrl: "https://onedrive.live.com/?id=folder_documents",
    createdBy: { user: { displayName: "John Doe", email: "john.doe@microsoft.com" } },
    lastModifiedBy: { user: { displayName: "John Doe", email: "john.doe@microsoft.com" } },
    parentReference: { driveId: "drive_1", id: "root", path: "/drive/root:" }
  },
  {
    id: "folder_pictures",
    name: "Pictures",
    size: 145903022,
    createdDateTime: "2026-02-15T08:15:00Z",
    lastModifiedDateTime: "2026-07-05T12:10:00Z",
    folder: { childCount: 3 },
    webUrl: "https://onedrive.live.com/?id=folder_pictures",
    createdBy: { user: { displayName: "John Doe", email: "john.doe@microsoft.com" } },
    lastModifiedBy: { user: { displayName: "John Doe", email: "john.doe@microsoft.com" } },
    parentReference: { driveId: "drive_1", id: "root", path: "/drive/root:" }
  },
  {
    id: "folder_projects",
    name: "Projects",
    size: 512000000,
    createdDateTime: "2026-03-01T09:00:00Z",
    lastModifiedDateTime: "2026-07-09T01:30:00Z",
    folder: { childCount: 5 },
    webUrl: "https://onedrive.live.com/?id=folder_projects",
    createdBy: { user: { displayName: "John Doe", email: "john.doe@microsoft.com" } },
    lastModifiedBy: { user: { displayName: "John Doe", email: "john.doe@microsoft.com" } },
    parentReference: { driveId: "drive_1", id: "root", path: "/drive/root:" },
    isFavorite: true
  },
  {
    id: "folder_shared",
    name: "Shared Vault",
    size: 15320980,
    createdDateTime: "2026-04-20T14:45:00Z",
    lastModifiedDateTime: "2026-07-01T11:00:00Z",
    folder: { childCount: 2 },
    webUrl: "https://onedrive.live.com/?id=folder_shared",
    createdBy: { user: { displayName: "Sarah Jenkins", email: "sarah.j@microsoft.com" } },
    lastModifiedBy: { user: { displayName: "John Doe", email: "john.doe@microsoft.com" } },
    parentReference: { driveId: "drive_1", id: "root", path: "/drive/root:" },
    isShared: true
  },

  // Root Level Files
  {
    id: "file_welcome",
    name: "Welcome to OneDrive.txt",
    size: 2450,
    createdDateTime: "2026-01-01T00:00:00Z",
    lastModifiedDateTime: "2026-01-01T00:05:00Z",
    file: { mimeType: "text/plain" },
    webUrl: "https://onedrive.live.com/?id=file_welcome",
    createdBy: { user: { displayName: "OneDrive Team", email: "no-reply@microsoft.com" } },
    lastModifiedBy: { user: { displayName: "OneDrive Team", email: "no-reply@microsoft.com" } },
    parentReference: { driveId: "drive_1", id: "root", path: "/drive/root:" },
    isFavorite: true
  },
  {
    id: "file_budget",
    name: "Quarterly Budget Plan.xlsx",
    size: 145200,
    createdDateTime: "2026-06-15T11:00:00Z",
    lastModifiedDateTime: "2026-07-09T01:45:00Z",
    file: { mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
    webUrl: "https://onedrive.live.com/?id=file_budget",
    createdBy: { user: { displayName: "John Doe", email: "john.doe@microsoft.com" } },
    lastModifiedBy: { user: { displayName: "John Doe", email: "john.doe@microsoft.com" } },
    parentReference: { driveId: "drive_1", id: "root", path: "/drive/root:" },
    isRecent: true
  },
  {
    id: "file_intro_video",
    name: "Product Demo Video.mp4",
    size: 45890201,
    createdDateTime: "2026-05-12T16:30:00Z",
    lastModifiedDateTime: "2026-07-03T10:15:00Z",
    file: { mimeType: "video/mp4" },
    webUrl: "https://onedrive.live.com/?id=file_intro_video",
    createdBy: { user: { displayName: "John Doe", email: "john.doe@microsoft.com" } },
    lastModifiedBy: { user: { displayName: "John Doe", email: "john.doe@microsoft.com" } },
    parentReference: { driveId: "drive_1", id: "root", path: "/drive/root:" }
  },

  // Documents Folder Contents
  {
    id: "file_resume",
    name: "John_Doe_Resume_2026.pdf",
    size: 342000,
    createdDateTime: "2026-01-12T11:30:00Z",
    lastModifiedDateTime: "2026-05-20T14:30:00Z",
    file: { mimeType: "application/pdf" },
    webUrl: "https://onedrive.live.com/?id=file_resume",
    createdBy: { user: { displayName: "John Doe", email: "john.doe@microsoft.com" } },
    lastModifiedBy: { user: { displayName: "John Doe", email: "john.doe@microsoft.com" } },
    parentReference: { driveId: "drive_1", id: "folder_documents" },
    isFavorite: true
  },
  {
    id: "file_contracts",
    name: "Service_Agreement_v3.docx",
    size: 89000,
    createdDateTime: "2026-02-18T10:00:00Z",
    lastModifiedDateTime: "2026-07-08T15:20:00Z",
    file: { mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
    webUrl: "https://onedrive.live.com/?id=file_contracts",
    createdBy: { user: { displayName: "John Doe", email: "john.doe@microsoft.com" } },
    lastModifiedBy: { user: { displayName: "John Doe", email: "john.doe@microsoft.com" } },
    parentReference: { driveId: "drive_1", id: "folder_documents" },
    isRecent: true,
    isShared: true
  },
  {
    id: "file_finance",
    name: "Annual_Tax_Return_2025.xlsx",
    size: 2100000,
    createdDateTime: "2026-04-10T09:15:00Z",
    lastModifiedDateTime: "2026-04-15T16:00:00Z",
    file: { mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
    webUrl: "https://onedrive.live.com/?id=file_finance",
    createdBy: { user: { displayName: "John Doe", email: "john.doe@microsoft.com" } },
    lastModifiedBy: { user: { displayName: "John Doe", email: "john.doe@microsoft.com" } },
    parentReference: { driveId: "drive_1", id: "folder_documents" }
  },
  {
    id: "file_ideas",
    name: "App_Startup_Ideas.txt",
    size: 1540,
    createdDateTime: "2026-03-22T21:40:00Z",
    lastModifiedDateTime: "2026-07-06T23:10:00Z",
    file: { mimeType: "text/plain" },
    webUrl: "https://onedrive.live.com/?id=file_ideas",
    createdBy: { user: { displayName: "John Doe", email: "john.doe@microsoft.com" } },
    lastModifiedBy: { user: { displayName: "John Doe", email: "john.doe@microsoft.com" } },
    parentReference: { driveId: "drive_1", id: "folder_documents" }
  },

  // Pictures Folder Contents
  {
    id: "file_hawaii",
    name: "Hawaii_Sunset_Beach.jpg",
    size: 4500122,
    createdDateTime: "2026-02-18T18:30:00Z",
    lastModifiedDateTime: "2026-02-18T18:30:00Z",
    file: { mimeType: "image/jpeg" },
    webUrl: "https://onedrive.live.com/?id=file_hawaii",
    createdBy: { user: { displayName: "John Doe", email: "john.doe@microsoft.com" } },
    lastModifiedBy: { user: { displayName: "John Doe", email: "john.doe@microsoft.com" } },
    parentReference: { driveId: "drive_1", id: "folder_pictures" },
    isFavorite: true
  },
  {
    id: "file_family",
    name: "Family_Dinner_Thanksgiving.jpg",
    size: 3890122,
    createdDateTime: "2025-11-27T19:00:00Z",
    lastModifiedDateTime: "2025-11-27T19:00:00Z",
    file: { mimeType: "image/jpeg" },
    webUrl: "https://onedrive.live.com/?id=file_family",
    createdBy: { user: { displayName: "John Doe", email: "john.doe@microsoft.com" } },
    lastModifiedBy: { user: { displayName: "John Doe", email: "john.doe@microsoft.com" } },
    parentReference: { driveId: "drive_1", id: "folder_pictures" }
  },
  {
    id: "file_profile",
    name: "Professional_Avatar.png",
    size: 156022,
    createdDateTime: "2026-01-05T14:10:00Z",
    lastModifiedDateTime: "2026-01-05T14:10:00Z",
    file: { mimeType: "image/png" },
    webUrl: "https://onedrive.live.com/?id=file_profile",
    createdBy: { user: { displayName: "John Doe", email: "john.doe@microsoft.com" } },
    lastModifiedBy: { user: { displayName: "John Doe", email: "john.doe@microsoft.com" } },
    parentReference: { driveId: "drive_1", id: "folder_pictures" }
  },

  // Projects Folder Contents
  {
    id: "folder_react_app",
    name: "OneDrive_Explorer_App",
    size: 12590302,
    createdDateTime: "2026-03-02T10:00:00Z",
    lastModifiedDateTime: "2026-07-09T01:30:00Z",
    folder: { childCount: 3 },
    webUrl: "https://onedrive.live.com/?id=folder_react_app",
    createdBy: { user: { displayName: "John Doe", email: "john.doe@microsoft.com" } },
    lastModifiedBy: { user: { displayName: "John Doe", email: "john.doe@microsoft.com" } },
    parentReference: { driveId: "drive_1", id: "folder_projects" }
  },
  {
    id: "file_sys_architecture",
    name: "System_Architecture_Layout.pdf",
    size: 4500000,
    createdDateTime: "2026-03-10T14:20:00Z",
    lastModifiedDateTime: "2026-06-28T09:45:00Z",
    file: { mimeType: "application/pdf" },
    webUrl: "https://onedrive.live.com/?id=file_sys_architecture",
    createdBy: { user: { displayName: "John Doe", email: "john.doe@microsoft.com" } },
    lastModifiedBy: { user: { displayName: "John Doe", email: "john.doe@microsoft.com" } },
    parentReference: { driveId: "drive_1", id: "folder_projects" }
  },
  {
    id: "file_pitch_deck",
    name: "Investor_Pitch_v2.pptx",
    size: 18400000,
    createdDateTime: "2026-04-02T11:00:00Z",
    lastModifiedDateTime: "2026-07-05T13:10:00Z",
    file: { mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation" },
    webUrl: "https://onedrive.live.com/?id=file_pitch_deck",
    createdBy: { user: { displayName: "John Doe", email: "john.doe@microsoft.com" } },
    lastModifiedBy: { user: { displayName: "John Doe", email: "john.doe@microsoft.com" } },
    parentReference: { driveId: "drive_1", id: "folder_projects" },
    isRecent: true,
    isShared: true
  },

  // OneDrive_Explorer_App Contents (Nested folder)
  {
    id: "file_react_main",
    name: "main.tsx",
    size: 1250,
    createdDateTime: "2026-03-02T10:05:00Z",
    lastModifiedDateTime: "2026-07-09T01:30:00Z",
    file: { mimeType: "text/plain" },
    webUrl: "https://onedrive.live.com/?id=file_react_main",
    createdBy: { user: { displayName: "John Doe", email: "john.doe@microsoft.com" } },
    lastModifiedBy: { user: { displayName: "John Doe", email: "john.doe@microsoft.com" } },
    parentReference: { driveId: "drive_1", id: "folder_react_app" }
  },
  {
    id: "file_react_package",
    name: "package.json",
    size: 840,
    createdDateTime: "2026-03-02T10:05:00Z",
    lastModifiedDateTime: "2026-07-09T01:10:00Z",
    file: { mimeType: "text/plain" },
    webUrl: "https://onedrive.live.com/?id=file_react_package",
    createdBy: { user: { displayName: "John Doe", email: "john.doe@microsoft.com" } },
    lastModifiedBy: { user: { displayName: "John Doe", email: "john.doe@microsoft.com" } },
    parentReference: { driveId: "drive_1", id: "folder_react_app" }
  },

  // Demo Folder Contents
  {
    id: "file_demo_presentation",
    name: "Product Pitch Demo.pptx",
    size: 15420000,
    createdDateTime: "2026-07-09T01:00:00Z",
    lastModifiedDateTime: "2026-07-09T05:00:00Z",
    file: { mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation" },
    webUrl: "https://onedrive.live.com/?id=file_demo_presentation",
    createdBy: { user: { displayName: "Himanshu Jain (Simulated)", email: "demo@onedrive.com" } },
    lastModifiedBy: { user: { displayName: "Himanshu Jain (Simulated)", email: "demo@onedrive.com" } },
    parentReference: { driveId: "drive_1", id: "folder_demo" },
    isFavorite: true,
    isRecent: true
  },
  {
    id: "file_demo_sheet",
    name: "User Growth Data.xlsx",
    size: 452000,
    createdDateTime: "2026-07-09T01:15:00Z",
    lastModifiedDateTime: "2026-07-09T04:30:00Z",
    file: { mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
    webUrl: "https://onedrive.live.com/?id=file_demo_sheet",
    createdBy: { user: { displayName: "Himanshu Jain (Simulated)", email: "demo@onedrive.com" } },
    lastModifiedBy: { user: { displayName: "Himanshu Jain (Simulated)", email: "demo@onedrive.com" } },
    parentReference: { driveId: "drive_1", id: "folder_demo" },
    isRecent: true
  },
  {
    id: "file_demo_doc",
    name: "System Specifications.pdf",
    size: 2100000,
    createdDateTime: "2026-07-09T01:10:00Z",
    lastModifiedDateTime: "2026-07-09T04:15:00Z",
    file: { mimeType: "application/pdf" },
    webUrl: "https://onedrive.live.com/?id=file_demo_doc",
    createdBy: { user: { displayName: "Himanshu Jain (Simulated)", email: "demo@onedrive.com" } },
    lastModifiedBy: { user: { displayName: "Himanshu Jain (Simulated)", email: "demo@onedrive.com" } },
    parentReference: { driveId: "drive_1", id: "folder_demo" }
  },

  // Recycle Bin Items
  {
    id: "file_old_notes",
    name: "Old_Notes_ToDelete.txt",
    size: 450,
    createdDateTime: "2025-12-10T11:00:00Z",
    lastModifiedDateTime: "2026-01-20T16:40:00Z",
    file: { mimeType: "text/plain" },
    webUrl: "https://onedrive.live.com/?id=file_old_notes",
    createdBy: { user: { displayName: "John Doe", email: "john.doe@microsoft.com" } },
    lastModifiedBy: { user: { displayName: "John Doe", email: "john.doe@microsoft.com" } },
    parentReference: { driveId: "drive_1", id: "root" },
    isRecycleBin: true
  },
  {
    id: "file_draft_pic",
    name: "Draft_Banner_Blurry.png",
    size: 512039,
    createdDateTime: "2026-01-10T15:20:00Z",
    lastModifiedDateTime: "2026-01-10T15:22:00Z",
    file: { mimeType: "image/png" },
    webUrl: "https://onedrive.live.com/?id=file_draft_pic",
    createdBy: { user: { displayName: "John Doe", email: "john.doe@microsoft.com" } },
    lastModifiedBy: { user: { displayName: "John Doe", email: "john.doe@microsoft.com" } },
    parentReference: { driveId: "drive_1", id: "root" },
    isRecycleBin: true
  }
];

export function getMockItems(): DriveItem[] {
  const stored = sessionStorage.getItem("onedrive_mock_items");
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      // Ensure the newly added "folder_demo" is present; if not, reset storage
      if (Array.isArray(parsed) && parsed.some((item) => item.id === "folder_demo")) {
        return parsed;
      }
    } catch (e) {
      console.error("Failed to parse stored mock items, resetting", e);
    }
  }
  sessionStorage.setItem("onedrive_mock_items", JSON.stringify(INITIAL_MOCK_ITEMS));
  return INITIAL_MOCK_ITEMS;
}

export function saveMockItems(items: DriveItem[]) {
  sessionStorage.setItem("onedrive_mock_items", JSON.stringify(items));
}

export function resetMockItems(): DriveItem[] {
  sessionStorage.setItem("onedrive_mock_items", JSON.stringify(INITIAL_MOCK_ITEMS));
  return INITIAL_MOCK_ITEMS;
}
