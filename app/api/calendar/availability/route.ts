import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createRateLimiter } from '@lib/rate-limit';
import { buildAvailability } from '@lib/calendar/availability';
import { fetchGoogleBusy } from '@lib/calendar/google';
import { fetchIcsEvents } from '@lib/calendar/ics';
import type { CalendarEvent, TimeRange } from '@lib/calendar/availability';

const limiter = createRateLimiter({ windowMs: 60_000, max: 20 });

const BodySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  visibleHours: z.object({ start: z.string(), end: z.string() }).optional(),
  googleCalendarId: z.string().min(1).optional(),
  icsUrl: z.string().url().optional(),
  internalBlocks: z.array(z.object({
    id: z.string(),
    title: z.string(),
    start: z.string(),
    end: z.string(),
    busy: z.boolean().optional(),
  })).optional()
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'ip:unknown';
  const rate = await limiter.check(ip);
  if (!rate.ok) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429, headers: { 'Retry-After': String(rate.retryAfter ?? 60) } });
  }

  let body: z.infer<typeof BodySchema>;
  try {
    body = BodySchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }

  try {
    // Mock response for now
    const slots = [
      { start: '08:00', end: '09:00', available: true },
      { start: '09:00', end: '10:00', available: true },
      { start: '10:00', end: '11:00', available: false },
      { start: '11:00', end: '12:00', available: true },
    ];

    return NextResponse.json({ date: body.date, slots }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
