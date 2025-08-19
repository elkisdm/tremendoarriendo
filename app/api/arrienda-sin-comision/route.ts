import { NextResponse } from "next/server";
import { createRateLimiter } from "@lib/rate-limit";
import { getSupabaseProcessor } from "@/lib/supabase-data-processor";

// Rate limiter: 20 requests per minute per IP
const rateLimiter = createRateLimiter({ windowMs: 60_000, max: 20 });

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

    // Obtener parámetros de query
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const offset = (page - 1) * limit;

    console.log('🔍 API Arriendo Sin Comisión: Cargando edificios con promociones...');
    
    const processor = await getSupabaseProcessor();
    const result = await processor.getLandingBuildings(limit, offset);
    
    console.log(`✅ API Arriendo Sin Comisión: ${result.buildings.length} edificios cargados`);

    return NextResponse.json({
      success: true,
      buildings: result.buildings,
      pagination: {
        page,
        limit,
        total: result.total,
        hasMore: result.hasMore,
        totalPages: Math.ceil(result.total / limit)
      }
    });

  } catch (error) {
    console.error('❌ Error en API Arriendo Sin Comisión:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
