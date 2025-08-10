import { BookingRequestSchema, BuildingSchema, UnitSchema } from "@schemas/models";
import type { BookingRequest, Building, Unit } from "@schemas/models";
import { fromAssetPlan } from "@lib/adapters/assetplan";

type ListFilters = {
  comuna?: string;
  tipologia?: string;
  minPrice?: number;
  maxPrice?: number;
};

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
const simulateLatency = process.env.NODE_ENV !== "production";

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
  // If flag is enabled, attempt to read AssetPlan source files on server
  const USE_ASSETPLAN_SOURCE =
    typeof process !== "undefined" && typeof process.env !== "undefined"
      ? process.env.USE_ASSETPLAN_SOURCE === "true"
      : false;

  if (USE_ASSETPLAN_SOURCE) {
    const fromAssetPlanFiles = await readAssetPlanSources();
    if (fromAssetPlanFiles && fromAssetPlanFiles.length > 0) {
      return fromAssetPlanFiles;
    }
  }

  // Fallback to mock JSON bundled with the app (works on client and server)
  const raw = (await import("@data/buildings.json")).default as unknown;
  const arr = (raw as unknown[]).map(validateBuilding);
  return arr;
}

export async function getAllBuildings(filters?: ListFilters): Promise<(Building & { precioDesde: number | null })[]> {
  if (simulateLatency) {
    await delay(200 + Math.floor(Math.random() * 200));
  }
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
  if (simulateLatency) {
    await delay(200 + Math.floor(Math.random() * 200));
  }
  const all = await readAll();
  const found = all.find((b) => b.slug === slug);
  if (!found) return null;
  return { ...found, precioDesde: calculatePrecioDesde(found.units) };
}

export async function getRelatedBuildings(slug: string, n = 3): Promise<(Building & { precioDesde: number | null })[]> {
  if (simulateLatency) {
    await delay(200 + Math.floor(Math.random() * 200));
  }
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
  if (simulateLatency) {
    await delay(200 + Math.floor(Math.random() * 200));
  }
  const id = `bk_${Math.random().toString(36).slice(2, 10)}`;
  return { id };
}

export type { Building, Unit, BookingRequest };


// Server-only: discover and read data/sources/assetplan-*.json and map via adapter
async function readAssetPlanSources(): Promise<Building[] | null> {
  // Avoid attempting to use Node APIs in the browser bundle
  if (typeof window !== "undefined") return null;

  try {
    // Use eval to avoid bundlers trying to include Node built-ins in client chunks
    // eslint-disable-next-line no-eval
    const pathMod = (await (0, eval)("import('node:path')")) as typeof import("node:path");
    // eslint-disable-next-line no-eval
    const fs = (await (0, eval)("import('node:fs/promises')")) as typeof import("node:fs/promises");

    const sourcesDir = pathMod.join(process.cwd(), "data", "sources");
    let dirEntries: string[] = [];
    try {
      dirEntries = await fs.readdir(sourcesDir);
    } catch {
      return null; // directory may not exist
    }

    const targetFiles = dirEntries.filter((name) => /^assetplan-.*\.json$/i.test(name));
    if (targetFiles.length === 0) return null;

    const buildings: Building[] = [];
    for (const fileName of targetFiles) {
      const filePath = pathMod.join(sourcesDir, fileName);
      try {
        const content = await fs.readFile(filePath, "utf-8");
        const json = JSON.parse(content);
        if (Array.isArray(json)) {
          for (const raw of json) {
            try {
              const mapped = fromAssetPlan(raw as unknown as any);
              buildings.push(validateBuilding(mapped));
            } catch {
              // ignore malformed item
            }
          }
        } else if (json && typeof json === "object") {
          try {
            const mapped = fromAssetPlan(json as unknown as any);
            buildings.push(validateBuilding(mapped));
          } catch {
            // ignore malformed file
          }
        }
      } catch {
        // ignore file read/parse errors and continue
      }
    }

    return buildings.length > 0 ? buildings : null;
  } catch {
    return null;
  }
}


