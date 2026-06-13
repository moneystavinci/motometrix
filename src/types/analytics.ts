/**
 * Client-safe mock data for demo/fallback mode.
 * This file contains NO server-only imports (no googleapis, prisma, etc.)
 */

export interface GA4Metrics {
  totalVisitors: number;
  avgSessionDurationSeconds: number;
  topSource: string;
  dailyVisitors: Array<{ date: string; visitors: number }>;
  topPages: Array<{ page: string; visitors: number }>;
  previousPeriodVisitors: number;
  growthPercent: number;
  propertyId: string | null;
  websiteUrl: string | null;
}

export interface SearchConsoleMetrics {
  totalClicks: number;
  totalImpressions: number;
  avgPosition: number;
  topKeywords: Array<{ keyword: string; clicks: number; position: number }>;
  isDemo: boolean;
}

export function getMockGA4Metrics(): GA4Metrics {
  const today = new Date();
  const dailyVisitors = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (29 - i));
    const base = 80 + Math.floor(Math.sin(i * 0.4) * 30) + Math.floor(Math.random() * 20);
    return {
      date: d.toISOString().split("T")[0],
      visitors: Math.max(20, base),
    };
  });

  return {
    totalVisitors: 3842,
    avgSessionDurationSeconds: 187,
    topSource: "Google Search",
    dailyVisitors,
    topPages: [
      { page: "/", visitors: 1420 },
      { page: "/about", visitors: 634 },
      { page: "/pricing", visitors: 521 },
      { page: "/blog/getting-started", visitors: 388 },
      { page: "/contact", visitors: 241 },
    ],
    previousPeriodVisitors: 3201,
    growthPercent: 20,
    propertyId: null,
    websiteUrl: null,
  };
}

export function getMockSearchConsoleMetrics(): SearchConsoleMetrics {
  return {
    totalClicks: 1247,
    totalImpressions: 18430,
    avgPosition: 8.3,
    topKeywords: [
      { keyword: "business analytics tool", clicks: 312, position: 4.1 },
      { keyword: "website metrics for founders", clicks: 198, position: 6.7 },
      { keyword: "simple google analytics", clicks: 156, position: 9.2 },
    ],
    isDemo: true,
  };
}
