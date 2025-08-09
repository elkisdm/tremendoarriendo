export function BuildingCardSkeleton() {
  return (
    <div className="rounded-2xl bg-[var(--soft)]/90 ring-1 ring-white/10 overflow-hidden animate-pulse">
      {/* Image skeleton with exact same aspect ratio as BuildingCard */}
      <div className="relative aspect-[16/10] bg-gray-700/50" />
      
      {/* Content skeleton matching BuildingCard layout */}
      <div className="p-4 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {/* Building name skeleton */}
          <div className="h-5 bg-gray-700/50 rounded-md mb-1 w-3/4" />
          {/* Comuna skeleton */}
          <div className="h-4 bg-gray-700/30 rounded-md w-1/2" />
        </div>
        <div className="text-right shrink-0">
          {/* Price skeleton */}
          <div className="h-5 bg-gray-700/50 rounded-md mb-1 w-20" />
          {/* "Desde" text skeleton */}
          <div className="h-3 bg-gray-700/30 rounded-md w-12" />
        </div>
      </div>
    </div>
  );
}
