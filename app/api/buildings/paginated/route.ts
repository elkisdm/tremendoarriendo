import { NextResponse } from "next/server";
import { z } from "zod";
import { getAllBuildings } from "@lib/data";
import type { Building, Unit, TypologySummary } from "@schemas/models";
import { computeUnitTotalArea } from "@lib/derive";
import { createRateLimiter } from "@lib/rate-limit";

// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic';

// Rate limiter: 20 requests per minute per IP
const rateLimiter = createRateLimiter({ windowMs: 60_000, max: 20 });

const PaginatedQuerySchema = z.object({
  comuna: z.string().min(1).optional(),
  tipologia: z.string().min(1).optional(),
  minPrice: z
    .preprocess((v) => (typeof v === "string" && v.trim() !== "" ? Number(v) : undefined), z.number().int().nonnegative().optional()),
  maxPrice: z
    .preprocess((v) => (typeof v === "string" && v.trim() !== "" ? Number(v) : undefined), z.number().int().nonnegative().optional()),
  page: z
    .preprocess((v) => (typeof v === "string" && v.trim() !== "" ? Number(v) : 1), z.number().int().min(1).default(1)),
  limit: z
    .preprocess((v) => (typeof v === "string" && v.trim() !== "" ? Number(v) : 12), z.number().int().min(1).max(50).default(12)),
  cursor: z.string().optional(), // Para infinite scroll futuro
});

type BuildingListItem = Pick<Building, "id" | "slug" | "name" | "comuna" | "address" | "gallery" | "coverImage" | "badges" | "serviceLevel"> & {
  precioDesde: number;
  precioRango?: { min: number; max: number };
  hasAvailability: boolean;
  typologySummary?: TypologySummary[];
};

type PaginatedResponse = {
  buildings: BuildingListItem[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    limit: number;
  };
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
    
    const bedroomValues = group.map((u) => u.bedrooms).filter((v): v is number => typeof v === "number");
    const uniformBedrooms = bedroomValues.length > 0 && bedroomValues.every((v) => v === bedroomValues[0]) ? bedroomValues[0] : undefined;
    
    let label = key;
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
    // Rate limiting check
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0] : "unknown";
    const rateLimitResult = await rateLimiter.check(ip);
    
    if (!rateLimitResult.ok) {
      return NextResponse.json(
        { error: "Rate limit exceeded", retryAfter: rateLimitResult.retryAfter },
        { 
          status: 429,
          headers: {
            "Retry-After": rateLimitResult.retryAfter?.toString() || "60",
            "X-RateLimit-Limit": "20",
            "X-RateLimit-Window": "60"
          }
        }
      );
    }

    // console.log("API /buildings/paginated called");
    
    const { searchParams } = new URL(request.url);
    const parsed = PaginatedQuerySchema.safeParse({
      comuna: searchParams.get("comuna") ?? undefined,
      tipologia: searchParams.get("tipologia") ?? undefined,
      minPrice: searchParams.get("minPrice") ?? undefined,
      maxPrice: searchParams.get("maxPrice") ?? undefined,
      page: searchParams.get("page") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
      cursor: searchParams.get("cursor") ?? undefined,
    });

    if (!parsed.success) {
      // console.error("Query validation failed:", parsed.error);
      return NextResponse.json(
        { error: "Parámetros inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { page, limit, ...filters } = parsed.data;
    // console.log("Calling getAllBuildings with filters:", filters, "page:", page, "limit:", limit);
    
    // Obtener todos los buildings y aplicar filtros
    const allBuildings = await getAllBuildings(filters);
    
    // Convertir a BuildingListItem
    const buildingItems: BuildingListItem[] = allBuildings.map((b) => {
      const available = b.units.filter((u) => u.disponible);
      const hasAvailability = available.length > 0;
      const priceCandidates = (hasAvailability ? available : b.units)
        .map((u) => u.price)
        .filter((n) => Number.isFinite(n) && n > 0) as number[];
      
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

    // Aplicar paginación
    const totalCount = buildingItems.length;
    const totalPages = Math.ceil(totalCount / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedBuildings = buildingItems.slice(startIndex, endIndex);

    const response: PaginatedResponse = {
      buildings: paginatedBuildings,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        limit,
      },
    };

    // console.log("Returning paginated buildings:", paginatedBuildings.length, "of", totalCount);
    return NextResponse.json(response);
  } catch (error) {
    // console.error("API Error:", error);
    return NextResponse.json(
      { 
        error: "Error inesperado", 
        details: error instanceof Error ? error.message : "Unknown error" 
      }, 
      { status: 500 }
    );
  }
}
