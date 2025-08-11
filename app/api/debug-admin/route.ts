import { NextResponse } from "next/server";
import { supabaseAdmin } from "@lib/supabase";

export async function GET() {
  try {
    console.log("🔍 Endpoint de debug admin llamado");
    
    if (!supabaseAdmin) {
      return NextResponse.json({ 
        success: false, 
        error: "No admin client available"
      });
    }
    
    // Intentar consulta con cliente admin
    const { data: buildingsData, error: buildingsError } = await supabaseAdmin
      .from('buildings')
      .select('id, nombre, comuna')
      .limit(10);

    if (buildingsError) {
      return NextResponse.json({ 
        success: false, 
        error: buildingsError.message
      });
    }

    return NextResponse.json({ 
      success: true,
      totalBuildings: buildingsData?.length || 0,
      sample: buildingsData?.slice(0, 3).map(b => ({
        name: b.nombre,
        comuna: b.comuna
      })) || []
    });
  } catch (error) {
    console.error("❌ Error en endpoint de debug admin:", error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
}
