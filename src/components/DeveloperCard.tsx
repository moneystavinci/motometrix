// components/DeveloperCard.tsx

import type { Seller } from "@/lib/sce-sellers";

export function DeveloperCard({ seller }: { seller: Seller }) {
  const initials = seller.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex flex-col rounded-xl border border-white/10 bg-[#101F3A] p-5 transition hover:border-[#D4AF37]/40">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#1A2C4E] text-sm font-semibold text-[#D4AF37]">
          {seller.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={seller.avatarUrl}
              alt=""
              className="h-11 w-11 object-cover"
            />
          ) : (
            initials
          )}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-semibold text-white">
              {seller.name}
            </h3>
            <VerifiedBadge tier={seller.tier} />
          </div>
          {seller.tagline && (
            <p className="mt-0.5 line-clamp-1 text-sm text-white/60">
              {seller.tagline}
            </p>
          )}
        </div>
      </div>

      {seller.specialties.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {seller.specialties.slice(0, 4).map((s) => (
            <span
              key={s}
              className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-white/60"
            >
              {s}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
        {typeof seller.rating === "number" ? (
          <div className="flex items-center gap-1 text-sm text-white/70">
            <StarIcon className="h-3.5 w-3.5 text-[#D4AF37]" />
            <span>{seller.rating.toFixed(1)}</span>
            {seller.reviewCount ? (
              <span className="text-white/40">({seller.reviewCount})</span>
            ) : null}
          </div>
        ) : (
          <span />
        )}

        <a
          href={seller.profileUrl}
          className="rounded-lg bg-[#D4AF37] px-3 py-1.5 text-sm font-medium text-[#0B1F3A] transition hover:bg-[#E4C158] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
        >
          View profile →
        </a>
      </div>
    </div>
  );
}

function VerifiedBadge({ tier }: { tier: Seller["tier"] }) {
  return (
    <span
      className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#D4AF37]/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[#D4AF37]"
      title={
        tier === "premium" ? "Premium verified developer" : "Verified subscriber"
      }
    >
      <CheckIcon className="h-2.5 w-2.5" />
      Verified
    </span>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="3"
    >
      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1L12 2z" />
    </svg>
  );
}
