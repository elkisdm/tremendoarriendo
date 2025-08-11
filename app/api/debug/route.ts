import { NextResponse } from "next/server";
import { supabase } from "@lib/supabase";

export async function GET() {
  try {
    console.log("🔍 Endpoint de debug llamado");
    
    // Verificar variables de entorno
    const USE_SUPABASE = process.env.USE_SUPABASE === "true";
    
    // Intentar consulta directa a Supabase
    const { data: buildingsData, error: buildingsError } = await supabase
      .from('buildings')
      .select(`
        id,
        nombre,
        comuna,
        units (
          id,
          tipologia,
          precio,
          disponible
        )
      `)
      .limit(10);

    if (buildingsError) {
      return NextResponse.json({ 
        success: false, 
        error: buildingsError.message,
        useSupabase: USE_SUPABASE
      });
    }

    const buildingsWithUnits = buildingsData?.filter(building => {
      const availableUnits = building.units?.filter(unit => unit.disponible) || [];
      return availableUnits.length > 0;
    }) || [];

    return NextResponse.json({ 
      success: true,
      useSupabase: USE_SUPABASE,
      totalBuildings: buildingsData?.length || 0,
      buildingsWithAvailableUnits: buildingsWithUnits.length,
      sample: buildingsWithUnits.slice(0, 3).map(b => ({
        name: b.nombre,
        comuna: b.comuna,
        unitsCount: b.units?.length || 0,
        availableUnits: b.units?.filter(u => u.disponible).length || 0
      }))
    });
  } catch (error) {
    console.error("❌ Error en endpoint de debug:", error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
}
