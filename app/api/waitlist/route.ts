import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { WaitlistRequestSchema } from '@schemas/models';

// Rate limiting in-memory (en producción usar Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minuto
const RATE_LIMIT_MAX_REQUESTS = 3;

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
    const parsed = WaitlistRequestSchema.safeParse(json);
    
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

    const { email, phone, utm } = parsed.data;

    // Crear cliente Supabase (usando service role key para bypass RLS)
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase environment variables');
      return NextResponse.json(
        { success: false, error: 'Error de configuración' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Insertar en waitlist
    const { data, error } = await supabase
      .from('waitlist')
      .insert({
        email,
        phone,
        utm: utm || {},
        source: 'coming-soon'
      })
      .select()
      .single();

    if (error) {
      console.error('Error inserting into waitlist:', error);
      
      // Si es un email duplicado, no es un error crítico
      if (error.code === '23505') { // unique_violation
        return NextResponse.json(
          { success: true, message: 'Ya estás en la lista de espera' },
          { status: 200 }
        );
      }
      
      return NextResponse.json(
        { success: false, error: 'Error al guardar datos' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: '¡Te agregamos a la lista de espera!' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Unexpected error in waitlist API:', error);
    return NextResponse.json(
      { success: false, error: 'Error inesperado' },
      { status: 500 }
    );
  }
}
