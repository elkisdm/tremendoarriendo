import { NextResponse } from "next/server";
import { BookingRequestSchema } from "@schemas/models";
import { createRateLimiter } from "@lib/rate-limit";

// Rate limiter: 10 requests per minute per IP (more restrictive for booking)
const rateLimiter = createRateLimiter({ windowMs: 60_000, max: 10 });

export async function POST(request: Request) {
  try {
    // Rate limiting check
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0] : "unknown";
    const rateLimitResult = await rateLimiter.check(ip);
    
    if (!rateLimitResult.ok) {
      return NextResponse.json(
        { success: false, error: "Rate limit exceeded", retryAfter: rateLimitResult.retryAfter },
        { 
          status: 429,
          headers: {
            "Retry-After": rateLimitResult.retryAfter?.toString() || "60",
            "X-RateLimit-Limit": "10",
            "X-RateLimit-Window": "60"
          }
        }
      );
    }

    const json = await request.json();
    const parsed = BookingRequestSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Datos inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // Simular persistencia
    await new Promise((res) => setTimeout(res, 400));
    const bookingId = `bk_${Math.random().toString(36).slice(2, 10)}`;

    return NextResponse.json({ success: true, bookingId }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Error inesperado" }, { status: 500 });
  }
}


