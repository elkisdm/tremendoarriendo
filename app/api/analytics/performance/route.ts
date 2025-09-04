import { NextRequest, NextResponse } from "next/server";

// Tipos para métricas de performance
type PerformanceMetric = {
  name: string;
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  timestamp: number;
  page_url?: string;
  user_agent?: string;
};

export async function POST(request: NextRequest) {
  try {
    const metric: PerformanceMetric = await request.json();
    
    // Validar métrica básica
    if (!metric.name || typeof metric.value !== "number") {
      return NextResponse.json(
        { error: "Métrica inválida" },
        { status: 400 }
      );
    }

    // Log de la métrica (en producción usaría un servicio de analytics)
    console.log(`[Performance] ${metric.name}: ${metric.value}ms (${metric.rating})`, {
      page_url: metric.page_url,
      user_agent: metric.user_agent,
      timestamp: new Date(metric.timestamp).toISOString(),
    });

    // Aquí podrías enviar a servicios como:
    // - Google Analytics 4
    // - Google Search Console
    // - DataDog
    // - New Relic
    // - Base de datos propia

    // Por ahora solo retornamos éxito
    return NextResponse.json({ 
      success: true,
      metric: metric.name,
      rating: metric.rating,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Error procesando métrica de performance:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// GET para verificar que el endpoint funciona
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Performance analytics endpoint funcionando",
    timestamp: new Date().toISOString()
  });
}


