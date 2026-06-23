// app/find-a-developer/page.tsx
//
// Bridge page between Motometrix (the insight) and Smart Contracts Escrow
// (the transaction). Job of this page: explain the handoff in one breath,
// make escrow feel like protection rather than friction, and get the user
// to pick a verified developer with zero hesitation.

import Link from "next/link";
import { getVerifiedDevelopers } from "@/lib/sce-sellers";
import { DeveloperCard } from "@/components/DeveloperCard";
import { EscrowFlowDiagram } from "@/components/EscrowFlowDiagram";

export const metadata = {
  title: "Find a Verified Developer | Motometrix",
};

export default async function FindADeveloperPage() {
  const { sellers, loadFailed } = await getVerifiedDevelopers();

  return (
    <main className="min-h-screen bg-[#0B1F3A] text-white">
      {/* Minimal top bar on purpose — this is a funnel bridge, not a full
          app page. One way back, no other distractions. */}
      <div className="border-b border-white/10">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-4">
          <Link
            href="/dashboard"
            className="text-sm text-white/50 transition hover:text-white"
          >
            ← Back to dashboard
          </Link>
          <span className="text-xs uppercase tracking-wide text-white/30">
            Step 2 of 2
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-5 py-12 sm:py-16">
        {/* Hero */}
        <div className="text-center">
          <p className="text-sm font-medium text-[#D4AF37]">
            Motometrix found the opportunity
          </p>
          <h1 className="mt-3 font-serif text-3xl font-semibold leading-tight sm:text-4xl">
            Now let&apos;s get it fixed — without the usual hiring risk
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-white/60">
            You&apos;re about to move from Motometrix to Smart Contracts
            Escrow, our partner marketplace. They handle the money side: your
            payment stays in escrow until the work is actually delivered, so
            you&apos;re never paying a stranger upfront.
          </p>
        </div>

        {/* Trust block: signature flow diagram + the 3 real steps */}
        <div className="mt-10 rounded-2xl border border-white/10 bg-[#0E1F3D] p-6 sm:p-8">
          <EscrowFlowDiagram />
          <ol className="mt-6 grid gap-4 text-sm sm:grid-cols-3">
            <li>
              <span className="font-semibold text-[#D4AF37]">1.</span>{" "}
              <span className="text-white/70">
                Choose a verified developer below
              </span>
            </li>
            <li>
              <span className="font-semibold text-[#D4AF37]">2.</span>{" "}
              <span className="text-white/70">
                Your payment goes into escrow — held, not released
              </span>
            </li>
            <li>
              <span className="font-semibold text-[#D4AF37]">3.</span>{" "}
              <span className="text-white/70">
                They deliver the fix, you approve, funds release
              </span>
            </li>
          </ol>
        </div>

        {/* Developer list */}
        <div className="mt-12">
          <div className="flex items-baseline justify-between">
            <h2 className="text-lg font-semibold">Verified developers</h2>
            <span className="text-xs text-white/40">
              Only premium, verified profiles shown
            </span>
          </div>

          <div className="mt-5">
            {loadFailed ? (
              <ErrorState />
            ) : sellers.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {sellers.map((seller) => (
                  <DeveloperCard key={seller.id} seller={seller} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Safety net — the funnel should never dead-end */}
        <div className="mt-10 text-center">
          <a
            href="https://smartcontractsescrow.net/find-seller"
            className="text-sm text-white/40 underline decoration-white/20 underline-offset-4 transition hover:text-white/70"
          >
            Or browse the full developer marketplace
          </a>
        </div>
      </div>
    </main>
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-white/15 p-8 text-center">
      <p className="text-white/70">
        No verified developers are listed right now.
      </p>
      <p className="mt-1 text-sm text-white/40">
        Check back shortly, or reach out and we&apos;ll match you with
        someone vetted.
      </p>
      <a
        href="mailto:sales@smartcontractsescrow.net?subject=Site%20fix%20-%20need%20a%20verified%20developer"
        className="mt-4 inline-block rounded-lg bg-[#D4AF37] px-4 py-2 text-sm font-medium text-[#0B1F3A] transition hover:bg-[#E4C158]"
      >
        Email us instead
      </a>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="rounded-xl border border-white/10 bg-[#101F3A] p-8 text-center">
      <p className="text-white/70">
        We couldn&apos;t load the verified developer list just now.
      </p>
      <a
        href="https://smartcontractsescrow.net/find-seller"
        className="mt-4 inline-block rounded-lg bg-[#D4AF37] px-4 py-2 text-sm font-medium text-[#0B1F3A] transition hover:bg-[#E4C158]"
      >
        Browse developers on Smart Contracts Escrow
      </a>
    </div>
  );
}
