import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseProcessor } from '@/lib/supabase-data-processor';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    
    const offset = (page - 1) * limit;
    
    const processor = await getSupabaseProcessor();
    const result = await processor.getLandingBuildings(limit, offset);
    
    // Convertir LandingBuilding a BuildingSummary
    const buildings = result.buildings.map(building => ({
      id: building.id,
      slug: building.slug,
      name: building.name,
      comuna: building.comuna,
      address: building.address,
      coverImage: building.coverImage,
      gallery: building.gallery,
      precioDesde: building.precioDesde,
      hasAvailability: building.hasAvailability,
      badges: building.badges.map(badge => ({
        type: badge.type as any,
        label: badge.label,
        description: badge.description,
      })),
      amenities: building.amenities,
      typologySummary: building.typologySummary,
    }));

    return NextResponse.json({
      buildings,
      total: result.total,
      hasMore: result.hasMore,
      page,
      limit
    });
    
  } catch (error) {
    console.error('Error en API buildings:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}