import React from 'react';
import { render, screen } from '@testing-library/react';
import { ResultsGrid } from '../../components/lists/ResultsGrid';
import { BuildingSummary } from '../../hooks/useFetchBuildings';
import { PromotionType } from '../../schemas/models';

// Mock the hooks and components
jest.mock('../../hooks/useFetchBuildings', () => ({
  useFetchBuildings: jest.fn()
}));

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

// Mock the flags module
jest.mock('../../lib/flags', () => ({
  CARD_V2: false
}));

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

describe('ResultsGrid Integration', () => {
  const mockUseFetchBuildings = require('../../hooks/useFetchBuildings').useFetchBuildings;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render BuildingCardV2 when CARD_V2 flag is enabled', () => {
    // Mock the flag to be enabled
    const flags = require('../../lib/flags');
    flags.CARD_V2 = true;
    
    // Mock the hook to return data
    mockUseFetchBuildings.mockReturnValue({
      data: [mockBuildingSummary],
      isLoading: false,
      isFetching: false,
      error: null
    });

    render(
      <ResultsGrid
        filters={{ comuna: 'Todas', tipologia: 'Todas', minPrice: null, maxPrice: null }}
        sort="default"
        onResultsChange={jest.fn()}
      />
    );

    // Should render BuildingCardV2
    expect(screen.getByTestId('building-card-v2')).toBeInTheDocument();
    expect(screen.getByText('Test Building')).toBeInTheDocument();
    expect(screen.getByText('Las Condes')).toBeInTheDocument();
  });

  it('should render BuildingCard when CARD_V2 flag is disabled', () => {
    // Mock the flag to be disabled
    const flags = require('../../lib/flags');
    flags.CARD_V2 = false;
    
    // Mock the hook to return data
    mockUseFetchBuildings.mockReturnValue({
      data: [mockBuildingSummary],
      isLoading: false,
      isFetching: false,
      error: null
    });

    render(
      <ResultsGrid
        filters={{ comuna: 'Todas', tipologia: 'Todas', minPrice: null, maxPrice: null }}
        sort="default"
        onResultsChange={jest.fn()}
      />
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
    });

    render(
      <ResultsGrid
        filters={{ comuna: 'Todas', tipologia: 'Todas', minPrice: null, maxPrice: null }}
        sort="default"
        onResultsChange={jest.fn()}
      />
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
    });

    render(
      <ResultsGrid
        filters={{ comuna: 'Todas', tipologia: 'Todas', minPrice: null, maxPrice: null }}
        sort="default"
        onResultsChange={jest.fn()}
      />
    );

    // Should show empty state
    expect(screen.getByText('No se encontraron propiedades')).toBeInTheDocument();
    expect(screen.getByText('Intenta ajustar tus filtros de búsqueda')).toBeInTheDocument();
  });
});
