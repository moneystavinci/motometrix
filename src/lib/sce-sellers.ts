// lib/sce-sellers.ts
//
// Fetches the verified developer list from Smart Contracts Escrow.
//
// HEADS UP: I couldn't find a documented public API for
// smartcontractsescrow.net — their seller list loads client-side on their
// own site. This file is built so the transition page works the moment
// you wire in the real endpoint:
//   1. Set SCE_API_BASE_URL (and SCE_API_KEY if it needs auth) in your
//      Vercel + local env vars.
//   2. Adjust `normalizeSeller()` below so the right-hand field names match
//      whatever the real SCE response actually returns.
// Until then, this fails safe: the page shows a graceful empty/error state
// instead of breaking, and always offers a link straight to
// smartcontractsescrow.net/find-seller as a fallback.

export interface Seller {
  id: string;
  name: string;
  avatarUrl?: string;
  tagline?: string;
  specialties: string[];
  rating?: number;
  reviewCount?: number;
  verified: boolean;
  tier: "premium" | "subscriber" | "standard";
  profileUrl: string;
}

export interface SellerFetchResult {
  sellers: Seller[];
  loadFailed: boolean;
}

const SCE_API_BASE_URL =
  process.env.SCE_API_BASE_URL ??
  "https://backend.smartcontractsescrow.net/api";

const SCE_API_KEY = process.env.SCE_API_KEY; // only set if SCE requires auth

/**
 * Maps one raw record from the SCE API into our Seller shape.
 * TODO: confirm real field names once you have API access and update the
 * right-hand side of each line below.
 */
function normalizeSeller(raw: any): Seller {
  return {
    id: String(raw.id ?? raw.sellerId ?? raw.slug),
    name: raw.name ?? raw.fullName ?? raw.businessName ?? "Verified Developer",
    avatarUrl: raw.avatarUrl ?? raw.photo ?? raw.logo,
    tagline: raw.tagline ?? raw.title ?? raw.headline,
    specialties: raw.specialties ?? raw.skills ?? raw.categories ?? [],
    rating: typeof raw.rating === "number" ? raw.rating : undefined,
    reviewCount: raw.reviewCount ?? raw.reviewsCount ?? 0,
    verified: Boolean(raw.verified ?? raw.isVerified),
    tier: (raw.tier ?? raw.plan ?? "standard") as Seller["tier"],
    profileUrl:
      raw.profileUrl ??
      `https://smartcontractsescrow.net/sellers/${raw.id ?? raw.slug}`,
  };
}

/**
 * Returns only verified developers on the premium or subscriber tier.
 * Never throws — on any failure it returns an empty list with
 * loadFailed: true so the page can render a graceful fallback.
 */
export async function getVerifiedDevelopers(): Promise<SellerFetchResult> {
  try {
    const res = await fetch(`${SCE_API_BASE_URL}/sellers?verified=true`, {
      headers: SCE_API_KEY ? { Authorization: `Bearer ${SCE_API_KEY}` } : {},
      // Revalidate every 5 minutes so the list stays fresh without
      // hitting SCE on every single page load.
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      throw new Error(`SCE sellers request failed: ${res.status}`);
    }

    const json = await res.json();
    const rawList: any[] = Array.isArray(json)
      ? json
      : json.data ?? json.sellers ?? [];

    const sellers = rawList
      .map(normalizeSeller)
      .filter(
        (s) => s.verified && (s.tier === "premium" || s.tier === "subscriber")
      );

    return { sellers, loadFailed: false };
  } catch (err) {
    console.error("Failed to load verified developers from SCE:", err);
    return { sellers: [], loadFailed: true };
  }
}
