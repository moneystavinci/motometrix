"use client";

import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Suspense } from "react";

const ERROR_MESSAGES: Record<string, { title: string; body: string }> = {
  OAuthCallback: {
    title: "Sign-in was cancelled",
    body: "It looks like the Google sign-in was cancelled or didn't complete. You can try again anytime.",
  },
  OAuthAccountNotLinked: {
    title: "Account already exists",
    body: "An account with this email already exists using a different sign-in method.",
  },
  AccessDenied: {
    title: "Access was denied",
    body: "Motometrix needs access to Google Analytics and Search Console to show your data. Please approve all permissions on the next attempt.",
  },
  Configuration: {
    title: "Setup issue",
    body: "There's a configuration problem on our end. Please try again in a few minutes.",
  },
  Default: {
    title: "Something went wrong",
    body: "We ran into an unexpected issue during sign-in. Please try again.",
  },
};

function ErrorContent() {
  const params = useSearchParams();
  const errorCode = params.get("error") ?? "Default";
  const { title, body } =
    ERROR_MESSAGES[errorCode] ?? ERROR_MESSAGES.Default;

  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center px-6">
      {/* Background grid */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative z-10 text-center max-w-md w-full">
        {/* Icon */}
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)" }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={{ color: "#f87171" }}>
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            <path
              d="M12 8v4M12 16h.01"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Card */}
        <div
          className="glass-card rounded-2xl p-8 mb-6"
          style={{ border: "1px solid rgba(255,255,255,0.07)" }}
        >
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-6 h-6 rounded-md bg-gold-500 flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
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
              className="text-white font-semibold text-sm"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Motometrix
            </span>
          </div>

          <h1
            className="text-white font-bold mb-3"
            style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem" }}
          >
            {title}
          </h1>
          <p className="text-navy-300 text-sm leading-relaxed mb-8">{body}</p>

          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-xl font-semibold text-navy-950 text-sm transition-all duration-200"
            style={{
              background: "linear-gradient(135deg, #f5c842 0%, #e6b820 100%)",
              boxShadow: "0 0 30px rgba(230,184,32,0.2), 0 4px 12px rgba(0,0,0,0.3)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 0 40px rgba(230,184,32,0.35), 0 6px 20px rgba(0,0,0,0.4)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 0 30px rgba(230,184,32,0.2), 0 4px 12px rgba(0,0,0,0.3)";
            }}
          >
            <GoogleIcon />
            Try Again with Google
          </button>
        </div>

        <a
          href="/"
          className="text-navy-300 text-xs hover:text-white transition-colors"
        >
          ← Back to home
        </a>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense>
      <ErrorContent />
    </Suspense>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#1e3a78" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#162d60" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#2d4d94" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#0f1f45" />
    </svg>
  );
}
