import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useBuildingsPagination, useBuildingsInfinite } from '../../hooks/useBuildingsPagination';
import type { BuildingFilters } from '../../types/buildings';

// Mock fetch global
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock data
const mockBuildingsPage1 = [
  {
    id: '1',
    slug: 'building-1',
    name: 'Edificio Test 1',
    comuna: 'Las Condes',
    address: 'Av. Test 123',
    gallery: ['image1.jpg'],
    coverImage: 'cover1.jpg',
    badges: ['Nuevo'],
    serviceLevel: 'Premium',
    precioDesde: 150000,
    hasAvailability: true,
  },
  {
    id: '2',
    slug: 'building-2',
    name: 'Edificio Test 2',
    comuna: 'Providencia',
    address: 'Av. Test 456',
    gallery: ['image2.jpg'],
    coverImage: 'cover2.jpg',
    badges: ['Destacado'],
    serviceLevel: 'Standard',
    precioDesde: 120000,
    hasAvailability: true,
  },
];

const mockBuildingsPage2 = [
  {
    id: '3',
    slug: 'building-3',
    name: 'Edificio Test 3',
    comuna: 'Ñuñoa',
    address: 'Av. Test 789',
    gallery: ['image3.jpg'],
    coverImage: 'cover3.jpg',
    badges: [],
    serviceLevel: 'Standard',
    precioDesde: 100000,
    hasAvailability: false,
  },
];

const mockPaginatedResponse = (page: number, buildings: any[]) => ({
  buildings,
  pagination: {
    currentPage: page,
    totalPages: 2,
    totalCount: 3,
    hasNextPage: page < 2,
    hasPrevPage: page > 1,
    limit: 2,
  },
});

// Wrapper con QueryClient
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

describe('useBuildingsPagination', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Paginación básica', () => {
    it('debe cargar la primera página correctamente', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPaginatedResponse(1, mockBuildingsPage1),
      });

      const { result } = renderHook(
        () => useBuildingsPagination({ page: 1, limit: 2 }),
        { wrapper: createWrapper() }
      );

      expect(result.current.isLoading).toBe(true);
      expect(result.current.buildings).toEqual([]);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.buildings).toEqual(mockBuildingsPage1);
      expect(result.current.pagination).toEqual({
        currentPage: 1,
        totalPages: 2,
        totalCount: 3,
        hasNextPage: true,
        hasPrevPage: false,
        limit: 2,
      });

      expect(mockFetch).toHaveBeenCalledWith('/api/buildings/paginated?page=1&limit=2');
    });

    it('debe aplicar filtros correctamente', async () => {
      const filters: BuildingFilters = {
        comuna: 'Las Condes',
        minPrice: 100000,
        maxPrice: 200000,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPaginatedResponse(1, [mockBuildingsPage1[0]]),
      });

      const { result } = renderHook(
        () => useBuildingsPagination({ filters, page: 1, limit: 2 }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/buildings/paginated?comuna=Las+Condes&minPrice=100000&maxPrice=200000&page=1&limit=2'
      );
    });

    it('debe manejar errores de API', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => ({ error: 'Error del servidor' }),
      });

      const { result } = renderHook(
        () => useBuildingsPagination({ page: 1 }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeTruthy();
      expect(result.current.buildings).toEqual([]);
    });

    it('debe deshabilitar el hook cuando enabled es false', () => {
      const { result } = renderHook(
        () => useBuildingsPagination({ enabled: false }),
        { wrapper: createWrapper() }
      );

      expect(result.current.isLoading).toBe(false);
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe('Navegación de páginas', () => {
    it('debe proporcionar funciones de navegación', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPaginatedResponse(1, mockBuildingsPage1),
      });

      const { result } = renderHook(
        () => useBuildingsPagination({ page: 1 }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(typeof result.current.goToPage).toBe('function');
      expect(typeof result.current.nextPage).toBe('function');
      expect(typeof result.current.prevPage).toBe('function');
      expect(typeof result.current.refetch).toBe('function');
      expect(typeof result.current.invalidate).toBe('function');
    });
  });
});

describe('useBuildingsInfinite', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debe cargar páginas infinitas correctamente', async () => {
    // Mock para primera página
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockPaginatedResponse(1, mockBuildingsPage1),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockPaginatedResponse(2, mockBuildingsPage2),
      });

    const { result } = renderHook(
      () => useBuildingsInfinite({ limit: 2 }),
      { wrapper: createWrapper() }
    );

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Primera página cargada
    expect(result.current.buildings).toEqual(mockBuildingsPage1);
    expect(result.current.hasNextPage).toBe(true);

    // Cargar segunda página
    await result.current.fetchNextPage();

    await waitFor(() => {
      expect(result.current.isFetchingNextPage).toBe(false);
    });

    // Ambas páginas combinadas
    expect(result.current.buildings).toEqual([...mockBuildingsPage1, ...mockBuildingsPage2]);
    expect(result.current.hasNextPage).toBe(false);
  });

  it('debe aplicar filtros en infinite scroll', async () => {
    const filters: BuildingFilters = {
      tipologia: '2D',
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPaginatedResponse(1, mockBuildingsPage1),
    });

    const { result } = renderHook(
      () => useBuildingsInfinite({ filters, limit: 2 }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockFetch).toHaveBeenCalledWith('/api/buildings/paginated?tipologia=2D&page=1&limit=2');
  });

  it('debe proporcionar información de paginación combinada', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPaginatedResponse(1, mockBuildingsPage1),
    });

    const { result } = renderHook(
      () => useBuildingsInfinite({ limit: 2 }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.pagination).toEqual({
      currentPage: 1,
      totalPages: 2,
      totalCount: 3,
      hasNextPage: true,
      hasPrevPage: false,
      limit: 2,
      loadedPages: 1,
    });
  });

  it('debe manejar errores en infinite scroll', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: async () => ({ error: 'Error del servidor' }),
    });

    const { result } = renderHook(
      () => useBuildingsInfinite({ limit: 2 }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.buildings).toEqual([]);
  });
});

describe('Integración de cache', () => {
  it('debe usar cache para requests duplicados', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockPaginatedResponse(1, mockBuildingsPage1),
    });

    const wrapper = createWrapper();

    // Primer hook
    const { result: result1 } = renderHook(
      () => useBuildingsPagination({ page: 1 }),
      { wrapper }
    );

    await waitFor(() => {
      expect(result1.current.isLoading).toBe(false);
    });

    // Segundo hook con los mismos parámetros
    const { result: result2 } = renderHook(
      () => useBuildingsPagination({ page: 1 }),
      { wrapper }
    );

    // Debe usar cache, no loading
    expect(result2.current.isLoading).toBe(false);
    expect(result2.current.buildings).toEqual(mockBuildingsPage1);

    // Solo una llamada a fetch
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});
