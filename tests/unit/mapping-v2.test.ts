import { createMappingV2Transformer, type RawBuildingData, type RawUnitData } from '@lib/mapping-v2';
import { BuildingSchema, UnitSchema } from '@schemas/models';

describe('MappingV2Transformer', () => {
  const transformer = createMappingV2Transformer();

  describe('transformBuilding', () => {
    test('transforms raw building data correctly', () => {
      const rawBuilding: RawBuildingData = {
        Condominio: 'Edificio Test',
        Comuna: '8930002 San Miguel',
        Direccion: 'Av. Test 123',
        'Tipo edificio': 'MF',
        'Link Listing': 'https://example.com'
      };

      const result = transformer.transformBuilding(rawBuilding);

      expect(result.id).toBeDefined();
      expect(result.name).toBe('Edificio Test');
      expect(result.address).toBe('Av. Test 123');
      expect(result.comuna).toBe('San Miguel'); // Normalized
      expect(result.gc_mode).toBe('MF');
    });

    test('handles missing data gracefully', () => {
      const rawBuilding: RawBuildingData = {
        Condominio: '',
        Comuna: '',
        Direccion: '',
        'Tipo edificio': '',
        'Link Listing': ''
      };

      const result = transformer.transformBuilding(rawBuilding);

      expect(result.id).toBeDefined();
      expect(result.name).toBeUndefined();
      expect(result.address).toBe('');
      expect(result.comuna).toBeUndefined();
    });
  });

  describe('transformUnit', () => {
    test('transforms raw unit data correctly', () => {
      const rawUnit: RawUnitData = {
        OP: 'TEST001',
        Unidad: '101',
        Tipologia: '2D/1B',
        'm2 Depto': 45,
        'm2 Exterior': 5,
        Orientacion: 'N',
        Estac: '31|32',
        Bod: '15',
        'Arriendo Total': 500000,
        'GC Total': 50000,
        'Rentas Necesarias': 2.5,
        'Reajuste por contrato': 'UF',
        'Meses sin reajuste': 12,
        '% Descuento': 10,
        'Cant. Meses Descuento': 3,
        'Tremenda promo': false,
        'Sin Garantia': false,
        'Cant. Garantías (Meses)': 1,
        'Cant. Garantías Mascota (Meses)': 0,
        'Cuotas Garantía': 6,
        'Requiere Aval(es)': true,
        'Acepta Mascotas?': true,
        Estado: 'Lista para arrendar'
      };

      const buildingId = 'test-building';
      const result = transformer.transformUnit(rawUnit, buildingId);

      expect(result.id).toBe('TEST001');
      expect(result.tipologia).toBe('2D1B'); // Normalized
      expect(result.m2).toBe(50); // 45 + 5
      expect(result.price).toBe(500000);
      expect(result.estacionamiento).toBe(true);
      expect(result.bodega).toBe(true);
      expect(result.disponible).toBe(true);
      expect(result.area_interior_m2).toBe(45);
      expect(result.area_exterior_m2).toBe(5);
      expect(result.orientacion).toBe('N');
      expect(result.parking_ids).toBe('31|32');
      expect(result.parking_opcional).toBe(false);
      expect(result.storage_ids).toBe('15');
      expect(result.storage_opcional).toBe(false);
      expect(result.guarantee_installments).toBe(6);
      expect(result.guarantee_months).toBe(1);
      expect(result.rentas_necesarias).toBe(2.5);
      expect(result.renta_minima).toBe(1250000); // 500000 * 2.5
      expect(result.petFriendly).toBe(true);
    });

    test('handles optional parking/storage correctly', () => {
      const rawUnit: RawUnitData = {
        OP: 'TEST002',
        Unidad: '102',
        Tipologia: '1D1B',
        'm2 Depto': 35,
        'm2 Exterior': 0,
        Orientacion: 'S',
        Estac: 'x', // Optional
        Bod: 'x', // Optional
        'Arriendo Total': 400000,
        'GC Total': 40000,
        'Rentas Necesarias': 2,
        'Reajuste por contrato': 'IPC',
        'Meses sin reajuste': 6,
        '% Descuento': 0,
        'Cant. Meses Descuento': 0,
        'Tremenda promo': false,
        'Sin Garantia': false,
        'Cant. Garantías (Meses)': 1,
        'Cant. Garantías Mascota (Meses)': 0,
        'Cuotas Garantía': 3,
        'Requiere Aval(es)': false,
        'Acepta Mascotas?': false,
        Estado: 'Lista para arrendar'
      };

      const buildingId = 'test-building';
      const result = transformer.transformUnit(rawUnit, buildingId);

      expect(result.estacionamiento).toBe(false);
      expect(result.bodega).toBe(false);
      expect(result.parking_opcional).toBe(true);
      expect(result.storage_opcional).toBe(true);
      expect(result.parking_ids).toBeNull();
      expect(result.storage_ids).toBeNull();
    });

    test('handles unavailable units correctly', () => {
      const rawUnit: RawUnitData = {
        OP: 'TEST003',
        Unidad: '103',
        Tipologia: 'Studio',
        'm2 Depto': 25,
        'm2 Exterior': 0,
        Orientacion: 'E',
        Estac: '',
        Bod: '',
        'Arriendo Total': 0, // Below minimum
        'GC Total': 0,
        'Rentas Necesarias': 1,
        'Reajuste por contrato': 'UF',
        'Meses sin reajuste': 0,
        '% Descuento': 0,
        'Cant. Meses Descuento': 0,
        'Tremenda promo': false,
        'Sin Garantia': false,
        'Cant. Garantías (Meses)': 0,
        'Cant. Garantías Mascota (Meses)': 0,
        'Cuotas Garantía': 1,
        'Requiere Aval(es)': false,
        'Acepta Mascotas?': false,
        Estado: 'No disponible'
      };

      const buildingId = 'test-building';
      const result = transformer.transformUnit(rawUnit, buildingId);

      expect(result.disponible).toBe(false);
      expect(result.price).toBe(0);
    });
  });

  describe('transformPromotion', () => {
    test('transforms promotion data correctly', () => {
      const rawUnit: RawUnitData = {
        OP: 'TEST004',
        Unidad: '104',
        Tipologia: '2D2B',
        'm2 Depto': 55,
        'm2 Exterior': 0,
        Orientacion: 'NO',
        Estac: '33',
        Bod: '16',
        'Arriendo Total': 600000,
        'GC Total': 60000,
        'Rentas Necesarias': 3,
        'Reajuste por contrato': 'UF',
        'Meses sin reajuste': 12,
        '% Descuento': 50, // High discount
        'Cant. Meses Descuento': 6,
        'Tremenda promo': true,
        'Sin Garantia': true,
        'Cant. Garantías (Meses)': 0,
        'Cant. Garantías Mascota (Meses)': 0,
        'Cuotas Garantía': 12,
        'Requiere Aval(es)': false,
        'Acepta Mascotas?': true,
        Estado: 'Lista para arrendar'
      };

      const result = transformer.transformPromotion(rawUnit);

      expect(result.discount_pct).toBe(50);
      expect(result.discount_months).toBe(6);
      expect(result.tremenda_promo).toBe(true);
      expect(result.no_guarantee).toBe(true);
      expect(result.no_guarantee_surcharge_pct).toBe(36000); // 6% of 600000
      expect(result.guarantee_months).toBe(0);
      expect(result.pet_guarantee_months).toBe(0);
      expect(result.guarantee_installments).toBe(12);
      expect(result.requires_guarantor).toBe(false);
      expect(result.accepts_pets).toBe(true);
    });
  });

  describe('validatePetRestrictions', () => {
    test('validates pet restrictions correctly', () => {
      // Valid pet
      const validPet = transformer.validatePetRestrictions(15, 'labrador');
      expect(validPet.allowed).toBe(true);
      expect(validPet.restrictions.max_kg).toBe(20);
      expect(validPet.restrictions.restricted).toBe('razas peligrosas');

      // Overweight pet
      const overweightPet = transformer.validatePetRestrictions(25, 'golden');
      expect(overweightPet.allowed).toBe(false);
      expect(overweightPet.reason).toBe('Peso máximo 20kg');

      // Dangerous breed
      const dangerousPet = transformer.validatePetRestrictions(15, 'pitbull');
      expect(dangerousPet.allowed).toBe(false);
      expect(dangerousPet.reason).toBe('Raza restringida');
    });
  });

  describe('calculateAggregations', () => {
    test('calculates building aggregations correctly', () => {
      const mockBuildings = [
        {
          id: 'building1',
          units: [
            { id: '1', disponible: true, price: 500000 },
            { id: '2', disponible: true, price: 600000 },
            { id: '3', disponible: false, price: 400000 }
          ]
        },
        {
          id: 'building2',
          units: [
            { id: '4', disponible: false, price: 300000 },
            { id: '5', disponible: false, price: 350000 }
          ]
        }
      ] as any[];

      const aggregations = transformer.calculateAggregations(mockBuildings);

      expect(aggregations.get('building1')).toEqual({
        price_from: 500000,
        price_to: 600000,
        has_availability: true
      });

      expect(aggregations.get('building2')).toEqual({
        price_from: undefined,
        price_to: undefined,
        has_availability: false
      });
    });
  });
});
