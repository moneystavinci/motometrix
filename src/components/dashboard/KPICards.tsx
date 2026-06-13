"use client";

import type { ReactNode } from "react";
import type { GA4Metrics } from "@/types/analytics";
import { formatNumber, formatDuration } from "@/lib/utils";

interface KPICardsProps {
  ga4: GA4Metrics | null;
  loading: boolean;
}

export default function KPICards({ ga4, loading }: KPICardsProps) {
  const cards: Array<{
    label: string;
    tooltip: string;
    value: string;
    subValue: string | null;
    icon: ReactNode;
    accent: string;
    valueColor?: string;
  }> = [
    {
      label: "Total Visitors",
      tooltip: "Unique people who visited your site in the last 30 days",
      value: ga4 ? formatNumber(ga4.totalVisitors) : "—",
      subValue: ga4
        ? `vs. ${formatNumber(ga4.previousPeriodVisitors)} last month`
        : null,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      accent: "#e6b820",
    },
    {
      label: "Monthly Growth",
      tooltip: "How much your visitor count has changed vs. the previous 30 days",
      value: ga4 ? `${ga4.growthPercent > 0 ? "+" : ""}${ga4.growthPercent}%` : "—",
      subValue: ga4
        ? ga4.growthPercent >= 0
          ? "Traffic is growing"
          : "Traffic declined"
        : null,
      valueColor:
        ga4
          ? ga4.growthPercent >= 0
            ? "#4ade80"
            : "#f87171"
          : "white",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <polyline
            points="22 7 13.5 15.5 8.5 10.5 2 17"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polyline
            points="16 7 22 7 22 13"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      accent: "#4ade80",
    },
    {
      label: "Top Traffic Source",
      tooltip: "Where most of your visitors are coming from",
      value: ga4?.topSource ?? "—",
      subValue: ga4
        ? `${formatDuration(ga4.avgSessionDurationSeconds)} avg. time on site`
        : null,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="2" />
          <path
            d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      ),
      accent: "#7a96c8",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {cards.map((card, idx) => (
        <div
          key={card.label}
          className="glass-card rounded-2xl p-6 relative overflow-hidden group transition-all duration-300"
          style={{
            animationDelay: `${idx * 80}ms`,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.boxShadow =
              "0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)";
            (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.boxShadow = "";
            (e.currentTarget as HTMLDivElement).style.transform = "";
          }}
        >
          {/* Accent line at top */}
          <div
            className="absolute top-0 left-6 right-6 h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${card.accent}60, transparent)` }}
          />

          {/* Icon */}
          <div
            className="inline-flex items-center justify-center w-10 h-10 rounded-xl mb-4"
            style={{ background: `${card.accent}18`, color: card.accent }}
          >
            {card.icon}
          </div>

          {/* Label */}
          <p className="text-navy-300 text-xs font-medium tracking-wide uppercase mb-2">
            {card.label}
          </p>

          {/* Value */}
          {loading ? (
            <div className="skeleton h-9 w-28 mb-2" />
          ) : (
            <p
              className="font-bold leading-none mb-2"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
                color: card.valueColor ?? "white",
              }}
            >
              {card.value}
            </p>
          )}

          {/* Sub value */}
          {loading ? (
            <div className="skeleton h-4 w-36" />
          ) : (
            card.subValue && (
              <p className="text-navy-300 text-xs">{card.subValue}</p>
            )
          )}
        </div>
      ))}
    </div>
  );
}
