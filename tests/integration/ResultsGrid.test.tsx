// Mocks deben ir antes de las importaciones
jest.doMock('../../lib/flags', () => {
  const mockFlags = {
    CARD_V2: false,
    VIRTUAL_GRID: false,
    PAGINATION: false,
    COMING_SOON: false,
  };

  return {
    ...jest.requireActual('../../lib/flags'),
    get CARD_V2() { return mockFlags.CARD_V2; },
    get VIRTUAL_GRID() { return mockFlags.VIRTUAL_GRID; },
    get PAGINATION() { return mockFlags.PAGINATION; },
    get COMING_SOON() { return mockFlags.COMING_SOON; },
    __setMockFlag: (flag: string, value: boolean) => {
      mockFlags[flag as keyof typeof mockFlags] = value;
    },
    __resetMockFlags: () => {
      mockFlags.CARD_V2 = false;
      mockFlags.VIRTUAL_GRID = false;
      mockFlags.PAGINATION = false;
      mockFlags.COMING_SOON = false;
    },
  };
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ResultsGrid } from '../../components/lists/ResultsGrid';
import { BuildingSummary } from '../../hooks/useFetchBuildings';
import { PromotionType } from '../../schemas/models';
import { applyOverride, CARD_V2 } from '../../lib/flags';

// Mock the hooks and components
jest.mock('../../hooks/useFetchBuildings', () => ({
  useFetchBuildings: jest.fn()
}));

const mockUseFetchBuildings = require('../../hooks/useFetchBuildings').useFetchBuildings;

jest.mock('../../components/BuildingCard', () => ({
  BuildingCard: ({ building }: { building: any }) => (
    <div data-testid="building-card-v1">
      <h3>{building.name}</h3>
      <p>{building.comuna}</p>
    </div>
  )
}));

jest.mock('../../components/ui/BuildingCardV2', () => ({
  BuildingCardV2: ({ building }: { building: any }) => (
    <div data-testid="building-card-v2">
      <h3>{building.name}</h3>
      <p>{building.comuna}</p>
    </div>
  )
}));

jest.mock('../../components/ui/BuildingCardSkeleton', () => ({
  BuildingCardSkeleton: () => <div data-testid="building-card-skeleton">Loading...</div>
}));



// Test wrapper with QueryClient
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

const mockBuildingSummary: BuildingSummary = {
  id: 'test-1',
  slug: 'test-building',
  name: 'Test Building',
  comuna: 'Las Condes',
  address: 'Test Address 123',
  gallery: ['/images/test-1.jpg', '/images/test-2.jpg'],
  coverImage: '/images/test-cover.jpg',
  badges: [
    {
      type: PromotionType.FREE_COMMISSION,
      label: 'Sin comisión',
      tag: 'Promoción'
    }
  ],
  serviceLevel: 'standard',
  precioDesde: 500000,
  precioRango: { min: 500000, max: 800000 },
  hasAvailability: true,
  typologySummary: [
    {
      key: '1D1B',
      label: '1D1B',
      count: 2,
      minPrice: 500000,
      minM2: 45
    },
    {
      key: '2D1B',
      label: '2D1B',
      count: 1,
      minPrice: 650000,
      minM2: 55
    }
  ]
};

import { useFetchBuildings } from '../../hooks/useFetchBuildings';
import * as flags from '../../lib/flags';

describe('ResultsGrid Integration', () => {
  const mockUseFetchBuildings = useFetchBuildings as jest.MockedFunction<typeof useFetchBuildings>;

  beforeEach(() => {
    jest.clearAllMocks();
    (flags as any).__resetMockFlags();
  });

  it('should render BuildingCardV2 when CARD_V2 flag is enabled', () => {
    // Mock the flag to be enabled
    applyOverride({ flag: 'CARD_V2', value: true, duration: 60 });
    console.log('CARD_V2 flag value:', CARD_V2);
    
    // Mock the hook to return data
    mockUseFetchBuildings.mockReturnValue({
      data: [mockBuildingSummary],
      isLoading: false,
      isFetching: false,
      error: null
    } as any);

    render(
      <ResultsGrid
        filters={{ comuna: 'Todas', tipologia: 'Todas', minPrice: null, maxPrice: null }}
        sort="default"
        onResultsChange={jest.fn()}
      />,
      { wrapper: createWrapper() }
    );

    // Should render BuildingCardV2
    expect(screen.getByTestId('building-card-v2')).toBeInTheDocument();
    expect(screen.getByText('Test Building')).toBeInTheDocument();
    expect(screen.getByText('Las Condes')).toBeInTheDocument();
  });

  it('should render BuildingCard when CARD_V2 flag is disabled', () => {
    // Mock the flag to be disabled
    applyOverride({ flag: 'CARD_V2', value: false, duration: 60 });
    
    // Mock the hook to return data
    mockUseFetchBuildings.mockReturnValue({
      data: [mockBuildingSummary],
      isLoading: false,
      isFetching: false,
      error: null
    } as any);

    render(
      <ResultsGrid
        filters={{ comuna: 'Todas', tipologia: 'Todas', minPrice: null, maxPrice: null }}
        sort="default"
        onResultsChange={jest.fn()}
      />,
      { wrapper: createWrapper() }
    );

    // Should render BuildingCard (v1)
    expect(screen.getByTestId('building-card-v1')).toBeInTheDocument();
    expect(screen.getByText('Test Building')).toBeInTheDocument();
    expect(screen.getByText('Las Condes')).toBeInTheDocument();
  });

  it('should show loading skeletons during fetch', () => {
    // Mock the hook to return loading state
    mockUseFetchBuildings.mockReturnValue({
      data: [],
      isLoading: true,
      isFetching: false,
      error: null
    } as any);

    render(
      <ResultsGrid
        filters={{ comuna: 'Todas', tipologia: 'Todas', minPrice: null, maxPrice: null }}
        sort="default"
        onResultsChange={jest.fn()}
      />,
      { wrapper: createWrapper() }
    );

    // Should show skeletons
    expect(screen.getAllByTestId('building-card-skeleton')).toHaveLength(8);
  });

  it('should show empty state when no results', () => {
    // Mock the hook to return empty data
    mockUseFetchBuildings.mockReturnValue({
      data: [],
      isLoading: false,
      isFetching: false,
      error: null
    } as any);

    render(
      <ResultsGrid
        filters={{ comuna: 'Todas', tipologia: 'Todas', minPrice: null, maxPrice: null }}
        sort="default"
        onResultsChange={jest.fn()}
      />,
      { wrapper: createWrapper() }
    );

    // Should show empty state
    expect(screen.getByText('No se encontraron propiedades')).toBeInTheDocument();
    expect(screen.getByText('Intenta ajustar tus filtros de búsqueda')).toBeInTheDocument();
  });
});
