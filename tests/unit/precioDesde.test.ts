import { getAllBuildings } from '@lib/data';

describe('precioDesde', () => {
  test('ignora unidades no disponibles', async () => {
    const items = await getAllBuildings();

    // Las Condes tiene 460k disponible y 495k no disponible
    const lasCondes = items.find(b => b.slug === 'edificio-vista-las-condes');
    expect(lasCondes).toBeTruthy();
    expect(lasCondes?.precioDesde).toBe(460000);

    // Providencia tiene 460k disponible y 820k no disponible
    const providencia = items.find(b => b.slug === 'torre-central-providencia');
    expect(providencia).toBeTruthy();
    expect(providencia?.precioDesde).toBe(460000);

    // Macul tiene solo una unidad disponible a 520k (la de 370k no disponible)
    const macul = items.find(b => b.slug === 'parque-sur-macul');
    expect(macul).toBeTruthy();
    expect(macul?.precioDesde).toBe(520000);
  });
});


