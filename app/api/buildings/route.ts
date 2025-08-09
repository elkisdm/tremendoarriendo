import { NextResponse } from "next/server";
import { z } from "zod";
import { getAllBuildings } from "@lib/data";
import type { Building } from "@schemas/models";

const QuerySchema = z.object({
  comuna: z.string().min(1).optional(),
  tipologia: z.string().min(1).optional(),
  minPrice: z
    .preprocess((v) => (typeof v === "string" && v.trim() !== "" ? Number(v) : undefined), z.number().int().nonnegative().optional()),
  maxPrice: z
    .preprocess((v) => (typeof v === "string" && v.trim() !== "" ? Number(v) : undefined), z.number().int().nonnegative().optional()),
});

type BuildingSummary = Building & {
  precioDesde: number | null;
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = QuerySchema.safeParse({
      comuna: searchParams.get("comuna") ?? undefined,
      tipologia: searchParams.get("tipologia") ?? undefined,
      minPrice: searchParams.get("minPrice") ?? undefined,
      maxPrice: searchParams.get("maxPrice") ?? undefined,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Parámetros inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const filters = parsed.data;
    const list = await getAllBuildings(filters);

    const buildings: BuildingSummary[] = list.map((b) => ({
      ...b,
      precioDesde: b.precioDesde ?? null,
    }));

    return NextResponse.json({ buildings });
  } catch {
    return NextResponse.json({ error: "Error inesperado" }, { status: 500 });
  }
}


