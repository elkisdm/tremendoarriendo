import { NextResponse } from "next/server";
import { readAll } from "@lib/data";
import { createRateLimiter } from "@lib/rate-limit";

const limiter = createRateLimiter({ windowMs: 60_000, max: 20 });

export async function GET(request: Request) {
  const ipHeader = request.headers.get("x-forwarded-for");
  const ip = ipHeader ? ipHeader.split(",")[0].trim() : "unknown";
  const { ok, retryAfter } = await limiter.check(ip);
  if (!ok) {
    return NextResponse.json(
      { error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(retryAfter ?? 60) } }
    );
  }
  try {
    // console.log("🧪 Endpoint de prueba llamado");
    
    const buildings = await readAll();
    
    // console.log(`📊 Total edificios obtenidos: ${buildings.length}`);
    
    return NextResponse.json({ 
      success: true, 
      count: buildings.length,
      sample: buildings.slice(0, 3).map(b => ({ name: b.name, comuna: b.comuna }))
    });
  } catch (error) {
    // console.error("❌ Error en endpoint de prueba:", error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
}
