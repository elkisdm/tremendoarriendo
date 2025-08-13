/**
 * Advanced Filters Hook
 * Extends basic FilterValues with search and advanced filtering capabilities
 */

import { useState, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { searchBuildings } from '../lib/search';
import type { 
  FilterValues, 
  AdvancedFilterValues, 
  FilterChip, 
  FilterAnalytics 
} from '../types/filters';
import type { Building } from '../schemas/models';
import type { SearchResult } from '../lib/search';

export interface UseAdvancedFiltersParams {
  buildings: Building[];
  initialFilters?: Partial<AdvancedFilterValues>;
  urlSync?: boolean;
  debounceMs?: number;
}

export interface UseAdvancedFiltersReturn {
  // Current filter state
  filters: AdvancedFilterValues;
  
  // Filter actions
  setFilters: (filters: Partial<AdvancedFilterValues>) => void;
  setQuery: (query: string) => void;
  clearFilters: () => void;
  resetToDefaults: () => void;
  
  // Results
  filteredBuildings: Building[];
  searchResults: SearchResult[];
  resultsCount: number;
  
  // Filter state
  hasActiveFilters: boolean;
  activeFilterChips: FilterChip[];
  
  // URL sync
  updateURL: () => void;
  
  // Analytics
  getFilterAnalytics: () => FilterAnalytics;
}

// Re-export types for backward compatibility
export type { AdvancedFilterValues, FilterChip, FilterAnalytics };

const DEFAULT_FILTERS: AdvancedFilterValues = {
  // Basic filters (backward compatibility)
  comuna: "Todas",
  tipologia: "Todas", 
  minPrice: null,
  maxPrice: null,
  
  // Advanced filters
  query: "",
  amenities: [],
  minM2: null,
  maxM2: null,
  estacionamiento: null,
  bodega: null,
  amoblado: null,
  petFriendly: null,
  bedrooms: null,
  bathrooms: null,
  hasPromotions: null,
  serviceLevel: null,
  nearTransit: null,
};

/**
 * Convert AdvancedFilterValues to basic FilterValues for backward compatibility
 */
export function toBasicFilters(advanced: AdvancedFilterValues): FilterValues {
  return {
    comuna: advanced.comuna,
    tipologia: advanced.tipologia,
    minPrice: advanced.minPrice,
    maxPrice: advanced.maxPrice,
  };
}

/**
 * Advanced filters hook with search and multiple filter capabilities
 */
export function useAdvancedFilters({
  buildings,
  initialFilters = {},
  urlSync = true,
  // debounceMs = 300,
}: UseAdvancedFiltersParams): UseAdvancedFiltersReturn {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Initialize filters from URL or defaults
  const [filters, setFiltersState] = useState<AdvancedFilterValues>(() => {
    const baseFilters = { ...DEFAULT_FILTERS, ...initialFilters };
    
    if (urlSync) {
      return {
        ...baseFilters,
        comuna: searchParams.get("comuna") || baseFilters.comuna,
        tipologia: searchParams.get("tipologia") || baseFilters.tipologia,
        minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : baseFilters.minPrice,
        maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : baseFilters.maxPrice,
        query: searchParams.get("q") || baseFilters.query,
        amenities: searchParams.get("amenities")?.split(',').filter(Boolean) || baseFilters.amenities,
        minM2: searchParams.get("minM2") ? Number(searchParams.get("minM2")) : baseFilters.minM2,
        maxM2: searchParams.get("maxM2") ? Number(searchParams.get("maxM2")) : baseFilters.maxM2,
        estacionamiento: searchParams.get("estacionamiento") === "true" ? true : 
                        searchParams.get("estacionamiento") === "false" ? false : baseFilters.estacionamiento,
        bodega: searchParams.get("bodega") === "true" ? true : 
                searchParams.get("bodega") === "false" ? false : baseFilters.bodega,
      };
    }
    
    return baseFilters;
  });

  // Create debounced search function
  // const _debouncedSearch = useMemo(
  //   () => createDebouncedSearch(searchBuildings, debounceMs),
  //   [debounceMs]
  // );

  // Apply all filters to buildings
  const { filteredBuildings, searchResults } = useMemo(() => {
    let results = [...buildings];
    let searchRes: SearchResult[] = [];

    // Step 1: Apply search query if present
    if (filters.query.trim()) {
      searchRes = searchBuildings(results, { 
        query: filters.query,
        threshold: 0.1,
        maxResults: 100
      });
      results = searchRes.map(r => r.building);
    }

    // Step 2: Apply basic filters
    if (filters.comuna && filters.comuna !== "Todas") {
      results = results.filter(building => building.comuna === filters.comuna);
    }

    if (filters.tipologia && filters.tipologia !== "Todas") {
      results = results.filter(building => 
        building.units.some(unit => unit.tipologia === filters.tipologia)
      );
    }

    if (filters.minPrice !== null) {
      results = results.filter(building => 
        building.units.some(unit => unit.price >= filters.minPrice!)
      );
    }

    if (filters.maxPrice !== null) {
      results = results.filter(building => 
        building.units.some(unit => unit.price <= filters.maxPrice!)
      );
    }

    // Step 3: Apply advanced filters
    if (filters.amenities.length > 0) {
      results = results.filter(building => 
        filters.amenities.every(amenity => building.amenities.includes(amenity))
      );
    }

    if (filters.minM2 !== null) {
      results = results.filter(building => 
        building.units.some(unit => unit.m2 >= filters.minM2!)
      );
    }

    if (filters.maxM2 !== null) {
      results = results.filter(building => 
        building.units.some(unit => unit.m2 <= filters.maxM2!)
      );
    }

    if (filters.estacionamiento !== null) {
      results = results.filter(building => 
        building.units.some(unit => unit.estacionamiento === filters.estacionamiento)
      );
    }

    if (filters.bodega !== null) {
      results = results.filter(building => 
        building.units.some(unit => unit.bodega === filters.bodega)
      );
    }

    if (filters.amoblado !== null) {
      results = results.filter(building => 
        building.units.some(unit => unit.amoblado === filters.amoblado)
      );
    }

    if (filters.petFriendly !== null) {
      results = results.filter(building => 
        building.units.some(unit => unit.petFriendly === filters.petFriendly)
      );
    }

    if (filters.bedrooms !== null) {
      results = results.filter(building => 
        building.units.some(unit => unit.bedrooms === filters.bedrooms)
      );
    }

    if (filters.bathrooms !== null) {
      results = results.filter(building => 
        building.units.some(unit => unit.bathrooms === filters.bathrooms)
      );
    }

    if (filters.hasPromotions !== null) {
      results = results.filter(building => {
        const hasPromos = building.units.some(unit => 
          unit.promotions && unit.promotions.length > 0
        );
        return hasPromos === filters.hasPromotions;
      });
    }

    if (filters.serviceLevel !== null) {
      results = results.filter(building => building.serviceLevel === filters.serviceLevel);
    }

    if (filters.nearTransit !== null) {
      results = results.filter(building => {
        const hasTransit = building.nearestTransit?.distanceMin !== undefined;
        return hasTransit === filters.nearTransit;
      });
    }

    return { filteredBuildings: results, searchResults: searchRes };
  }, [buildings, filters]);

  // Generate filter chips for active filters
  const activeFilterChips = useMemo((): FilterChip[] => {
    const chips: FilterChip[] = [];

    if (filters.query.trim()) {
      chips.push({
        id: 'query',
        label: 'Búsqueda',
        value: `"${filters.query}"`,
        onRemove: () => setFilters({ query: '' })
      });
    }

    if (filters.comuna !== "Todas") {
      chips.push({
        id: 'comuna',
        label: 'Comuna',
        value: filters.comuna,
        onRemove: () => setFilters({ comuna: "Todas" })
      });
    }

    if (filters.tipologia !== "Todas") {
      chips.push({
        id: 'tipologia',
        label: 'Tipología',
        value: filters.tipologia,
        onRemove: () => setFilters({ tipologia: "Todas" })
      });
    }

    if (filters.minPrice !== null || filters.maxPrice !== null) {
      const min = filters.minPrice ? `$${filters.minPrice.toLocaleString()}` : '';
      const max = filters.maxPrice ? `$${filters.maxPrice.toLocaleString()}` : '';
      const value = min && max ? `${min} - ${max}` : min || max;
      
      chips.push({
        id: 'price',
        label: 'Precio',
        value,
        onRemove: () => setFilters({ minPrice: null, maxPrice: null })
      });
    }

    if (filters.amenities.length > 0) {
      filters.amenities.forEach(amenity => {
        chips.push({
          id: `amenity-${amenity}`,
          label: 'Amenidad',
          value: amenity,
          onRemove: () => setFilters({ 
            amenities: filters.amenities.filter(a => a !== amenity) 
          })
        });
      });
    }

    if (filters.minM2 !== null || filters.maxM2 !== null) {
      const min = filters.minM2 ? `${filters.minM2}m²` : '';
      const max = filters.maxM2 ? `${filters.maxM2}m²` : '';
      const value = min && max ? `${min} - ${max}` : min || max;
      
      chips.push({
        id: 'm2',
        label: 'Metros²',
        value,
        onRemove: () => setFilters({ minM2: null, maxM2: null })
      });
    }

    if (filters.estacionamiento !== null) {
      chips.push({
        id: 'estacionamiento',
        label: 'Estacionamiento',
        value: filters.estacionamiento ? 'Sí' : 'No',
        onRemove: () => setFilters({ estacionamiento: null })
      });
    }

    if (filters.bodega !== null) {
      chips.push({
        id: 'bodega',
        label: 'Bodega',
        value: filters.bodega ? 'Sí' : 'No',
        onRemove: () => setFilters({ bodega: null })
      });
    }

    return chips;
  }, [filters]);

  // Update filters with partial values
  const setFilters = useCallback((newFilters: Partial<AdvancedFilterValues>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  }, []);

  const hasActiveFilters = useMemo(() => {
    return Object.entries(filters).some(([key, value]) => {
      const defaultValue = DEFAULT_FILTERS[key as keyof AdvancedFilterValues];
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value !== defaultValue;
    });
  }, [filters]);

  // Set search query specifically (with debounce potential)
  const setQuery = useCallback((query: string) => {
    setFilters({ query });
  }, [setFilters]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFiltersState(DEFAULT_FILTERS);
  }, []);

  // Reset to default values
  const resetToDefaults = useCallback(() => {
    clearFilters();
  }, [clearFilters]);

  // Update URL with current filters
  const updateURL = useCallback(() => {
    if (!urlSync) return;

    const params = new URLSearchParams();
    
    // Basic filters
    if (filters.comuna !== "Todas") params.set("comuna", filters.comuna);
    if (filters.tipologia !== "Todas") params.set("tipologia", filters.tipologia);
    if (filters.minPrice !== null) params.set("minPrice", filters.minPrice.toString());
    if (filters.maxPrice !== null) params.set("maxPrice", filters.maxPrice.toString());
    
    // Advanced filters
    if (filters.query.trim()) params.set("q", filters.query);
    if (filters.amenities.length > 0) params.set("amenities", filters.amenities.join(','));
    if (filters.minM2 !== null) params.set("minM2", filters.minM2.toString());
    if (filters.maxM2 !== null) params.set("maxM2", filters.maxM2.toString());
    if (filters.estacionamiento !== null) params.set("estacionamiento", filters.estacionamiento.toString());
    if (filters.bodega !== null) params.set("bodega", filters.bodega.toString());

    const url = params.toString() ? `?${params.toString()}` : "";
    router.replace(`${window.location.pathname}${url}`, { scroll: false });
  }, [filters, router, urlSync]);

  // Get analytics data
  const getFilterAnalytics = useCallback((): FilterAnalytics => {
    const filtersUsed = Object.entries(filters)
      .filter(([key, value]) => {
        const defaultValue = DEFAULT_FILTERS[key as keyof AdvancedFilterValues];
        if (Array.isArray(value)) return value.length > 0;
        return value !== defaultValue;
      })
      .map(([key]) => key);

    return {
      totalFilters: filtersUsed.length,
      searchQuery: filters.query.trim() || null,
      filtersUsed,
      resultCount: filteredBuildings.length,
    };
  }, [filters, filteredBuildings.length]);

  return {
    // State
    filters,
    
    // Actions
    setFilters,
    setQuery,
    clearFilters,
    resetToDefaults,
    
    // Results
    filteredBuildings,
    searchResults,
    resultsCount: filteredBuildings.length,
    
    // Filter state
    hasActiveFilters,
    activeFilterChips,
    
    // URL sync
    updateURL,
    
    // Analytics
    getFilterAnalytics,
  };
}
