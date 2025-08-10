"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FilterBar, type FilterValues } from "./filters/FilterBar";
import { ResultsGrid } from "./lists/ResultsGrid";
import { track } from "@lib/analytics";

const DEFAULT_FILTERS: FilterValues = {
  comuna: "Todas",
  tipologia: "Todas",
  minPrice: null,
  maxPrice: null,
};

export function LandingClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Initialize filters from URL or defaults
  const [filters, setFilters] = useState<FilterValues>(() => {
    return {
      comuna: searchParams.get("comuna") || DEFAULT_FILTERS.comuna,
      tipologia: searchParams.get("tipologia") || DEFAULT_FILTERS.tipologia,
      minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : DEFAULT_FILTERS.minPrice,
      maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : DEFAULT_FILTERS.maxPrice,
    };
  });
  
  const [sort, setSort] = useState(() => searchParams.get("sort") || "default");
  const [resultsCount, setResultsCount] = useState(0);
  const [announcement, setAnnouncement] = useState("");

  // Update URL when filters or sort change
  const updateURL = useCallback((newFilters: FilterValues, newSort: string) => {
    const params = new URLSearchParams();
    
    // Only add non-default values to URL
    if (newFilters.comuna && newFilters.comuna !== "Todas") {
      params.set("comuna", newFilters.comuna);
    }
    if (newFilters.tipologia && newFilters.tipologia !== "Todas") {
      params.set("tipologia", newFilters.tipologia);
    }
    if (newFilters.minPrice) {
      params.set("minPrice", newFilters.minPrice.toString());
    }
    if (newFilters.maxPrice) {
      params.set("maxPrice", newFilters.maxPrice.toString());
    }
    if (newSort && newSort !== "default") {
      params.set("sort", newSort);
    }

    const url = params.toString() ? `?${params.toString()}` : "";
    router.replace(`/landing${url}`, { scroll: false });
  }, [router]);

  // Handle filter changes (don't update URL immediately)
  const handleFilterChange = useCallback((newFilters: FilterValues) => {
    setFilters(newFilters);
  }, []);

  // Handle apply filters (update URL and trigger fetch)
  const handleApplyFilters = useCallback(() => {
    updateURL(filters, sort);
    // Fire GA4 filter_applied event (no PII)
    track("filter_applied", {
      comuna: filters.comuna,
      tipologia: filters.tipologia,
      minPrice: filters.minPrice ?? undefined,
      maxPrice: filters.maxPrice ?? undefined,
      results_count: resultsCount,
    });
  }, [filters, sort, updateURL, resultsCount]);

  // Handle clear filters
  const handleClearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setSort("default");
    updateURL(DEFAULT_FILTERS, "default");
  }, [updateURL]);

  // Handle sort change (immediate URL update)
  const handleSortChange = useCallback((newSort: string) => {
    setSort(newSort);
    updateURL(filters, newSort);
  }, [filters, updateURL]);

  // Handle results count change for accessibility announcement
  const handleResultsChange = useCallback((count: number) => {
    if (count !== resultsCount) {
      setResultsCount(count);
      setAnnouncement(`${count} resultado${count !== 1 ? "s" : ""} encontrado${count !== 1 ? "s" : ""}`);
    }
  }, [resultsCount]);

  // Clear announcement after it's been announced
  useEffect(() => {
    if (announcement) {
      const timer = setTimeout(() => setAnnouncement(""), 1000);
      return () => clearTimeout(timer);
    }
  }, [announcement]);

  return (
    <div className="container mx-auto px-4 md:px-6 py-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Arrienda con 0% de comisión</h1>
        <p className="text-[var(--subtext)]">Explora proyectos disponibles hoy</p>
      </div>

      <div className="mb-6">
        <FilterBar
          value={filters}
          onChange={handleFilterChange}
          onApply={handleApplyFilters}
          onClear={handleClearFilters}
          sort={sort}
          onSort={handleSortChange}
        />
      </div>

      {/* Accessibility: Live region for result announcements */}
      <div 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
        role="status"
      >
        {announcement}
      </div>

      <ResultsGrid
        filters={filters}
        sort={sort}
        onResultsChange={handleResultsChange}
      />
    </div>
  );
}
