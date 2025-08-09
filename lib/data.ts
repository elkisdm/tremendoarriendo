import { BookingRequestSchema, BuildingSchema, UnitSchema } from "@schemas/models";
import type { BookingRequest, Building, Unit } from "@schemas/models";

type ListFilters = {
  comuna?: string;
  tipologia?: string;
  minPrice?: number;
  maxPrice?: number;
};

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

function calculatePrecioDesde(units: Unit[]): number | null {
  const disponibles = units.filter((u) => u.disponible);
  if (disponibles.length === 0) return null;
  return Math.min(...disponibles.map((u) => u.price));
}

function validateBuilding(raw: unknown): Building {
  const parsed = BuildingSchema.parse(raw);
  return parsed;
}

async function readAll(): Promise<Building[]> {
  // dynamic import to keep it tree-shakeable in Next
  const raw = (await import("@data/buildings.json")).default as unknown;
  const arr = (raw as unknown[]).map(validateBuilding);
  return arr;
}

export async function getAllBuildings(filters?: ListFilters): Promise<(Building & { precioDesde: number | null })[]> {
  await delay(300 + Math.floor(Math.random() * 300));
  const all = await readAll();

  let list = all.map((b) => ({ ...b, precioDesde: calculatePrecioDesde(b.units) }));

  if (filters) {
    const { comuna, tipologia, minPrice, maxPrice } = filters;
    if (comuna && comuna !== "Todas") {
      list = list.filter((b) => b.comuna.toLowerCase() === comuna.toLowerCase());
    }
    if (tipologia && tipologia !== "Todas") {
      list = list.filter((b) => b.units.some((u) => u.tipologia.toLowerCase() === tipologia.toLowerCase()));
    }
    if (typeof minPrice === "number") {
      list = list.filter((b) => (b.precioDesde ?? Infinity) >= minPrice);
    }
    if (typeof maxPrice === "number") {
      list = list.filter((b) => (b.precioDesde ?? 0) <= maxPrice);
    }
  }

  return list;
}

export async function getBuildingBySlug(slug: string): Promise<(Building & { precioDesde: number | null }) | null> {
  await delay(300 + Math.floor(Math.random() * 300));
  const all = await readAll();
  const found = all.find((b) => b.slug === slug);
  if (!found) return null;
  return { ...found, precioDesde: calculatePrecioDesde(found.units) };
}

export async function getRelatedBuildings(slug: string, n = 3): Promise<(Building & { precioDesde: number | null })[]> {
  await delay(300 + Math.floor(Math.random() * 300));
  const all = await readAll();
  const current = all.find((b) => b.slug === slug);
  if (!current) return [];
  const withPrecio = all
    .filter((b) => b.slug !== slug)
    .map((b) => ({ ...b, precioDesde: calculatePrecioDesde(b.units) }));

  const sameComuna = withPrecio.filter((b) => b.comuna === current.comuna);
  const others = withPrecio.filter((b) => b.comuna !== current.comuna);
  return [...sameComuna, ...others].slice(0, n);
}

export async function createBooking(payload: BookingRequest): Promise<{ id: string }>{
  const data = BookingRequestSchema.parse(payload);
  await delay(300 + Math.floor(Math.random() * 300));
  const id = `bk_${Math.random().toString(36).slice(2, 10)}`;
  return { id };
}

export type { Building, Unit, BookingRequest };


