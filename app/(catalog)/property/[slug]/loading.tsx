import { BuildingCardSkeleton } from "@components/ui/BuildingCardSkeleton";

export default function Loading() {
  return (
    <main id="main-content" role="main" className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <div className="h-8 w-2/3 bg-white/10 rounded-md animate-pulse" />
          <div className="mt-2 h-5 w-1/3 bg-white/5 rounded-md animate-pulse" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="aspect-[16/10] w-full rounded-2xl bg-white/5 ring-1 ring-white/10 animate-pulse" />
            <div>
              <div className="h-6 w-48 bg-white/10 rounded-md mb-3 animate-pulse" />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={`chip-${i}`} className="h-8 rounded-md bg-white/5 ring-1 ring-white/10 animate-pulse" />
                ))}
              </div>
            </div>
            <div>
              <div className="h-6 w-36 bg-white/10 rounded-md mb-3 animate-pulse" />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={`amenity-${i}`} className="h-24 rounded-xl bg-white/5 ring-1 ring-white/10 animate-pulse" />
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="h-64 rounded-2xl bg-white/5 ring-1 ring-white/10 animate-pulse" />
            <div className="h-96 rounded-2xl bg-white/5 ring-1 ring-white/10 animate-pulse" />
          </div>
        </div>

        <section aria-label="Propiedades relacionadas" className="mt-16">
          <div className="h-6 w-56 bg-white/10 rounded-md mb-4 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, idx) => (
              <BuildingCardSkeleton key={`related-skeleton-${idx}`} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}


