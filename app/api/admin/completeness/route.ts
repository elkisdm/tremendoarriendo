import { NextResponse } from "next/server";
import { createRateLimiter } from "@lib/rate-limit";
import { createSupabaseClient } from "@lib/supabase.mock";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Rate limiting for admin endpoints
const limiter = createRateLimiter({ windowMs: 60_000, max: 10 });

interface CompletenessStats {
  totalBuildings: number;
  averageCompleteness: number;
  buildingsWithIssues: number;
  completenessDistribution: {
    excellent: number; // 90-100%
    good: number;     // 70-89%
    fair: number;     // 50-69%
    poor: number;     // 0-49%
  };
  topIssues: Array<{
    field: string;
    count: number;
    percentage: number;
  }>;
}

function calculateCompletenessStats(buildings: any[]): CompletenessStats {
  if (!buildings || buildings.length === 0) {
    return {
      totalBuildings: 0,
      averageCompleteness: 0,
      buildingsWithIssues: 0,
      completenessDistribution: { excellent: 0, good: 0, fair: 0, poor: 0 },
      topIssues: []
    };
  }

  const totalBuildings = buildings.length;
  const averageCompleteness = buildings.reduce((sum, b) => sum + b.completeness_percentage, 0) / totalBuildings;
  
  const buildingsWithIssues = buildings.filter(b => b.completeness_percentage < 100).length;
  
  const distribution = buildings.reduce((acc, b) => {
    const percentage = b.completeness_percentage;
    if (percentage >= 90) acc.excellent++;
    else if (percentage >= 70) acc.good++;
    else if (percentage >= 50) acc.fair++;
    else acc.poor++;
    return acc;
  }, { excellent: 0, good: 0, fair: 0, poor: 0 });

  // Calculate top issues
  const fieldIssues = {
    'cover_image': buildings.filter(b => b.cover_image_status === '❌').length,
    'badges': buildings.filter(b => b.badges_status === '❌').length,
    'service_level': buildings.filter(b => b.service_level_status === '❌').length,
    'amenities': buildings.filter(b => b.amenities_status === '❌').length,
    'gallery': buildings.filter(b => b.gallery_status === '❌').length,
  };

  const topIssues = Object.entries(fieldIssues)
    .filter(([_, count]) => count > 0)
    .map(([field, count]) => ({
      field,
      count,
      percentage: Math.round((count / totalBuildings) * 100)
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    totalBuildings,
    averageCompleteness: Math.round(averageCompleteness * 10) / 10,
    buildingsWithIssues,
    completenessDistribution: distribution,
    topIssues
  };
}

export async function GET(request: Request) {
  try {
    console.log("🔍 Admin completeness endpoint called");

    // Rate limiting
    const ipHeader = request.headers.get("x-forwarded-for");
    const ip = ipHeader ? ipHeader.split(",")[0].trim() : "unknown";
    
    const rateLimitResult = await limiter.check(ip);
    if (!rateLimitResult.ok) {
      console.warn(`Rate limit exceeded for IP: ${ip}`);
      return NextResponse.json(
        { error: "rate_limited" },
        { status: 429, headers: { "Retry-After": String(rateLimitResult.retryAfter ?? 60) } }
      );
    }

    // TODO(BLUEPRINT): mocks solo dev
    // Fetch data from the completeness view
    const supabaseAdmin = createSupabaseClient();
    const { data: buildings, error } = await supabaseAdmin
      .from('v_building_completeness')
      .select('*')
      .order('completeness_percentage', { ascending: true });

    if (error) {
      console.error('Error fetching completeness data:', error);
      return NextResponse.json(
        { error: "database_error", details: error.message },
        { status: 500 }
      );
    }

    // Calculate statistics
    const stats = calculateCompletenessStats(buildings);

    console.log(`📊 Completeness data fetched: ${buildings?.length || 0} buildings`);

    return NextResponse.json({
      success: true,
      buildings: buildings || [],
      stats,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "internal_error", message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
