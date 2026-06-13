"use client";

import { formatNumber } from "@/lib/utils";

interface Page {
  page: string;
  visitors: number;
}

interface TopPagesProps {
  pages: Page[] | null;
  loading: boolean;
}

function cleanPagePath(path: string): string {
  if (path === "/" || path === "") return "Home page";
  return path
    .replace(/^\//, "")
    .replace(/-/g, " ")
    .replace(/\//g, " › ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function TopPages({ pages, loading }: TopPagesProps) {
  const maxVisitors = pages?.[0]?.visitors ?? 1;

  return (
    <div className="glass-card rounded-2xl p-6">
      {/* Header */}
      <div className="mb-5">
        <p className="text-navy-300 text-xs font-medium tracking-wide uppercase mb-1">
          Top Content
        </p>
        <h2
          className="text-white font-semibold"
          style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem" }}
        >
          5 Best-Performing Pages
        </h2>
      </div>

      {/* List */}
      <div className="space-y-4">
        {loading
          ? [...Array(5)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="skeleton h-4 w-3/4" />
                <div className="skeleton h-1.5 w-full rounded-full" />
              </div>
            ))
          : (pages ?? []).map((page, idx) => {
              const pct = Math.round((page.visitors / maxVisitors) * 100);
              return (
                <div key={page.page}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-xs font-mono w-5"
                        style={{ color: idx === 0 ? "#e6b820" : "#8892a4" }}
                      >
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span className="text-white text-sm truncate max-w-[180px]">
                        {cleanPagePath(page.page)}
                      </span>
                    </div>
                    <span className="text-navy-300 text-xs font-medium ml-3 shrink-0">
                      {formatNumber(page.visitors)} visitors
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="h-1 rounded-full bg-navy-800 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${pct}%`,
                        background:
                          idx === 0
                            ? "linear-gradient(90deg, #e6b820, #f5c842)"
                            : "rgba(122,150,200,0.5)",
                      }}
                    />
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
}
