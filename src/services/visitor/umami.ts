import {
  UmamiStats,
  UmamiMetric,
  UmamiActiveResponse,
  UmamiAnalyticsData,
  EMPTY_ANALYTICS,
} from "@/commons/types/umami";
import { logNonCriticalError } from "@/lib/logging";

// Configurable so the same code works against Umami Cloud OR a self-hosted instance.
//   Cloud:       UMAMI_API_URL=https://api.umami.is/v1   (data API needs a Pro plan)
//   Self-hosted: UMAMI_API_URL=https://umami.example.com/api  (all features, free)
const UMAMI_API_URL = process.env.UMAMI_API_URL ?? "https://api.umami.is/v1";
const WEBSITE_ID = process.env.UMAMI_WEBSITE_ID ?? "3344dd5c-2e88-4ae5-95f7-e142cdbff614";

// Auth: either a static API key (Cloud Pro / self-host API key) OR username+password
// login (self-hosted → POST /auth/login returns a JWT we cache and send as Bearer).
const API_KEY = process.env.UMAMI_API_KEY;
const UMAMI_USERNAME = process.env.UMAMI_USERNAME;
const UMAMI_PASSWORD = process.env.UMAMI_PASSWORD;

let cachedToken: { token: string; expiresAt: number } | null = null;
let loginInFlight: Promise<string | null> | null = null;

// Umami's stats endpoint may return either flat numbers or { value, prev } objects
// depending on API version. Normalize both into the flat UmamiStats shape.
function normalizeStats(raw: any): UmamiStats {
  const toNum = (v: any) =>
    typeof v === "object" && v !== null ? Number(v.value ?? 0) : Number(v ?? 0);
  const toPrev = (v: any) =>
    typeof v === "object" && v !== null ? Number(v.prev ?? 0) : 0;

  const pageviews = toNum(raw.pageviews);
  const visitors = toNum(raw.visitors);
  const visits = toNum(raw.visits);
  const bounces = toNum(raw.bounces);
  const totaltime = toNum(raw.totaltime);

  const hasComparison = typeof raw.pageviews === "object" && raw.pageviews !== null;

  return {
    pageviews,
    visitors,
    visits,
    bounces,
    totaltime,
    comparison: hasComparison
      ? {
          pageviews: pageviews - toPrev(raw.pageviews),
          visitors: visitors - toPrev(raw.visitors),
          visits: visits - toPrev(raw.visits),
          bounces: bounces - toPrev(raw.bounces),
          totaltime: totaltime - toPrev(raw.totaltime),
        }
      : undefined,
  };
}

// Helper to quickly add timeouts to fetches
const fetchWithTimeout = async (url: string, options: RequestInit, timeoutMs = 6000) => {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetch(url, { ...options, signal: controller.signal })
    clearTimeout(id)
    return response
  } catch (error: any) {
    clearTimeout(id)
    // Handle timeout or connection errors specifically to prevent loud crashes
    if (error.name === 'AbortError' || error.code === 'UND_ERR_CONNECT_TIMEOUT') {
      console.warn(`[Umami] Fetch timeout or connection blocked for ${url}`)
      return null
    }
    throw error
  }
}

// Resolve a Bearer token: a static API key if provided, otherwise log in (self-hosted).
// Login is comparatively slow (bcrypt + proxy), so it gets a longer timeout and
// concurrent callers share a single in-flight login.
async function getAuthToken(): Promise<string | null> {
  if (API_KEY) return API_KEY;
  if (!UMAMI_USERNAME || !UMAMI_PASSWORD) return null;

  if (cachedToken && cachedToken.expiresAt > Date.now()) return cachedToken.token;
  if (loginInFlight) return loginInFlight;

  loginInFlight = (async () => {
    try {
      // The Umami reverse proxy can return a transient 502/503/504 on cold start.
      // Retry a few times (backoff) so the first render after a server start works
      // without needing a manual browser refresh. Bad creds (4xx) or a timeout are
      // not retried — they won't recover from a quick retry.
      for (let attempt = 1; attempt <= 3; attempt++) {
        const response = await fetchWithTimeout(`${UMAMI_API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ username: UMAMI_USERNAME, password: UMAMI_PASSWORD }),
        }, 10000);

        if (response?.ok) {
          const data = await response.json();
          if (data?.token) {
            cachedToken = { token: data.token, expiresAt: Date.now() + 50 * 60 * 1000 };
            return data.token;
          }
        }

        // No response (timeout) or a non-5xx status (e.g. 401 bad credentials): stop.
        if (!response || response.status < 500) {
          logNonCriticalError(`Umami login failed: ${response?.status ?? "no response"}`);
          return null;
        }

        // Transient upstream 5xx (cold proxy) — back off and retry.
        logNonCriticalError(`Umami login ${response.status} (attempt ${attempt}/3), retrying…`);
        if (attempt < 3) await new Promise((r) => setTimeout(r, attempt * 600));
      }

      logNonCriticalError("Umami login failed after 3 attempts (upstream 5xx)");
      return null;
    } finally {
      loginInFlight = null;
    }
  })();

  return loginInFlight;
}

/**
 * Get summarized website statistics
 */
export async function getUmamiStats(
  startAt?: number,
  endAt?: number
): Promise<UmamiStats | null> {
  // getAuthToken() already logs the specific reason on failure (login 5xx, timeout, etc.)
  const token = await getAuthToken();
  if (!token) return null;

  try {
    const now = Date.now();
    const start = startAt || now - 30 * 24 * 60 * 60 * 1000; // Default: last 30 days
    const end = endAt || now;

    const url = `${UMAMI_API_URL}/websites/${WEBSITE_ID}/stats?startAt=${start}&endAt=${end}`;

    const response = await fetchWithTimeout(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response) return null; // Handled timeout

    if (!response.ok) {
      const text = await response.text();
      logNonCriticalError(`Umami stats API returned ${response.status} - ${text.substring(0, 100)}`);
      return null;
    }

    return normalizeStats(await response.json());
  } catch (error) {
    logNonCriticalError("Failed to fetch Umami stats:", error);
    return null;
  }
}

/**
 * Get number of active visitors (last 5 minutes)
 */
export async function getActiveVisitors(): Promise<number> {
  const token = await getAuthToken();
  if (!token) return 0;

  try {
    const url = `${UMAMI_API_URL}/websites/${WEBSITE_ID}/active`;

    const response = await fetchWithTimeout(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      next: { revalidate: 60 }, // Cache for 1 minute
    });

    if (!response) return 0; // Handled timeout

    if (!response.ok) {
      logNonCriticalError(`Umami active API returned ${response.status}`);
      return 0;
    }

    const data: UmamiActiveResponse = await response.json();
    return data.visitors || 0;
  } catch (error) {
    logNonCriticalError("Failed to fetch active visitors:", error);
    return 0;
  }
}

/**
 * Get metrics for a given type (path, referrer, country, browser, device, etc.)
 */
export type UmamiMetricType =
  | "path"
  | "referrer"
  | "country"
  | "region"
  | "city"
  | "browser"
  | "device"
  | "os"
  | "language"
  | "screen"
  | "event";

export async function getUmamiMetrics(
  type: UmamiMetricType,
  limit: number = 10,
  startAt?: number,
  endAt?: number
): Promise<UmamiMetric[]> {
  const token = await getAuthToken();
  if (!token) return [];

  try {
    const now = Date.now();
    const start = startAt || now - 30 * 24 * 60 * 60 * 1000; // Default: last 30 days
    const end = endAt || now;

    const url = `${UMAMI_API_URL}/websites/${WEBSITE_ID}/metrics?startAt=${start}&endAt=${end}&type=${type}&limit=${limit}`;

    const response = await fetchWithTimeout(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response) return []; // Handled timeout

    if (!response.ok) {
      logNonCriticalError(`Umami metrics API returned ${response.status}`);
      return [];
    }

    // Umami versions differ: some return a bare array, others a wrapped object.
    // Guard so a non-array body can't crash the analytics render with .map.
    const data = await response.json().catch(() => null);
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    return [];
  } catch (error) {
    logNonCriticalError(`Failed to fetch Umami ${type} metrics:`, error);
    return [];
  }
}

/**
 * Get all analytics data in a single call
 */
export async function getUmamiAnalytics(): Promise<UmamiAnalyticsData> {
  try {
    const [stats, activeVisitors, topPages, topReferrers, countries, browsers, devices, os] =
      await Promise.all([
        getUmamiStats(),
        getActiveVisitors(),
        getUmamiMetrics("path", 10),
        getUmamiMetrics("referrer", 10),
        getUmamiMetrics("country", 10),
        getUmamiMetrics("browser", 10),
        getUmamiMetrics("device", 10),
        getUmamiMetrics("os", 10),
      ]);

    return {
      stats,
      activeVisitors,
      topPages,
      topReferrers,
      countries,
      browsers,
      os,
      devices,
    };
  } catch (error) {
    logNonCriticalError("Failed to fetch Umami analytics:", error);
    return EMPTY_ANALYTICS;
  }
}

export interface UmamiTimeseries {
  pageviews: { x: string; y: number }[];
  sessions: { x: string; y: number }[];
}

/** Pageviews + sessions time-series for charting. */
export async function getUmamiPageviews(
  startAt: number,
  endAt: number,
  unit: "hour" | "day"
): Promise<UmamiTimeseries> {
  const token = await getAuthToken();
  if (!token) return { pageviews: [], sessions: [] };

  try {
    const url = `${UMAMI_API_URL}/websites/${WEBSITE_ID}/pageviews?startAt=${startAt}&endAt=${endAt}&unit=${unit}&timezone=Asia%2FJakarta`;
    const response = await fetchWithTimeout(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      next: { revalidate: 3600 },
    });

    if (!response || !response.ok) {
      if (response) logNonCriticalError(`Umami pageviews API returned ${response.status}`);
      return { pageviews: [], sessions: [] };
    }

    const data = await response.json();
    return { pageviews: data.pageviews ?? [], sessions: data.sessions ?? [] };
  } catch (error) {
    logNonCriticalError("Failed to fetch Umami pageviews:", error);
    return { pageviews: [], sessions: [] };
  }
}

export interface FullUmamiAnalytics {
  stats: UmamiStats | null;
  activeVisitors: number;
  series: UmamiTimeseries;
  pages: UmamiMetric[];
  referrers: UmamiMetric[];
  countries: UmamiMetric[];
  regions: UmamiMetric[];
  cities: UmamiMetric[];
  browsers: UmamiMetric[];
  os: UmamiMetric[];
  devices: UmamiMetric[];
  languages: UmamiMetric[];
  screens: UmamiMetric[];
  events: UmamiMetric[];
}

/** Everything the admin analytics dashboard needs, for a given date range. */
export async function getFullUmamiAnalytics(
  startAt: number,
  endAt: number,
  unit: "hour" | "day"
): Promise<FullUmamiAnalytics> {
  const m = (type: UmamiMetricType) => getUmamiMetrics(type, 10, startAt, endAt);

  const [stats, activeVisitors, series, pages, referrers, countries, regions, cities, browsers, os, devices, languages, screens, events] =
    await Promise.all([
      getUmamiStats(startAt, endAt),
      getActiveVisitors(),
      getUmamiPageviews(startAt, endAt, unit),
      m("path"), m("referrer"), m("country"), m("region"), m("city"),
      m("browser"), m("os"), m("device"), m("language"), m("screen"), m("event"),
    ]);

  return { stats, activeVisitors, series, pages, referrers, countries, regions, cities, browsers, os, devices, languages, screens, events };
}
