import { renderHook, act } from '@testing-library/react';
import { useBuildingsStore } from '../../stores/buildingsStore';
import { Building } from '../../types';

// Mock de un building de prueba
const mockBuilding: Building = {
  id: 'test-1',
  name: 'Test Building',
  comuna: 'Las Condes',
  address: 'Test Address 123',
  cover: '/test-cover.jpg',
  amenities: ['gym', 'pool'],
  units: [
    {
      id: 'unit-1',
      tipologia: '1D1B',
      m2: 45,
      price: 500000,
      estacionamiento: true,
      bodega: false,
      disponible: true,
    },
  ],
  gallery: ['/test-1.jpg', '/test-2.jpg'],
};

describe('BuildingsStore', () => {
  beforeEach(() => {
    // Reset del store antes de cada test
    act(() => {
      useBuildingsStore().reset();
    });
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useBuildingsStore());
    
    expect(result.current.buildings).toEqual([]);
    expect(result.current.filteredBuildings).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.filters).toEqual({});
    expect(result.current.sort).toBe('price-asc');
  });

  it('should set buildings correctly', () => {
    const { result } = renderHook(() => useBuildingsStore());
    
    act(() => {
      result.current.setBuildings([mockBuilding]);
    });
    
    expect(result.current.buildings).toEqual([mockBuilding]);
    expect(result.current.filteredBuildings).toEqual([mockBuilding]);
  });

  it('should set loading state', () => {
    const { result } = renderHook(() => useBuildingsStore());
    
    act(() => {
      result.current.setLoading(true);
    });
    
    expect(result.current.loading).toBe(true);
  });

  it('should set error state', () => {
    const { result } = renderHook(() => useBuildingsStore());
    
    act(() => {
      result.current.setError('Test error');
    });
    
    expect(result.current.error).toBe('Test error');
  });

  it('should set filters correctly', () => {
    const { result } = renderHook(() => useBuildingsStore());
    
    act(() => {
      result.current.setFilters({ comuna: 'Las Condes', minPrice: 400000 });
    });
    
    expect(result.current.filters).toEqual({
      comuna: 'Las Condes',
      minPrice: 400000,
    });
  });

  it('should clear filters', () => {
    const { result } = renderHook(() => useBuildingsStore());
    
    // Set filters first
    act(() => {
      result.current.setFilters({ comuna: 'Las Condes' });
    });
    
    expect(result.current.filters).toEqual({ comuna: 'Las Condes' });
    
    // Clear filters
    act(() => {
      result.current.clearFilters();
    });
    
    expect(result.current.filters).toEqual({});
  });

  it('should set sort correctly', () => {
    const { result } = renderHook(() => useBuildingsStore());
    
    act(() => {
      result.current.setSort('price-desc');
    });
    
    expect(result.current.sort).toBe('price-desc');
  });

  it('should reset to initial state', () => {
    const { result } = renderHook(() => useBuildingsStore());
    
    // Modify state
    act(() => {
      result.current.setBuildings([mockBuilding]);
      result.current.setLoading(true);
      result.current.setError('Test error');
      result.current.setFilters({ comuna: 'Las Condes' });
      result.current.setSort('price-desc');
    });
    
    // Reset
    act(() => {
      result.current.reset();
    });
    
    expect(result.current.buildings).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.filters).toEqual({});
    expect(result.current.sort).toBe('price-asc');
  });
});
