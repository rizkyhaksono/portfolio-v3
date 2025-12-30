export interface UmamiStats {
  pageviews: number;
  visitors: number;
  visits: number;
  bounces: number;
  totaltime: number;
  comparison?: {
    pageviews: number;
    visitors: number;
    visits: number;
    bounces: number;
    totaltime: number;
  };
}

export interface UmamiMetric {
  x: string;
  y: number;
}

export interface UmamiActiveResponse {
  visitors: number;
}

export interface UmamiPageviewData {
  x: string;
  y: number;
}

export interface UmamiPageviews {
  pageviews: UmamiPageviewData[];
  sessions: UmamiPageviewData[];
}

export interface UmamiAnalyticsData {
  stats: UmamiStats | null;
  activeVisitors: number;
  topPages: UmamiMetric[];
  topReferrers: UmamiMetric[];
  countries: UmamiMetric[];
  browsers: UmamiMetric[];
  devices: UmamiMetric[];
}

export const EMPTY_ANALYTICS: UmamiAnalyticsData = {
  stats: null,
  activeVisitors: 0,
  topPages: [],
  topReferrers: [],
  countries: [],
  browsers: [],
  devices: [],
};
