import { useEffect, useCallback, useRef } from 'react';
import { useBuildingsStore } from '../stores/buildingsStore';
import { Building } from '../types';
import { BuildingFilters, SortOption } from '../types/buildings';

// Función para convertir BuildingFilters a FilterValues (compatibilidad con API existente)
const convertFiltersToAPI = (filters: BuildingFilters) => {
  return {
    comuna: filters.comuna || 'Todas',
    tipologia: filters.tipologia || 'Todas',
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
  };
};

// Función para convertir SortOption a string (compatibilidad con API existente)
const convertSortToAPI = (sort: SortOption): string => {
  switch (sort) {
    case 'price-asc': return 'price-asc';
    case 'price-desc': return 'price-desc';
    case 'm2-asc': return 'm2-asc';
    case 'm2-desc': return 'm2-desc';
    case 'name-asc': return 'name-asc';
    case 'name-desc': return 'name-desc';
    default: return 'default';
  }
};

// Función para filtrar buildings localmente
const filterBuildings = (buildings: Building[], filters: BuildingFilters): Building[] => {
  return buildings.filter(building => {
    // Filtro por comuna
    if (filters.comuna && building.comuna !== filters.comuna) {
      return false;
    }

    // Filtro por tipología
    if (filters.tipologia) {
      const hasTipologia = building.units.some(unit => 
        unit.tipologia.includes(filters.tipologia!)
      );
      if (!hasTipologia) return false;
    }

    // Filtro por precio
    if (filters.minPrice || filters.maxPrice) {
      const buildingPrices = building.units.map(unit => unit.price);
      const minBuildingPrice = Math.min(...buildingPrices);
      const maxBuildingPrice = Math.max(...buildingPrices);

      if (filters.minPrice && minBuildingPrice < filters.minPrice) return false;
      if (filters.maxPrice && maxBuildingPrice > filters.maxPrice) return false;
    }

    // Filtro por metros cuadrados
    if (filters.minM2 || filters.maxM2) {
      const buildingM2s = building.units.map(unit => unit.m2);
      const minBuildingM2 = Math.min(...buildingM2s);
      const maxBuildingM2 = Math.max(...buildingM2s);

      if (filters.minM2 && minBuildingM2 < filters.minM2) return false;
      if (filters.maxM2 && maxBuildingM2 > filters.maxM2) return false;
    }

    // Filtro por amenities
    if (filters.amenities && filters.amenities.length > 0) {
      const hasAllAmenities = filters.amenities.every(amenity =>
        building.amenities.includes(amenity)
      );
      if (!hasAllAmenities) return false;
    }

    return true;
  });
};

// Función para ordenar buildings
const sortBuildings = (buildings: Building[], sort: SortOption): Building[] => {
  const sorted = [...buildings];

  switch (sort) {
    case 'price-asc':
      return sorted.sort((a, b) => {
        const aMinPrice = Math.min(...a.units.map(u => u.price));
        const bMinPrice = Math.min(...b.units.map(u => u.price));
        return aMinPrice - bMinPrice;
      });

    case 'price-desc':
      return sorted.sort((a, b) => {
        const aMinPrice = Math.min(...a.units.map(u => u.price));
        const bMinPrice = Math.min(...b.units.map(u => u.price));
        return bMinPrice - aMinPrice;
      });

    case 'm2-asc':
      return sorted.sort((a, b) => {
        const aMinM2 = Math.min(...a.units.map(u => u.m2));
        const bMinM2 = Math.min(...b.units.map(u => u.m2));
        return aMinM2 - bMinM2;
      });

    case 'm2-desc':
      return sorted.sort((a, b) => {
        const aMinM2 = Math.min(...a.units.map(u => u.m2));
        const bMinM2 = Math.min(...b.units.map(u => u.m2));
        return bMinM2 - aMinM2;
      });

    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name, 'es'));

    case 'name-desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name, 'es'));

    default:
      return sorted;
  }
};

// Hook principal para manejar datos de buildings
export function useBuildingsData() {
  const {
    buildings,
    filteredBuildings,
    loading,
    error,
    filters,
    sort,
    setBuildings,
    setFilteredBuildings,
    setLoading,
    setError,
    setFilters,
    setSort,
    clearFilters,
    reset
  } = useBuildingsStore();

  // Usar refs para evitar dependencias en useCallback
  const filtersRef = useRef(filters);
  const sortRef = useRef(sort);
  
  // Actualizar refs cuando cambien los valores
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);
  
  useEffect(() => {
    sortRef.current = sort;
  }, [sort]);

  // Función para cargar datos desde la API
  const fetchBuildings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Usar valores actuales de los refs
      const currentFilters = filtersRef.current;
      const currentSort = sortRef.current;

      // Convertir filtros y sort para la API
      const apiFilters = convertFiltersToAPI(currentFilters);
      const apiSort = convertSortToAPI(currentSort);

      // Construir URL con parámetros
      const params = new URLSearchParams();
      if (apiFilters.comuna && apiFilters.comuna !== 'Todas') {
        params.append('comuna', apiFilters.comuna);
      }
      if (apiFilters.tipologia && apiFilters.tipologia !== 'Todas') {
        params.append('tipologia', apiFilters.tipologia);
      }
      if (apiFilters.minPrice) {
        params.append('minPrice', apiFilters.minPrice.toString());
      }
      if (apiFilters.maxPrice) {
        params.append('maxPrice', apiFilters.maxPrice.toString());
      }
      if (apiSort && apiSort !== 'default') {
        params.append('sort', apiSort);
      }

      const url = `/api/buildings${params.toString() ? `?${params.toString()}` : ''}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const buildingsData: Building[] = data.buildings || [];

      // Actualizar store con datos
      setBuildings(buildingsData);
      
      // Aplicar filtros y ordenamiento local
      const filtered = filterBuildings(buildingsData, currentFilters);
      const sorted = sortBuildings(filtered, currentSort);
      setFilteredBuildings(sorted);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setError(errorMessage);
      // console.error('Error fetching buildings:', error);
    } finally {
      setLoading(false);
    }
  }, [setBuildings, setError, setFilteredBuildings, setLoading]); // Dependencias mínimas

  // Función para actualizar filtros
  const updateFilters = useCallback((newFilters: Partial<BuildingFilters>) => {
    setFilters(newFilters);
    
    // Re-aplicar filtros y ordenamiento a los datos existentes
    const filtered = filterBuildings(buildings, { ...filters, ...newFilters });
    const sorted = sortBuildings(filtered, sort);
    setFilteredBuildings(sorted);
  }, [setFilters, setFilteredBuildings, buildings, filters, sort]);

  // Función para actualizar ordenamiento
  const updateSort = useCallback((newSort: SortOption) => {
    setSort(newSort);
    
    // Re-aplicar ordenamiento a los datos filtrados existentes
    const sorted = sortBuildings(filteredBuildings, newSort);
    setFilteredBuildings(sorted);
  }, [setSort, setFilteredBuildings, filteredBuildings]);

  // Función para limpiar filtros
  const clearFiltersAction = useCallback(() => {
    clearFilters();
    setFilteredBuildings(buildings);
  }, [clearFilters, setFilteredBuildings, buildings]);

  // Función para recargar datos
  const refresh = useCallback(() => {
    fetchBuildings();
  }, [fetchBuildings]);

  // Cargar datos iniciales al montar el componente (solo una vez)
  useEffect(() => {
    if (buildings.length === 0 && !loading) {
      fetchBuildings();
    }
  }, []); // Sin dependencias para evitar bucle infinito

  // Re-aplicar filtros cuando cambien los datos base
  useEffect(() => {
    if (buildings.length > 0) {
      const filtered = filterBuildings(buildings, filters);
      const sorted = sortBuildings(filtered, sort);
      setFilteredBuildings(sorted);
    }
  }, [buildings, filters, sort, setFilteredBuildings]); // Dependencias completas

  return {
    // Datos
    buildings,
    filteredBuildings,
    
    // Estado
    loading,
    error,
    
    // Filtros y ordenamiento
    filters,
    sort,
    
    // Acciones
    fetchBuildings,
    updateFilters,
    updateSort,
    clearFilters: clearFiltersAction,
    refresh,
    
    // Utilidades
    reset,
  };
}

// Hook simplificado para usar solo los datos filtrados
export function useFilteredBuildings() {
  const { filteredBuildings, loading, error } = useBuildingsData();
  return { buildings: filteredBuildings, loading, error };
}

// Hook para usar solo los filtros
export function useBuildingsFilters() {
  const { filters, updateFilters, clearFilters } = useBuildingsData();
  return { filters, updateFilters, clearFilters };
}

// Hook para usar solo el ordenamiento
export function useBuildingsSort() {
  const { sort, updateSort } = useBuildingsData();
  return { sort, updateSort };
}
