"use client";

import { useState } from "react";

export default function DemoBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div
      className="rounded-2xl px-5 py-4 flex items-start gap-4"
      style={{
        background: "linear-gradient(135deg, rgba(230,184,32,0.08), rgba(230,184,32,0.04))",
        border: "1px solid rgba(230,184,32,0.2)",
      }}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
        style={{ background: "rgba(230,184,32,0.15)" }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: "#e6b820" }}>
          <path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-white font-semibold text-sm mb-0.5">You&apos;re viewing demo data</p>
        <p className="text-navy-300 text-xs leading-relaxed">
                    These numbers are illustrative examples. To see your real website data, you need
                    Google Analytics 4 set up on your site.{" "}
                    <a href="/onboarding" className="underline text-white hover:text-yellow-400 transition-colors">
                    Follow our setup guide ?
                    </a>
        </p>
      </div>

      <button
        onClick={() => setDismissed(true)}
        className="shrink-0 text-navy-300 hover:text-white transition-colors mt-0.5"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M18 6L6 18M6 6l12 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}
