import type { QuotationInput, QuotationResponse } from "@schemas/quotation";

export interface Unit {
  id: string;
  price: number;
  area: number;
  type: string;
  available: boolean;
}

export interface Building {
  id: string;
  name: string;
  commune: string;
  units: Unit[];
}

export function computeQuotation(
  input: QuotationInput,
  unit: Unit,
  building: Building
): QuotationResponse {
  try {
    const monthlyRent = unit.price;
    const deposit = monthlyRent; // 1 mes de depósito
    const utilities = input.includeUtilities ? 50000 : 0; // $50k por servicios básicos
    const furniture = input.includeFurniture ? 100000 : 0; // $100k por muebles
    const fees = 0; // 0% comisión

    const totalFirstMonth = monthlyRent + deposit + utilities + furniture + fees;
    const totalContract = (monthlyRent * input.duration) + deposit + (utilities * input.duration) + (furniture * input.duration) + fees;

    return {
      success: true,
      quotation: {
        unitId: input.unitId,
        startDate: input.startDate,
        duration: input.duration,
        monthlyRent,
        deposit,
        utilities: input.includeUtilities ? utilities : undefined,
        furniture: input.includeFurniture ? furniture : undefined,
        totalFirstMonth,
        totalContract,
        breakdown: {
          rent: monthlyRent,
          deposit,
          utilities: input.includeUtilities ? utilities : undefined,
          furniture: input.includeFurniture ? furniture : undefined,
          fees,
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: "Error al calcular la cotización",
    };
  }
}

export function getUnitWithBuilding(unitId: string): { unit: Unit; building: Building } | null {
  // Mock data - en producción esto vendría de la base de datos
  const mockUnit: Unit = {
    id: unitId,
    price: 210000,
    area: 45,
    type: "1D1B",
    available: true,
  };

  const mockBuilding: Building = {
    id: "1",
    name: "Home Inclusive Amengual",
    commune: "Estación Central",
    units: [mockUnit],
  };

  return { unit: mockUnit, building: mockBuilding };
}
