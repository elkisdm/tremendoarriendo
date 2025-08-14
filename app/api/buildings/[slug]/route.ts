import { NextResponse } from "next/server";
import { z } from "zod";
import { getBuildingBySlug } from "@lib/data";
import { createRateLimiter } from "@lib/rate-limit";

const ParamsSchema = z.object({ slug: z.string().min(1) });

// Rate limiter: 20 requests per minute per IP
const rateLimiter = createRateLimiter({ windowMs: 60_000, max: 20 });

export async function GET(request: Request, context: { params: Promise<{ slug: string }> }) {
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


