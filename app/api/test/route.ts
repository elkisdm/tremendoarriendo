import { NextResponse } from "next/server";
import { readAll } from "@lib/data";

export async function GET() {
  try {
    console.log("🧪 Endpoint de prueba llamado");
    
    const buildings = await readAll();
    
    console.log(`📊 Total edificios obtenidos: ${buildings.length}`);
    
    return NextResponse.json({ 
      success: true, 
      count: buildings.length,
      sample: buildings.slice(0, 3).map(b => ({ name: b.name, comuna: b.comuna }))
    });
  } catch (error) {
    console.error("❌ Error en endpoint de prueba:", error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
}
