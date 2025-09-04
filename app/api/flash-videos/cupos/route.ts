import { NextRequest, NextResponse } from "next/server";

// Simulación de base de datos en memoria (en producción usar Supabase/DB)
let cuposDisponibles = 10;

export async function GET() {
  try {
    return NextResponse.json({
      cuposDisponibles,
      total: 10,
      porcentaje: Math.round((cuposDisponibles / 10) * 100),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error obteniendo cupos:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === "decrementar" && cuposDisponibles > 0) {
      cuposDisponibles--;
      
      return NextResponse.json({
        success: true,
        cuposDisponibles,
        total: 10,
        porcentaje: Math.round((cuposDisponibles / 10) * 100),
        timestamp: new Date().toISOString(),
      });
    }

    if (action === "reset") {
      cuposDisponibles = 10;
      
      return NextResponse.json({
        success: true,
        cuposDisponibles,
        total: 10,
        porcentaje: 100,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      { error: "Acción no válida" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error actualizando cupos:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}


