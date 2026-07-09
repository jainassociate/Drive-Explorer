/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { DriveItem } from "../types";

interface FileEditorModalProps {
  item: DriveItem;
  onSave: (itemId: string, newContent: string) => void;
  onClose: () => void;
}

export default function FileEditorModal({ item, onSave, onClose }: FileEditorModalProps) {
  const [content, setContent] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Generate beautiful simulated content if none exists yet
  useEffect(() => {
    if (item.content !== undefined) {
      setContent(item.content);
    } else {
      setContent(getSimulatedContent(item.name, item.file?.mimeType));
    }
  }, [item]);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      onSave(item.id, content);
      setIsSaving(false);
      setIsEditing(false);
    }, 600);
  };

  const getSimulatedContent = (name: string, mime?: string): string => {
    const ext = name.split(".").pop()?.toLowerCase();
    
    if (ext === "md" || name.endsWith(".md")) {
      return `# ${name}

Welcome to your **OneDrive In-App Markdown Reader & Editor**! 🚀

This is a beautiful live-rendered Markdown preview. You can toggle **Edit Mode** to modify the content, add headers, checklists, and code snippets, and save them.

## Core Features
1. **Live Preview**: Dual-mode text reader and markdown compiler.
2. **Offline-First Storage**: Saves all edits to your local simulation store securely.
3. **MIME Integrity**: Preserves original file types.

### Code Block Demonstration
\`\`\`typescript
interface Developer {
  name: string;
  skills: string[];
  enjoysOneDrive: boolean;
}

const me: Developer = {
  name: "Himanshu Jain",
  skills: ["React", "TypeScript", "Tailwind CSS"],
  enjoysOneDrive: true
};
\`\`\`

> "The details are not the details. They make the design." - Charles Eames

### Interactive Tasks
- [x] Select multiple items and batch delete
- [x] Inspect interactive storage pie chart
- [x] Read and write in markdown editor
`;
    }

    if (ext === "json" || mime === "application/json") {
      return `{
  "name": "${name}",
  "version": "1.0.0",
  "description": "Simulated configuration file on OneDrive",
  "author": "Himanshu Jain",
  "license": "Apache-2.0",
  "features": [
    "Batch Operations",
    "Markdown Reader",
    "Recharts Allocation View",
    "Drag & Drop Zones"
  ],
  "preferences": {
    "theme": "dark",
    "enableDevConsole": true,
    "automaticSync": true
  }
}`;
    }

    if (ext === "js" || ext === "ts" || ext === "tsx" || ext === "jsx") {
      return `/**
 * Simulated Microsoft Graph API Client Wrapper
 * File: ${name}
 */

import { DriveItem } from "../types";

export class OneDriveClient {
  private accessToken: string;

  constructor(token: string) {
    this.accessToken = token;
  }

  async getRootFiles(): Promise<DriveItem[]> {
    console.log("Fetching root folder collections...");
    const res = await fetch("https://graph.microsoft.com/v1.0/me/drive/root/children");
    return res.json();
  }

  static getCategory(mime: string): string {
    if (mime.startsWith("image/")) return "Images";
    if (mime.startsWith("video/")) return "Videos";
    return "Documents";
  }
}
`;
    }

    if (ext === "txt") {
      if (name.includes("welcome") || name.includes("Welcome")) {
        return `========================================
WELCOME TO ONEDRIVE EXPLORER & SIMULATOR
========================================

Greetings! This OneDrive Explorer simulates a high-fidelity Azure App Registration portal.

Through this dashboard, you can:
- Seamlessly navigate nested drive folder hierarchies.
- Drag and drop documents directly from your system file explorer.
- Inspect Microsoft Graph API request and response payloads.
- View interactive analytics charts showing storage categorization.

All text and markdown files can be edited in-app. Toggle Edit Mode at the top-right to start customizing this document!`;
      }
      if (name.includes("ideas") || name.includes("Ideas")) {
        return `========================================
APP STARTUP IDEAS - NOTES
========================================

1. FocusFlow - Mindfulness & Ambient Synth
   - Simple dark mode meditation assistant.
   - Built-in audio loops and guided breathing sessions.

2. OneDrive Delta Manager
   - File synchronization dashboard targeting Azure multi-tenants.
   - Active telemetry visualizers.

3. D3 Realtime Analytics Canvas
   - Web application log analyzer with interactive node-link diagrams.
   - Dynamic drilldowns and CSV exports.`;
      }
      return `This is simulated text content for the file "${name}".\n\nYou can edit this text right here inside OneDrive Explorer and save changes to your mock storage!`;
    }

    return `// Raw File Reader: ${name}\n\nThis file format does not support advanced live formatting. You can view or update the raw string content here: \n\n${name} size: ${item.size} bytes`;
  };

  // Safe custom Markdown renderer
  const renderMarkdown = (text: string) => {
    const lines = text.split("\n");
    let inCodeBlock = false;
    let codeBlockContent: string[] = [];

    return (
      <div className="prose dark:prose-invert max-w-none text-xs text-fluent-text dark:text-gray-200 space-y-3 leading-relaxed">
        {lines.map((line, idx) => {
          // Code Blocks
          if (line.trim().startsWith("```")) {
            if (inCodeBlock) {
              inCodeBlock = false;
              const codeText = codeBlockContent.join("\n");
              codeBlockContent = [];
              return (
                <pre key={idx} className="bg-slate-900 text-slate-100 p-3 rounded-sm border border-slate-800 font-mono text-[11px] overflow-x-auto my-2.5">
                  <code>{codeText}</code>
                </pre>
              );
            } else {
              inCodeBlock = true;
              return null;
            }
          }

          if (inCodeBlock) {
            codeBlockContent.push(line);
            return null;
          }

          // Headings
          if (line.startsWith("# ")) {
            return <h1 key={idx} className="text-lg font-bold text-fluent-text dark:text-white border-b border-fluent-border dark:border-fluent-dark-border pb-1.5 pt-3 tracking-tight">{line.slice(2)}</h1>;
          }
          if (line.startsWith("## ")) {
            return <h2 key={idx} className="text-base font-bold text-fluent-text dark:text-white pt-2.5 tracking-tight">{line.slice(3)}</h2>;
          }
          if (line.startsWith("### ")) {
            return <h3 key={idx} className="text-xs font-bold text-fluent-text-secondary dark:text-gray-300 pt-2 tracking-tight">{line.slice(4)}</h3>;
          }

          // Blockquotes
          if (line.startsWith("> ")) {
            return (
              <blockquote key={idx} className="border-l-3 border-fluent-brand bg-fluent-bg-sidebar/30 dark:bg-fluent-dark-sidebar/10 px-3.5 py-2 text-[11px] italic text-fluent-text-secondary dark:text-gray-400 rounded-r-sm">
                {line.slice(2)}
              </blockquote>
            );
          }

          // Checkboxes/Tasklist
          if (line.startsWith("- [x] ") || line.startsWith("- [X] ")) {
            return (
              <div key={idx} className="flex items-center space-x-2 pl-1.5 py-0.5">
                <input type="checkbox" checked readOnly className="rounded-xs border-fluent-border text-fluent-brand focus:ring-fluent-brand w-3.5 h-3.5" />
                <span className="line-through text-fluent-text-secondary dark:text-gray-400">{line.slice(6)}</span>
              </div>
            );
          }
          if (line.startsWith("- [ ] ")) {
            return (
              <div key={idx} className="flex items-center space-x-2 pl-1.5 py-0.5">
                <input type="checkbox" checked={false} readOnly className="rounded-xs border-fluent-border text-fluent-brand focus:ring-fluent-brand w-3.5 h-3.5" />
                <span>{line.slice(6)}</span>
              </div>
            );
          }

          // Bullet lists
          if (line.startsWith("- ") || line.startsWith("* ")) {
            return (
              <ul key={idx} className="list-disc list-inside pl-3 space-y-1">
                <li>{parseInlineMarkdown(line.slice(2))}</li>
              </ul>
            );
          }

          // Numbered list
          const numMatch = line.match(/^(\d+)\.\s(.*)/);
          if (numMatch) {
            return (
              <ol key={idx} className="list-decimal list-inside pl-3 space-y-1">
                <li>{parseInlineMarkdown(numMatch[2])}</li>
              </ol>
            );
          }

          // Empty line
          if (line.trim() === "") {
            return <div key={idx} className="h-2"></div>;
          }

          // Standard paragraph
          return <p key={idx}>{parseInlineMarkdown(line)}</p>;
        })}
      </div>
    );
  };

  // Parse Bold and Italics and Inline code safely
  const parseInlineMarkdown = (text: string) => {
    let parts: React.ReactNode[] = [];
    let currentText = text;
    let index = 0;

    while (currentText.length > 0) {
      // Bold **
      const boldMatch = currentText.match(/\*\*(.*?)\*\*/);
      // Inline Code `
      const codeMatch = currentText.match(/`(.*?)`/);

      const matches = [
        { type: "bold", index: boldMatch?.index ?? -1, length: boldMatch ? boldMatch[0].length : 0, value: boldMatch ? boldMatch[1] : "" },
        { type: "code", index: codeMatch?.index ?? -1, length: codeMatch ? codeMatch[0].length : 0, value: codeMatch ? codeMatch[1] : "" }
      ].filter(m => m.index !== -1).sort((a, b) => a.index - b.index);

      if (matches.length === 0) {
        parts.push(<span key={index++}>{currentText}</span>);
        break;
      }

      const firstMatch = matches[0];
      if (firstMatch.index > 0) {
        parts.push(<span key={index++}>{currentText.slice(0, firstMatch.index)}</span>);
      }

      if (firstMatch.type === "bold") {
        parts.push(<strong key={index++} className="font-bold text-fluent-text dark:text-white">{firstMatch.value}</strong>);
      } else if (firstMatch.type === "code") {
        parts.push(<code key={index++} className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-red-500 font-mono text-[10.5px] rounded-xs">{firstMatch.value}</code>);
      }

      currentText = currentText.slice(firstMatch.index + firstMatch.length);
    }

    return parts;
  };

  const getFileIcon = (name: string) => {
    const ext = name.split(".").pop()?.toLowerCase();
    if (ext === "md") {
      return (
        <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    }
    if (ext === "json") {
      return (
        <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      );
    }
    return (
      <svg className="w-5 h-5 text-fluent-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
  };

  const isMarkdown = item.name.endsWith(".md");

  return (
    <div className="fixed inset-0 bg-black/45 dark:bg-black/65 flex items-center justify-center z-50 p-4 backdrop-blur-xs animate-fade-in" id="file-editor-modal-container">
      <div className="bg-white dark:bg-fluent-dark-card border border-fluent-border dark:border-fluent-dark-border w-full max-w-4xl h-[85vh] rounded-sm shadow-2xl flex flex-col overflow-hidden animate-scale-up">
        
        {/* Title Bar Header */}
        <header className="bg-fluent-bg-sidebar dark:bg-fluent-dark-sidebar p-3.5 px-5 border-b border-fluent-border dark:border-fluent-dark-border flex items-center justify-between select-none">
          <div className="flex items-center space-x-2.5 min-w-0">
            {getFileIcon(item.name)}
            <div className="min-w-0">
              <span className="text-xs font-bold text-fluent-text dark:text-white truncate block">{item.name}</span>
              <span className="text-[10px] text-fluent-text-secondary block mt-0.5">
                {isEditing ? "Editing Mode" : "Reader Mode"} • {item.name.endsWith(".md") ? "Markdown formatted" : "Text document"}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Mode Switch Button */}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-3 py-1.2 rounded-sm text-xs font-bold transition-all flex items-center space-x-1 border cursor-pointer ${
                isEditing
                  ? "bg-white dark:bg-fluent-dark-bg text-fluent-text dark:text-white border-fluent-border dark:border-fluent-dark-border shadow-3xs"
                  : "bg-fluent-brand text-white border-transparent hover:bg-fluent-brand-hover"
              }`}
              id="editor-btn-toggle-mode"
            >
              {isEditing ? (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>Preview</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  <span>Edit File</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-sm hover:bg-gray-200 dark:hover:bg-gray-800 text-fluent-text-muted hover:text-fluent-text transition-colors cursor-pointer"
              title="Close editor"
              id="editor-btn-close"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </header>

        {/* Content Workspace Grid */}
        <div className="flex-1 flex overflow-hidden bg-white dark:bg-fluent-dark-bg">
          {isEditing ? (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-1 p-6 font-mono text-[11px] text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-950/40 border-0 outline-none resize-none focus:ring-0 leading-relaxed overflow-y-auto"
              placeholder="Write text or markdown content here..."
              id="editor-textarea"
            />
          ) : (
            <div className="flex-1 p-6.5 overflow-y-auto" id="editor-preview-container">
              {isMarkdown ? (
                renderMarkdown(content)
              ) : (
                <pre className="font-mono text-xs whitespace-pre-wrap leading-relaxed text-fluent-text dark:text-gray-200">
                  {content || "Empty document"}
                </pre>
              )}
            </div>
          )}
        </div>

        {/* Footer actions bar */}
        <footer className="bg-fluent-bg-sidebar dark:bg-fluent-dark-sidebar p-3 px-5 border-t border-fluent-border dark:border-fluent-dark-border flex items-center justify-between select-none">
          <span className="text-[10px] text-fluent-text-secondary">
            Character count: <span className="font-semibold text-fluent-text dark:text-white">{content.length}</span>
          </span>
          
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4.5 py-1.5 border border-fluent-border dark:border-fluent-dark-border hover:bg-gray-100 dark:hover:bg-gray-800 text-fluent-text dark:text-white rounded-sm text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            
            {isEditing && (
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="px-5 py-1.5 bg-fluent-brand hover:bg-fluent-brand-hover text-white rounded-sm text-xs font-bold transition-colors flex items-center space-x-2 cursor-pointer shadow-3xs disabled:opacity-50"
                id="editor-btn-save"
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            )}
          </div>
        </footer>

      </div>
    </div>
  );
}
