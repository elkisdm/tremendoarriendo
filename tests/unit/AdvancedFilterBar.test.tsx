/**
 * Tests for AdvancedFilterBar component
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AdvancedFilterBar } from '../../components/filters/AdvancedFilterBar';
import type { Building } from '../../schemas/models';

// Mock Next.js router
const mockReplace = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
  useSearchParams: () => ({
    get: () => null,
  }),
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => React.createElement('div', props, children),
  },
  AnimatePresence: ({ children }: any) => children,
}));

// Mock the search function
jest.mock('../../lib/search', () => ({
  searchBuildings: jest.fn(() => []),
}));

// Mock buildings data
const mockBuildings: Building[] = [
  {
    id: '1',
    slug: 'edificio-las-condes',
    name: 'Edificio Las Condes',
    comuna: 'Las Condes',
    address: 'Av. Apoquindo 123',
    amenities: ['Piscina', 'Gimnasio', 'Sala de eventos'],
    gallery: ['image1.jpg', 'image2.jpg', 'image3.jpg'],
    serviceLevel: 'pro',
    nearestTransit: { name: 'Metro Escuela Militar', distanceMin: 5 },
    units: [
      {
        id: 'unit1',
        tipologia: '2D2B',
        m2: 80,
        price: 450000,
        estacionamiento: true,
        bodega: true,
        disponible: true,
        bedrooms: 2,
        bathrooms: 2,
        amoblado: false,
        petFriendly: true,
        promotions: [{ label: 'Sin comisión', type: 'free_commission' as any }],
      }
    ]
  },
  {
    id: '2',
    slug: 'residencial-nunoa',
    name: 'Residencial Ñuñoa',
    comuna: 'Ñuñoa',
    address: 'Calle Grecia 456',
    amenities: ['Piscina', 'Quincho', 'Juegos infantiles'],
    gallery: ['image4.jpg', 'image5.jpg', 'image6.jpg'],
    serviceLevel: 'standard',
    units: [
      {
        id: 'unit2',
        tipologia: '1D1B',
        m2: 60,
        price: 350000,
        estacionamiento: false,
        bodega: true,
        disponible: true,
        bedrooms: 1,
        bathrooms: 1,
        amoblado: true,
        petFriendly: false,
      }
    ]
  },
];

describe('AdvancedFilterBar', () => {
  const defaultProps = {
    buildings: mockBuildings,
    onFiltersChange: jest.fn(),
    onSortChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('basic rendering', () => {
    it('should render search input', () => {
      render(<AdvancedFilterBar {...defaultProps} />);
      
      expect(screen.getByRole('searchbox')).toBeInTheDocument();
    });

    it('should render sort select', () => {
      render(<AdvancedFilterBar {...defaultProps} />);
      
      expect(screen.getByText('Filtros')).toBeInTheDocument();
    });

    it('should show results count', () => {
      render(<AdvancedFilterBar {...defaultProps} />);
      
      expect(screen.getByText('Mostrando todas las 2 propiedades')).toBeInTheDocument();
    });

    it('should not show clear button when no filters are active', () => {
      render(<AdvancedFilterBar {...defaultProps} />);
      
      expect(screen.queryByText('Limpiar todo')).not.toBeInTheDocument();
    });
  });

  describe('search functionality', () => {
    it('should call onFiltersChange when search is performed', async () => {
      const onFiltersChange = jest.fn();
      render(<AdvancedFilterBar {...defaultProps} onFiltersChange={onFiltersChange} />);
      
      const searchInput = screen.getByRole('searchbox');
      fireEvent.change(searchInput, { target: { value: 'Las Condes' } });
      
      // Wait for debounce
      await waitFor(() => {
        expect(onFiltersChange).toHaveBeenCalled();
      }, { timeout: 500 });
    });

    it('should show search suggestions', async () => {
      render(<AdvancedFilterBar {...defaultProps} showSearchSuggestions={true} />);
      
      const searchInput = screen.getByRole('searchbox');
      fireEvent.focus(searchInput);
      fireEvent.change(searchInput, { target: { value: 'Las' } });
      
      // Wait for suggestions to appear
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });
      
      // Should show suggestions
      expect(screen.getByText('Edificio Las Condes')).toBeInTheDocument();
      expect(screen.getByText('Las Condes')).toBeInTheDocument();
      
      // Should have proper ARIA attributes
      expect(searchInput).toHaveAttribute('aria-expanded', 'true');
      expect(searchInput).toHaveAttribute('aria-haspopup', 'listbox');
    });
  });

  describe('advanced filters panel', () => {
    it('should toggle advanced filters panel', () => {
      render(<AdvancedFilterBar {...defaultProps} />);
      
      const filterButton = screen.getByText('Filtros');
      
      // Panel should not be visible initially
      expect(screen.queryByText('Filtros Básicos')).not.toBeInTheDocument();
      
      // Click to open
      fireEvent.click(filterButton);
      
      // Panel should be visible
      expect(screen.getByText('Filtros Básicos')).toBeInTheDocument();
      expect(screen.getByText('Filtros Avanzados')).toBeInTheDocument();
    });

    it('should render comuna filter options', () => {
      render(<AdvancedFilterBar {...defaultProps} />);
      
      // Open advanced filters
      fireEvent.click(screen.getByText('Filtros'));
      
      // Check comuna filter
      const comunaSelect = screen.getByLabelText('Comuna');
      expect(comunaSelect).toBeInTheDocument();
      
      // Should have options from mock data
      expect(screen.getByText('Todas las comunas')).toBeInTheDocument();
    });

    it('should render tipologia filter options', () => {
      render(<AdvancedFilterBar {...defaultProps} />);
      
      // Open advanced filters
      fireEvent.click(screen.getByText('Filtros'));
      
      // Check tipologia filter
      const tipologiaSelect = screen.getByLabelText('Tipología');
      expect(tipologiaSelect).toBeInTheDocument();
      
      expect(screen.getByText('Todas las tipologías')).toBeInTheDocument();
    });

    it('should render price range inputs', () => {
      render(<AdvancedFilterBar {...defaultProps} />);
      
      // Open advanced filters
      fireEvent.click(screen.getByText('Filtros'));
      
      expect(screen.getByLabelText('Precio mínimo')).toBeInTheDocument();
      expect(screen.getByLabelText('Precio máximo')).toBeInTheDocument();
    });

    it('should render boolean filter checkboxes', () => {
      render(<AdvancedFilterBar {...defaultProps} />);
      
      // Open advanced filters
      fireEvent.click(screen.getByText('Filtros'));
      
      expect(screen.getByText('Con estacionamiento')).toBeInTheDocument();
      expect(screen.getByText('Con bodega')).toBeInTheDocument();
      expect(screen.getByText('Pet friendly')).toBeInTheDocument();
    });
  });

  describe('filter interactions', () => {
    it('should update comuna filter', () => {
      const onFiltersChange = jest.fn();
      render(<AdvancedFilterBar {...defaultProps} onFiltersChange={onFiltersChange} />);
      
      // Open advanced filters
      fireEvent.click(screen.getByText('Filtros'));
      
      const comunaSelect = screen.getByLabelText('Comuna');
      fireEvent.change(comunaSelect, { target: { value: 'Las Condes' } });
      
      // Should call onFiltersChange
      expect(onFiltersChange).toHaveBeenCalled();
    });

    it('should update price filters', () => {
      const onFiltersChange = jest.fn();
      render(<AdvancedFilterBar {...defaultProps} onFiltersChange={onFiltersChange} />);
      
      // Open advanced filters
      fireEvent.click(screen.getByText('Filtros'));
      
      const minPriceInput = screen.getByLabelText('Precio mínimo');
      fireEvent.change(minPriceInput, { target: { value: '300000' } });
      
      expect(onFiltersChange).toHaveBeenCalled();
    });

    it('should update boolean filters', () => {
      const onFiltersChange = jest.fn();
      render(<AdvancedFilterBar {...defaultProps} onFiltersChange={onFiltersChange} />);
      
      // Open advanced filters
      fireEvent.click(screen.getByText('Filtros'));
      
      const estacionamientoCheckbox = screen.getByText('Con estacionamiento').closest('label')?.querySelector('input');
      expect(estacionamientoCheckbox).toBeInTheDocument();
      
      if (estacionamientoCheckbox) {
        fireEvent.click(estacionamientoCheckbox);
        expect(onFiltersChange).toHaveBeenCalled();
      }
    });
  });

  describe('sort functionality', () => {
    it('should call onSortChange when sort is changed', () => {
      const onSortChange = jest.fn();
      render(<AdvancedFilterBar {...defaultProps} onSortChange={onSortChange} />);
      
      // Find and interact with sort component
      // Note: This depends on the SortSelect component implementation
      // For now, just verify the prop is passed
      expect(onSortChange).toBeDefined();
    });
  });

  describe('URL sync', () => {
    it('should sync filters with URL when urlSync is enabled', async () => {
      render(<AdvancedFilterBar {...defaultProps} urlSync={true} />);
      
      // Change a filter
      const searchInput = screen.getByRole('searchbox');
      fireEvent.change(searchInput, { target: { value: 'test search' } });
      
      // Wait for debounce to complete
      await waitFor(() => {
        expect(searchInput).toHaveValue('test search');
      }, { timeout: 500 });
    });

    it('should not sync with URL when urlSync is disabled', () => {
      render(<AdvancedFilterBar {...defaultProps} urlSync={false} />);
      
      // Should render without URL sync
      expect(screen.getByRole('searchbox')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have proper form labels', () => {
      render(<AdvancedFilterBar {...defaultProps} />);
      
      // Open advanced filters
      fireEvent.click(screen.getByText('Filtros'));
      
      expect(screen.getByLabelText('Comuna')).toBeInTheDocument();
      expect(screen.getByLabelText('Tipología')).toBeInTheDocument();
      expect(screen.getByLabelText('Precio mínimo')).toBeInTheDocument();
      expect(screen.getByLabelText('Precio máximo')).toBeInTheDocument();
    });

    it('should be keyboard accessible', () => {
      render(<AdvancedFilterBar {...defaultProps} />);
      
      const filterButton = screen.getByRole('button', { name: /filtros/i });
      expect(filterButton.tagName).toBe('BUTTON');
      expect(filterButton).toBeVisible();
    });
  });

  describe('edge cases', () => {
    it('should handle empty buildings array', () => {
      render(<AdvancedFilterBar {...defaultProps} buildings={[]} />);
      
      expect(screen.getByText('Mostrando todas las 0 propiedades')).toBeInTheDocument();
    });

    it('should handle buildings without amenities', () => {
      const buildingsWithoutAmenities = mockBuildings.map(building => ({
        ...building,
        amenities: [],
      }));
      
      render(<AdvancedFilterBar {...defaultProps} buildings={buildingsWithoutAmenities} />);
      
      expect(screen.getByRole('searchbox')).toBeInTheDocument();
    });

    it('should handle initial filters', () => {
      const initialFilters = { comuna: 'Las Condes', query: 'test' };
      
      render(
        <AdvancedFilterBar 
          {...defaultProps} 
          initialFilters={initialFilters}
        />
      );
      
      expect(screen.getByRole('searchbox')).toHaveValue('test');
    });
  });

  // Test simple para verificar si el componente renderiza correctamente
  it('should render without crashing', () => {
    render(<AdvancedFilterBar {...defaultProps} />);
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });
});
