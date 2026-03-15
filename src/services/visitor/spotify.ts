import { logNonCriticalError } from "@/lib/logging";

export interface SpotifyNowPlaying {
  isPlaying: boolean;
  isRecentlyPlayed?: boolean;
  status?: "playing" | "recently_played" | "idle" | "error";
  title?: string;
  artist?: string;
  album?: string;
  albumImageUrl?: string;
  songUrl?: string;
  playedAt?: string;
  message?: string;
}

const SPOTIFY_NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;
const SPOTIFY_TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

const SPOTIFY_RECENTLY_PLAYED_ENDPOINT = `https://api.spotify.com/v1/me/player/recently-played?limit=1`;
const LAST_KNOWN_TTL_MS = 5 * 60 * 1000;

let lastKnownSpotify: SpotifyNowPlaying | null = null;
let lastKnownAt = 0;

const idleState = (message?: string): SpotifyNowPlaying => ({
  isPlaying: false,
  status: "idle",
  message,
});

const errorState = (message = "Unable to load Spotify status."): SpotifyNowPlaying => ({
  isPlaying: false,
  status: "error",
  message,
});

const saveLastKnownSpotify = (data: SpotifyNowPlaying) => {
  const canCache = data.status === "playing" || data.status === "recently_played";
  if (!canCache) {
    return;
  }

  lastKnownSpotify = {
    ...data,
    isPlaying: false,
    isRecentlyPlayed: true,
    status: "recently_played",
  };
  lastKnownAt = Date.now();
};

const getLastKnownSpotify = (message?: string): SpotifyNowPlaying | null => {
  if (!lastKnownSpotify) {
    return null;
  }

  if (Date.now() - lastKnownAt > LAST_KNOWN_TTL_MS) {
    return null;
  }

  return {
    ...lastKnownSpotify,
    isPlaying: false,
    isRecentlyPlayed: true,
    status: "recently_played",
    message: message ?? lastKnownSpotify.message ?? "Showing last known Spotify track.",
  };
};

const getAccessToken = async () => {
  if (!client_id || !client_secret || !refresh_token) {
    throw new Error("Missing Spotify environment variables.");
  }

  const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");

  const response = await fetch(SPOTIFY_TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refresh_token || "",
    }),
  });

  if (!response.ok) {
    throw new Error(`Spotify token request failed with status ${response.status}.`);
  }

  const data = await response.json();
  if (data.error) {
    throw new Error(`Spotify token error: ${data.error} - ${data.error_description}`);
  }
  return data;
};

export const getNowPlaying = async (): Promise<SpotifyNowPlaying> => {
  try {
    const { access_token } = await getAccessToken();

    const response = await fetch(SPOTIFY_NOW_PLAYING_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      next: {
        revalidate: 30,
      },
    });

    if (response.status === 204) {
      return getRecentlyPlayed(access_token);
    }

    if (response.status === 429) {
      const retryAfter = response.headers.get("Retry-After");
      const fallbackMessage = retryAfter
        ? `Spotify rate limited. Showing last track (retry after ${retryAfter}s).`
        : "Spotify rate limited. Showing last track.";

      const cachedTrack = getLastKnownSpotify(fallbackMessage);
      if (cachedTrack) {
        return cachedTrack;
      }

      const fallbackTrack = await getRecentlyPlayed(access_token);
      if (fallbackTrack.status === "recently_played") {
        return fallbackTrack;
      }

      return idleState("Spotify rate limited. Last track not available.");
    }

    if (response.status >= 400) {
      const fallbackTrack = await getRecentlyPlayed(access_token);
      if (fallbackTrack.status === "recently_played") {
        return fallbackTrack;
      }
      return errorState("Spotify is currently unavailable.");
    }

    const song = await response.json();

    if (!song.item) {
      return getRecentlyPlayed(access_token);
    }

    const isPlaying = song.is_playing;
    const title = song.item.name;
    const artist = song.item.artists.map((_artist: { name: string }) => _artist.name).join(", ");
    const album = song.item.album.name;
    const albumImageUrl = song.item.album.images[0]?.url;
    const songUrl = song.item.external_urls.spotify;
    const playedAt = song.timestamp ? new Date(song.timestamp).toISOString() : undefined;

    if (!isPlaying) {
      const recentlyPlayedResult: SpotifyNowPlaying = {
        isPlaying: false,
        isRecentlyPlayed: true,
        status: "recently_played",
        title,
        artist,
        album,
        albumImageUrl,
        songUrl,
        playedAt,
      };

      saveLastKnownSpotify(recentlyPlayedResult);
      return recentlyPlayedResult;
    }

    const nowPlayingResult: SpotifyNowPlaying = {
      isPlaying,
      status: "playing",
      title,
      artist,
      album,
      albumImageUrl,
      songUrl,
      playedAt,
    };

    saveLastKnownSpotify(nowPlayingResult);
    return nowPlayingResult;
  } catch (error) {
    logNonCriticalError("Error fetching Spotify now playing:", error instanceof Error ? error.message : "Unknown error");
    const cachedTrack = getLastKnownSpotify("Spotify temporarily unavailable. Showing last track.");
    if (cachedTrack) {
      return cachedTrack;
    }
    return errorState();
  }
};

const getRecentlyPlayed = async (access_token: string): Promise<SpotifyNowPlaying> => {
  try {
    const response = await fetch(SPOTIFY_RECENTLY_PLAYED_ENDPOINT, {
      headers: { Authorization: `Bearer ${access_token}` },
      next: { revalidate: 60 },
    });

    if (response.status === 429) {
      const retryAfter = response.headers.get("Retry-After");
      const fallbackMessage = retryAfter
        ? `Spotify rate limited. Showing last track (retry after ${retryAfter}s).`
        : "Spotify rate limited. Showing last track.";

      const cachedTrack = getLastKnownSpotify(fallbackMessage);
      if (cachedTrack) {
        return cachedTrack;
      }

      return idleState("Spotify rate limited. Last track not available.");
    }

    if (!response.ok) return idleState();

    const data = await response.json();
    const recentlyPlayedItem = data.items?.[0];
    const item = recentlyPlayedItem?.track;
    if (!item) return idleState("No recent Spotify activity.");

    const recentlyPlayedResult: SpotifyNowPlaying = {
      isPlaying: false,
      isRecentlyPlayed: true,
      status: "recently_played",
      title: item.name,
      artist: item.artists.map((a: { name: string }) => a.name).join(", "),
      album: item.album.name,
      albumImageUrl: item.album.images[0]?.url,
      songUrl: item.external_urls.spotify,
      playedAt: recentlyPlayedItem.played_at,
      message: "Last played on Spotify.",
    };

    saveLastKnownSpotify(recentlyPlayedResult);
    return recentlyPlayedResult;
  } catch {
    const cachedTrack = getLastKnownSpotify("Spotify temporarily unavailable. Showing last track.");
    if (cachedTrack) {
      return cachedTrack;
    }
    return idleState();
  }
};
