/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { DevLog } from "../types";

interface DevConsoleProps {
  logs: DevLog[];
  onClearLogs: () => void;
}

export default function DevConsole({ logs, onClearLogs }: DevConsoleProps) {
  const [selectedLogId, setSelectedLogId] = useState<string | null>(
    logs.length > 0 ? logs[0].id : null
  );
  const [activeTab, setActiveTab] = useState<"request" | "response" | "code">("request");
  const [codeLang, setCodeLang] = useState<"curl" | "js" | "python" | "csharp" | "powershell">("curl");
  const [methodFilter, setMethodFilter] = useState<"ALL" | "GET" | "POST" | "DELETE" | "PATCH">("ALL");

  // Filter logs by selected HTTP method
  const filteredLogs = logs.filter((log) => {
    if (methodFilter === "ALL") return true;
    return log.method === methodFilter;
  });

  // Keep selection synchronized with logs if new ones appear
  const activeLog = filteredLogs.find((l) => l.id === selectedLogId) || filteredLogs[0];

  const formatHeaders = (headers?: Record<string, string>) => {
    if (!headers) return "";
    return Object.entries(headers)
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n");
  };

  const getCodeSnippet = (log: DevLog) => {
    const url = log.url;
    const method = log.method;
    const bodyStr = log.requestBody ? (typeof log.requestBody === "object" ? JSON.stringify(log.requestBody) : log.requestBody) : "";

    switch (codeLang) {
      case "curl":
        return `curl -X ${method} "${url}" \\\n  -H "Authorization: Bearer [ACCESS_TOKEN]" \\\n  -H "Content-Type: application/json" ${
          bodyStr ? `\\\n  -d '${bodyStr}'` : ""
        }`;
      case "js":
        return `const response = await fetch("${url}", {\n  method: "${method}",\n  headers: {\n    "Authorization": "Bearer [ACCESS_TOKEN]",\n    "Content-Type": "application/json"\n  }${
          bodyStr ? `,\n  body: JSON.stringify(${bodyStr})` : ""
        }\n});\nconst data = await response.json();\nconsole.log(data);`;
      case "python":
        return `import requests\n\nurl = "${url}"\nheaders = {\n    "Authorization": "Bearer [ACCESS_TOKEN]",\n    "Content-Type": "application/json"\n}\n\nresponse = requests.${method.toLowerCase()}(url, headers=headers${
          bodyStr ? `, json=${bodyStr}` : ""
        })\nprint(response.json())`;
      case "csharp":
        return `var client = new HttpClient();\nvar request = new HttpRequestMessage(HttpMethod.${
          method.charAt(0) + method.slice(1).toLowerCase()
        }, "${url}");\nrequest.Headers.Add("Authorization", "Bearer [ACCESS_TOKEN]");\n${
          bodyStr
            ? `request.Content = new StringContent("${bodyStr.replace(/"/g, '\\"')}", Encoding.UTF8, "application/json");\n`
            : ""
        }var response = await client.SendAsync(request);\nstring responseBody = await response.Content.ReadAsStringAsync();`;
      case "powershell":
        return `Invoke-RestMethod -Uri "${url}" \`\n  -Method ${method} \`\n  -Headers @{ Authorization = "Bearer [ACCESS_TOKEN]" } \`\n  -ContentType "application/json"${
          bodyStr ? ` \`\n  -Body '${bodyStr}'` : ""
        }`;
    }
  };

  // Export full logs history as JSON file
  const handleExportJSON = () => {
    if (logs.length === 0) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `onedrive_graph_logs_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
  };

  // Export current selected log details as raw text file
  const handleExportRawText = () => {
    if (!activeLog) return;
    const textContent = `================================================
MICROSOFT GRAPH GRAPH API LOG REPORT
================================================
Timestamp: ${activeLog.timestamp}
Method: ${activeLog.method}
URL: ${activeLog.url}
Response Status: ${activeLog.statusCode} (${activeLog.responseTimeMs} ms)

------------------------------------------------
REQUEST HEADERS:
------------------------------------------------
${formatHeaders(activeLog.requestHeaders) || "None"}

------------------------------------------------
REQUEST BODY:
------------------------------------------------
${activeLog.requestBody || "Empty Body"}

------------------------------------------------
RESPONSE HEADERS:
------------------------------------------------
${formatHeaders(activeLog.responseHeaders) || "None"}

------------------------------------------------
RESPONSE BODY:
------------------------------------------------
${typeof activeLog.responseBody === "object" ? JSON.stringify(activeLog.responseBody, null, 2) : activeLog.responseBody || "Empty Body"}
`;

    const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(textContent);
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `graph_log_report_${activeLog.id}.txt`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
  };

  // Quick Copy all console logs
  const handleCopyAllLogs = () => {
    if (logs.length === 0) return;
    navigator.clipboard.writeText(JSON.stringify(logs, null, 2));
    alert("Copied all logs history to clipboard successfully!");
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-fluent-dark-bg text-gray-100 font-mono select-text animate-fade-in" id="dev-console-wrapper">
      {/* Console Top Header */}
      <div className="p-4 border-b border-fluent-dark-border flex flex-wrap gap-4 items-center justify-between select-none bg-black/30">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
          <span className="font-bold text-xs uppercase tracking-wider text-gray-300 ml-2">Microsoft Graph API Logs</span>
        </div>

        {/* Toolbar controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Method Filter dropdown */}
          <div className="flex items-center space-x-1.5">
            <span className="text-[10px] text-gray-500 font-semibold uppercase">Filter:</span>
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value as any)}
              className="text-[10px] bg-black/50 text-gray-300 border border-fluent-dark-border rounded-xs px-2 py-1 outline-none cursor-pointer focus:border-fluent-brand"
            >
              <option value="ALL">All Methods</option>
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="DELETE">DELETE</option>
              <option value="PATCH">PATCH</option>
            </select>
          </div>

          <div className="h-4 w-[1px] bg-fluent-dark-border mx-1"></div>

          {/* Export Actions */}
          {logs.length > 0 && (
            <div className="flex items-center space-x-1">
              <button
                onClick={handleCopyAllLogs}
                className="text-[10px] text-gray-300 hover:text-white font-bold px-2 py-1 border border-fluent-dark-border rounded-sm bg-white/5 hover:bg-white/10 transition-colors"
                title="Copy all logs to clipboard"
              >
                Copy All
              </button>
              <button
                onClick={handleExportJSON}
                className="text-[10px] text-fluent-brand hover:text-fluent-brand-hover font-bold px-2 py-1 border border-fluent-brand/30 hover:border-fluent-brand rounded-sm bg-fluent-brand/10 transition-colors"
                title="Download entire log history as JSON file"
              >
                Export JSON
              </button>
              {activeLog && (
                <button
                  onClick={handleExportRawText}
                  className="text-[10px] text-amber-400 hover:text-amber-300 font-bold px-2 py-1 border border-amber-500/30 hover:border-amber-500 rounded-sm bg-amber-500/10 transition-colors"
                  title="Download selected log report as text file"
                >
                  Export Report
                </button>
              )}
            </div>
          )}

          <div className="h-4 w-[1px] bg-fluent-dark-border mx-1"></div>

          <button
            onClick={onClearLogs}
            className="text-[10px] text-red-400 hover:text-red-300 font-bold px-3 py-1 border border-red-500/30 hover:border-red-500 rounded-sm bg-red-500/10 transition-colors"
          >
            Clear Console
          </button>
        </div>
      </div>

      {filteredLogs.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center select-none" id="empty-state-console">
          <svg className="w-12 h-12 text-gray-700 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h4 className="text-xs font-bold text-gray-400 mt-4">No Logs Found</h4>
          <p className="text-[11px] text-gray-500 max-w-sm mt-1 leading-normal">
            {methodFilter !== "ALL"
              ? `There are no requests matching the method filter "${methodFilter}" in this session yet.`
              : "Browse folders, upload files, or trigger CRUD operations to inspect raw Microsoft Graph HTTP requests/responses."}
          </p>
        </div>
      ) : (
        <div className="flex-1 flex min-h-0 divide-x divide-fluent-dark-border">
          {/* Logs Left Menu Panel */}
          <div className="w-80 flex flex-col min-h-0 select-none bg-black/20">
            <div className="p-3 bg-black/40 border-b border-fluent-dark-border text-[9px] font-bold text-gray-400 tracking-wider uppercase flex justify-between items-center">
              <span>HTTP Operations Log</span>
              <span className="text-[9.5px] font-bold bg-white/10 px-1.5 py-0.2 rounded-xs text-gray-300">
                {filteredLogs.length} entries
              </span>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-fluent-dark-border/40">
              {filteredLogs.map((log) => {
                const isActive = (activeLog && activeLog.id === log.id) || selectedLogId === log.id;
                const isError = log.statusCode >= 400;
                return (
                  <button
                    key={log.id}
                    onClick={() => {
                      setSelectedLogId(log.id);
                    }}
                    className={`w-full text-left p-3 text-xs block transition-colors ${
                      isActive
                        ? "bg-fluent-brand/10 text-fluent-brand border-l-2 border-fluent-brand pl-2.5"
                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`font-bold px-1.5 py-0.5 rounded-sm text-[8px] uppercase ${
                          log.method === "GET"
                            ? "bg-green-500/20 text-green-400"
                            : log.method === "POST"
                            ? "bg-fluent-brand/20 text-fluent-brand"
                            : log.method === "DELETE"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-amber-500/20 text-amber-400"
                        }`}
                      >
                        {log.method}
                      </span>
                      <span
                        className={`font-bold text-[9px] ${
                          isError ? "text-red-400" : "text-green-400"
                        }`}
                      >
                        {log.statusCode}
                      </span>
                    </div>
                    <p className="font-mono mt-1.5 truncate text-[10px] break-all opacity-85">{log.url}</p>
                    <div className="flex justify-between text-[8px] text-gray-500 mt-2">
                      <span>{log.responseTimeMs} ms</span>
                      <span>{log.timestamp}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Details Right Display Panel */}
          {activeLog && (
            <div className="flex-1 flex flex-col min-h-0 bg-black/40">
              {/* Tabs list */}
              <div className="flex bg-black/20 p-1 border-b border-fluent-dark-border select-none">
                {(["request", "response", "code"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1.5 text-[10px] font-bold rounded-sm capitalize transition-all cursor-pointer ${
                      activeTab === tab
                        ? "bg-white/10 text-fluent-brand font-bold"
                        : "text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    {tab === "code" ? "SDK / CLI Snippet" : `${tab} payload`}
                  </button>
                ))}
              </div>

              {/* Panel Details Body */}
              <div className="flex-1 p-4 overflow-auto text-xs space-y-4">
                {activeTab === "request" && (
                  <>
                    <div>
                      <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block">Target Graph URL</span>
                      <p className="text-gray-300 font-bold mt-1 bg-black/40 p-2 rounded-sm border border-fluent-dark-border break-all">{activeLog.url}</p>
                    </div>
                    <div>
                      <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block">Request Headers</span>
                      <pre className="bg-black/40 p-3 rounded-sm border border-fluent-dark-border text-gray-400 mt-1 whitespace-pre-wrap leading-relaxed">
                        {formatHeaders(activeLog.requestHeaders) || "No Headers Specified"}
                      </pre>
                    </div>
                    <div>
                      <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block">Request JSON Payload Body</span>
                      <pre className="bg-black/40 p-3 rounded-sm border border-fluent-dark-border text-fluent-brand mt-1 whitespace-pre-wrap leading-relaxed">
                        {activeLog.requestBody
                          ? typeof activeLog.requestBody === "object"
                            ? JSON.stringify(activeLog.requestBody, null, 2)
                            : activeLog.requestBody
                          : "Empty Request Body"}
                      </pre>
                    </div>
                  </>
                )}

                {activeTab === "response" && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block">Response Status</span>
                        <p
                          className={`font-bold mt-1 text-sm ${
                            activeLog.statusCode < 400 ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          HTTP {activeLog.statusCode}
                        </p>
                      </div>
                      <div>
                        <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block">Duration Time</span>
                        <p className="text-gray-300 font-semibold mt-1 text-sm">{activeLog.responseTimeMs} ms</p>
                      </div>
                    </div>
                    <div>
                      <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block">Response Headers</span>
                      <pre className="bg-black/40 p-3 rounded-sm border border-fluent-dark-border text-gray-400 mt-1 whitespace-pre-wrap leading-relaxed">
                        {formatHeaders(activeLog.responseHeaders) || "No Headers"}
                      </pre>
                    </div>
                    <div>
                      <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block">Response JSON Payload Body</span>
                      <div className="relative mt-1">
                        <button
                          onClick={() => {
                            const data = typeof activeLog.responseBody === "object" ? JSON.stringify(activeLog.responseBody, null, 2) : activeLog.responseBody;
                            navigator.clipboard.writeText(data || "");
                          }}
                          className="absolute right-2 top-2 bg-white/5 hover:bg-white/10 text-[9px] font-bold px-2 py-1 rounded-sm border border-fluent-dark-border hover:text-white transition-colors cursor-pointer"
                        >
                          Copy Body
                        </button>
                        <pre className="bg-black/40 p-3 rounded-sm border border-fluent-dark-border text-green-400 whitespace-pre-wrap leading-relaxed min-h-36">
                          {activeLog.responseBody
                            ? typeof activeLog.responseBody === "object"
                              ? JSON.stringify(activeLog.responseBody, null, 2)
                              : activeLog.responseBody
                            : "Empty Response Body"}
                        </pre>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === "code" && (
                  <div className="space-y-4">
                    <div className="flex bg-black/20 p-1 rounded-sm border border-fluent-dark-border space-x-1 select-none">
                      {(["curl", "js", "python", "csharp", "powershell"] as const).map((lang) => (
                        <button
                          key={lang}
                          onClick={() => setCodeLang(lang)}
                          className={`flex-1 py-1 text-[9px] font-bold uppercase rounded-sm cursor-pointer ${
                            codeLang === lang
                              ? "bg-white/10 text-fluent-brand"
                              : "text-gray-500 hover:text-gray-300"
                          }`}
                        >
                          {lang === "js" ? "Fetch" : lang === "csharp" ? "C#" : lang}
                        </button>
                      ))}
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5 select-none">
                        <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Ready-to-run Code Script</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(getCodeSnippet(activeLog));
                          }}
                          className="bg-fluent-brand/10 hover:bg-fluent-brand/20 text-fluent-brand text-[9px] font-bold px-2.5 py-1 rounded-sm border border-fluent-brand/20 hover:border-fluent-brand/40 transition-all cursor-pointer"
                        >
                          Copy Script
                        </button>
                      </div>
                      <pre className="bg-black/40 p-4 rounded-sm border border-fluent-dark-border text-amber-400 whitespace-pre-wrap leading-normal font-mono break-all min-h-48">
                        {getCodeSnippet(activeLog)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
