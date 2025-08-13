import type { Building, Unit } from "@schemas/models";
import {
  hashSha1Join,
  titlecaseTrim,
  normalizeCommuneExtended,
  // _enumMFOrRetail,
  // _validUrlOrNull,
  // _upperTrim,
  normalizeTypologyInternal,
  // _mapTypologyPublic,
  toIntNull,
  sumIfBoth,
  strictEnum,
  parse_ids_or_pipe,
  // _isOptionalX,
  notEmptyAndNotX,
  clpToInt,
  // clpToIntNull,
  determineGCMode,
  toFloatNull,
  rentMinRequiredSumable,
  // _mapContractIndexUFIPC,
  // toIntNull as _toIntNull2,
  percentToInt0100,
  toBoolGeneric,
  rangeOrNull,
  validateGuaranteeMonths,
  validateGuaranteeInstallments,
  // toBoolGeneric as _toBoolGeneric2
} from "./adapters/assetplan";
import {
  // _calculatePriceFrom,
  // _calculatePriceTo,
  // _hasAvailability,
  // _calculateRentaMinima,
  // _calculateFeaturedFlag,
  isAvailableForPublishing,
  calculateNoGuaranteeSurcharge,
  // _calculateBuildingAggregations,
  // _calculatePricePercentile,
  // _calculateFeaturedFlagWithPercentile,
  // _calculateRentaMinimaSumable,
  // validatePetRestrictions as _validatePetRestrictionsDerive
} from "./derive";

// Types for the mapping configuration
export interface MappingConfig {
  meta: {
    version: string;
    primary_key: string;
    currency: string;
  };
  availability: {
    publishable_states: string[];
    min_rent_exclusive: number;
  };
  building: Record<string, unknown>;
  unit: Record<string, unknown>;
  pricing: Record<string, unknown>;
  promotion: Record<string, unknown>;
  aggregations: Record<string, unknown>;
}

// Raw data types based on the mapping
export interface RawBuildingData {
  Condominio: string;
  Comuna: string;
  Direccion: string;
  "Tipo edificio": string;
  "Link Listing": string;
}

export interface RawUnitData {
  OP: string;
  Unidad: string;
  Tipologia: string;
  "m2 Depto": number | string;
  "m2 Exterior": number | string;
  Orientacion: string;
  Estac: string;
  Bod: string;
  "Arriendo Total": number | string;
  "GC Total": number | string;
  "Rentas Necesarias": number | string;
  "Reajuste por contrato": string;
  "Meses sin reajuste": number | string;
  "% Descuento": number | string;
  "Cant. Meses Descuento": number | string;
  "Tremenda promo": boolean | string;
  "Sin Garantia": boolean | string;
  "Cant. Garantías (Meses)": number | string;
  "Cant. Garantías Mascota (Meses)": number | string;
  "Cuotas Garantía": number | string;
  "Requiere Aval(es)": boolean | string;
  "Acepta Mascotas?": boolean | string;
  Estado: string;
}

/**
 * Transforma datos raw según la configuración de mapping v2.0.0
 */
export class MappingV2Transformer {
  private config: MappingConfig;

  constructor(config: MappingConfig) {
    this.config = config;
  }

  /**
   * Transforma datos de edificio raw a formato canónico
   */
  transformBuilding(raw: RawBuildingData): Partial<Building> {
    const buildingId = hashSha1Join([raw.Condominio, raw.Comuna, raw.Direccion], "|");
    
    return {
      id: buildingId,
      name: titlecaseTrim(raw.Condominio),
      address: raw.Direccion?.trim(),
      comuna: normalizeCommuneExtended(raw.Comuna),
      // Add v2 fields
      gc_mode: determineGCMode(raw["Tipo edificio"], buildingId),
      // Note: link_listing is unit-level, not building-level
    };
  }

  /**
   * Transforma datos de unidad raw a formato canónico
   */
  transformUnit(raw: RawUnitData, _buildingId: string): Partial<Unit> {
    const unitId = raw.OP?.trim();
    
    // Parse parking and storage
    const parkingData = parse_ids_or_pipe(raw.Estac);
    const storageData = parse_ids_or_pipe(raw.Bod);
    
    // Calculate areas
    const m2Interior = toIntNull(raw["m2 Depto"]) || undefined;
    const m2Exterior = toIntNull(raw["m2 Exterior"]) || undefined;
    const m2Ponderado = sumIfBoth(m2Interior, m2Exterior);
    
    // Calculate pricing
    const rentAmount = clpToInt(raw["Arriendo Total"]);
    // const _gcTotal = clpToIntNull(raw["GC Total"]);
    const rentasNecesarias = toFloatNull(raw["Rentas Necesarias"]);
    const rentaMinima = rentasNecesarias ? rentMinRequiredSumable(rentAmount, rentasNecesarias) : undefined;
    
    // Check availability
    const disponible = isAvailableForPublishing(raw.Estado, rentAmount);
    
    return {
      id: unitId,
      tipologia: normalizeTypologyInternal(raw.Tipologia),
      m2: m2Ponderado || 0,
      price: rentAmount,
      estacionamiento: notEmptyAndNotX(raw.Estac),
      bodega: notEmptyAndNotX(raw.Bod),
      disponible,
      // Extended fields
      area_interior_m2: m2Interior,
      area_exterior_m2: m2Exterior,
      orientacion: strictEnum(raw.Orientacion, ["N", "NE", "E", "SE", "S", "SO", "O", "NO"]) as "N" | "NE" | "E" | "SE" | "S" | "SO" | "O" | "NO" | undefined,
      // v2 fields
      parking_ids: parkingData.ids,
      parking_opcional: parkingData.has_optional,
      storage_ids: storageData.ids,
      storage_opcional: storageData.has_optional,
      guarantee_installments: validateGuaranteeInstallments(toIntNull(raw["Cuotas Garantía"]) || undefined),
      guarantee_months: validateGuaranteeMonths(toFloatNull(raw["Cant. Garantías (Meses)"]) || undefined),
      rentas_necesarias: rentasNecesarias || undefined,
      renta_minima: rentaMinima,
      link_listing: undefined, // Link listing is building-level, not unit-level
      // Additional fields that would be calculated
      petFriendly: toBoolGeneric(raw["Acepta Mascotas?"]),
    };
  }

  /**
   * Transforma datos de promoción raw
   */
  transformPromotion(raw: RawUnitData): {
    discount_pct: number;
    discount_months: number | null;
    tremenda_promo: boolean;
    no_guarantee: boolean;
    no_guarantee_surcharge_pct: number;
    guarantee_months: number | null;
    pet_guarantee_months: number | null;
    guarantee_installments: number | null;
    requires_guarantor: boolean;
    accepts_pets: boolean;
  } {
    const discountPct = percentToInt0100(raw["% Descuento"]);
    const discountMonths = toIntNull(raw["Cant. Meses Descuento"]);
    const tremendaPromo = toBoolGeneric(raw["Tremenda promo"]);
    const noGuarantee = toBoolGeneric(raw["Sin Garantia"]);
    const guaranteeMonths = toFloatNull(raw["Cant. Garantías (Meses)"]);
    const petGuaranteeMonths = toFloatNull(raw["Cant. Garantías Mascota (Meses)"]);
    const guaranteeInstallments = rangeOrNull(toIntNull(raw["Cuotas Garantía"]) || undefined, 1, 12);
    const requiresGuarantor = toBoolGeneric(raw["Requiere Aval(es)"]);
    const acceptsPets = toBoolGeneric(raw["Acepta Mascotas?"]);
    
    // Calculate no guarantee surcharge
    const rentAmount = clpToInt(raw["Arriendo Total"]);
    const noGuaranteeSurcharge = noGuarantee ? calculateNoGuaranteeSurcharge(rentAmount) : 0;
    
    return {
      discount_pct: discountPct,
      discount_months: discountMonths,
      tremenda_promo: tremendaPromo,
      no_guarantee: noGuarantee,
      no_guarantee_surcharge_pct: noGuaranteeSurcharge,
      guarantee_months: guaranteeMonths,
      pet_guarantee_months: petGuaranteeMonths,
      guarantee_installments: guaranteeInstallments,
      requires_guarantor: requiresGuarantor,
      accepts_pets: acceptsPets,
    };
  }

  /**
   * Calcula agregaciones por edificio
   */
  calculateAggregations(buildings: Building[]): Map<string, {
    price_from: number | undefined;
    price_to: number | undefined;
    has_availability: boolean;
  }> {
    const aggregations = new Map();
    
    for (const building of buildings) {
      const publicableUnits = building.units.filter(u => 
        u.disponible && u.price > this.config.availability.min_rent_exclusive
      );
      
      aggregations.set(building.id, {
        price_from: publicableUnits.length > 0 ? Math.min(...publicableUnits.map(u => u.price)) : undefined,
        price_to: publicableUnits.length > 0 ? Math.max(...publicableUnits.map(u => u.price)) : undefined,
        has_availability: publicableUnits.length > 0
      });
    }
    
    return aggregations;
  }

  /**
   * Valida restricciones de mascotas según la configuración
   */
  validatePetRestrictions(petWeight?: number, petBreed?: string): {
    allowed: boolean;
    reason?: string;
    restrictions: {
      max_kg: number;
      restricted: string;
    };
  } {
    const restrictions = {
      max_kg: 20,
      restricted: "razas peligrosas"
    };
    
    // Check weight restriction
    if (petWeight && petWeight > restrictions.max_kg) {
      return {
        allowed: false,
        reason: 'Peso máximo 20kg',
        restrictions
      };
    }
    
    // Check breed restriction
    if (petBreed) {
      const dangerousBreeds = ['pitbull', 'rottweiler', 'doberman', 'bulldog'];
      if (dangerousBreeds.includes(petBreed.toLowerCase())) {
        return {
          allowed: false,
          reason: 'Raza restringida',
          restrictions
        };
      }
    }
    
    return {
      allowed: true,
      restrictions
    };
  }
}

/**
 * Factory function para crear el transformer con configuración por defecto
 */
export function createMappingV2Transformer(): MappingV2Transformer {
  const defaultConfig: MappingConfig = {
    meta: {
      version: "2.0.0",
      primary_key: "OP",
      currency: "CLP"
    },
    availability: {
      publishable_states: ["RE - Acondicionamiento", "Lista para arrendar"],
      min_rent_exclusive: 1
    },
    building: {},
    unit: {},
    pricing: {},
    promotion: {},
    aggregations: {}
  };
  
  return new MappingV2Transformer(defaultConfig);
}
