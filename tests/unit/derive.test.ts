import { deriveBuildingAggregates, computeUnitTotalArea } from '@lib/derive';
import { PromotionType, type Building, type Unit, type PromotionBadge } from '@schemas/models';

describe('derive', () => {
  describe('computeUnitTotalArea', () => {
    test('uses interior + exterior when both present', () => {
      const unit: Unit = {
        id: '1',
        tipologia: 'Studio',
        m2: 50,
        price: 400000,
        estacionamiento: false,
        bodega: false,
        disponible: true,
        area_interior_m2: 25,
        area_exterior_m2: 3
      };
      
      expect(computeUnitTotalArea(unit)).toBe(28);
    });

    test('uses interior only when exterior missing', () => {
      const unit: Unit = {
        id: '1',
        tipologia: 'Studio',
        m2: 50,
        price: 400000,
        estacionamiento: false,
        bodega: false,
        disponible: true,
        area_interior_m2: 25
      };
      
      expect(computeUnitTotalArea(unit)).toBe(25);
    });

    test('uses exterior only when interior missing', () => {
      const unit: Unit = {
        id: '1',
        tipologia: 'Studio',
        m2: 50,
        price: 400000,
        estacionamiento: false,
        bodega: false,
        disponible: true,
        area_exterior_m2: 5
      };
      
      expect(computeUnitTotalArea(unit)).toBe(5);
    });

    test('falls back to m2 when both interior/exterior missing', () => {
      const unit: Unit = {
        id: '1',
        tipologia: 'Studio',
        m2: 50,
        price: 400000,
        estacionamiento: false,
        bodega: false,
        disponible: true
      };
      
      expect(computeUnitTotalArea(unit)).toBe(50);
    });

    test('falls back to m2 when sum is invalid', () => {
      const unit: Unit = {
        id: '1',
        tipologia: 'Studio',
        m2: 50,
        price: 400000,
        estacionamiento: false,
        bodega: false,
        disponible: true,
        area_interior_m2: 0, // invalid
        area_exterior_m2: 0  // invalid
      };
      
      expect(computeUnitTotalArea(unit)).toBe(50);
    });
  });

  describe('deriveBuildingAggregates', () => {
    test('handles two typologies with different promotion statuses', () => {
      const promoUnitBadge: PromotionBadge = {
        label: '50% OFF',
        type: PromotionType.DISCOUNT_PERCENT
      };

      const building: Building = {
        id: '1',
        slug: 'test-building',
        name: 'Test Building',
        comuna: 'Test Comuna',
        address: 'Test Address',
        amenities: ['piscina'],
        gallery: ['img1.jpg', 'img2.jpg', 'img3.jpg'],
        units: [
          // Studio typology - with promo
          {
            id: 'u1',
            tipologia: 'Studio',
            m2: 25,
            price: 400000,
            estacionamiento: false,
            bodega: false,
            disponible: true,
            promotions: [promoUnitBadge]
          },
          {
            id: 'u2',
            tipologia: 'Studio',
            m2: 30,
            price: 450000,
            estacionamiento: false,
            bodega: false,
            disponible: true
          },
          // 1D/1B typology - no promo
          {
            id: 'u3',
            tipologia: '1D/1B',
            m2: 40,
            price: 500000,
            estacionamiento: true,
            bodega: true,
            disponible: true,
            bedrooms: 1,
            bathrooms: 1
          },
          {
            id: 'u4',
            tipologia: '1D/1B',
            m2: 42,
            price: 520000,
            estacionamiento: false,
            bodega: false,
            disponible: true,
            bedrooms: 1,
            bathrooms: 1
          }
        ]
      };

      const result = deriveBuildingAggregates(building);

      expect(result.hasAvailability).toBe(true);
      expect(result.precioDesde).toBe(400000);
      expect(result.precioRango).toEqual({ min: 400000, max: 520000 });

      // Should have 2 typologies
      expect(result.typologySummary).toHaveLength(2);

      // Studio typology - should have promo
      const studioTypology = result.typologySummary.find(t => t.code === 'Studio');
      expect(studioTypology).toBeDefined();
      expect(studioTypology!.unidades).toBe(2);
      expect(studioTypology!.priceRange).toEqual({ min: 400000, max: 450000 });
      expect(studioTypology!.areaRange).toEqual({ min: 25, max: 30 });
      expect(studioTypology!.hasPromo).toBe(true);
      expect(studioTypology!.bedrooms).toBeUndefined(); // no bedrooms in studio
      expect(studioTypology!.bathrooms).toBeUndefined(); // no bathrooms data

      // 1D/1B typology - no promo
      const oneBedTypology = result.typologySummary.find(t => t.code === '1D/1B');
      expect(oneBedTypology).toBeDefined();
      expect(oneBedTypology!.unidades).toBe(2);
      expect(oneBedTypology!.priceRange).toEqual({ min: 500000, max: 520000 });
      expect(oneBedTypology!.areaRange).toEqual({ min: 40, max: 42 });
      expect(oneBedTypology!.hasPromo).toBe(false);
      expect(oneBedTypology!.bedrooms).toBe(1); // uniform across units
      expect(oneBedTypology!.bathrooms).toBe(1); // uniform across units
    });

    test('handles missing interior/exterior areas gracefully', () => {
      const building: Building = {
        id: '1',
        slug: 'test-building',
        name: 'Test Building',
        comuna: 'Test Comuna',
        address: 'Test Address',
        amenities: ['piscina'],
        gallery: ['img1.jpg', 'img2.jpg', 'img3.jpg'],
        units: [
          {
            id: 'u1',
            tipologia: 'Studio',
            m2: 25,
            price: 400000,
            estacionamiento: false,
            bodega: false,
            disponible: true,
            area_interior_m2: 20,
            area_exterior_m2: 3
          },
          {
            id: 'u2',
            tipologia: 'Studio',
            m2: 30,
            price: 450000,
            estacionamiento: false,
            bodega: false,
            disponible: true
            // no interior/exterior areas - should fall back to m2
          }
        ]
      };

      const result = deriveBuildingAggregates(building);

      const studioTypology = result.typologySummary.find(t => t.code === 'Studio');
      expect(studioTypology).toBeDefined();
      
      // Area range should consider computed total areas:
      // u1: 20 + 3 = 23, u2: 30 (fallback to m2)
      expect(studioTypology!.areaRange).toEqual({ min: 23, max: 30 });
    });

    test('ignores reserved status in min/max calculations', () => {
      const building: Building = {
        id: '1',
        slug: 'test-building',
        name: 'Test Building',
        comuna: 'Test Comuna',
        address: 'Test Address',
        amenities: ['piscina'],
        gallery: ['img1.jpg', 'img2.jpg', 'img3.jpg'],
        units: [
          {
            id: 'u1',
            tipologia: 'Studio',
            m2: 25,
            price: 400000,
            estacionamiento: false,
            bodega: false,
            disponible: true,
            status: 'available'
          },
          {
            id: 'u2',
            tipologia: 'Studio',
            m2: 30,
            price: 350000, // lower price but reserved
            estacionamiento: false,
            bodega: false,
            disponible: false,
            status: 'reserved'
          },
          {
            id: 'u3',
            tipologia: 'Studio',
            m2: 28,
            price: 480000,
            estacionamiento: false,
            bodega: false,
            disponible: true,
            status: 'available'
          }
        ]
      };

      const result = deriveBuildingAggregates(building);

      // Should only consider available units (u1 and u3)
      expect(result.hasAvailability).toBe(true);
      expect(result.precioDesde).toBe(400000); // min of available units
      expect(result.precioRango).toEqual({ min: 400000, max: 480000 });

      const studioTypology = result.typologySummary.find(t => t.code === 'Studio');
      expect(studioTypology).toBeDefined();
      expect(studioTypology!.unidades).toBe(2); // only available units
      expect(studioTypology!.priceRange).toEqual({ min: 400000, max: 480000 });
      expect(studioTypology!.areaRange).toEqual({ min: 25, max: 28 });
    });

    test('handles building-level promotions affecting all typologies', () => {
      const buildingPromo: PromotionBadge = {
        label: 'Free Commission',
        type: PromotionType.FREE_COMMISSION
      };

      const building: Building = {
        id: '1',
        slug: 'test-building',
        name: 'Test Building',
        comuna: 'Test Comuna',
        address: 'Test Address',
        amenities: ['piscina'],
        gallery: ['img1.jpg', 'img2.jpg', 'img3.jpg'],
        badges: [buildingPromo], // building-level promotion
        units: [
          {
            id: 'u1',
            tipologia: 'Studio',
            m2: 25,
            price: 400000,
            estacionamiento: false,
            bodega: false,
            disponible: true
          },
          {
            id: 'u2',
            tipologia: '1D/1B',
            m2: 40,
            price: 500000,
            estacionamiento: false,
            bodega: false,
            disponible: true
          }
        ]
      };

      const result = deriveBuildingAggregates(building);

      // Both typologies should have promo due to building-level promotion
      const studioTypology = result.typologySummary.find(t => t.code === 'Studio');
      expect(studioTypology!.hasPromo).toBe(true);

      const oneBedTypology = result.typologySummary.find(t => t.code === '1D/1B');
      expect(oneBedTypology!.hasPromo).toBe(true);
    });

    test('handles non-uniform bedrooms/bathrooms in typology', () => {
      const building: Building = {
        id: '1',
        slug: 'test-building',
        name: 'Test Building',
        comuna: 'Test Comuna',
        address: 'Test Address',
        amenities: ['piscina'],
        gallery: ['img1.jpg', 'img2.jpg', 'img3.jpg'],
        units: [
          {
            id: 'u1',
            tipologia: '1D/1B',
            m2: 40,
            price: 500000,
            estacionamiento: false,
            bodega: false,
            disponible: true,
            bedrooms: 1,
            bathrooms: 1
          },
          {
            id: 'u2',
            tipologia: '1D/1B',
            m2: 42,
            price: 520000,
            estacionamiento: false,
            bodega: false,
            disponible: true,
            bedrooms: 1,
            bathrooms: 2 // different bathroom count
          }
        ]
      };

      const result = deriveBuildingAggregates(building);

      const oneBedTypology = result.typologySummary.find(t => t.code === '1D/1B');
      expect(oneBedTypology).toBeDefined();
      expect(oneBedTypology!.bedrooms).toBe(1); // uniform
      expect(oneBedTypology!.bathrooms).toBeUndefined(); // non-uniform, should be undefined
    });

    test('handles no available units', () => {
      const building: Building = {
        id: '1',
        slug: 'test-building',
        name: 'Test Building',
        comuna: 'Test Comuna',
        address: 'Test Address',
        amenities: ['piscina'],
        gallery: ['img1.jpg', 'img2.jpg', 'img3.jpg'],
        units: [
          {
            id: 'u1',
            tipologia: 'Studio',
            m2: 25,
            price: 400000,
            estacionamiento: false,
            bodega: false,
            disponible: false
          },
          {
            id: 'u2',
            tipologia: '1D/1B',
            m2: 40,
            price: 500000,
            estacionamiento: false,
            bodega: false,
            disponible: false
          }
        ]
      };

      const result = deriveBuildingAggregates(building);

      expect(result.hasAvailability).toBe(false);
      expect(result.precioDesde).toBeUndefined();
      expect(result.precioRango).toBeUndefined();
      expect(result.typologySummary).toHaveLength(0);
    });

    test('handles edge case with zero or negative prices', () => {
      const building: Building = {
        id: '1',
        slug: 'test-building',
        name: 'Test Building',
        comuna: 'Test Comuna',
        address: 'Test Address',
        amenities: ['piscina'],
        gallery: ['img1.jpg', 'img2.jpg', 'img3.jpg'],
        units: [
          {
            id: 'u1',
            tipologia: 'Studio',
            m2: 25,
            price: 0, // invalid price
            estacionamiento: false,
            bodega: false,
            disponible: true
          },
          {
            id: 'u2',
            tipologia: 'Studio',
            m2: 30,
            price: 450000,
            estacionamiento: false,
            bodega: false,
            disponible: true
          }
        ]
      };

      const result = deriveBuildingAggregates(building);

      expect(result.hasAvailability).toBe(true);
      expect(result.precioDesde).toBe(450000); // only valid prices considered
      expect(result.precioRango).toEqual({ min: 450000, max: 450000 });

      const studioTypology = result.typologySummary.find(t => t.code === 'Studio');
      expect(studioTypology!.priceRange).toEqual({ min: 450000, max: 450000 });
    });

    test('handles edge case with zero or negative areas', () => {
      const building: Building = {
        id: '1',
        slug: 'test-building',
        name: 'Test Building',
        comuna: 'Test Comuna',
        address: 'Test Address',
        amenities: ['piscina'],
        gallery: ['img1.jpg', 'img2.jpg', 'img3.jpg'],
        units: [
          {
            id: 'u1',
            tipologia: 'Studio',
            m2: 0, // invalid area
            price: 400000,
            estacionamiento: false,
            bodega: false,
            disponible: true
          },
          {
            id: 'u2',
            tipologia: 'Studio',
            m2: 30,
            price: 450000,
            estacionamiento: false,
            bodega: false,
            disponible: true
          }
        ]
      };

      const result = deriveBuildingAggregates(building);

      const studioTypology = result.typologySummary.find(t => t.code === 'Studio');
      expect(studioTypology!.areaRange).toEqual({ min: 30, max: 30 }); // only valid areas
    });
  });
});
