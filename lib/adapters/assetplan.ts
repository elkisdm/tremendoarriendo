import { BuildingSchema, UnitSchema, type Building, type Unit, PromotionType, type PromotionBadge } from "@schemas/models";
import { AMENITY_LABEL_TO_KEY, BADGE_LABEL_TO_TAG, PromotionTag } from "./constants";

// Raw provider types for AssetPlan input. These are conservative and capture only
// the fields we actually consume in the adapter.
export type AssetPlanRawBadge = {
  label: string;
};

export type AssetPlanRawMedia = {
  images?: string[];
  tour360?: string;
  video?: string;
  lat?: number;
  lng?: number;
};

export type AssetPlanRawTransit = {
  name: string;
  distanceMin: number;
};

export type AssetPlanRawUnit = {
  id: string | number;
  codigoInterno?: string;
  tipologia?: string; // e.g., "1D/1B", "Studio"
  bedrooms?: number;
  bathrooms?: number;
  m2?: number; // total or interior, depends on source
  area_interior_m2?: number;
  area_exterior_m2?: number;
  orientacion?: string;
  piso?: number;
  amoblado?: boolean;
  petFriendly?: boolean;
  estacionamiento?: boolean;
  bodega?: boolean;
  parkingOptions?: string[];
  storageOptions?: string[];
  price?: number;
  disponible?: boolean;
  status?: string; // provider-specific status label
  promotions?: AssetPlanRawBadge[] | string[]; // can be strings or objects with label
};

export type AssetPlanRawBuilding = {
  id: string | number;
  slug?: string;
  nombre: string;
  comuna: string;
  direccion: string;
  coverImage?: string;
  amenities?: string[]; // free-form labels
  media?: AssetPlanRawMedia;
  serviceLevel?: "pro" | "standard" | string;
  badges?: AssetPlanRawBadge[] | string[];
  nearestTransit?: AssetPlanRawTransit;
  images?: string[]; // sometimes comes at root instead of media.images
  units: AssetPlanRawUnit[];
};

function normalizeString(value: string | undefined | null): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
}

function coerceId(value: string | number): string {
  return String(value).trim();
}

// Map provider status labels into internal enum
function mapStatus(providerStatus?: string): Unit["status"] {
  const v = normalizeString(providerStatus)?.toLowerCase();
  switch (v) {
    case "available":
    case "disponible":
    case "libre":
    case "en disponibilidad":
      return "available";
    case "reserved":
    case "reservado":
      return "reserved";
    case "rented":
    case "arrendado":
    case "ocupado":
      return "rented";
    default:
      return undefined;
  }
}

// Map provider badge labels to internal PromotionType
const PROMOTION_TAG_TO_TYPE: Record<PromotionTag, PromotionType> = {
  [PromotionTag.DISCOUNT_PERCENT]: PromotionType.DISCOUNT_PERCENT,
  [PromotionTag.FREE_COMMISSION]: PromotionType.FREE_COMMISSION,
  [PromotionTag.GUARANTEE_INSTALLMENTS]: PromotionType.GUARANTEE_INSTALLMENTS,
  [PromotionTag.FIXED_PRICE_TERM]: PromotionType.FIXED_PRICE_TERM,
  [PromotionTag.NO_AVAL]: PromotionType.NO_AVAL,
  [PromotionTag.NO_GUARANTEE]: PromotionType.NO_GUARANTEE,
  [PromotionTag.SERVICE_PRO]: PromotionType.SERVICE_PRO,
};

function toPromotionBadges(input?: (AssetPlanRawBadge | string)[]): PromotionBadge[] | undefined {
  if (!input || input.length === 0) return undefined;
  const badges: PromotionBadge[] = [];
  for (const b of input) {
    const label = typeof b === "string" ? b : b.label;
    const normLabel = normalizeString(label);
    if (!normLabel) continue;
    const tagKey = BADGE_LABEL_TO_TAG[normLabel as keyof typeof BADGE_LABEL_TO_TAG];
    if (!tagKey) continue;
    const type = PROMOTION_TAG_TO_TYPE[tagKey];
    badges.push({ label: normLabel, type });
  }
  return badges.length ? badges : undefined;
}

// Map a single AssetPlan unit into our internal Unit
export function mapUnit(raw: AssetPlanRawUnit): Unit {
  const id = coerceId(raw.id);
  const tipologia = normalizeString(raw.tipologia) ?? "";

  const areaInterior = raw.area_interior_m2 ?? raw.m2;
  const areaTotal = areaInterior && raw.area_exterior_m2 ? areaInterior + raw.area_exterior_m2 : (raw.m2 ?? areaInterior ?? 0);
  const m2 = Number(areaTotal ?? 0);

  const price = Number(raw.price ?? 0);
  const estacionamiento = Boolean(raw.estacionamiento ?? (raw.parkingOptions && raw.parkingOptions.length > 0));
  const bodega = Boolean(raw.bodega ?? (raw.storageOptions && raw.storageOptions.length > 0));
  const disponible = Boolean(
    typeof raw.disponible === "boolean" ? raw.disponible : mapStatus(raw.status) === "available"
  );

  const base: Unit = {
    id,
    tipologia,
    m2,
    price,
    estacionamiento,
    bodega,
    disponible,
  };

  const extended: Partial<Unit> = {
    codigoInterno: normalizeString(raw.codigoInterno),
    bedrooms: typeof raw.bedrooms === "number" ? raw.bedrooms : undefined,
    bathrooms: typeof raw.bathrooms === "number" ? raw.bathrooms : undefined,
    area_interior_m2: typeof raw.area_interior_m2 === "number" ? raw.area_interior_m2 : undefined,
    area_exterior_m2: typeof raw.area_exterior_m2 === "number" ? raw.area_exterior_m2 : undefined,
    orientacion: normalizeString(raw.orientacion),
    piso: typeof raw.piso === "number" ? raw.piso : undefined,
    amoblado: typeof raw.amoblado === "boolean" ? raw.amoblado : undefined,
    petFriendly: typeof raw.petFriendly === "boolean" ? raw.petFriendly : undefined,
    parkingOptions: Array.isArray(raw.parkingOptions) ? raw.parkingOptions.map((s) => s.trim()).filter(Boolean) : undefined,
    storageOptions: Array.isArray(raw.storageOptions) ? raw.storageOptions.map((s) => s.trim()).filter(Boolean) : undefined,
    status: mapStatus(raw.status),
    promotions: toPromotionBadges(raw.promotions as (AssetPlanRawBadge | string)[] | undefined),
  };

  // Validate and return; rely on schema for final shape correctness
  return UnitSchema.parse({ ...base, ...extended });
}

// Convert AssetPlan raw payload into internal Building model
export function fromAssetPlan(raw: AssetPlanRawBuilding): Building {
  const id = coerceId(raw.id);
  const name = normalizeString(raw.nombre) ?? "";
  const comuna = normalizeString(raw.comuna) ?? "";
  const address = normalizeString(raw.direccion) ?? "";
  const slug = normalizeString(raw.slug) ?? id;

  // Amenities normalization using canonical keys
  const amenities = Array.isArray(raw.amenities)
    ? raw.amenities
        .map((a) => normalizeString(a))
        .filter((a): a is string => Boolean(a))
        .map((a) => AMENITY_LABEL_TO_KEY[a as keyof typeof AMENITY_LABEL_TO_KEY])
        .filter(Boolean)
    : [];

  // Media/images handling and fallbacks
  const images = (raw.media?.images ?? raw.images ?? []).map((s) => s?.trim()).filter(Boolean) as string[];
  const gallery = images.slice();
  const coverImage = normalizeString(raw.coverImage) ?? gallery[0];

  // Badges (building level)
  const badges = toPromotionBadges(raw.badges);

  // Service level: prefer explicit, else infer from SERVICE_PRO badge
  const serviceLevel = ((): Building["serviceLevel"] => {
    const explicit = normalizeString(typeof raw.serviceLevel === "string" ? raw.serviceLevel : undefined)?.toLowerCase();
    if (explicit === "pro" || explicit === "standard") return explicit as "pro" | "standard";
    const hasServicePro = (badges ?? []).some((b) => b.type === PromotionType.SERVICE_PRO);
    return hasServicePro ? "pro" : undefined;
  })();

  const nearestTransit = raw.nearestTransit && typeof raw.nearestTransit.name === "string" && typeof raw.nearestTransit.distanceMin === "number"
    ? { name: raw.nearestTransit.name.trim(), distanceMin: raw.nearestTransit.distanceMin }
    : undefined;

  const units = Array.isArray(raw.units) ? raw.units.map(mapUnit) : [];

  // Build candidate object
  const candidate: Partial<Building> & Pick<Building, "id" | "slug" | "name" | "comuna" | "address" | "amenities" | "gallery" | "units"> = {
    id,
    slug,
    name,
    comuna,
    address,
    amenities,
    gallery,
    units,
  };

  if (coverImage) candidate.coverImage = coverImage;
  if (images.length) {
    candidate.media = {
      images,
      tour360: normalizeString(raw.media?.tour360),
      video: normalizeString(raw.media?.video),
      map: raw.media?.lat != null && raw.media?.lng != null ? { lat: raw.media.lat, lng: raw.media.lng } : undefined,
    };
  }
  if (badges) candidate.badges = badges;
  if (serviceLevel) candidate.serviceLevel = serviceLevel;
  if (nearestTransit) candidate.nearestTransit = nearestTransit;

  // Validate final shape
  return BuildingSchema.parse(candidate);
}


