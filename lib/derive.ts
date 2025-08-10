import type { Building, Unit, PromotionBadge } from "@schemas/models";

export type PriceRange = { min: number; max: number };
export type AreaRange = { min: number; max: number };

export type TypologyAggregate = {
  code: string;
  bedrooms?: number;
  bathrooms?: number;
  unidades: number;
  priceRange?: PriceRange;
  areaRange?: AreaRange;
  hasPromo: boolean;
};

export type BuildingWithAggregates = Omit<Building, "typologySummary" | "hasAvailability" | "precioRango"> & {
  hasAvailability: boolean;
  precioDesde?: number;
  precioRango?: PriceRange;
  typologySummary: TypologyAggregate[];
};

function isPositiveNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

export function computeUnitTotalArea(unit: Unit): number {
  const hasInterior = isPositiveNumber(unit.area_interior_m2);
  const hasExterior = isPositiveNumber(unit.area_exterior_m2);
  if (hasInterior || hasExterior) {
    const interior = hasInterior ? (unit.area_interior_m2 as number) : 0;
    const exterior = hasExterior ? (unit.area_exterior_m2 as number) : 0;
    const sum = interior + exterior;
    return isPositiveNumber(sum) ? sum : unit.m2;
  }
  return unit.m2;
}

function hasAnyPromotion(badges?: PromotionBadge[] | undefined): boolean {
  return Array.isArray(badges) && badges.length > 0;
}

export function deriveBuildingAggregates(input: Building): BuildingWithAggregates {
  const availableUnits = (input.units ?? []).filter((u) => u.disponible);

  const hasAvailability = availableUnits.length > 0;

  const prices = availableUnits.map((u) => u.price).filter(isPositiveNumber);
  const precioDesde = prices.length > 0 ? Math.min(...prices) : undefined;
  const precioRango = prices.length > 0 ? { min: Math.min(...prices), max: Math.max(...prices) } : undefined;

  // Group by typology code
  const typologyMap = new Map<string, Unit[]>();
  for (const unit of availableUnits) {
    const key = unit.tipologia.trim();
    if (!typologyMap.has(key)) typologyMap.set(key, []);
    typologyMap.get(key)!.push(unit);
  }

  const buildingHasPromo = hasAnyPromotion(input.badges);

  const typologySummary: TypologyAggregate[] = Array.from(typologyMap.entries()).map(([code, units]) => {
    // Count
    const unidades = units.length;

    // Price range in typology
    const tPrices = units.map((u) => u.price).filter(isPositiveNumber);
    const priceRange = tPrices.length > 0 ? { min: Math.min(...tPrices), max: Math.max(...tPrices) } : undefined;

    // Area range (using interior+exterior if present, else m2)
    const tAreas = units.map((u) => computeUnitTotalArea(u)).filter(isPositiveNumber);
    const areaRange = tAreas.length > 0 ? { min: Math.min(...tAreas), max: Math.max(...tAreas) } : undefined;

    // Bedrooms and bathrooms: if uniform across units, keep the value; else undefined
    const bedroomValues = units.map((u) => u.bedrooms).filter((v): v is number => typeof v === "number");
    const bathroomValues = units.map((u) => u.bathrooms).filter((v): v is number => typeof v === "number");

    const bedrooms = bedroomValues.length > 0 && bedroomValues.every((v) => v === bedroomValues[0]) ? bedroomValues[0] : undefined;
    const bathrooms = bathroomValues.length > 0 && bathroomValues.every((v) => v === bathroomValues[0]) ? bathroomValues[0] : undefined;

    // Promotions: any unit in typology or building-level
    const hasUnitPromo = units.some((u) => hasAnyPromotion(u.promotions));
    const hasPromo = buildingHasPromo || hasUnitPromo;

    return {
      code,
      bedrooms,
      bathrooms,
      unidades,
      priceRange,
      areaRange,
      hasPromo,
    } satisfies TypologyAggregate;
  });

  const result: BuildingWithAggregates = {
    ...input,
    hasAvailability,
    precioDesde,
    precioRango,
    typologySummary,
  };

  return result;
}


