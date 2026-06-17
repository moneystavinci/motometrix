"use client";

import { useEffect, useState } from "react";
import DashboardNav from "./DashboardNav";
import KPICards from "./KPICards";
import VisitorChart from "./VisitorChart";
import TopPages from "./TopPages";
import TopKeywords from "./TopKeywords";
import DemoBanner from "./DemoBanner";
import SiteAuditCTA from "./SiteAuditCTA";
import {
  GA4Metrics,
  SearchConsoleMetrics,
  getMockGA4Metrics,
  getMockSearchConsoleMetrics,
} from "@/types/analytics";

interface DashboardShellProps {
  user: {
    name: string;
    email: string;
    image: string | null;
  };
}

interface AnalyticsData {
  ga4: GA4Metrics;
  searchConsole: SearchConsoleMetrics;
  isDemo: boolean;
}

export default function DashboardShell({ user }: DashboardShellProps) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/analytics");
        if (!res.ok) throw new Error("Failed to fetch");
        const json = await res.json();
        setData(json);
      } catch {
        // Graceful fallback to demo data on any failure
        setData({
          ga4: getMockGA4Metrics(),
          searchConsole: getMockSearchConsoleMetrics(),
          isDemo: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const firstName = user.name.split(" ")[0];

  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(160deg, #060d1f 0%, #0a1530 40%, #0f1f45 100%)" }}
    >
      {/* Background grid */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10">
        <DashboardNav user={user} />

        <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
          {/* Welcome header */}
          <div className="opacity-0 animate-fade-up">
            <p className="text-navy-300 text-sm mb-1">
              {getGreeting()}, {firstName}
            </p>
            <div className="flex items-end gap-4">
              <h1
                className="text-white leading-none"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
                  fontWeight: 700,
                }}
              >
                Your Website Performance
              </h1>
              <span className="text-navy-300 text-sm mb-1 hidden md:block">
                Last 30 days
              </span>
            </div>
            <div className="gold-line mt-3" />
          </div>

          {/* Demo banner */}
          {data?.isDemo && !loading && <DemoBanner />}

          {/* KPI Cards — Row 1 */}
          <div className="opacity-0 animate-fade-up animate-delay-100">
            <KPICards ga4={data?.ga4 ?? null} loading={loading} />
          </div>

          {/* Visitor Trend Chart — Row 2 */}
          <div className="opacity-0 animate-fade-up animate-delay-200">
            <VisitorChart data={data?.ga4?.dailyVisitors ?? null} loading={loading} />
          </div>

          {/* Bottom Row — Pages + Keywords */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 opacity-0 animate-fade-up animate-delay-300">
            <TopPages pages={data?.ga4?.topPages ?? null} loading={loading} />
            <TopKeywords keywords={data?.searchConsole?.topKeywords ?? null} loading={loading} />
          </div>

          {/* Site Audit CTA */}
          <div className="opacity-0 animate-fade-up animate-delay-300">
            <SiteAuditCTA />
          </div>

          {/* Footer */}
          <div className="text-center pt-4 pb-8">
            <p className="text-navy-300 text-xs opacity-40">
              Motometrix · Data refreshes on each visit
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}
