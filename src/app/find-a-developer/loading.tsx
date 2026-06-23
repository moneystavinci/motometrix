// app/find-a-developer/loading.tsx
//
// Next.js shows this automatically while the async page component above is
// fetching. Keeps the bridge feeling instant instead of blank-then-pop.

export default function Loading() {
  return (
    <main className="min-h-screen bg-[#0B1F3A] text-white">
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-4xl px-5 py-4">
          <div className="h-4 w-32 animate-pulse rounded bg-white/10" />
        </div>
      </div>
      <div className="mx-auto max-w-4xl px-5 py-12 sm:py-16">
        <div className="mx-auto h-4 w-48 animate-pulse rounded bg-white/10" />
        <div className="mx-auto mt-4 h-8 w-3/4 animate-pulse rounded bg-white/10" />
        <div className="mx-auto mt-3 h-8 w-2/3 animate-pulse rounded bg-white/10" />
        <div className="mt-10 h-40 animate-pulse rounded-2xl bg-white/5" />
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-xl bg-white/5" />
          ))}
        </div>
      </div>
    </main>
  );
}
