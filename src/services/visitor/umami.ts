import {
  UmamiStats,
  UmamiMetric,
  UmamiActiveResponse,
  UmamiAnalyticsData,
  EMPTY_ANALYTICS,
} from "@/commons/types/umami";

const UMAMI_API_URL = "https://api.umami.is/v1";
const WEBSITE_ID = "3344dd5c-2e88-4ae5-95f7-e142cdbff614";
const API_KEY = process.env.UMAMI_API_KEY;

/**
 * Get summarized website statistics
 */
export async function getUmamiStats(
  startAt?: number,
  endAt?: number
): Promise<UmamiStats | null> {
  if (!API_KEY) {
    console.warn("UMAMI_API_KEY not configured");
    return null;
  }

  try {
    const now = Date.now();
    const start = startAt || now - 30 * 24 * 60 * 60 * 1000; // Default: last 30 days
    const end = endAt || now;

    const url = `${UMAMI_API_URL}/websites/${WEBSITE_ID}/stats?startAt=${start}&endAt=${end}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        Accept: "application/json",
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      const text = await response.text();
      console.error(`Umami stats API returned ${response.status}: ${text.slice(0, 100)}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch Umami stats:", error);
    return null;
  }
}

/**
 * Get number of active visitors (last 5 minutes)
 */
export async function getActiveVisitors(): Promise<number> {
  if (!API_KEY) {
    return 0;
  }

  try {
    const url = `${UMAMI_API_URL}/websites/${WEBSITE_ID}/active`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        Accept: "application/json",
      },
      next: { revalidate: 60 }, // Cache for 1 minute
    });

    if (!response.ok) {
      console.error(`Umami active API returned ${response.status}`);
      return 0;
    }

    const data: UmamiActiveResponse = await response.json();
    return data.visitors || 0;
  } catch (error) {
    console.error("Failed to fetch active visitors:", error);
    return 0;
  }
}

/**
 * Get metrics for a given type (path, referrer, country, browser, device, etc.)
 */
export async function getUmamiMetrics(
  type: "url" | "referrer" | "country" | "browser" | "device" | "os",
  limit: number = 10,
  startAt?: number,
  endAt?: number
): Promise<UmamiMetric[]> {
  if (!API_KEY) {
    return [];
  }

  try {
    const now = Date.now();
    const start = startAt || now - 30 * 24 * 60 * 60 * 1000; // Default: last 30 days
    const end = endAt || now;

    const url = `${UMAMI_API_URL}/websites/${WEBSITE_ID}/metrics?startAt=${start}&endAt=${end}&type=${type}&limit=${limit}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        Accept: "application/json",
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      console.error(`Umami metrics API returned ${response.status}`);
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch Umami ${type} metrics:`, error);
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
        getUmamiMetrics("url", 10),
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
    console.error("Failed to fetch Umami analytics:", error);
    return EMPTY_ANALYTICS;
  }
}
