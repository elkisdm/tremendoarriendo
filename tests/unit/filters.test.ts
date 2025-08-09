import { getAllBuildings } from '@lib/data';

describe('Filtrado de edificios', () => {
  test('filtra por comuna', async () => {
    const items = await getAllBuildings({ comuna: 'Ñuñoa' });
    expect(items.every(b => b.comuna === 'Ñuñoa')).toBe(true);
  });

  test('filtra por tipología', async () => {
    const items = await getAllBuildings({ tipologia: 'Studio' });
    expect(items.length).toBeGreaterThan(0);
    expect(items.every(b => b.units.some(u => u.tipologia.toLowerCase() === 'studio'))).toBe(true);
  });

  test('filtra por rango de precio usando precioDesde', async () => {
    const items = await getAllBuildings({ minPrice: 400000, maxPrice: 500000 });
    // precioDesde debe existir y estar en el rango
    expect(items.length).toBeGreaterThan(0);
    for (const b of items) {
      expect(b.precioDesde).not.toBeNull();
      expect((b.precioDesde as number)).toBeGreaterThanOrEqual(400000);
      expect((b.precioDesde as number)).toBeLessThanOrEqual(500000);
    }
  });
});


