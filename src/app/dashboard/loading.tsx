export default function DashboardLoading() {
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
        {/* Nav skeleton */}
        <nav
          className="flex items-center justify-between px-4 md:px-8 py-4"
          style={{
            background: "rgba(6, 13, 31, 0.85)",
            backdropFilter: "blur(16px)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gold-500 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path
                  d="M2 12L6 7L9 10L13 4"
                  stroke="#0a1530"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span
              className="text-white font-semibold"
              style={{ fontFamily: "var(--font-display)", fontSize: "1rem" }}
            >
              Motometrix
            </span>
          </div>
          <div className="skeleton h-9 w-36 rounded-xl" />
        </nav>

        <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
          {/* Header skeleton */}
          <div className="space-y-3">
            <div className="skeleton h-4 w-32" />
            <div className="skeleton h-9 w-72" />
            <div className="skeleton h-0.5 w-10" />
          </div>

          {/* KPI cards skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl p-6 space-y-4"
                style={{
                  background: "rgba(22,45,96,0.4)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div className="skeleton h-10 w-10 rounded-xl" />
                <div className="skeleton h-3 w-24" />
                <div className="skeleton h-9 w-28" />
                <div className="skeleton h-3 w-36" />
              </div>
            ))}
          </div>

          {/* Chart skeleton */}
          <div
            className="rounded-2xl p-6"
            style={{
              background: "rgba(22,45,96,0.4)",
              border: "1px solid rgba(255,255,255,0.06)",
              minHeight: "280px",
            }}
          >
            <div className="space-y-3 mb-6">
              <div className="skeleton h-3 w-24" />
              <div className="skeleton h-6 w-56" />
            </div>
            <div className="flex items-end gap-2 h-40 pt-4">
              {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95, 65, 88, 72].map(
                (h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm skeleton"
                    style={{ height: `${h}%` }}
                  />
                )
              )}
            </div>
          </div>

          {/* Bottom row skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl p-6 space-y-5"
                style={{
                  background: "rgba(22,45,96,0.4)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div className="space-y-2">
                  <div className="skeleton h-3 w-20" />
                  <div className="skeleton h-6 w-52" />
                </div>
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="space-y-2">
                    <div className="flex justify-between">
                      <div className="skeleton h-4 w-40" />
                      <div className="skeleton h-4 w-20" />
                    </div>
                    <div className="skeleton h-1.5 w-full rounded-full" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
