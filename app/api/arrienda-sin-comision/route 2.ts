import { NextRequest, NextResponse } from "next/server";
import { LANDING_BUILDINGS_MOCK } from "@/lib/arrienda-sin-comision-mocks";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");

    // Usar solo los datos mock de Home Amengual
    const buildings = LANDING_BUILDINGS_MOCK;
    const total = buildings.length;

    return NextResponse.json({
      success: true,
      buildings,
      pagination: {
        page,
        limit,
        total,
        hasMore: false, // Solo tenemos 1 edificio
        totalPages: 1
      }
    });

  } catch (error) {
    console.error("Error en API arrienda-sin-comision:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Error interno del servidor",
        buildings: [],
        pagination: {
          page: 1,
          limit: 12,
          total: 0,
          hasMore: false,
          totalPages: 0
        }
      },
      { status: 500 }
    );
  }
}
