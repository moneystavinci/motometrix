"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function SettingsPage() {
  const [ga4PropertyId, setGa4PropertyId] = useState("");
  const [searchConsoleUrl, setSearchConsoleUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        setGa4PropertyId(data.ga4PropertyId || "");
        setSearchConsoleUrl(data.searchConsoleUrl || "");
        setLoading(false);
      });
  }, []);

  async function handleSave() {
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ga4PropertyId, searchConsoleUrl }),
      });
      if (!res.ok) throw new Error("Failed to save");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(160deg, #060d1f 0%, #0a1530 40%, #0f1f45 100%)" }}>
      <div className="fixed inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      <div className="relative z-10 max-w-2xl mx-auto px-4 md:px-8 py-16">

        <Link href="/dashboard" className="inline-flex items-center gap-2 text-navy-300 hover:text-white text-sm mb-10 transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M5 12l7 7M5 12l7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to dashboard
        </Link>

        <div className="mb-10">
          <p className="text-xs font-medium tracking-widest uppercase mb-3" style={{ color: "#e6b820" }}>Configuration</p>
          <h1 className="text-white font-bold mb-4" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.6rem, 3vw, 2.2rem)" }}>Settings</h1>
          <p className="text-navy-300 text-sm leading-relaxed">Connect your analytics accounts so Motometrix can show your real website data.</p>
          <div className="h-px mt-6" style={{ background: "linear-gradient(90deg, #e6b820, transparent)" }} />
        </div>

        {loading ? (
          <div className="space-y-4">
            <div className="skeleton h-20 rounded-2xl" />
            <div className="skeleton h-20 rounded-2xl" />
          </div>
        ) : (
          <div className="space-y-6">

            {/* GA4 */}
            <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(230,184,32,0.15)" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ color: "#e6b820" }}>
                    <path d="M18 20V10M12 20V4M6 20v-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Google Analytics 4</p>
                  <p className="text-navy-300 text-xs">Your Measurement ID from GA4</p>
                </div>
              </div>
              <input
                type="text"
                value={ga4PropertyId}
                onChange={(e) => setGa4PropertyId(e.target.value)}
                placeholder="G-XXXXXXXXXX"
                className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-navy-300 outline-none transition-all"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
              />
              <p className="text-navy-300 text-xs mt-2">
                Find this in GA4 → Admin → Data Streams → your stream → Measurement ID
              </p>
            </div>

            {/* Search Console */}
            <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(122,150,200,0.15)" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ color: "#7a96c8" }}>
                    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                    <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Google Search Console</p>
                  <p className="text-navy-300 text-xs">Your verified website URL</p>
                </div>
              </div>
              <input
                type="text"
                value={searchConsoleUrl}
                onChange={(e) => setSearchConsoleUrl(e.target.value)}
                placeholder="https://yourwebsite.com"
                className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-navy-300 outline-none transition-all"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
              />
              <p className="text-navy-300 text-xs mt-2">
                This must exactly match the property URL in your Search Console account
              </p>
            </div>

            {/* Save button */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="font-bold px-8 py-3 rounded-xl text-sm transition-colors disabled:opacity-50"
                style={{ background: "#e6b820", color: "#0a1530" }}
              >
                {saving ? "Saving..." : "Save Settings"}
              </button>
              {saved && <p className="text-green-400 text-sm">Settings saved successfully!</p>}
              {error && <p className="text-red-400 text-sm">{error}</p>}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}