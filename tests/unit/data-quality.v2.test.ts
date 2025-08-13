import {
  isAvailableForPublishing,
  parse_ids_or_pipe,
  normalizeOrientation,
  validateGuaranteeInstallments,
  validateGuaranteeMonths,
  determineGCMode,
  validateLinkListing,
  normalizeComuna,
  normalizeTypology,
  correctArea,
  calculateNoGuaranteeSurcharge
} from '@lib/adapters/assetplan';

import {
  calculatePriceFrom,
  calculatePriceTo,
  calculateRentaMinima,
  calculateFeaturedFlag,
  hasAvailability
} from '@lib/derive';

import type { Unit } from '@schemas/models';

describe('Data Quality v2 - Transformation Functions', () => {
  describe('isAvailableForPublishing', () => {
    test('should return true for valid states with price > 1', () => {
      expect(isAvailableForPublishing('RE - Acondicionamiento', 500000)).toBe(true);
      expect(isAvailableForPublishing('Lista para arrendar', 750000)).toBe(true);
    });

    test('should return false for invalid states', () => {
      expect(isAvailableForPublishing('Arrendado', 500000)).toBe(false);
      expect(isAvailableForPublishing('En construcción', 500000)).toBe(false);
    });

    test('should return false for price <= 1', () => {
      expect(isAvailableForPublishing('RE - Acondicionamiento', 1)).toBe(false);
      expect(isAvailableForPublishing('Lista para arrendar', 0)).toBe(false);
    });
  });

  describe('parse_ids_or_pipe', () => {
    test('should parse valid pipe-separated IDs', () => {
      expect(parse_ids_or_pipe('31|32')).toEqual({ ids: '31|32', has_optional: false });
      expect(parse_ids_or_pipe('15')).toEqual({ ids: '15', has_optional: false });
    });

    test('should handle optional value "x"', () => {
      expect(parse_ids_or_pipe('x')).toEqual({ ids: null, has_optional: true });
    });

    test('should reject invalid formats', () => {
      expect(parse_ids_or_pipe('abc|def')).toEqual({ ids: null, has_optional: false });
      expect(parse_ids_or_pipe('31|')).toEqual({ ids: null, has_optional: false });
      expect(parse_ids_or_pipe('|32')).toEqual({ ids: null, has_optional: false });
    });

    test('should handle undefined/null', () => {
      expect(parse_ids_or_pipe(undefined)).toEqual({ ids: null, has_optional: false });
    });
  });

  describe('normalizeOrientation', () => {
    test('should normalize valid orientations', () => {
      expect(normalizeOrientation('n')).toBe('N');
      expect(normalizeOrientation('NE')).toBe('NE');
      expect(normalizeOrientation('  se  ')).toBe('SE');
    });

    test('should reject invalid orientations', () => {
      expect(normalizeOrientation('NORTE')).toBeUndefined();
      expect(normalizeOrientation('SUR')).toBeUndefined();
      expect(normalizeOrientation('XYZ')).toBeUndefined();
    });

    test('should handle undefined/null', () => {
      expect(normalizeOrientation(undefined)).toBeUndefined();
    });
  });

  describe('validateGuaranteeInstallments', () => {
    test('should accept valid installments', () => {
      expect(validateGuaranteeInstallments(1)).toBe(1);
      expect(validateGuaranteeInstallments(6)).toBe(6);
      expect(validateGuaranteeInstallments(12)).toBe(12);
    });

    test('should reject invalid installments', () => {
      expect(validateGuaranteeInstallments(0)).toBeUndefined();
      expect(validateGuaranteeInstallments(13)).toBeUndefined();
      expect(validateGuaranteeInstallments(-1)).toBeUndefined();
    });

    test('should handle undefined/null', () => {
      expect(validateGuaranteeInstallments(undefined)).toBeUndefined();
    });
  });

  describe('validateGuaranteeMonths', () => {
    test('should accept valid months', () => {
      expect(validateGuaranteeMonths(0)).toBe(0);
      expect(validateGuaranteeMonths(1)).toBe(1);
      expect(validateGuaranteeMonths(2)).toBe(2);
    });

    test('should reject invalid months', () => {
      expect(validateGuaranteeMonths(3)).toBeUndefined();
      expect(validateGuaranteeMonths(-1)).toBeUndefined();
    });

    test('should handle undefined/null', () => {
      expect(validateGuaranteeMonths(undefined)).toBeUndefined();
    });
  });

  describe('determineGCMode', () => {
    test('should return variable for OP exceptions', () => {
      expect(determineGCMode('MF', 'VISD')).toBe('variable');
      expect(determineGCMode('MF', 'SNMD')).toBe('variable');
      expect(determineGCMode('MF', 'LIAD')).toBe('variable');
      expect(determineGCMode('MF', 'MRSD')).toBe('variable');
    });

    test('should return variable for retail', () => {
      expect(determineGCMode('retail', 'ANY_ID')).toBe('variable');
      expect(determineGCMode('RETAIL', 'ANY_ID')).toBe('variable');
    });

    test('should return MF for normal cases', () => {
      expect(determineGCMode('MF', 'NORMAL_ID')).toBe('MF');
      expect(determineGCMode(undefined, 'NORMAL_ID')).toBe('MF');
    });
  });

  describe('validateLinkListing', () => {
    test('should accept valid URLs with unit numbers', () => {
      expect(validateLinkListing('https://example.com/unit-101')).toBe('https://example.com/unit-101');
      expect(validateLinkListing('http://example.com/listing/123')).toBe('http://example.com/listing/123');
    });

    test('should reject URLs without unit numbers', () => {
      expect(validateLinkListing('https://example.com/listing')).toBeNull();
      expect(validateLinkListing('http://example.com/')).toBeNull();
    });

    test('should reject invalid URLs', () => {
      expect(validateLinkListing('not-a-url')).toBeNull();
      expect(validateLinkListing('ftp://example.com/123')).toBeNull();
    });

    test('should handle undefined/null', () => {
      expect(validateLinkListing(undefined)).toBeNull();
    });
  });

  describe('normalizeComuna', () => {
    test('should remove postal codes', () => {
      expect(normalizeComuna('8930002 San Miguel')).toBe('San Miguel');
      expect(normalizeComuna('123 Las Condes 456')).toBe('Las Condes');
    });

    test('should handle duplicates with hyphens', () => {
      expect(normalizeComuna('San Miguel - San Miguel 27888')).toBe('San Miguel');
      expect(normalizeComuna('Las Condes - Las Condes')).toBe('Las Condes');
    });

    test('should apply title case', () => {
      expect(normalizeComuna('las condes')).toBe('Las Condes');
      expect(normalizeComuna('ÑUÑOA')).toBe('ÑUñoa');
    });

    test('should handle undefined/null', () => {
      expect(normalizeComuna(undefined)).toBeUndefined();
    });
  });

  describe('normalizeTypology', () => {
    test('should normalize to canonical format', () => {
      expect(normalizeTypology('1D/1B')).toBe('1D1B');
      expect(normalizeTypology('2D 2B')).toBe('2D2B');
      expect(normalizeTypology('studio')).toBe('Studio');
      expect(normalizeTypology('MONOAMBIENTE')).toBe('Studio');
    });

    test('should handle already canonical formats', () => {
      expect(normalizeTypology('1D1B')).toBe('1D1B');
      expect(normalizeTypology('Studio')).toBe('Studio');
    });

    test('should handle undefined/null', () => {
      expect(normalizeTypology(undefined)).toBeUndefined();
    });
  });

  describe('correctArea', () => {
    test('should correct cm² to m²', () => {
      expect(correctArea(4000)).toBe(40);
      expect(correctArea(5800)).toBe(58);
      expect(correctArea(150)).toBe(150);
    });

    test('should leave m² values unchanged', () => {
      expect(correctArea(40)).toBe(40);
      expect(correctArea(58)).toBe(58);
      expect(correctArea(1.5)).toBe(1.5);
    });

    test('should handle undefined/null', () => {
      expect(correctArea(undefined)).toBeUndefined();
    });
  });

  describe('calculateNoGuaranteeSurcharge', () => {
    test('should calculate 6% surcharge on rent only', () => {
      expect(calculateNoGuaranteeSurcharge(500000)).toBe(30000); // 6% of 500000
    });

    test('should calculate 6% surcharge on rent + extras', () => {
      expect(calculateNoGuaranteeSurcharge(500000, 50000, 25000)).toBe(34500); // 6% of 575000
    });

    test('should handle zero extras', () => {
      expect(calculateNoGuaranteeSurcharge(500000, 0, 0)).toBe(30000);
    });
  });
});

describe('Data Quality v2 - Derived Variables', () => {
  const mockUnits: Unit[] = [
    {
      id: '1',
      tipologia: '1D1B',
      m2: 40,
      price: 500000,
      estacionamiento: false,
      bodega: false,
      disponible: true
    },
    {
      id: '2',
      tipologia: '2D2B',
      m2: 60,
      price: 750000,
      estacionamiento: true,
      bodega: true,
      disponible: true
    },
    {
      id: '3',
      tipologia: '1D1B',
      m2: 35,
      price: 0, // Not publicable
      estacionamiento: false,
      bodega: false,
      disponible: false
    }
  ];

  describe('calculatePriceFrom', () => {
    test('should return minimum price of publicable units', () => {
      expect(calculatePriceFrom(mockUnits)).toBe(500000);
    });

    test('should exclude non-publicable units', () => {
      const unitsWithInvalidPrice = [
        { ...mockUnits[0], price: 0, disponible: true },
        { ...mockUnits[1], price: 750000, disponible: true }
      ];
      expect(calculatePriceFrom(unitsWithInvalidPrice)).toBe(750000);
    });

    test('should return undefined when no publicable units', () => {
      const nonPublicableUnits = mockUnits.map(u => ({ ...u, disponible: false }));
      expect(calculatePriceFrom(nonPublicableUnits)).toBeUndefined();
    });
  });

  describe('calculatePriceTo', () => {
    test('should return maximum price of publicable units', () => {
      expect(calculatePriceTo(mockUnits)).toBe(750000);
    });

    test('should exclude non-publicable units', () => {
      const unitsWithInvalidPrice = [
        { ...mockUnits[0], price: 500000, disponible: true },
        { ...mockUnits[1], price: 0, disponible: true }
      ];
      expect(calculatePriceTo(unitsWithInvalidPrice)).toBe(500000);
    });

    test('should return undefined when no publicable units', () => {
      const nonPublicableUnits = mockUnits.map(u => ({ ...u, disponible: false }));
      expect(calculatePriceTo(nonPublicableUnits)).toBeUndefined();
    });
  });

  describe('calculateRentaMinima', () => {
    test('should calculate renta mínima correctly', () => {
      expect(calculateRentaMinima(500000, 2)).toBe(1000000);
      expect(calculateRentaMinima(750000, 1.5)).toBe(1125000);
    });

    test('should handle zero rentas necesarias', () => {
      expect(calculateRentaMinima(500000, 0)).toBe(0);
    });
  });

  describe('calculateFeaturedFlag', () => {
    test('should return true for tremenda promo', () => {
      expect(calculateFeaturedFlag({ tremendaPromo: true }, 50)).toBe(true);
    });

    test('should return true for discount >= 50%', () => {
      expect(calculateFeaturedFlag({ descuentoPercent: 50 }, 50)).toBe(true);
      expect(calculateFeaturedFlag({ descuentoPercent: 75 }, 50)).toBe(true);
    });

    test('should return true for sin garantía', () => {
      expect(calculateFeaturedFlag({ sinGarantia: true }, 50)).toBe(true);
    });

    test('should return true for price in bottom 25%', () => {
      expect(calculateFeaturedFlag({}, 20)).toBe(true);
      expect(calculateFeaturedFlag({}, 25)).toBe(true);
    });

    test('should return false when no conditions met', () => {
      expect(calculateFeaturedFlag({}, 50)).toBe(false);
      expect(calculateFeaturedFlag({ descuentoPercent: 25 }, 50)).toBe(false);
    });
  });

  describe('hasAvailability', () => {
    test('should return true when publicable units exist', () => {
      expect(hasAvailability(mockUnits)).toBe(true);
    });

    test('should return false when no publicable units', () => {
      const nonPublicableUnits = mockUnits.map(u => ({ ...u, disponible: false }));
      expect(hasAvailability(nonPublicableUnits)).toBe(false);
    });

    test('should return false when units have invalid prices', () => {
      const unitsWithInvalidPrice = mockUnits.map(u => ({ ...u, price: 0 }));
      expect(hasAvailability(unitsWithInvalidPrice)).toBe(false);
    });
  });
});

describe('Data Quality v2 - Integration Tests', () => {
  test('end-to-end transformation pipeline', () => {
    // Test complete transformation flow
    const rawComuna = '8930002 San Miguel - San Miguel 27888';
    const rawTypology = '1D/1B';
    const rawArea = 4000;
    const rawOrientation = 'n';
    const rawInstallments = 6;
    const rawMonths = 1;
    const rawLink = 'https://example.com/unit-101';

    // Apply transformations
    const normalizedComuna = normalizeComuna(rawComuna);
    const normalizedTypology = normalizeTypology(rawTypology);
    const correctedArea = correctArea(rawArea);
    const normalizedOrientation = normalizeOrientation(rawOrientation);
    const validInstallments = validateGuaranteeInstallments(rawInstallments);
    const validMonths = validateGuaranteeMonths(rawMonths);
    const validLink = validateLinkListing(rawLink);

    // Assertions
    expect(normalizedComuna).toBe('San Miguel');
    expect(normalizedTypology).toBe('1D1B');
    expect(correctedArea).toBe(40);
    expect(normalizedOrientation).toBe('N');
    expect(validInstallments).toBe(6);
    expect(validMonths).toBe(1);
    expect(validLink).toBe('https://example.com/unit-101');
  });

  test('availability calculation with mixed units', () => {
    const mixedUnits: Unit[] = [
      { id: '1', tipologia: '1D1B', m2: 40, price: 500000, estacionamiento: false, bodega: false, disponible: true },
      { id: '2', tipologia: '2D2B', m2: 60, price: 0, estacionamiento: true, bodega: true, disponible: true }, // Invalid price
      { id: '3', tipologia: '1D1B', m2: 35, price: 450000, estacionamiento: false, bodega: false, disponible: false }, // Not available
      { id: '4', tipologia: 'Studio', m2: 30, price: 400000, estacionamiento: false, bodega: false, disponible: true }
    ];

    expect(hasAvailability(mixedUnits)).toBe(true);
    expect(calculatePriceFrom(mixedUnits)).toBe(400000);
    expect(calculatePriceTo(mixedUnits)).toBe(500000);
  });
});
