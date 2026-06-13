#!/usr/bin/env node
/**
 * Obtain a Spotify refresh token with a local callback server.
 *
 * Usage:
 *   npm run spotify:token
 *
 * Spotify Dashboard → Redirect URI must include:
 *   http://127.0.0.1:8888/callback
 */

import { createServer } from "node:http";
import { exec } from "node:child_process";

const REDIRECT_URI = "http://127.0.0.1:8888/callback";
const PORT = 8888;
const SCOPES = "user-read-currently-playing user-read-recently-played";

const SERVER_ERROR_HELP = `
Spotify returned "server_error" (masalah di sisi Spotify / konfigurasi app).

Cek berurutan:
  1. Developer Dashboard → app yang Client ID-nya sama dengan .env
     https://developer.spotify.com/dashboard
  2. Settings → Redirect URIs → harus ADA persis (copy-paste):
     http://127.0.0.1:8888/callback
     (JANGAN pakai localhost — Spotify tidak menerima localhost)
  3. User Management → Add your Spotify email (WAJIB jika app masih Development Mode)
  4. Login Spotify di browser dengan akun yang sama (bukan akun lain)
  5. Coba logout di https://accounts.spotify.com lalu npm run spotify:token lagi
  6. Coba browser incognito / browser lain

Jika masih gagal: buat app baru di Dashboard, set Redirect URI + Add user, ganti CLIENT_ID/SECRET di .env.
`.trim();

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  console.error("Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env");
  process.exit(1);
}

const authorizeUrl = new URL("https://accounts.spotify.com/authorize");
authorizeUrl.searchParams.set("client_id", clientId);
authorizeUrl.searchParams.set("response_type", "code");
authorizeUrl.searchParams.set("redirect_uri", REDIRECT_URI);
authorizeUrl.searchParams.set("scope", SCOPES);
authorizeUrl.searchParams.set("state", crypto.randomUUID());

function htmlPage(title, body) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title>
<style>body{font-family:system-ui;max-width:32rem;margin:3rem auto;padding:0 1rem}
code{background:#f4f4f5;padding:.2rem .4rem;border-radius:4px;word-break:break-all}</style></head>
<body><h1>${title}</h1>${body}<p>You can close this tab.</p></body></html>`;
}

async function exchangeCode(code) {
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI,
    }),
  });
  return { ok: tokenRes.ok, data: await tokenRes.json() };
}

function openBrowser(url) {
  const platform = process.platform;
  const cmd =
    platform === "win32"
      ? `start "" "${url}"`
      : platform === "darwin"
        ? `open "${url}"`
        : `xdg-open "${url}"`;
  exec(cmd, () => {});
}

console.log("\n=== Spotify refresh token ===\n");
console.log("Client ID:", clientId.slice(0, 8) + "...");
console.log("\n1. Spotify Dashboard → SAME app → Settings:\n");
console.log(`   Redirect URI (exact): ${REDIRECT_URI}\n`);
console.log("2. User Management → Add user → your Spotify account email");
console.log("   (Required when app is in Development Mode)\n");
console.log("3. Starting local server on port", PORT, "...\n");

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", REDIRECT_URI);

  if (url.pathname !== "/callback") {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found");
    return;
  }

  const error = url.searchParams.get("error");
  if (error) {
    const helpHtml =
      error === "server_error"
        ? `<ol>
<li>Buka <a href="https://developer.spotify.com/dashboard">Spotify Dashboard</a> → app Anda</li>
<li><strong>Settings</strong> → Redirect URIs: <code>${REDIRECT_URI}</code> (simpan)</li>
<li><strong>User Management</strong> → Add user → email akun Spotify yang dipakai login</li>
<li>Logout Spotify, jalankan <code>npm run spotify:token</code> lagi (incognito disarankan)</li>
</ol>`
        : `<p>Run <code>npm run spotify:token</code> again.</p>`;

    res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
    res.end(
      htmlPage(
        "Spotify denied",
        `<p>Error: <strong>${error}</strong></p>${helpHtml}`
      )
    );
    console.error("\nSpotify returned error:", error);
    if (error === "server_error") {
      console.error("\n" + SERVER_ERROR_HELP + "\n");
    }
    server.close();
    process.exit(1);
  }

  const code = url.searchParams.get("code");
  if (!code) {
    res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
    res.end(htmlPage("Missing code", "<p>No authorization code in URL.</p>"));
    return;
  }

  const { ok, data } = await exchangeCode(code);

  if (!ok) {
    res.writeHead(500, { "Content-Type": "text/html; charset=utf-8" });
    res.end(
      htmlPage(
        "Token exchange failed",
        `<pre>${JSON.stringify(data, null, 2)}</pre>`
      )
    );
    console.error("\nToken exchange failed:", data);
    server.close();
    process.exit(1);
  }

  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(
    htmlPage(
      "Success",
      "<p>Refresh token printed in your terminal. Add it to <code>.env</code> as <code>SPOTIFY_REFRESH_TOKEN</code>.</p>"
    )
  );

  console.log("\n✓ Success. Add to .env (and Azure/GitHub secrets):\n");
  console.log(`SPOTIFY_REFRESH_TOKEN=${data.refresh_token}\n`);
  console.log("Scopes:", data.scope ?? "(run npm run spotify:verify to check)\n");
  console.log("Next: npm run spotify:verify\n");

  setTimeout(() => {
    server.close();
    process.exit(0);
  }, 500);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`\nPort ${PORT} is already in use. Close the other app or change PORT in the script.\n`);
  } else {
    console.error(err);
  }
  process.exit(1);
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`   Listening: http://127.0.0.1:${PORT}/callback\n`);
  console.log("3. Opening browser for Spotify login...\n");
  console.log("   If it does not open, visit:\n");
  console.log(`   ${authorizeUrl.toString()}\n`);
  console.log("   (Page 'refused to connect' is normal until you approve in Spotify.)\n");

  openBrowser(authorizeUrl.toString());
});

process.on("SIGINT", () => {
  server.close();
  process.exit(0);
});
