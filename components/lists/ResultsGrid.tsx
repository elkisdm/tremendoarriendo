"use client";
import { useMemo, useState } from "react";
import { BuildingCard } from "../BuildingCard";
import { BuildingCardV2 } from "../ui/BuildingCardV2";
import { BuildingCardSkeleton } from "../ui/BuildingCardSkeleton";
import { VirtualResultsGrid } from "./VirtualResultsGrid";
import { PaginationControls, InfiniteScrollControls, AutoInfiniteScroll } from "./PaginationControls";
import { useFetchBuildings, type FilterValues, type BuildingSummary } from "../../hooks/useFetchBuildings";
import { useBuildingsPagination, useBuildingsInfinite } from "../../hooks/useBuildingsPagination";
import { CARD_V2, VIRTUAL_GRID, PAGINATION, getFlagValue } from "@lib/flags";
import { Building } from "@types";
import type { BuildingFilters } from "../../types/buildings";

interface ResultsGridProps {
  filters: FilterValues;
  sort: string;
  onResultsChange: (count: number) => void;
  paginationMode?: 'traditional' | 'infinite' | 'auto-infinite';
}

// Adapter function to convert FilterValues to BuildingFilters for pagination
function adaptFilterValuesToBuildingFilters(filters: FilterValues): BuildingFilters {
  return {
    comuna: filters.comuna !== 'Todas' ? filters.comuna : undefined,
    tipologia: filters.tipologia !== 'Todas' ? filters.tipologia : undefined,
    minPrice: filters.minPrice || undefined,
    maxPrice: filters.maxPrice || undefined,
  };
}

// Adapter function to convert BuildingSummary to Building for BuildingCardV2
function adaptBuildingSummaryToBuilding(buildingSummary: BuildingSummary): Building {
  // Create synthetic units based on typologySummary
  const syntheticUnits = buildingSummary.typologySummary?.map((typology, index) => ({
    id: `${buildingSummary.id}-unit-${index}`,
    tipologia: typology.key,
    price: typology.minPrice || buildingSummary.precioDesde,
    m2: typology.minM2 || 40, // Default m2 if not available
    estacionamiento: false, // Default values since not available in summary
    bodega: false,
    disponible: true // Assume available since it's in the summary
  })) || [];

  return {
    id: buildingSummary.id,
    name: buildingSummary.name,
    comuna: buildingSummary.comuna,
    address: buildingSummary.address,
    cover: buildingSummary.coverImage ?? buildingSummary.gallery?.[0] ?? "/images/nunoa-cover.jpg",
    hero: buildingSummary.gallery?.[1] ?? buildingSummary.gallery?.[0] ?? "/images/nunoa-cover.jpg",
    gallery: buildingSummary.gallery,
    units: syntheticUnits,
    amenities: [], // Not available in BuildingSummary
    promo: buildingSummary.badges?.[0] ? {
      label: buildingSummary.badges[0].label,
      tag: buildingSummary.badges[0].tag
    } : undefined
  };
}

export function ResultsGrid({ 
  filters, 
  sort, 
  onResultsChange, 
  paginationMode = 'traditional' 
}: ResultsGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Choose data source based on pagination feature flag
  const usePagination = PAGINATION;
  
  // Legacy system (original hook)
  const { 
    data: legacyBuildings = [], 
    isLoading: legacyLoading, 
    isFetching: legacyFetching, 
    error: legacyError 
  } = useFetchBuildings({ 
    filters, 
    sort 
  });

  // New pagination system
  const buildingFilters = adaptFilterValuesToBuildingFilters(filters);
  
  // Use appropriate pagination hook based on mode
  const isInfiniteMode = paginationMode === 'infinite' || paginationMode === 'auto-infinite';
  
  // Traditional pagination
  const {
    buildings: paginatedBuildings,
    pagination,
    isLoading: paginationLoading,
    isError: paginationError,
    error: paginationErrorDetails,
    goToPage,
    nextPage,
    prevPage,
  } = useBuildingsPagination({
    filters: buildingFilters,
    page: currentPage,
    limit: pageSize,
    enabled: usePagination && !isInfiniteMode,
  });

  // Infinite scroll pagination
  const {
    buildings: infiniteBuildings,
    pagination: infinitePagination,
    isLoading: infiniteLoading,
    isError: infiniteError,
    error: infiniteErrorDetails,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useBuildingsInfinite({
    filters: buildingFilters,
    limit: pageSize,
    enabled: usePagination && isInfiniteMode,
  });

  // Use appropriate data source with type casting for compatibility
  const buildings: BuildingSummary[] = usePagination ? 
    (isInfiniteMode ? infiniteBuildings : paginatedBuildings) as unknown as BuildingSummary[] : // Cast to bypass type mismatch
    legacyBuildings;
  
  const isLoading = usePagination ? 
    (isInfiniteMode ? infiniteLoading : paginationLoading) : 
    legacyLoading;
  
  const isFetching = usePagination ? 
    (isInfiniteMode ? isFetchingNextPage : false) : 
    legacyFetching;
  
  const error = usePagination ? 
    (isInfiniteMode ? 
      (infiniteError ? infiniteErrorDetails : null) : 
      (paginationError ? paginationErrorDetails : null)
    ) : 
    legacyError;

  // Get pagination info for current mode
  const currentPagination = usePagination ? 
    (isInfiniteMode ? infinitePagination : pagination) : 
    null;

  // Notify parent component of results count changes
  useMemo(() => {
    if (!isLoading && !isFetching) {
      const totalCount = usePagination ? (currentPagination?.totalCount || 0) : buildings.length;
      onResultsChange(totalCount);
    }
  }, [buildings.length, isLoading, isFetching, onResultsChange, usePagination, currentPagination?.totalCount]);

  // Handle page changes for traditional pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    goToPage(page);
  };

  const handleNextPage = () => {
    if (currentPagination?.hasNextPage) {
      if (isInfiniteMode) {
        fetchNextPage();
      } else {
        const newPage = currentPage + 1;
        setCurrentPage(newPage);
        nextPage();
      }
    }
  };

  const handlePrevPage = () => {
    if (currentPagination?.hasPrevPage && !isInfiniteMode) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      prevPage();
    }
  };

  // Use VirtualResultsGrid when feature flag is enabled
  if (VIRTUAL_GRID) {
    return (
      <VirtualResultsGrid
        items={buildings}
        isLoading={isLoading || isFetching}
        error={error}
        onResultsChange={onResultsChange}
      />
    );
  }

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

  // Results grid with feature flag for BuildingCardV2
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
        {buildings.map((building: BuildingSummary, idx: number) => {
          if (getFlagValue('CARD_V2')) {
            // Use BuildingCardV2 when flag is enabled
            const adaptedBuilding = adaptBuildingSummaryToBuilding(building);
            return (
              <BuildingCardV2 
                key={building.id} 
                building={adaptedBuilding} 
                priority={idx === 0} 
                showBadge={true}
              />
            );
          } else {
            // Use original BuildingCard when flag is disabled
            return (
              <BuildingCard 
                key={building.id} 
                building={building} 
                priority={idx === 0} 
              />
            );
          }
        })}
      </div>

      {/* Pagination controls when pagination is enabled */}
      {usePagination && currentPagination && (
        <>
          {/* Traditional pagination controls */}
          {!isInfiniteMode && currentPagination.totalPages > 1 && (
            <PaginationControls
              pagination={currentPagination}
              onPageChange={handlePageChange}
              onNextPage={handleNextPage}
              onPrevPage={handlePrevPage}
              isLoading={isLoading}
            />
          )}

          {/* Infinite scroll controls */}
          {isInfiniteMode && (
            paginationMode === 'infinite' ? (
              <InfiniteScrollControls
                hasNextPage={Boolean(hasNextPage)}
                isFetchingNextPage={isFetchingNextPage}
                onLoadMore={fetchNextPage}
                totalCount={currentPagination.totalCount}
                loadedCount={buildings.length}
              />
            ) : (
              <AutoInfiniteScroll
                hasNextPage={Boolean(hasNextPage)}
                isFetchingNextPage={isFetchingNextPage}
                onLoadMore={fetchNextPage}
                totalCount={currentPagination.totalCount}
                loadedCount={buildings.length}
              />
            )
          )}
        </>
      )}
    </div>
  );
}
