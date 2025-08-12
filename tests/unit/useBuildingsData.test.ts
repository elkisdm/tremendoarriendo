import { renderHook, act, waitFor } from '@testing-library/react';
import { useBuildingsData, useFilteredBuildings, useBuildingsFilters, useBuildingsSort } from '../../hooks/useBuildingsData';
import { useBuildingsStore } from '../../stores/buildingsStore';
import { Building } from '../../types';

// Mock de fetch
global.fetch = jest.fn();

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

const mockBuilding2: Building = {
  id: 'test-2',
  name: 'Test Building 2',
  comuna: 'Providencia',
  address: 'Test Address 456',
  cover: '/test-cover-2.jpg',
  amenities: ['gym'],
  units: [
    {
      id: 'unit-2',
      tipologia: '2D2B',
      m2: 65,
      price: 750000,
      estacionamiento: true,
      bodega: true,
      disponible: true,
    },
  ],
  gallery: ['/test-3.jpg', '/test-4.jpg'],
};

describe('useBuildingsData', () => {
  beforeEach(() => {
    // Reset del store antes de cada test
    useBuildingsStore.getState().reset();
    
    // Reset del mock de fetch
    (fetch as jest.Mock).mockClear();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useBuildingsData());
    
    expect(result.current.buildings).toEqual([]);
    expect(result.current.filteredBuildings).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.filters).toEqual({});
    expect(result.current.sort).toBe('price-asc');
  });

  it('should fetch buildings on mount when no data exists', async () => {
    const mockResponse = { buildings: [mockBuilding, mockBuilding2] };
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const { result } = renderHook(() => useBuildingsData());

    // Esperar a que se complete el fetch
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(fetch).toHaveBeenCalledWith('/api/buildings');
    expect(result.current.buildings).toEqual([mockBuilding, mockBuilding2]);
    expect(result.current.filteredBuildings).toEqual([mockBuilding, mockBuilding2]);
  });

  it('should handle fetch errors', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useBuildingsData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Network error');
    expect(result.current.buildings).toEqual([]);
  });

  it('should filter buildings by comuna', async () => {
    // Setup: tener datos en el store
    useBuildingsStore.getState().setBuildings([mockBuilding, mockBuilding2]);

    const { result } = renderHook(() => useBuildingsData());

    // Aplicar filtro por comuna
    act(() => {
      result.current.updateFilters({ comuna: 'Las Condes' });
    });

    expect(result.current.filteredBuildings).toEqual([mockBuilding]);
    expect(result.current.filters.comuna).toBe('Las Condes');
  });

  it('should filter buildings by price range', async () => {
    // Setup: tener datos en el store
    useBuildingsStore.getState().setBuildings([mockBuilding, mockBuilding2]);

    const { result } = renderHook(() => useBuildingsData());

    // Aplicar filtro por precio
    act(() => {
      result.current.updateFilters({ minPrice: 600000 });
    });

    expect(result.current.filteredBuildings).toEqual([mockBuilding2]);
    expect(result.current.filters.minPrice).toBe(600000);
  });

  it('should sort buildings by price ascending', async () => {
    // Setup: tener datos en el store
    useBuildingsStore.getState().setBuildings([mockBuilding2, mockBuilding]); // Orden inverso

    const { result } = renderHook(() => useBuildingsData());

    // Aplicar ordenamiento
    act(() => {
      result.current.updateSort('price-asc');
    });

    expect(result.current.sort).toBe('price-asc');
    expect(result.current.filteredBuildings[0].id).toBe('test-1'); // El más barato primero
  });

  it('should sort buildings by name ascending', async () => {
    // Setup: tener datos en el store
    useBuildingsStore.getState().setBuildings([mockBuilding2, mockBuilding]); // Orden inverso

    const { result } = renderHook(() => useBuildingsData());

    // Aplicar ordenamiento
    act(() => {
      result.current.updateSort('name-asc');
    });

    expect(result.current.sort).toBe('name-asc');
    expect(result.current.filteredBuildings[0].name).toBe('Test Building');
  });

  it('should clear filters', async () => {
    // Setup: tener datos y filtros en el store
    useBuildingsStore.getState().setBuildings([mockBuilding, mockBuilding2]);
    useBuildingsStore.getState().setFilters({ comuna: 'Las Condes' });

    const { result } = renderHook(() => useBuildingsData());

    // Limpiar filtros
    act(() => {
      result.current.clearFilters();
    });

    expect(result.current.filters).toEqual({});
    expect(result.current.filteredBuildings).toEqual([mockBuilding, mockBuilding2]);
  });

  it('should refresh data', async () => {
    const mockResponse = { buildings: [mockBuilding] };
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const { result } = renderHook(() => useBuildingsData());

    // Llamar refresh
    act(() => {
      result.current.refresh();
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(fetch).toHaveBeenCalledWith('/api/buildings');
    expect(result.current.buildings).toEqual([mockBuilding]);
  });

  it('should combine filters and sorting', async () => {
    // Setup: tener datos en el store
    useBuildingsStore.getState().setBuildings([mockBuilding, mockBuilding2]);

    const { result } = renderHook(() => useBuildingsData());

    // Aplicar filtro y ordenamiento
    act(() => {
      result.current.updateFilters({ comuna: 'Las Condes' });
      result.current.updateSort('price-desc');
    });

    expect(result.current.filters.comuna).toBe('Las Condes');
    expect(result.current.sort).toBe('price-desc');
    expect(result.current.filteredBuildings).toEqual([mockBuilding]); // Solo Las Condes
  });
});

describe('useFilteredBuildings', () => {
  beforeEach(() => {
    useBuildingsStore.getState().reset();
  });

  it('should return only filtered buildings', () => {
    // Setup: tener datos en el store
    useBuildingsStore.getState().setBuildings([mockBuilding, mockBuilding2]);
    useBuildingsStore.getState().setFilteredBuildings([mockBuilding]);

    const { result } = renderHook(() => useFilteredBuildings());

    expect(result.current.buildings).toEqual([mockBuilding]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });
});

describe('useBuildingsFilters', () => {
  beforeEach(() => {
    useBuildingsStore.getState().reset();
  });

  it('should return filters and filter actions', () => {
    const { result } = renderHook(() => useBuildingsFilters());

    expect(result.current.filters).toEqual({});
    expect(typeof result.current.updateFilters).toBe('function');
    expect(typeof result.current.clearFilters).toBe('function');
  });
});

describe('useBuildingsSort', () => {
  beforeEach(() => {
    useBuildingsStore.getState().reset();
  });

  it('should return sort and sort actions', () => {
    const { result } = renderHook(() => useBuildingsSort());

    expect(result.current.sort).toBe('price-asc');
    expect(typeof result.current.updateSort).toBe('function');
  });
});
