import { cache } from "react";
import { unstable_cache } from "next/cache";
import {
  UmamiStats,
  UmamiMetric,
  UmamiActiveResponse,
  UmamiAnalyticsData,
  UmamiPageviewData,
  EMPTY_ANALYTICS,
} from "@/commons/types/umami";
import { logNonCriticalError } from "@/lib/logging";

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

// Read lazily with `||`: compose maps unset vars to "", which must count as missing (fail closed).
const config = () => ({
  apiUrl: process.env.UMAMI_API_URL || "",
  websiteId: process.env.UMAMI_WEBSITE_ID || "",
  apiKey: process.env.UMAMI_API_KEY || "",
  username: process.env.UMAMI_USERNAME || "",
  password: process.env.UMAMI_PASSWORD || "",
});

let cachedToken: { token: string; expiresAt: number } | null = null;
let loginInFlight: Promise<string | null> | null = null;

/** Rounds a timestamp down to `step` ms so cache keys only change once per step. */
export const floorTo = (ms: number, step: number) => Math.floor(ms / step) * step;

const lastDays = (days: number, step: number) => {
  const end = floorTo(Date.now(), step);
  return [end - days * DAY, end] as const;
};

const isUnreachable = (error: unknown) => {
  const err = error as { name?: string; cause?: { code?: string } } | null;
  const code = err?.cause?.code ?? "";
  return err?.name === "TimeoutError" || err?.name === "AbortError" || code === "ECONNREFUSED" || code === "ENOTFOUND" || code.startsWith("UND_ERR_");
};

const logFailure = (what: string, error: unknown) => {
  const err = error as { name?: string; cause?: { code?: string } };
  if (isUnreachable(error)) logNonCriticalError(`[Umami] ${what}: unreachable (${err.cause?.code ?? err.name})`);
  else logNonCriticalError(`[Umami] ${what} failed:`, error);
};

// v3 /stats returns flat numbers plus `comparison` (previous period); v2 returned { value, prev }.
// Either way `comparison` here becomes the change versus the previous period.
export function normalizeStats(raw: Record<string, unknown>): UmamiStats {
  const keys = ["pageviews", "visitors", "visits", "bounces", "totaltime"] as const;
  const prevRaw = (raw.comparison ?? null) as Record<string, unknown> | null;
  const value = (v: unknown) => Number((v && typeof v === "object" ? (v as { value?: unknown }).value : v) ?? 0) || 0;
  const prev = (k: (typeof keys)[number]) => {
    const v = raw[k];
    if (v && typeof v === "object" && "prev" in v) return value((v as { prev?: unknown }).prev);
    return prevRaw ? value(prevRaw[k]) : null;
  };

  const stats = Object.fromEntries(keys.map((k) => [k, value(raw[k])])) as Omit<UmamiStats, "comparison">;
  const hasComparison = keys.some((k) => prev(k) !== null);
  return {
    ...stats,
    comparison: hasComparison
      ? (Object.fromEntries(keys.map((k) => [k, stats[k] - (prev(k) ?? 0)])) as UmamiStats["comparison"])
      : undefined,
  };
}

/** Zero-fills a daily series to exactly `days` points (Asia/Jakarta calendar days, oldest first). */
export function fillDays(series: UmamiPageviewData[], days: number, now = Date.now()): UmamiPageviewData[] {
  const totals = new Map<string, number>();
  for (const point of series) {
    const day = String(point.x).slice(0, 10);
    totals.set(day, (totals.get(day) ?? 0) + (Number(point.y) || 0));
  }
  return Array.from({ length: days }, (_, i) => {
    const day = new Date(now - (days - 1 - i) * DAY).toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" });
    return { x: day, y: totals.get(day) ?? 0 };
  });
}

// Static API key, or self-hosted login (JWT cached ~50 min; concurrent callers share one login).
async function getAuthToken(): Promise<string | null> {
  const { apiUrl, apiKey, username, password } = config();
  if (apiKey) return apiKey;
  if (!username || !password) return null;
  if (cachedToken && cachedToken.expiresAt > Date.now()) return cachedToken.token;
  if (loginInFlight) return loginInFlight;

  loginInFlight = (async () => {
    try {
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const response = await fetch(`${apiUrl}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({ username, password }),
            signal: AbortSignal.timeout(5000),
          });
          if (response.ok) {
            const data = await response.json();
            if (!data?.token) return null;
            cachedToken = { token: data.token, expiresAt: Date.now() + 50 * MINUTE };
            return data.token as string;
          }
          // Bad credentials won't fix themselves; only a cold-proxy 5xx is worth the one retry.
          logNonCriticalError(`[Umami] login returned ${response.status}`);
          if (response.status < 500) return null;
        } catch (error) {
          logFailure("login", error);
        }
      }
      return null;
    } finally {
      loginInFlight = null;
    }
  })();

  return loginInFlight;
}

async function umamiGet<T>(path: string, retried = false): Promise<T | null> {
  const { apiUrl, websiteId, apiKey } = config();
  if (!apiUrl || !websiteId) return null;

  try {
    const token = await getAuthToken();
    if (!token) return null;

    const response = await fetch(`${apiUrl}/websites/${websiteId}${path}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      signal: AbortSignal.timeout(4000),
    });

    if (response.status === 401 && !retried && !apiKey) {
      cachedToken = null;
      return umamiGet<T>(path, true);
    }
    if (!response.ok) {
      logNonCriticalError(`[Umami] ${path.split("?")[0]} returned ${response.status}`);
      return null;
    }
    return (await response.json()) as T;
  } catch (error) {
    logFailure(path.split("?")[0], error);
    return null;
  }
}

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

export interface UmamiTimeseries {
  pageviews: UmamiPageviewData[];
  sessions: UmamiPageviewData[];
}

const EMPTY_SERIES: UmamiTimeseries = { pageviews: [], sessions: [] };

// unstable_cache keeps whatever resolves, so the cached fetchers reject on failure (a transient outage
// is retried next render instead of being served for the whole window); the exported getters catch.
async function umamiFetch<T>(path: string): Promise<T> {
  const data = await umamiGet<T>(path);
  if (data === null) throw new Error(`[Umami] ${path.split("?")[0]} unavailable`);
  return data;
}

const fetchStats = async (startAt: number, endAt: number): Promise<UmamiStats> =>
  normalizeStats(await umamiFetch<Record<string, unknown>>(`/stats?startAt=${startAt}&endAt=${endAt}`));

const fetchActive = async (): Promise<number> => {
  const data = await umamiFetch<UmamiActiveResponse>("/active");
  return Number(data?.visitors) || 0;
};

const fetchMetrics = async (type: UmamiMetricType, limit: number, startAt: number, endAt: number): Promise<UmamiMetric[]> => {
  // Versions differ: a bare array or { data: [] }.
  const data = await umamiFetch<UmamiMetric[] | { data?: UmamiMetric[] }>(
    `/metrics?startAt=${startAt}&endAt=${endAt}&type=${type}&limit=${limit}`,
  );
  if (Array.isArray(data)) return data;
  return Array.isArray(data?.data) ? data.data : [];
};

const fetchPageviews = async (startAt: number, endAt: number, unit: "hour" | "day"): Promise<UmamiTimeseries> => {
  const data = await umamiFetch<Partial<UmamiTimeseries>>(
    `/pageviews?startAt=${startAt}&endAt=${endAt}&unit=${unit}&timezone=Asia%2FJakarta`,
  );
  return { pageviews: data?.pageviews ?? [], sessions: data?.sessions ?? [] };
};

// unstable_cache keys include the (floored) arguments, so each window is fetched once per revalidate.
const cachedStats = unstable_cache(fetchStats, ["umami-stats"], { revalidate: 3600 });
const cachedActive = unstable_cache(fetchActive, ["umami-active"], { revalidate: 30 });
const cachedMetrics = unstable_cache(fetchMetrics, ["umami-metrics"], { revalidate: 3600 });
const cachedPageviews = unstable_cache(fetchPageviews, ["umami-pageviews"], { revalidate: 3600 });

/** Summary stats; defaults to the last 30 days, floored to the hour. */
export async function getUmamiStats(startAt?: number, endAt?: number): Promise<UmamiStats | null> {
  const [start, end] = startAt && endAt ? [startAt, endAt] : lastDays(30, HOUR);
  return cachedStats(start, end).catch(() => null);
}

/** Visitors active in the last five minutes (cached 30 s, 0 on any failure). */
export const getActiveVisitors = (): Promise<number> => cachedActive().catch(() => 0);

export async function getUmamiMetrics(type: UmamiMetricType, limit = 10, startAt?: number, endAt?: number): Promise<UmamiMetric[]> {
  const [start, end] = startAt && endAt ? [startAt, endAt] : lastDays(30, HOUR);
  return cachedMetrics(type, limit, start, end).catch(() => []);
}

/** Pageviews + sessions time-series (Asia/Jakarta buckets). */
export function getUmamiPageviews(startAt: number, endAt: number, unit: "hour" | "day"): Promise<UmamiTimeseries> {
  return cachedPageviews(startAt, endAt, unit).catch(() => EMPTY_SERIES);
}

/** Daily pageviews + sessions for the last `days` days, zero-filled, oldest first. */
export async function getDailyPageviews(days = 30): Promise<UmamiTimeseries> {
  const end = floorTo(Date.now(), HOUR);
  // Start at Jakarta midnight (WIB is UTC+7, no DST) so the oldest bucket is a whole day.
  const start = floorTo(end + 7 * HOUR - (days - 1) * DAY, DAY) - 7 * HOUR;
  const { pageviews, sessions } = await cachedPageviews(start, end, "day").catch(() => EMPTY_SERIES);
  return { pageviews: fillDays(pageviews, days, end), sessions: fillDays(sessions, days, end) };
}

const normalizePath = (path: string) => (path.length > 1 ? path.replace(/\/+$/, "") : path);

/**
 * Readers per path over the last 30 days (`/blog/{slug}`, `/project/{id}`, …, trailing slash stripped).
 * One Umami call per hour; React `cache` dedupes the Map within a render.
 */
export const getPathReads = cache(async (): Promise<Map<string, number>> => {
  const [start, end] = lastDays(30, HOUR);
  const reads = new Map<string, number>();
  for (const { x, y } of await cachedMetrics("path", 500, start, end).catch(() => [])) {
    const path = normalizePath(x);
    reads.set(path, (reads.get(path) ?? 0) + y);
  }
  return reads;
});

/** Everything the home Readers section needs (public, hourly). */
export async function getUmamiAnalytics(): Promise<UmamiAnalyticsData> {
  try {
    const [stats, activeVisitors, topPages, topReferrers, countries, browsers, devices, os] = await Promise.all([
      getUmamiStats(),
      getActiveVisitors(),
      getUmamiMetrics("path", 10),
      getUmamiMetrics("referrer", 10),
      getUmamiMetrics("country", 10),
      getUmamiMetrics("browser", 10),
      getUmamiMetrics("device", 10),
      getUmamiMetrics("os", 10),
    ]);
    return { stats, activeVisitors, topPages, topReferrers, countries, browsers, os, devices };
  } catch (error) {
    logNonCriticalError("[Umami] analytics bundle failed:", error);
    return EMPTY_ANALYTICS;
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

type AdminBundle = Omit<FullUmamiAnalytics, "activeVisitors">;

const fetchAdminBundle = async (startAt: number, endAt: number, unit: "hour" | "day"): Promise<AdminBundle> => {
  const m = (type: UmamiMetricType) => fetchMetrics(type, 10, startAt, endAt).catch((): UmamiMetric[] => []);
  const [stats, series, pages, referrers, countries, regions, cities, browsers, os, devices, languages, screens, events] =
    await Promise.all([
      fetchStats(startAt, endAt).catch(() => null),
      fetchPageviews(startAt, endAt, unit).catch(() => EMPTY_SERIES),
      m("path"), m("referrer"), m("country"), m("region"), m("city"),
      m("browser"), m("os"), m("device"), m("language"), m("screen"), m("event"),
    ]);
  // Without stats Umami is down: reject so the empty window is not cached for five minutes.
  if (!stats) throw new Error("[Umami] admin bundle unavailable");
  return { stats, series, pages, referrers, countries, regions, cities, browsers, os, devices, languages, screens, events };
};

const EMPTY_ADMIN_BUNDLE: AdminBundle = {
  stats: null, series: EMPTY_SERIES, pages: [], referrers: [], countries: [], regions: [], cities: [],
  browsers: [], os: [], devices: [], languages: [], screens: [], events: [],
};

const cachedAdminBundle = unstable_cache(fetchAdminBundle, ["umami-admin"], { revalidate: 300 });

/** Everything the admin analytics dashboard needs; the window is floored to 5 minutes. */
export async function getFullUmamiAnalytics(startAt: number, endAt: number, unit: "hour" | "day"): Promise<FullUmamiAnalytics> {
  const end = floorTo(endAt, 5 * MINUTE);
  const [bundle, activeVisitors] = await Promise.all([
    cachedAdminBundle(end - (endAt - startAt), end, unit).catch(() => EMPTY_ADMIN_BUNDLE),
    getActiveVisitors(),
  ]);
  return { ...bundle, activeVisitors };
}
