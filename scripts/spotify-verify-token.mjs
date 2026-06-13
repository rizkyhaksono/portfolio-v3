#!/usr/bin/env node
/**
 * Verify Spotify env vars, token refresh, and required API scopes.
 *
 * Usage:
 *   node --env-file=.env scripts/spotify-verify-token.mjs
 */

const REQUIRED_SCOPES = [
  "user-read-currently-playing",
  "user-read-recently-played",
];

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

function fail(msg) {
  console.error(`\n✗ ${msg}`);
  process.exit(1);
}

if (!clientId || !clientSecret || !refreshToken) {
  fail(
    "Missing SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, or SPOTIFY_REFRESH_TOKEN in .env"
  );
}

const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
  method: "POST",
  headers: {
    Authorization: `Basic ${basic}`,
    "Content-Type": "application/x-www-form-urlencoded",
  },
  body: new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  }),
});

const tokenData = await tokenRes.json();

if (!tokenRes.ok) {
  console.error("\nToken refresh failed:", tokenData);
  fail("Regenerate refresh token: npm run spotify:token");
}

const accessToken = tokenData.access_token;
const grantedScopes = (tokenData.scope ?? "").split(" ").filter(Boolean);

console.log("\n✓ Access token refreshed");
console.log("  Scopes on token:", grantedScopes.length ? grantedScopes.join(", ") : "(none reported)");

const missingScopes = REQUIRED_SCOPES.filter((s) => !grantedScopes.includes(s));
if (missingScopes.length > 0 && grantedScopes.length > 0) {
  console.warn("\n⚠ Missing scopes:", missingScopes.join(", "));
  console.warn("  Run: npm run spotify:token");
}

async function probe(name, url) {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  let body = "";
  if (res.status !== 204) {
    const raw = await res.text();
    try {
      const json = JSON.parse(raw);
      body = json?.error?.message ?? json?.error_description ?? raw.slice(0, 200);
    } catch {
      body = raw.slice(0, 200);
    }
  }

  const ok =
    res.status === 200 ||
    res.status === 204 ||
    res.status === 404;

  const symbol = ok ? "✓" : "✗";
  console.log(`\n${symbol} ${name}: HTTP ${res.status}${body ? ` — ${body}` : ""}`);

  if (res.status === 403) {
    const lower = body.toLowerCase();
    if (lower.includes("premium")) {
      console.log("  → Spotify Premium is required for the account that owns this Developer app.");
      console.log("  → Subscribe to Spotify Premium on the same account you used to authorize the app.");
    } else if (lower.includes("user") || lower.includes("development")) {
      console.log("  → Add your Spotify email in Developer Dashboard → User Management (Development mode).");
    } else {
      console.log(
        "  → Regenerate token: npm run spotify:token (scopes: user-read-currently-playing user-read-recently-played)"
      );
    }
  }

  return { status: res.status, body };
}

const playing = await probe(
  "Currently playing",
  "https://api.spotify.com/v1/me/player/currently-playing"
);
const recent = await probe(
  "Recently played",
  "https://api.spotify.com/v1/me/player/recently-played?limit=1"
);

const forbidden = [playing, recent].filter((p) => p.status === 403);
if (forbidden.length > 0) {
  const premium = forbidden.some((p) => p.body.toLowerCase().includes("premium"));
  if (premium) {
    fail(
      "Spotify Premium required for the app owner account. Subscribe to Premium, then wait a few hours and run verify again."
    );
  }
  fail("Spotify API returned 403. See messages above.");
}

console.log("\n✓ Spotify integration looks OK. Restart the app if the widget still shows an error.\n");
