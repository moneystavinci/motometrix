"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LandingHero() {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col relative overflow-hidden">
      {/* Background architectural grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Radial glow at top-center */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center top, rgba(45,77,148,0.4) 0%, transparent 70%)",
        }}
      />

      {/* Nav */}
      <header className="relative z-10 flex items-center justify-between px-8 py-6 md:px-16">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gold-500 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 12L6 7L9 10L13 4" stroke="#0a1530" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span
            className="text-white font-semibold tracking-tight"
            style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem" }}
          >
            Motometrix
          </span>
        </div>
        <div className="text-sm text-navy-300">
          Website Intelligence for Founders
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center pb-24">
        {/* Eyebrow */}
        <div className="flex items-center gap-2 mb-8 opacity-0 animate-fade-up">
          <div className="gold-line" />
          <span className="text-gold-500 text-xs tracking-[0.2em] uppercase font-medium">
            No setup required
          </span>
          <div className="gold-line" />
        </div>

        {/* Headline */}
        <h1
          className="text-white mb-6 leading-[1.1] opacity-0 animate-fade-up animate-delay-100"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.8rem, 6vw, 5.5rem)",
            fontWeight: 700,
            maxWidth: "14ch",
          }}
        >
          Your website,{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #f5c842, #e6b820, #f5c842)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            finally explained.
          </span>
        </h1>

        {/* Subheadline */}
        <p
          className="text-navy-300 mb-12 opacity-0 animate-fade-up animate-delay-200"
          style={{
            fontSize: "clamp(1rem, 2vw, 1.25rem)",
            maxWidth: "42ch",
            lineHeight: 1.7,
            fontWeight: 300,
          }}
        >
          Connect your Google account once. Get a clear, jargon-free view of
          who&apos;s visiting your site, where they&apos;re coming from, and what&apos;s working.
        </p>

        {/* CTA Button */}
        <div className="opacity-0 animate-fade-up animate-delay-300">
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="group relative flex items-center gap-4 px-8 py-4 rounded-xl text-navy-950 font-semibold text-base transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
            style={{
              background: loading
                ? "rgba(230,184,32,0.7)"
                : "linear-gradient(135deg, #f5c842 0%, #e6b820 100%)",
              boxShadow: loading
                ? "none"
                : "0 0 40px rgba(230,184,32,0.3), 0 4px 16px rgba(0,0,0,0.4)",
              transform: loading ? "none" : undefined,
            }}
            onMouseEnter={(e) => {
              if (!loading)
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 0 60px rgba(230,184,32,0.45), 0 8px 24px rgba(0,0,0,0.5)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 0 40px rgba(230,184,32,0.3), 0 4px 16px rgba(0,0,0,0.4)";
            }}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray="32"
                    strokeDashoffset="8"
                  />
                </svg>
                Connecting…
              </>
            ) : (
              <>
                <GoogleIcon />
                Connect with Google
              </>
            )}
          </button>

          <p className="text-navy-300 text-xs mt-4 opacity-70">
            Takes 30 seconds · No credit card · Free forever
          </p>
        </div>

        {/* Social proof / feature grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl w-full opacity-0 animate-fade-up animate-delay-400">
          {[
            {
              icon: "👤",
              title: "Total Visitors",
              desc: "See exactly how many real people visited your site this month.",
            },
            {
              icon: "🔍",
              title: "Google Search Visibility",
              desc: "Discover which keywords are bringing people to your door.",
            },
            {
              icon: "📈",
              title: "Growth Trend",
              desc: "Know instantly if your traffic is up or down vs. last month.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="glass-card rounded-xl p-6 text-left"
            >
              <span className="text-2xl mb-3 block">{feature.icon}</span>
              <h3 className="text-white font-semibold mb-2 text-sm">{feature.title}</h3>
              <p className="text-navy-300 text-xs leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer line */}
      <footer className="relative z-10 text-center pb-8">
        <p className="text-navy-300 text-xs opacity-50">
          © {new Date().getFullYear()} Motometrix · Built for founders, not engineers
        </p>
      </footer>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#1e3a78"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#162d60"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#2d4d94"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#0f1f45"
      />
    </svg>
  );
}
