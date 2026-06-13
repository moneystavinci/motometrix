import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center px-6">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />
      <div className="relative z-10 text-center">
        <p
          className="font-bold mb-2"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "6rem",
            lineHeight: 1,
            background: "linear-gradient(135deg, #f5c842, #e6b820)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          404
        </p>
        <h1
          className="text-white font-semibold mb-3"
          style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem" }}
        >
          Page not found
        </h1>
        <p className="text-navy-300 text-sm mb-8">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-xl transition-all"
          style={{
            background: "rgba(230,184,32,0.1)",
            border: "1px solid rgba(230,184,32,0.25)",
            color: "#e6b820",
          }}
        >
          ← Back to Motometrix
        </Link>
      </div>
    </div>
  );
}
