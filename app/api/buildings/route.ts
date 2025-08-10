import { NextResponse } from "next/server";
import { z } from "zod";
import { getAllBuildings } from "@lib/data";
import type { Building, Unit, TypologySummary } from "@schemas/models";
import { computeUnitTotalArea } from "@lib/derive";

const QuerySchema = z.object({
  comuna: z.string().min(1).optional(),
  tipologia: z.string().min(1).optional(),
  minPrice: z
    .preprocess((v) => (typeof v === "string" && v.trim() !== "" ? Number(v) : undefined), z.number().int().nonnegative().optional()),
  maxPrice: z
    .preprocess((v) => (typeof v === "string" && v.trim() !== "" ? Number(v) : undefined), z.number().int().nonnegative().optional()),
});

type BuildingListItem = Pick<Building, "id" | "slug" | "name" | "comuna" | "address" | "gallery" | "coverImage" | "badges" | "serviceLevel"> & {
  precioDesde: number;
  precioRango?: { min: number; max: number };
  hasAvailability: boolean;
  typologySummary?: TypologySummary[];
};

function summarizeTypologies(units: Unit[]): TypologySummary[] | undefined {
  if (!Array.isArray(units) || units.length === 0) return undefined;
  const map = new Map<string, Unit[]>();
  for (const unit of units) {
    const key = (unit.tipologia ?? "").trim();
    if (!key) continue;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(unit);
  }
  const items: TypologySummary[] = [];
  for (const [key, group] of map.entries()) {
    if (group.length === 0) continue;
    const prices = group.map((u) => u.price).filter((n) => Number.isFinite(n) && n > 0) as number[];
    const areas = group
      .map((u) => computeUnitTotalArea(u))
      .filter((n) => Number.isFinite(n) && n > 0) as number[];
    
    // Generate label based on bedrooms if available, fallback to tipologia
    const bedroomValues = group.map((u) => u.bedrooms).filter((v): v is number => typeof v === "number");
    const uniformBedrooms = bedroomValues.length > 0 && bedroomValues.every((v) => v === bedroomValues[0]) ? bedroomValues[0] : undefined;
    
    let label = key; // fallback to tipologia code
    if (uniformBedrooms !== undefined) {
      if (uniformBedrooms === 0) {
        label = "Studio";
      } else if (uniformBedrooms === 1) {
        label = "1 Dormitorio";
      } else {
        label = `${uniformBedrooms} Dormitorios`;
      }
    }
    
    items.push({
      key,
      label,
      count: group.length,
      minPrice: prices.length ? Math.min(...prices) : undefined,
      minM2: areas.length ? Math.min(...areas) : undefined,
    });
  }
  return items.length ? items : undefined;
}

export async function GET(request: Request) {
  try {
    console.log("API /buildings called");
    
    const { searchParams } = new URL(request.url);
    // Simulate API failure to verify error boundaries and client retry behavior
    if (searchParams.get("fail") === "1") {
      return NextResponse.json({ error: "Fallo simulado" }, { status: 500 });
    }
    const parsed = QuerySchema.safeParse({
      comuna: searchParams.get("comuna") ?? undefined,
      tipologia: searchParams.get("tipologia") ?? undefined,
      minPrice: searchParams.get("minPrice") ?? undefined,
      maxPrice: searchParams.get("maxPrice") ?? undefined,
    });

    if (!parsed.success) {
      console.error("Query validation failed:", parsed.error);
      return NextResponse.json(
        { error: "Parámetros inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const filters = parsed.data;
    console.log("Calling getAllBuildings with filters:", filters);
    
    const list = await getAllBuildings(filters);
    console.log("Got buildings from getAllBuildings:", list.length);

    const buildings: BuildingListItem[] = list.map((b) => {
      const available = b.units.filter((u) => u.disponible);
      const hasAvailability = available.length > 0;
      const priceCandidates = (hasAvailability ? available : b.units)
        .map((u) => u.price)
        .filter((n) => Number.isFinite(n) && n > 0) as number[];
      
      // Fix: Ensure precioDesde is always a valid number for buildings with units
      const precioDesde = priceCandidates.length ? Math.min(...priceCandidates) : 999999999;
      
      const preciosDisponibles = available.map((u) => u.price).filter((n) => Number.isFinite(n) && n > 0) as number[];
      const precioRango = preciosDisponibles.length
        ? { min: Math.min(...preciosDisponibles), max: Math.max(...preciosDisponibles) }
        : undefined;
      const typologySummary = summarizeTypologies(available);

      return {
        id: b.id,
        slug: b.slug,
        name: b.name,
        comuna: b.comuna,
        address: b.address,
        gallery: b.gallery,
        coverImage: b.coverImage,
        badges: b.badges,
        serviceLevel: b.serviceLevel,
        precioDesde,
        precioRango,
        hasAvailability,
        typologySummary,
      } satisfies BuildingListItem;
    });

    console.log("Returning buildings:", buildings.length);
    return NextResponse.json({ buildings });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { 
        error: "Error inesperado", 
        details: error instanceof Error ? error.message : "Unknown error" 
      }, 
      { status: 500 }
    );
  }
}