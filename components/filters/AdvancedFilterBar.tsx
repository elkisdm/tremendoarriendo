"use client";
import React, { useState, useCallback } from 'react';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchInput } from './SearchInput';
import { FilterChips } from './FilterChips';
import { SortSelect } from './SortSelect';
import { useAdvancedFilters } from '../../hooks/useAdvancedFilters';
import type { AdvancedFilterValues } from '../../types/filters';
import type { Building } from '../../schemas/models';

export interface AdvancedFilterBarProps {
  buildings: Building[];
  onFiltersChange: (filteredBuildings: Building[]) => void;
  onSortChange?: (sort: string) => void;
  sort?: string;
  className?: string;
  initialFilters?: Partial<AdvancedFilterValues>;
  showSearchSuggestions?: boolean;
  urlSync?: boolean;
}

export function AdvancedFilterBar({
  buildings,
  onFiltersChange,
  onSortChange,
  sort = "relevance",
  className = "",
  initialFilters,
  showSearchSuggestions = true,
  urlSync = true,
}: AdvancedFilterBarProps) {
  // const [_isExpanded, _setIsExpanded] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Advanced filters hook with full functionality
  const {
    filters,
    setFilters,
    setQuery,
    clearFilters,
    filteredBuildings,
    searchResults,
    resultsCount,
    hasActiveFilters,
    activeFilterChips,
    updateURL,
    // getFilterAnalytics: _getFilterAnalytics
  } = useAdvancedFilters({
    buildings,
    initialFilters,
    urlSync,
    debounceMs: 300
  });

  // Sync with parent component
  React.useEffect(() => {
    onFiltersChange(filteredBuildings);
  }, [filteredBuildings, onFiltersChange]);

  // URL sync
  React.useEffect(() => {
    if (urlSync) {
      updateURL();
    }
  }, [filters, urlSync, updateURL]);

  // Get search suggestions from buildings data
  const searchSuggestions = React.useMemo(() => {
    if (!showSearchSuggestions) return [];
    
    const suggestions = new Set<string>();
    
    buildings.forEach(building => {
      // Add building names
      suggestions.add(building.name);
      
      // Add comuna names
      suggestions.add(building.comuna);
      
      // Add amenities
      building.amenities.forEach(amenity => suggestions.add(amenity));
      
      // Add typologies
      building.units.forEach(unit => {
        if (unit.tipologia) suggestions.add(unit.tipologia);
      });
    });
    
    return Array.from(suggestions).sort();
  }, [buildings, showSearchSuggestions]);

  // Handle search input
  const handleSearchChange = useCallback((query: string) => {
    setQuery(query);
  }, [setQuery]);

  // Handle sort change
  const handleSortChange = useCallback((newSort: string) => {
    onSortChange?.(newSort);
  }, [onSortChange]);

  // Handle clear all filters
  const handleClearAll = useCallback(() => {
    clearFilters();
  }, [clearFilters]);

  // Handle individual filter changes
  const handleFilterChange = useCallback((filterKey: keyof AdvancedFilterValues, value: unknown) => {
    setFilters({ [filterKey]: value });
  }, [setFilters]);

  // Toggle advanced filters panel
  const toggleAdvancedFilters = useCallback(() => {
    setShowAdvancedFilters(prev => !prev);
  }, []);

  // Get unique values for filter options
  const filterOptions = React.useMemo(() => {
    const comunas = new Set<string>();
    const tipologias = new Set<string>();
    const amenities = new Set<string>();
    
    buildings.forEach(building => {
      comunas.add(building.comuna);
      building.amenities.forEach(amenity => amenities.add(amenity));
      
      building.units.forEach(unit => {
        if (unit.tipologia) tipologias.add(unit.tipologia);
      });
    });
    
    return {
      comunas: Array.from(comunas).sort(),
      tipologias: Array.from(tipologias).sort(),
      amenities: Array.from(amenities).sort(),
    };
  }, [buildings]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Filter Bar */}
      <div className="
        bg-black/40 backdrop-blur border border-white/20 
        rounded-2xl p-4 space-y-4
      ">
        
        {/* Search and Sort Row */}
        <div className="flex flex-col lg:flex-row gap-4">
          
          {/* Search Input */}
          <div className="flex-1">
            <SearchInput
              value={filters.query}
              onChange={handleSearchChange}
              suggestions={searchSuggestions}
              placeholder="Buscar propiedades, ubicaciones o amenidades..."
              autoFocus={false}
              className="w-full"
            />
          </div>

          {/* Sort Select */}
          <div className="lg:w-48">
            <SortSelect
              value={sort}
              onChange={handleSortChange}
            />
          </div>

          {/* Advanced Filters Toggle */}
          <button
            onClick={toggleAdvancedFilters}
            className="
              flex items-center gap-2 px-4 py-3
              bg-white/10 hover:bg-white/20 
              border border-white/20 rounded-xl
              text-white transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50
            "
            aria-expanded={showAdvancedFilters}
            aria-controls="advanced-filters-panel"
          >
            <Filter className="w-4 h-4" aria-hidden="true" />
            <span className="text-sm font-medium">Filtros</span>
            {showAdvancedFilters ? (
              <ChevronUp className="w-4 h-4" aria-hidden="true" />
            ) : (
              <ChevronDown className="w-4 h-4" aria-hidden="true" />
            )}
          </button>

        </div>

        {/* Results Count and Clear */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-[var(--subtext)]">
            {resultsCount === buildings.length ? (
              <span>Mostrando todas las {resultsCount} propiedades</span>
            ) : (
              <span>
                {resultsCount} de {buildings.length} propiedades
                {filters.query && searchResults.length > 0 && (
                  <span className="ml-2 text-[var(--primary)]">
                    (búsqueda activa)
                  </span>
                )}
              </span>
            )}
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleClearAll}
              className="
                flex items-center gap-2 px-3 py-1.5
                text-sm text-[var(--subtext)] hover:text-white
                transition-colors duration-200
              "
            >
              <X className="w-3 h-3" />
              <span>Limpiar todo</span>
            </button>
          )}
        </div>

        {/* Active Filter Chips */}
        {activeFilterChips.length > 0 && (
          <FilterChips
            chips={activeFilterChips}
            onClearAll={handleClearAll}
            maxVisible={6}
            showClearAll={false} // We have our own clear button above
          />
        )}

      </div>

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {showAdvancedFilters && (
          <motion.div
            id="advanced-filters-panel"
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="
              bg-black/40 backdrop-blur border border-white/20 
              rounded-2xl p-6 overflow-hidden
            "
          >
            <div className="space-y-6">
              
              {/* Basic Filters */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  Filtros Básicos
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  {/* Comuna Filter */}
                  <div>
                    <label htmlFor="comuna-filter" className="block text-sm font-medium text-white mb-2">
                      Comuna
                    </label>
                    <select
                      id="comuna-filter"
                      value={filters.comuna}
                      onChange={(e) => handleFilterChange('comuna', e.target.value)}
                      className="
                        w-full px-3 py-2 
                        bg-white/10 border border-white/20 
                        rounded-xl text-white
                        focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50
                      "
                    >
                      <option value="Todas">Todas las comunas</option>
                      {filterOptions.comunas.map(comuna => (
                        <option key={comuna} value={comuna} className="bg-black">
                          {comuna}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Tipologia Filter */}
                  <div>
                    <label htmlFor="tipologia-filter" className="block text-sm font-medium text-white mb-2">
                      Tipología
                    </label>
                    <select
                      id="tipologia-filter"
                      value={filters.tipologia}
                      onChange={(e) => handleFilterChange('tipologia', e.target.value)}
                      className="
                        w-full px-3 py-2 
                        bg-white/10 border border-white/20 
                        rounded-xl text-white
                        focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50
                      "
                    >
                      <option value="Todas">Todas las tipologías</option>
                      {filterOptions.tipologias.map(tipologia => (
                        <option key={tipologia} value={tipologia} className="bg-black">
                          {tipologia}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label htmlFor="min-price-filter" className="block text-sm font-medium text-white mb-2">
                      Precio mínimo
                    </label>
                    <input
                      id="min-price-filter"
                      type="number"
                      value={filters.minPrice || ''}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : null)}
                      placeholder="$200.000"
                      className="
                        w-full px-3 py-2 
                        bg-white/10 border border-white/20 
                        rounded-xl text-white placeholder-[var(--subtext)]
                        focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50
                      "
                    />
                  </div>

                  <div>
                    <label htmlFor="max-price-filter" className="block text-sm font-medium text-white mb-2">
                      Precio máximo
                    </label>
                    <input
                      id="max-price-filter"
                      type="number"
                      value={filters.maxPrice || ''}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : null)}
                      placeholder="$800.000"
                      className="
                        w-full px-3 py-2 
                        bg-white/10 border border-white/20 
                        rounded-xl text-white placeholder-[var(--subtext)]
                        focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50
                      "
                    />
                  </div>

                </div>
              </div>

              {/* Advanced Filters */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  Filtros Avanzados
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  
                  {/* M2 Range */}
                  <div>
                    <label htmlFor="min-m2-filter" className="block text-sm font-medium text-white mb-2">
                      Metros² mínimos
                    </label>
                    <input
                      id="min-m2-filter"
                      type="number"
                      value={filters.minM2 || ''}
                      onChange={(e) => handleFilterChange('minM2', e.target.value ? Number(e.target.value) : null)}
                      placeholder="30"
                      className="
                        w-full px-3 py-2 
                        bg-white/10 border border-white/20 
                        rounded-xl text-white placeholder-[var(--subtext)]
                        focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50
                      "
                    />
                  </div>

                  <div>
                    <label htmlFor="max-m2-filter" className="block text-sm font-medium text-white mb-2">
                      Metros² máximos
                    </label>
                    <input
                      id="max-m2-filter"
                      type="number"
                      value={filters.maxM2 || ''}
                      onChange={(e) => handleFilterChange('maxM2', e.target.value ? Number(e.target.value) : null)}
                      placeholder="120"
                      className="
                        w-full px-3 py-2 
                        bg-white/10 border border-white/20 
                        rounded-xl text-white placeholder-[var(--subtext)]
                        focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50
                      "
                    />
                  </div>

                  {/* Boolean Filters */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={filters.estacionamiento === true}
                        onChange={(e) => handleFilterChange('estacionamiento', e.target.checked ? true : null)}
                        className="
                          w-4 h-4 text-[var(--primary)] 
                          bg-white/10 border-white/20 
                          rounded focus:ring-[var(--primary)]/50
                        "
                      />
                      <span className="text-sm text-white">Con estacionamiento</span>
                    </label>

                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={filters.bodega === true}
                        onChange={(e) => handleFilterChange('bodega', e.target.checked ? true : null)}
                        className="
                          w-4 h-4 text-[var(--primary)] 
                          bg-white/10 border-white/20 
                          rounded focus:ring-[var(--primary)]/50
                        "
                      />
                      <span className="text-sm text-white">Con bodega</span>
                    </label>

                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={filters.petFriendly === true}
                        onChange={(e) => handleFilterChange('petFriendly', e.target.checked ? true : null)}
                        className="
                          w-4 h-4 text-[var(--primary)] 
                          bg-white/10 border-white/20 
                          rounded focus:ring-[var(--primary)]/50
                        "
                      />
                      <span className="text-sm text-white">Pet friendly</span>
                    </label>
                  </div>

                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

// Re-export dependencies for easy import
export { useAdvancedFilters } from '../../hooks/useAdvancedFilters';
export type { AdvancedFilterValues } from '../../types/filters';
