"use client";

interface Keyword {
  keyword: string;
  clicks: number;
  position: number;
}

interface TopKeywordsProps {
  keywords: Keyword[] | null;
  loading: boolean;
}

function positionLabel(position: number): { label: string; color: string } {
  if (position <= 3) return { label: "Top 3", color: "#4ade80" };
  if (position <= 10) return { label: "Page 1", color: "#e6b820" };
  if (position <= 20) return { label: "Page 2", color: "#7a96c8" };
  return { label: `Pos. ${position}`, color: "#8892a4" };
}

export default function TopKeywords({ keywords, loading }: TopKeywordsProps) {
  return (
    <div className="glass-card rounded-2xl p-6">
      {/* Header */}
      <div className="mb-5">
        <p className="text-navy-300 text-xs font-medium tracking-wide uppercase mb-1">
          Google Search
        </p>
        <h2
          className="text-white font-semibold"
          style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem" }}
        >
          Top 3 Search Terms That Found You
        </h2>
      </div>

      {/* List */}
      <div className="space-y-4">
        {loading
          ? [...Array(3)].map((_, i) => (
              <div key={i} className="skeleton h-16 rounded-xl" />
            ))
          : (keywords?.slice(0, 3) ?? []).map((kw, idx) => {
              const pos = positionLabel(kw.position);
              return (
                <div
                  key={kw.keyword}
                  className="rounded-xl px-4 py-4 flex items-center justify-between gap-4 transition-colors"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.05)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.03)";
                  }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold"
                      style={{
                        background: idx === 0 ? "rgba(230,184,32,0.15)" : "rgba(122,150,200,0.1)",
                        color: idx === 0 ? "#e6b820" : "#7a96c8",
                      }}
                    >
                      {idx + 1}
                    </div>
                    <div className="min-w-0">
                      <p className="text-white text-sm font-medium truncate capitalize">
                        {kw.keyword}
                      </p>
                      <p className="text-navy-300 text-xs mt-0.5">
                        {kw.clicks.toLocaleString()} clicks this month
                      </p>
                    </div>
                  </div>

                  {/* Position badge */}
                  <div
                    className="shrink-0 rounded-lg px-2.5 py-1 text-xs font-medium"
                    style={{
                      background: `${pos.color}18`,
                      color: pos.color,
                      border: `1px solid ${pos.color}30`,
                    }}
                  >
                    {pos.label}
                  </div>
                </div>
              );
            })}
      </div>

      {/* Footer explanation */}
      <div
        className="mt-5 rounded-xl px-4 py-3 flex items-start gap-3"
        style={{ background: "rgba(122,150,200,0.07)", border: "1px solid rgba(122,150,200,0.12)" }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0 mt-0.5" style={{ color: "#7a96c8" }}>
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <p className="text-navy-300 text-xs leading-relaxed">
          These are the exact words people typed into Google to find your website. Higher position = closer to the top of search results.
        </p>
      </div>
    </div>
  );
}
