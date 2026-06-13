# Spotify Widget Setup

The portfolio sidebar and `/api/spotify` endpoint need three environment variables at **runtime** (Azure App Service Application Settings, or local `.env`):

| Variable | Description |
| --- | --- |
| `SPOTIFY_CLIENT_ID` | From [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) |
| `SPOTIFY_CLIENT_SECRET` | App client secret |
| `SPOTIFY_REFRESH_TOKEN` | Long-lived user token (see below) |

Required OAuth scopes:

- `user-read-currently-playing`
- `user-read-recently-played`

**Spotify Premium** is required for the Spotify account that owns the Developer app. Without Premium, the Web API returns HTTP 403 with: `Active premium subscription required for the owner of the app` — this is not a scope or token problem.

## 1. Spotify Developer Dashboard

1. Open your app in the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
2. Add a **Redirect URI** (e.g. `http://127.0.0.1:8888/callback` for local token generation).
3. Copy **Client ID** and **Client Secret**.

## 2. Get authorization code

Replace `YOUR_CLIENT_ID` and open this URL in a browser (while logged into Spotify):

```
https://accounts.spotify.com/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=http%3A%2F%2F127.0.0.1%3A8888%2Fcallback&scope=user-read-currently-playing%20user-read-recently-played
```

After approving, copy the `code` query parameter from the redirect URL.

## 3. Exchange code for refresh token

```bash
curl -X POST "https://accounts.spotify.com/api/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -u "YOUR_CLIENT_ID:YOUR_CLIENT_SECRET" \
  -d "grant_type=authorization_code" \
  -d "code=YOUR_AUTHORIZATION_CODE" \
  -d "redirect_uri=http://127.0.0.1:8888/callback"
```

Save the `refresh_token` from the JSON response (not the short-lived `access_token`).

## 4. Configure production (Azure)

1. Azure Portal → App Service **portfolio-v3** → **Configuration** → **Application settings**.
2. Add or update:
   - `SPOTIFY_CLIENT_ID`
   - `SPOTIFY_CLIENT_SECRET`
   - `SPOTIFY_REFRESH_TOKEN`
3. Save and restart the app.

## 5. GitHub Actions secrets

Add the same three values as repository secrets. The deploy workflow passes them at build time; runtime still uses Azure Application Settings.

| Secret | Used in workflow |
| --- | --- |
| `SPOTIFY_CLIENT_ID` | Yes |
| `SPOTIFY_CLIENT_SECRET` | Yes |
| `SPOTIFY_REFRESH_TOKEN` | Yes |

## 6. Verify

```bash
curl https://YOUR_DOMAIN/api/spotify
```

Expected when working:

```json
{
  "isPlaying": true,
  "status": "playing",
  "title": "...",
  "artist": "..."
}
```

If you see `"status": "error"`, check the `message` field and Azure application logs.

## Helper script (recommended)

From the `portfolio-v3` folder:

```bash
npm run spotify:token
```

The script starts a **local server** on `http://127.0.0.1:8888/callback`, opens Spotify in your browser, and prints `SPOTIFY_REFRESH_TOKEN` when you approve access.

If the browser shows **"can't reach this page"** before you log in, that is normal — complete login on Spotify first; after you click **Agree**, the callback page will show **Success**.

Manual fallback: if the tab errors but the address bar contains `?code=AQB...`, copy only the `code` value and run the old flow, or run `npm run spotify:token` again with the server running.

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| `Spotify credentials not configured` | Set all three env vars on Azure and restart |
| `Spotify token expired` | Regenerate refresh token (steps above) |
| `Spotify missing scopes` | Re-authorize with both scopes in step 2 |
| Log: `refresh token rotated` | Copy new `refresh_token` from logs/token response into `SPOTIFY_REFRESH_TOKEN` |
| OAuth `server_error` on callback | App **Development Mode**: add your Spotify email under **User Management**. Redirect URI must be exactly `http://127.0.0.1:8888/callback` (not `localhost`). Log out of Spotify and retry in incognito. Client ID in `.env` must match the app where URI is saved. |

### `server_error` detail

This error comes **from Spotify** after you click Agree — your local server is working (it received the redirect).

Most common fix: [Developer Dashboard](https://developer.spotify.com/dashboard) → your app → **User Management** → **Add user** → enter the email of the Spotify account you use to log in.

Also confirm **Redirect URIs** uses `http://127.0.0.1:8888/callback` exactly (Spotify does not allow `localhost` for new apps).
