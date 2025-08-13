import { MOCK_BUILDINGS } from "@data/buildings.mock";
import type { Building } from "@types";
import { fakeDelay } from "@lib/utils";

export async function listBuildings({ comuna, minPrice, maxPrice, tipologia, sort }:
  { comuna?: string|null; minPrice?: number|null; maxPrice?: number|null; tipologia?: string|null; sort?: string|null; }): Promise<Building[]> {
  await fakeDelay();
  let items = [...MOCK_BUILDINGS];

  if (comuna && comuna !== "Todas") items = items.filter((b) => b.comuna === comuna);
  if (tipologia && tipologia !== "Todas") items = items.filter((b) => b.units.some((u) => u.tipologia.includes(tipologia)));
  if (minPrice != null || maxPrice != null) {
    items = items.filter((b) => b.units.some((u) => {
      const okMin = minPrice != null ? u.price >= minPrice : true;
      const okMax = maxPrice != null ? u.price <= maxPrice : true;
      return okMin && okMax;
    }));
  }

  items = items.map((b) => {
    // const avail = b.units.filter((u) => u.disponible);
    // const _minPriceAvail = avail.length ? Math.min(...avail.map((u) => u.price)) : Math.min(...b.units.map((u) => u.price));
    return { ...b, cover: b.cover, promo: b.promo, amenities: b.amenities, gallery: b.gallery, units: b.units, } as Building & { minPrice?: number };
  }).map((b: unknown) => ({ ...(b as any), minPrice: Math.min(...(b as Building).units.filter((u: unknown) => (u as { disponible: boolean; price: number }).disponible).map((u: unknown) => (u as { price: number }).price)) }));

  if (sort === "price-asc") items.sort((a: unknown, b: unknown) => (a as { minPrice: number }).minPrice - (b as { minPrice: number }).minPrice);
  if (sort === "price-desc") items.sort((a: unknown, b: unknown) => (b as { minPrice: number }).minPrice - (a as { minPrice: number }).minPrice);
  if (sort === "comuna") items.sort((a, b) => a.comuna.localeCompare(b.comuna, "es"));

  return items;
}

export async function getBuilding(id: string) {
  await fakeDelay();
  return MOCK_BUILDINGS.find((b) => b.id === id);
}

export async function related(comuna: string, excludeId: string) {
  await fakeDelay(500);
  return MOCK_BUILDINGS.filter((b) => b.comuna === comuna && b.id !== excludeId).slice(0, 3);
}
