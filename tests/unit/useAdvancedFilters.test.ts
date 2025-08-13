/**
 * Tests for useAdvancedFilters hook
 */

import { renderHook, act } from '@testing-library/react';
import { useAdvancedFilters, toBasicFilters } from '../../hooks/useAdvancedFilters';
import type { Building } from '../../schemas/models';

// Mock Next.js router
const mockReplace = jest.fn();
const mockSearchParams = new Map();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
  useSearchParams: () => ({
    get: (key: string) => mockSearchParams.get(key) || null,
  }),
}));

// Mock buildings data for testing
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
  {
    id: '3',
    slug: 'torre-providencia',
    name: 'Torre Providencia',
    comuna: 'Providencia',
    address: 'Av. Providencia 789',
    amenities: ['Gimnasio', 'Terraza', 'Estacionamiento subterráneo'],
    gallery: ['image7.jpg', 'image8.jpg', 'image9.jpg'],
    units: [
      {
        id: 'unit3',
        tipologia: 'Studio',
        m2: 45,
        price: 280000,
        estacionamiento: true,
        bodega: false,
        disponible: true,
        bedrooms: 0,
        bathrooms: 1,
        amoblado: false,
        petFriendly: true,
      }
    ]
  }
];

describe('useAdvancedFilters', () => {
  beforeEach(() => {
    mockReplace.mockClear();
    mockSearchParams.clear();
  });

  describe('initialization', () => {
    it('should initialize with default filters', () => {
      const { result } = renderHook(() => 
        useAdvancedFilters({ buildings: mockBuildings, urlSync: false })
      );

      expect(result.current.filters.comuna).toBe('Todas');
      expect(result.current.filters.tipologia).toBe('Todas');
      expect(result.current.filters.query).toBe('');
      expect(result.current.filters.amenities).toEqual([]);
      expect(result.current.filteredBuildings).toHaveLength(3);
    });

    it('should initialize with custom initial filters', () => {
      const { result } = renderHook(() => 
        useAdvancedFilters({ 
          buildings: mockBuildings, 
          urlSync: false,
          initialFilters: { comuna: 'Las Condes', query: 'test' }
        })
      );

      expect(result.current.filters.comuna).toBe('Las Condes');
      expect(result.current.filters.query).toBe('test');
    });

    it('should initialize from URL params when urlSync is enabled', () => {
      mockSearchParams.set('comuna', 'Ñuñoa');
      mockSearchParams.set('q', 'search test');
      mockSearchParams.set('amenities', 'Piscina,Gimnasio');

      const { result } = renderHook(() => 
        useAdvancedFilters({ buildings: mockBuildings, urlSync: true })
      );

      expect(result.current.filters.comuna).toBe('Ñuñoa');
      expect(result.current.filters.query).toBe('search test');
      expect(result.current.filters.amenities).toEqual(['Piscina', 'Gimnasio']);
    });
  });

  describe('basic filtering', () => {
    it('should filter by comuna', () => {
      const { result } = renderHook(() => 
        useAdvancedFilters({ buildings: mockBuildings, urlSync: false })
      );

      act(() => {
        result.current.setFilters({ comuna: 'Las Condes' });
      });

      expect(result.current.filteredBuildings).toHaveLength(1);
      expect(result.current.filteredBuildings[0].comuna).toBe('Las Condes');
    });

    it('should filter by tipologia', () => {
      const { result } = renderHook(() => 
        useAdvancedFilters({ buildings: mockBuildings, urlSync: false })
      );

      act(() => {
        result.current.setFilters({ tipologia: 'Studio' });
      });

      expect(result.current.filteredBuildings).toHaveLength(1);
      expect(result.current.filteredBuildings[0].units[0].tipologia).toBe('Studio');
    });

    it('should filter by price range', () => {
      const { result } = renderHook(() => 
        useAdvancedFilters({ buildings: mockBuildings, urlSync: false })
      );

      act(() => {
        result.current.setFilters({ minPrice: 300000, maxPrice: 400000 });
      });

      expect(result.current.filteredBuildings).toHaveLength(1);
      expect(result.current.filteredBuildings[0].units[0].price).toBe(350000);
    });
  });

  describe('advanced filtering', () => {
    it('should filter by search query', () => {
      const { result } = renderHook(() => 
        useAdvancedFilters({ buildings: mockBuildings, urlSync: false })
      );

      act(() => {
        result.current.setQuery('Edificio');
      });

      expect(result.current.filteredBuildings).toHaveLength(1);
      expect(result.current.filteredBuildings[0].name).toBe('Edificio Las Condes');
      expect(result.current.searchResults).toHaveLength(1);
    });

    it('should filter by amenities', () => {
      const { result } = renderHook(() => 
        useAdvancedFilters({ buildings: mockBuildings, urlSync: false })
      );

      act(() => {
        result.current.setFilters({ amenities: ['Piscina'] });
      });

      expect(result.current.filteredBuildings).toHaveLength(2); // Las Condes and Ñuñoa
      expect(result.current.filteredBuildings.every(b => 
        b.amenities.includes('Piscina')
      )).toBe(true);
    });

    it('should filter by m2 range', () => {
      const { result } = renderHook(() => 
        useAdvancedFilters({ buildings: mockBuildings, urlSync: false })
      );

      act(() => {
        result.current.setFilters({ minM2: 70 });
      });

      expect(result.current.filteredBuildings).toHaveLength(1);
      expect(result.current.filteredBuildings[0].units[0].m2).toBe(80);
    });

    it('should filter by estacionamiento', () => {
      const { result } = renderHook(() => 
        useAdvancedFilters({ buildings: mockBuildings, urlSync: false })
      );

      act(() => {
        result.current.setFilters({ estacionamiento: true });
      });

      expect(result.current.filteredBuildings).toHaveLength(2); // Las Condes and Providencia
      expect(result.current.filteredBuildings.every(b => 
        b.units.some(u => u.estacionamiento === true)
      )).toBe(true);
    });

    it('should filter by multiple criteria', () => {
      const { result } = renderHook(() => 
        useAdvancedFilters({ buildings: mockBuildings, urlSync: false })
      );

      act(() => {
        result.current.setFilters({ 
          comuna: 'Las Condes',
          amenities: ['Piscina'],
          estacionamiento: true
        });
      });

      expect(result.current.filteredBuildings).toHaveLength(1);
      expect(result.current.filteredBuildings[0].comuna).toBe('Las Condes');
    });
  });

  describe('filter chips', () => {
    it('should generate filter chips for active filters', () => {
      const { result } = renderHook(() => 
        useAdvancedFilters({ buildings: mockBuildings, urlSync: false })
      );

      act(() => {
        result.current.setFilters({ 
          comuna: 'Las Condes',
          query: 'test search',
          amenities: ['Piscina', 'Gimnasio']
        });
      });

      const chips = result.current.activeFilterChips;
      expect(chips).toHaveLength(4); // query + comuna + 2 amenities
      
      const queryChip = chips.find(c => c.id === 'query');
      expect(queryChip?.value).toBe('"test search"');
      
      const comunaChip = chips.find(c => c.id === 'comuna');
      expect(comunaChip?.value).toBe('Las Condes');
    });

    it('should remove filters when chip onRemove is called', () => {
      const { result } = renderHook(() => 
        useAdvancedFilters({ buildings: mockBuildings, urlSync: false })
      );

      act(() => {
        result.current.setFilters({ comuna: 'Las Condes' });
      });

      expect(result.current.filters.comuna).toBe('Las Condes');

      act(() => {
        const comunaChip = result.current.activeFilterChips.find(c => c.id === 'comuna');
        comunaChip?.onRemove();
      });

      expect(result.current.filters.comuna).toBe('Todas');
    });
  });

  describe('filter state', () => {
    it('should detect when filters are active', () => {
      const { result } = renderHook(() => 
        useAdvancedFilters({ buildings: mockBuildings, urlSync: false })
      );

      expect(result.current.hasActiveFilters).toBe(false);

      act(() => {
        result.current.setFilters({ comuna: 'Las Condes' });
      });

      expect(result.current.hasActiveFilters).toBe(true);
    });

    it('should clear all filters', () => {
      const { result } = renderHook(() => 
        useAdvancedFilters({ buildings: mockBuildings, urlSync: false })
      );

      act(() => {
        result.current.setFilters({ 
          comuna: 'Las Condes',
          query: 'test',
          amenities: ['Piscina']
        });
      });

      expect(result.current.hasActiveFilters).toBe(true);

      act(() => {
        result.current.clearFilters();
      });

      expect(result.current.hasActiveFilters).toBe(false);
      expect(result.current.filters.comuna).toBe('Todas');
      expect(result.current.filters.query).toBe('');
      expect(result.current.filters.amenities).toEqual([]);
    });
  });

  describe('analytics', () => {
    it('should provide filter analytics', () => {
      const { result } = renderHook(() => 
        useAdvancedFilters({ buildings: mockBuildings, urlSync: false })
      );

      act(() => {
        result.current.setFilters({ 
          comuna: 'Las Condes',
          query: 'search test',
          amenities: ['Piscina']
        });
      });

      const analytics = result.current.getFilterAnalytics();
      
      expect(analytics.totalFilters).toBe(3);
      expect(analytics.searchQuery).toBe('search test');
      expect(analytics.filtersUsed).toContain('comuna');
      expect(analytics.filtersUsed).toContain('query');
      expect(analytics.filtersUsed).toContain('amenities');
      expect(analytics.resultCount).toBe(result.current.resultsCount);
    });
  });

  describe('backward compatibility', () => {
    it('should convert to basic FilterValues', () => {
      const { result } = renderHook(() => 
        useAdvancedFilters({ buildings: mockBuildings, urlSync: false })
      );

      act(() => {
        result.current.setFilters({ 
          comuna: 'Las Condes',
          tipologia: '2D2B',
          minPrice: 300000,
          maxPrice: 500000,
          query: 'advanced query', // this should not be included
          amenities: ['Piscina'] // this should not be included
        });
      });

      const basicFilters = toBasicFilters(result.current.filters);
      
      expect(basicFilters).toEqual({
        comuna: 'Las Condes',
        tipologia: '2D2B',
        minPrice: 300000,
        maxPrice: 500000,
      });
      
      expect(basicFilters).not.toHaveProperty('query');
      expect(basicFilters).not.toHaveProperty('amenities');
    });
  });
});
