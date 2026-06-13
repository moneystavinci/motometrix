"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ background: "#060d1f", margin: 0, fontFamily: "system-ui, sans-serif" }}>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
            textAlign: "center",
          }}
        >
          <div>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: "rgba(248,113,113,0.1)",
                border: "1px solid rgba(248,113,113,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.5rem",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                  stroke="#f87171"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h1
              style={{
                color: "white",
                fontSize: "1.4rem",
                fontWeight: 700,
                marginBottom: "0.75rem",
              }}
            >
              Something went wrong
            </h1>
            <p
              style={{
                color: "#8892a4",
                fontSize: "0.875rem",
                marginBottom: "2rem",
                maxWidth: "30ch",
                lineHeight: 1.6,
              }}
            >
              An unexpected error occurred. Your data is safe.
            </p>
            <button
              onClick={reset}
              style={{
                background: "linear-gradient(135deg, #f5c842, #e6b820)",
                color: "#0a1530",
                border: "none",
                borderRadius: 12,
                padding: "0.75rem 1.5rem",
                fontWeight: 600,
                fontSize: "0.875rem",
                cursor: "pointer",
              }}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
