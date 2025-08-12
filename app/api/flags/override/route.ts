import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { applyOverride, getFlagsStatus, type FlagOverride } from '@lib/flags';

// Rate limiting in-memory (simple implementation)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minuto
const RATE_LIMIT_MAX_REQUESTS = 5;

// Schema para validación
const OverrideRequestSchema = z.object({
  flag: z.enum(['comingSoon']),
  value: z.boolean(),
  duration: z.number().int().min(300).max(3600).optional(), // 5min - 1h en segundos
});

function getClientIP(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0] || 
         request.headers.get('x-real-ip') || 
         'unknown';
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }
  
  record.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    if (!checkRateLimit(clientIP)) {
      return NextResponse.json(
        { success: false, error: 'Demasiadas solicitudes. Intenta de nuevo en 1 minuto.' },
        { status: 429 }
      );
    }

    // Validar body
    const json = await request.json();
    const parsed = OverrideRequestSchema.safeParse(json);
    
    if (!parsed.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Datos inválidos', 
          details: parsed.error.flatten() 
        },
        { status: 400 }
      );
    }

    const { flag, value, duration = 1800 } = parsed.data; // 30min por defecto

    // Aplicar override usando la función del lib
    const override: FlagOverride = { flag, value, duration };
    const result = applyOverride(override);

    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error('Error en override API:', error);
    return NextResponse.json(
      { success: false, error: 'Error inesperado' },
      { status: 500 }
    );
  }
}

// GET para ver estado actual
export async function GET() {
  try {
    const flagsStatus = getFlagsStatus();
    
    return NextResponse.json(
      { 
        success: true,
        flags: flagsStatus
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error obteniendo flags:', error);
    return NextResponse.json(
      { success: false, error: 'Error inesperado' },
      { status: 500 }
    );
  }
}
