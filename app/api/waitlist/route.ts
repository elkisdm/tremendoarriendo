import { NextRequest, NextResponse } from 'next/server';
// import { z } from 'zod';
import { WaitlistRequestSchema } from '@schemas/models';
import { createRateLimiter } from '@lib/rate-limit';
import { createSupabaseClient } from '@lib/supabase.mock';
import { logger } from '@lib/logger';

// Rate limiter: 20 requests per 60 seconds
const rateLimiter = createRateLimiter({ windowMs: 60_000, max: 20 });

function getClientIP(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0] || 
         request.headers.get('x-real-ip') || 
         'unknown';
}

export async function GET() {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (process.env.NODE_ENV === 'production') {
      if (!supabaseUrl || !supabaseServiceKey) {
        return NextResponse.json(
          { ok: false, error: 'server_misconfigured' },
          { status: 500 }
        );
      }
    }
    
    return NextResponse.json({ ok: true });
  } catch (_error) {
    return NextResponse.json(
      { ok: false, error: 'health_check_failed' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    const rateLimitResult = await rateLimiter.check(clientIP);
    
    if (!rateLimitResult.ok) {
      logger.warn('Waitlist rate limit exceeded', { ip: clientIP, retryAfter: rateLimitResult.retryAfter });
      return NextResponse.json(
        { 
          success: false, 
          error: 'Demasiados intentos, prueba en un minuto',
          retryAfter: rateLimitResult.retryAfter 
        },
        { 
          status: 429,
          headers: {
            'Retry-After': rateLimitResult.retryAfter?.toString() || '60'
          }
        }
      );
    }

    // Validar body
    const json = await request.json();
    const parsed = WaitlistRequestSchema.safeParse(json);
    
    if (!parsed.success) {
      logger.warn('Waitlist validation failed', parsed.error.flatten());
      return NextResponse.json(
        { 
          success: false, 
          error: 'Revisa el email',
          issues: parsed.error.flatten() 
        },
        { status: 400 }
      );
    }

    const { email, phone } = parsed.data;

    // Crear cliente Supabase (real o mock)
    let supabase;
    try {
      supabase = createSupabaseClient();
    } catch (error) {
      if (error instanceof Error && error.message === 'server_misconfigured') {
        logger.error('Supabase no configurado en producción');
        return NextResponse.json(
          { success: false, error: 'server_misconfigured' },
          { status: 500 }
        );
      }
      throw error;
    }

    // Insertar en waitlist
    const { error: _error } = await supabase
      .from('waitlist')
      .insert({
        email,
        phone: phone || null
      })
      .select()
      .single();

    if (_error) {
      logger.error('Waitlist DB insert failed', { code: _error.code });
      
      // Si es un email duplicado, no es un error crítico
      if (_error.code === '23505') { // unique_violation
        return NextResponse.json(
          { success: true, message: 'Ya estás en la lista de espera' },
          { status: 200 }
        );
      }
      
      return NextResponse.json(
        { success: false, error: 'Tuvimos un problema, intenta de nuevo' },
        { status: 500 }
      );
    }

    logger.info('Waitlist insert successful');
    return NextResponse.json(
      { success: true, message: '¡Te agregamos a la lista de espera!' },
      { status: 200 }
    );

  } catch {
    logger.error('Unexpected waitlist error');
    return NextResponse.json(
      { success: false, error: 'Tuvimos un problema, intenta de nuevo' },
      { status: 500 }
    );
  }
}
