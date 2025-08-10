"use client";
import { useMemo } from "react";
import { BuildingCard } from "../BuildingCard";
import { BuildingCardSkeleton } from "../ui/BuildingCardSkeleton";
import { useFetchBuildings, type FilterValues, type BuildingSummary } from "../../hooks/useFetchBuildings";

interface ResultsGridProps {
  filters: FilterValues;
  sort: string;
  onResultsChange: (count: number) => void;
}

export function ResultsGrid({ filters, sort, onResultsChange }: ResultsGridProps) {
  const { data: buildings = [], isLoading, isFetching, error } = useFetchBuildings({ 
    filters, 
    sort 
  });

  // Notify parent component of results count changes
  useMemo(() => {
    if (!isLoading && !isFetching) {
      onResultsChange(buildings.length);
    }
  }, [buildings.length, isLoading, isFetching, onResultsChange]);

  // Show skeletons during initial load and refetching
  if (isLoading || isFetching) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, idx) => (
          <BuildingCardSkeleton key={`skeleton-${idx}`} />
        ))}
      </div>
    );
  }

  // Error state -> Throw to be handled by route error boundary
  if (error) {
    if (error instanceof Error) throw error;
    throw new Error("Error desconocido al cargar propiedades");
  }

  // Empty state
  if (buildings.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-[var(--subtext)] mb-2">No se encontraron propiedades</div>
        <div className="text-sm text-[var(--subtext)]">
          Intenta ajustar tus filtros de búsqueda
        </div>
      </div>
    );
  }

  // Results grid
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
      {buildings.map((building: BuildingSummary, idx: number) => (
        <BuildingCard 
          key={building.id} 
          building={building} 
          priority={idx === 0} 
        />
      ))}
    </div>
  );
}
