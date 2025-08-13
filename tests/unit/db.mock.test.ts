import { listBuildings, getBuilding, related } from '@lib/db.mock';
import { MOCK_BUILDINGS } from '@data/buildings.mock';

// Mock fakeDelay to make tests faster
jest.mock('@lib/utils', () => ({
  ...jest.requireActual('@lib/utils'),
  fakeDelay: jest.fn().mockResolvedValue(undefined),
}));

describe('db.mock', () => {
  describe('listBuildings', () => {
    it('returns all buildings when no filters applied', async () => {
      const result = await listBuildings({});
      expect(result).toHaveLength(MOCK_BUILDINGS.length);
    });

    it('filters by comuna correctly', async () => {
      const result = await listBuildings({ comuna: 'Las Condes' });
      expect(result.every(b => b.comuna === 'Las Condes')).toBe(true);
    });

    it('does not filter when comuna is "Todas"', async () => {
      const result = await listBuildings({ comuna: 'Todas' });
      expect(result).toHaveLength(MOCK_BUILDINGS.length);
    });

    it('filters by tipologia correctly', async () => {
      const result = await listBuildings({ tipologia: '2D' });
      expect(result.every(b => 
        b.units.some(u => u.tipologia.includes('2D'))
      )).toBe(true);
    });

    it('does not filter when tipologia is "Todas"', async () => {
      const result = await listBuildings({ tipologia: 'Todas' });
      expect(result).toHaveLength(MOCK_BUILDINGS.length);
    });

    it('filters by price range correctly', async () => {
      const minPrice = 100000000;
      const maxPrice = 200000000;
      const result = await listBuildings({ minPrice, maxPrice });
      
      expect(result.every(b => 
        b.units.some(u => u.price >= minPrice && u.price <= maxPrice)
      )).toBe(true);
    });

    it('filters by minimum price only', async () => {
      const minPrice = 150000000;
      const result = await listBuildings({ minPrice });
      
      expect(result.every(b => 
        b.units.some(u => u.price >= minPrice)
      )).toBe(true);
    });

    it('filters by maximum price only', async () => {
      const maxPrice = 150000000;
      const result = await listBuildings({ maxPrice });
      
      expect(result.every(b => 
        b.units.some(u => u.price <= maxPrice)
      )).toBe(true);
    });

    it('sorts by price ascending', async () => {
      const result = await listBuildings({ sort: 'price-asc' });
      for (let i = 1; i < result.length; i++) {
        const prevMin = Math.min(...result[i-1].units.filter(u => u.disponible).map(u => u.price));
        const currMin = Math.min(...result[i].units.filter(u => u.disponible).map(u => u.price));
        expect(currMin).toBeGreaterThanOrEqual(prevMin);
      }
    });

    it('sorts by price descending', async () => {
      const result = await listBuildings({ sort: 'price-desc' });
      for (let i = 1; i < result.length; i++) {
        const prevMin = Math.min(...result[i-1].units.filter(u => u.disponible).map(u => u.price));
        const currMin = Math.min(...result[i].units.filter(u => u.disponible).map(u => u.price));
        expect(currMin).toBeLessThanOrEqual(prevMin);
      }
    });

    it('sorts by comuna alphabetically', async () => {
      const result = await listBuildings({ sort: 'comuna' });
      for (let i = 1; i < result.length; i++) {
        expect(result[i].comuna.localeCompare(result[i-1].comuna, 'es')).toBeGreaterThanOrEqual(0);
      }
    });
  });

  describe('getBuilding', () => {
    it('returns building by id', async () => {
      const firstBuilding = MOCK_BUILDINGS[0];
      const result = await getBuilding(firstBuilding.id);
      expect(result).toEqual(firstBuilding);
    });

    it('returns undefined for non-existent id', async () => {
      const result = await getBuilding('non-existent-id');
      expect(result).toBeUndefined();
    });
  });

  describe('related', () => {
    it('returns buildings from same comuna excluding specified id', async () => {
      const firstBuilding = MOCK_BUILDINGS[0];
      const result = await related(firstBuilding.comuna, firstBuilding.id);
      
      expect(result.every(b => b.comuna === firstBuilding.comuna)).toBe(true);
      expect(result.every(b => b.id !== firstBuilding.id)).toBe(true);
      expect(result).toHaveLength(Math.min(3, MOCK_BUILDINGS.filter(b => 
        b.comuna === firstBuilding.comuna && b.id !== firstBuilding.id
      ).length));
    });

    it('returns at most 3 buildings', async () => {
      const firstBuilding = MOCK_BUILDINGS[0];
      const result = await related(firstBuilding.comuna, firstBuilding.id);
      expect(result.length).toBeLessThanOrEqual(3);
    });
  });
});
