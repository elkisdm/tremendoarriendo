import { NextResponse } from "next/server";
import { z } from "zod";
import { getBuildingBySlug } from "@lib/data";

const ParamsSchema = z.object({ slug: z.string().min(1) });

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  try {
    const params = await context.params;
    const parsed = ParamsSchema.safeParse(params);
    if (!parsed.success) {
      return NextResponse.json({ error: "Parámetros inválidos" }, { status: 400 });
    }
    const { slug } = parsed.data;
    const building = await getBuildingBySlug(slug);
    if (!building) {
      return NextResponse.json({ error: "Edificio no encontrado" }, { status: 404 });
    }
    return NextResponse.json({ building });
  } catch {
    return NextResponse.json({ error: "Error inesperado" }, { status: 500 });
  }
}


