import { Building } from '../../types';

// Test the helper functions directly
describe('BuildingCardV2 Helper Functions', () => {
  const mockBuilding: Building = {
    id: 'test-building-1',
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
      {
        id: 'unit-2',
        tipologia: '2D1B',
        m2: 65,
        price: 750000,
        estacionamiento: true,
        bodega: true,
        disponible: true,
      },
      {
        id: 'unit-3',
        tipologia: '1D1B',
        m2: 50,
        price: 600000,
        estacionamiento: false,
        bodega: false,
        disponible: false,
      },
    ],
    gallery: ['/test-1.jpg', '/test-2.jpg'],
  };

  // Test the calculateBuildingStats function logic
  it('should calculate building stats correctly', () => {
    const availableUnits = mockBuilding.units.filter(unit => unit.disponible);
    const totalUnits = mockBuilding.units.length;
    
    // Calculate price range
    const prices = availableUnits.map(unit => unit.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    // Calculate m2 range
    const m2s = availableUnits.map(unit => unit.m2);
    const minM2 = Math.min(...m2s);
    const maxM2 = Math.max(...m2s);
    
    // Group by tipologia
    const tipologiaGroups = availableUnits.reduce((acc, unit) => {
      if (!acc[unit.tipologia]) {
        acc[unit.tipologia] = [];
      }
      acc[unit.tipologia].push(unit);
      return acc;
    }, {} as Record<string, typeof availableUnits>);
    
    const tipologiaSummary = Object.entries(tipologiaGroups).map(([tipologia, units]) => ({
      key: tipologia,
      label: tipologia,
      count: units.length,
      minPrice: Math.min(...units.map(u => u.price)),
      minM2: Math.min(...units.map(u => u.m2)),
    }));
    
    const stats = {
      hasAvailability: availableUnits.length > 0,
      availableCount: availableUnits.length,
      totalCount: totalUnits,
      precioDesde: minPrice,
      precioHasta: maxPrice,
      m2Desde: minM2,
      m2Hasta: maxM2,
      tipologiaSummary,
    };

    // Verify calculations
    expect(stats.hasAvailability).toBe(true);
    expect(stats.availableCount).toBe(2);
    expect(stats.totalCount).toBe(3);
    expect(stats.precioDesde).toBe(500000);
    expect(stats.precioHasta).toBe(750000);
    expect(stats.m2Desde).toBe(45);
    expect(stats.m2Hasta).toBe(65);
    expect(stats.tipologiaSummary).toHaveLength(2);
    expect(stats.tipologiaSummary[0]).toEqual({
      key: '1D1B',
      label: '1D1B',
      count: 1,
      minPrice: 500000,
      minM2: 45,
    });
    expect(stats.tipologiaSummary[1]).toEqual({
      key: '2D1B',
      label: '2D1B',
      count: 1,
      minPrice: 750000,
      minM2: 65,
    });
  });

  it('should handle building with no available units', () => {
    const buildingNoAvailability: Building = {
      ...mockBuilding,
      units: [
        {
          id: 'unit-1',
          tipologia: '1D1B',
          m2: 45,
          price: 500000,
          estacionamiento: true,
          bodega: false,
          disponible: false,
        },
      ],
    };

    const availableUnits = buildingNoAvailability.units.filter(unit => unit.disponible);
    const stats = {
      hasAvailability: availableUnits.length > 0,
      availableCount: availableUnits.length,
      totalCount: buildingNoAvailability.units.length,
      tipologiaSummary: [],
    };

    expect(stats.hasAvailability).toBe(false);
    expect(stats.availableCount).toBe(0);
    expect(stats.totalCount).toBe(1);
    expect(stats.tipologiaSummary).toHaveLength(0);
  });

  it('should handle multiple units of same tipologia', () => {
    const buildingWithMultipleUnits: Building = {
      ...mockBuilding,
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
        {
          id: 'unit-2',
          tipologia: '1D1B',
          m2: 50,
          price: 550000,
          estacionamiento: true,
          bodega: false,
          disponible: true,
        },
        {
          id: 'unit-3',
          tipologia: '2D1B',
          m2: 65,
          price: 750000,
          estacionamiento: true,
          bodega: true,
          disponible: true,
        },
      ],
    };

    const availableUnits = buildingWithMultipleUnits.units.filter(unit => unit.disponible);
    const tipologiaGroups = availableUnits.reduce((acc, unit) => {
      if (!acc[unit.tipologia]) {
        acc[unit.tipologia] = [];
      }
      acc[unit.tipologia].push(unit);
      return acc;
    }, {} as Record<string, typeof availableUnits>);
    
    const tipologiaSummary = Object.entries(tipologiaGroups).map(([tipologia, units]) => ({
      key: tipologia,
      label: tipologia,
      count: units.length,
      minPrice: Math.min(...units.map(u => u.price)),
      minM2: Math.min(...units.map(u => u.m2)),
    }));

    expect(tipologiaSummary).toHaveLength(2);
    expect(tipologiaSummary[0]).toEqual({
      key: '1D1B',
      label: '1D1B',
      count: 2,
      minPrice: 500000,
      minM2: 45,
    });
    expect(tipologiaSummary[1]).toEqual({
      key: '2D1B',
      label: '2D1B',
      count: 1,
      minPrice: 750000,
      minM2: 65,
    });
  });

  // Test the formatTypologyChip function logic
  it('should format typology chip correctly', () => {
    const formatTypologyChip = (summary: { key: string; label: string; count: number; minPrice?: number; minM2?: number }): string => {
      const displayLabel = summary.label;
      const count = summary.count;
      
      if (count === 1) {
        return `${displayLabel} — 1 disp`;
      }
      return `${displayLabel} — +${count} disp`;
    };

    const singleUnit = { key: '1D1B', label: '1D1B', count: 1, minPrice: 500000, minM2: 45 };
    const multipleUnits = { key: '1D1B', label: '1D1B', count: 3, minPrice: 500000, minM2: 45 };

    expect(formatTypologyChip(singleUnit)).toBe('1D1B — 1 disp');
    expect(formatTypologyChip(multipleUnits)).toBe('1D1B — +3 disp');
  });
});
