import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseProcessor } from '@lib/supabase-data-processor';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    
    const offset = (page - 1) * limit;
    
    const processor = getSupabaseProcessor();
    const buildings = await processor.getBuildings();
    const total = buildings.length;
    const hasMore = false;
    
    // Convertir Building a BuildingSummary
    const buildingSummaries = buildings.map(building => ({
      id: building.id,
      slug: building.slug || building.id,
      name: building.name,
      comuna: building.comuna,
      address: building.address,
      coverImage: building.coverImage,
      gallery: building.gallery || [],
      precioDesde: building.precioDesde || building.price,
      hasAvailability: building.hasAvailability || true,
      badges: building.badges || [],
      amenities: building.amenities || [],
      typologySummary: building.typologySummary || {},
    }));

    return NextResponse.json({
      buildings: buildingSummaries,
      total,
      hasMore,
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