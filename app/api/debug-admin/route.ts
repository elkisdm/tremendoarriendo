import { NextResponse } from "next/server";
import { createSupabaseClient } from "@lib/supabase.mock";
import { createRateLimiter } from "@lib/rate-limit";
import { logger } from "@lib/logger";

const limiter = createRateLimiter({ windowMs: 60_000, max: 20 });

export async function GET(request: Request) {
  const ipHeader = request.headers.get("x-forwarded-for");
  const ip = ipHeader ? ipHeader.split(",")[0].trim() : "unknown";
  const { ok, retryAfter } = await limiter.check(ip);
  if (!ok) {
    logger.warn('debug-admin rate limited', { ip });
    return NextResponse.json(
      { error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(retryAfter ?? 60) } }
    );
  }
  try {
    // TODO(BLUEPRINT): mocks solo dev
    // Intentar consulta con cliente admin
    logger.debug('debug-admin fetching sample buildings');
    const supabaseAdmin = createSupabaseClient();
    const { data: buildingsData, error: buildingsError } = await supabaseAdmin
      .from('buildings')
      .select('id, nombre, comuna')
      .limit(10);

    if (buildingsError) {
      logger.error('debug-admin buildings query error', { message: buildingsError.message });
      return NextResponse.json({ 
        success: false, 
        error: buildingsError.message
      });
    }

    logger.info('debug-admin buildings query ok', { count: buildingsData?.length || 0 });
    return NextResponse.json({ 
      success: true,
      totalBuildings: buildingsData?.length || 0,
      sample: buildingsData?.slice(0, 3).map(b => ({
        name: b.nombre,
        comuna: b.comuna
      })) || []
    });
  } catch (error) {
    logger.error('debug-admin unexpected error', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
}
