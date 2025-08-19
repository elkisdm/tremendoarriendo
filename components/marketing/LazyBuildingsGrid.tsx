"use client";

import { useState, useEffect } from "react";
import ArriendaSinComisionBuildingCard from "./ArriendaSinComisionBuildingCard";
import type { BuildingSummary } from "@/hooks/useFetchBuildings";

interface LazyBuildingsGridProps {
  initialBuildings: BuildingSummary[];
  total: number;
  hasMore: boolean;
}

export default function LazyBuildingsGrid({ 
  initialBuildings, 
  total, 
  hasMore: initialHasMore 
}: LazyBuildingsGridProps) {
  const [buildings, setBuildings] = useState<BuildingSummary[]>(initialBuildings);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [page, setPage] = useState(1);

  const loadMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      // Usar el nuevo API endpoint específico de arriendo sin comisión
      const response = await fetch(`/api/arrienda-sin-comision?page=${page + 1}&limit=12`);
      const data = await response.json();

      if (data.success && data.buildings) {
        setBuildings(prev => [...prev, ...data.buildings]);
        setHasMore(data.pagination.hasMore);
        setPage(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error cargando más edificios:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Grid de edificios */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {buildings.map((building, index) => (
          <ArriendaSinComisionBuildingCard
            key={`${building.id}-${index}`}
            building={building}
            priority={index < 3}
          />
        ))}
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center py-8">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-green-500 border-t-transparent"></div>
            <span className="text-muted-foreground">Cargando más edificios...</span>
          </div>
        </div>
      )}

      {/* Load more button */}
      {hasMore && !loading && (
        <div className="text-center">
          <button
            onClick={loadMore}
            className="inline-flex items-center gap-2 rounded-2xl border border-border bg-background px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500"
          >
            Cargar más edificios
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <p className="mt-2 text-sm text-muted-foreground">
            Mostrando {buildings.length} de {total} edificios
          </p>
        </div>
      )}

      {/* No more buildings */}
      {!hasMore && buildings.length > 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            Has visto todos los {total} edificios disponibles
          </p>
        </div>
      )}
    </div>
  );
}

