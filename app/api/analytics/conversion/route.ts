import { NextRequest, NextResponse } from "next/server";

// Tipos para eventos de conversión
type ConversionEvent = {
  eventName: string;
  properties: Record<string, unknown>;
  timestamp: number;
  sessionId?: string;
};

export async function POST(request: NextRequest) {
  try {
    const event: ConversionEvent = await request.json();
    
    // Validar evento básico
    if (!event.eventName || !event.timestamp) {
      return NextResponse.json(
        { error: "Evento inválido" },
        { status: 400 }
      );
    }

    // Log del evento (en producción usaría un servicio de analytics)
    console.log(`[Analytics] ${event.eventName}`, {
      sessionId: event.sessionId,
      properties: event.properties,
      timestamp: new Date(event.timestamp).toISOString(),
      userAgent: request.headers.get("user-agent"),
      ip: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown",
    });

    // Aquí podrías enviar a servicios como:
    // - Google Analytics 4
    // - Mixpanel
    // - Amplitude
    // - PostHog
    // - Base de datos propia

    // Por ahora solo retornamos éxito
    return NextResponse.json({ 
      success: true,
      eventId: `${event.sessionId}-${event.timestamp}`,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Error procesando evento de conversión:", error);
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
    message: "Analytics endpoint funcionando",
    timestamp: new Date().toISOString()
  });
}

