/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // API Route: Generate Microsoft OAuth URL
  app.get("/api/auth/url", (req, res) => {
    const clientId = (req.query.clientId as string) || process.env.CLIENT_ID || "common";
    const tenantId = (req.query.tenantId as string) || process.env.TENANT_ID || "common";
    const redirectUri = (req.query.redirectUri as string) || `${process.env.APP_URL || "http://localhost:3000"}/auth/callback`;
    const state = (req.query.state as string) || "onedrive_explorer_state";

    // Microsoft Graph standard scopes for fully-featured file operations
    const scopes = [
      "offline_access",
      "user.read",
      "Files.ReadWrite.All",
      "Files.ReadWrite.AppFolder",
      "Sites.ReadWrite.All"
    ].join(" ");

    const params = new URLSearchParams({
      client_id: clientId,
      response_type: "code",
      redirect_uri: redirectUri,
      scope: scopes,
      response_mode: "query",
      state: state,
      prompt: "select_account"
    });

    const authorityUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize`;
    const authUrl = `${authorityUrl}?${params.toString()}`;

    res.json({ url: authUrl });
  });

  // OAuth Callback Route (popup handler)
  app.get(["/auth/callback", "/auth/callback/"], async (req, res) => {
    const { code, state, error, error_description } = req.query;

    if (error) {
      return res.send(`
        <html>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 24px; text-align: center; background-color: #f3f4f6; color: #111827;">
            <div style="background: white; padding: 32px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); max-width: 480px; margin: 40px auto;">
              <h2 style="color: #ef4444; margin-bottom: 12px;">Authentication Failed</h2>
              <p style="font-size: 14px; margin-bottom: 24px; color: #4b5563;">${error_description || error}</p>
              <button onclick="window.close()" style="background-color: #3b82f6; color: white; border: none; padding: 10px 20px; border-radius: 4px; font-weight: 500; cursor: pointer;">Close Window</button>
            </div>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: 'OAUTH_AUTH_ERROR', error: '${error}', description: '${error_description || ""}' }, '*');
              }
            </script>
          </body>
        </html>
      `);
    }

    // Send the authentication code back to the client application to exchange or handle.
    // This allows client-side account storage and easy multi-account switching!
    res.send(`
      <html>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 24px; text-align: center; background-color: #f3f4f6; color: #111827;">
          <div style="background: white; padding: 32px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); max-width: 480px; margin: 40px auto;">
            <div style="width: 48px; height: 48px; border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px auto;"></div>
            <h2 style="color: #0f6cbd; margin-bottom: 12px;">Connecting OneDrive...</h2>
            <p style="font-size: 14px; color: #4b5563;">Exchanging secure tokens. This window will close automatically.</p>
          </div>
          <style>
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          </style>
          <script>
            if (window.opener) {
              window.opener.postMessage({ 
                type: 'OAUTH_AUTH_SUCCESS', 
                code: '${code || ""}', 
                state: '${state || ""}' 
              }, '*');
              setTimeout(() => { window.close(); }, 800);
            } else {
              window.location.href = '/';
            }
          </script>
        </body>
      </html>
    `);
  });

  // API Proxy Route for Microsoft Graph Requests
  // This proxy forwards requests, bypasses CORS, handles secret tokens when applicable, 
  // and measures accurate performance logs for the Developer Console.
  app.post("/api/graph/proxy", async (req, res) => {
    const { url, method, headers, body, clientId, clientSecret, tenantId, code, refreshToken, redirectUri } = req.body;

    const startTime = Date.now();
    const reqHeaders: Record<string, string> = { ...headers };

    try {
      // 1. If we are exchanging an authorization code for tokens
      if (code || refreshToken) {
        const tokenEndpoint = `https://login.microsoftonline.com/${tenantId || "common"}/oauth2/v2.0/token`;
        const tokenParams = new URLSearchParams();

        tokenParams.append("client_id", clientId || "");
        if (clientSecret) {
          tokenParams.append("client_secret", clientSecret);
        }
        
        if (code) {
          tokenParams.append("grant_type", "authorization_code");
          tokenParams.append("code", code);
          const finalRedirectUri = redirectUri || `${process.env.APP_URL || "http://localhost:3000"}/auth/callback`;
          tokenParams.append("redirect_uri", finalRedirectUri);
        } else if (refreshToken) {
          tokenParams.append("grant_type", "refresh_token");
          tokenParams.append("refresh_token", refreshToken);
        }

        const tokenResponse = await fetch(tokenEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: tokenParams.toString()
        });

        const status = tokenResponse.status;
        const responseHeaders: Record<string, string> = {};
        tokenResponse.headers.forEach((val, key) => {
          responseHeaders[key] = val;
        });

        const tokenData = await tokenResponse.json();
        const duration = Date.now() - startTime;

        return res.status(status).json({
          status,
          duration,
          responseHeaders,
          responseBody: tokenData,
          requestHeaders: { "Content-Type": "application/x-www-form-urlencoded" },
          requestBody: tokenParams.toString().replace(/client_secret=[^&]+/, "client_secret=[REDACTED]")
        });
      }

      // 2. Otherwise, forward standard Graph API call
      const fetchOptions: RequestInit = {
        method: method || "GET"
      };

      if (body && (method === "POST" || method === "PUT" || method === "PATCH")) {
        fetchOptions.body = typeof body === "string" ? body : JSON.stringify(body);
      }

      fetchOptions.headers = reqHeaders;

      const graphResponse = await fetch(url, fetchOptions);
      const status = graphResponse.status;
      
      const responseHeaders: Record<string, string> = {};
      graphResponse.headers.forEach((val, key) => {
        responseHeaders[key] = val;
      });

      let responseBody: any;
      const contentType = responseHeaders["content-type"] || "";
      if (contentType.includes("application/json")) {
        responseBody = await graphResponse.json();
      } else if (contentType.includes("text/")) {
        responseBody = await graphResponse.text();
      } else {
        // If binary/stream or other, we might just report success
        responseBody = { message: "Binary/Stream response received successfully" };
      }

      const duration = Date.now() - startTime;

      res.json({
        status,
        duration,
        responseHeaders,
        responseBody,
        requestHeaders: reqHeaders,
        requestBody: body || ""
      });
    } catch (error: any) {
      const duration = Date.now() - startTime;
      res.status(500).json({
        status: 500,
        duration,
        responseHeaders: { "Content-Type": "application/json" },
        responseBody: { error: error.message || "Failed to proxy Microsoft Graph request" },
        requestHeaders: reqHeaders,
        requestBody: body || ""
      });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true, port: 3000 },
      appType: "spa"
    });
    app.use(vite.middlewares);
    console.log("Vite development middleware mounted.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving compiled production build static assets.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`OneDrive Explorer custom server running on port ${PORT}`);
  });
}

startServer();
