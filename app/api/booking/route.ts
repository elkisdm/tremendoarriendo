import { NextResponse } from "next/server";
import { BookingRequestSchema } from "@schemas/models";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = BookingRequestSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Datos inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // Simular persistencia
    await new Promise((res) => setTimeout(res, 400));
    const bookingId = `bk_${Math.random().toString(36).slice(2, 10)}`;

    return NextResponse.json({ success: true, bookingId }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Error inesperado" }, { status: 500 });
  }
}


