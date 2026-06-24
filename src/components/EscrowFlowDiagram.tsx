// components/EscrowFlowDiagram.tsx
//
// Signature visual for the transition page: a quiet 3-node diagram showing
// where the user's money actually sits at each stage (You -> Escrow ->
// Developer), with a soft pulse on the escrow node to draw the eye to the
// "your money is held safely" idea without being loud about it.

export function EscrowFlowDiagram() {
  return (
    <div
      aria-hidden="true"
      className="flex items-center justify-center gap-3 sm:gap-6 py-2"
    >
      <FlowNode label="You" sublabel="Pay into escrow" />
      <FlowConnector />
      <FlowNode label="Escrow" sublabel="Funds held" accent />
      <FlowConnector />
      <FlowNode label="Developer" sublabel="Delivers work" />
    </div>
  );
}

function FlowNode({
  label,
  sublabel,
  accent = false,
}: {
  label: string;
  sublabel: string;
  accent?: boolean;
}) {
  return (
    <div className="flex w-20 flex-col items-center text-center sm:w-28">
      <div
        className={`relative flex h-12 w-12 items-center justify-center rounded-full border sm:h-14 sm:w-14 ${
          accent
            ? "border-[#D4AF37] bg-[#1A2C4E]"
            : "border-white/15 bg-[#16294A]"
        }`}
      >
        {accent ? (
          <>
            <span className="motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37]/20" />
            <LockIcon className="relative h-5 w-5 text-[#D4AF37]" />
          </>
        ) : (
          <PersonIcon className="h-5 w-5 text-white/70" />
        )}
      </div>
      <p className="mt-2 text-xs font-medium text-white sm:text-sm">
        {label}
      </p>
      <p className="text-[11px] text-white/50 sm:text-xs">{sublabel}</p>
    </div>
  );
}

function FlowConnector() {
  return (
    <div className="h-px max-w-8 flex-1 bg-gradient-to-r from-white/10 via-white/30 to-white/10 sm:max-w-12" />
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V7a4 4 0 1 1 8 0v4" />
    </svg>
  );
}

function PersonIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c1.2-3.5 4-5 7-5s5.8 1.5 7 5" />
    </svg>
  );
}
