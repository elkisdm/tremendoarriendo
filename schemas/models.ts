import { z } from "zod";

// Promotions
export enum PromotionType {
  DISCOUNT_PERCENT = "discount_percent",
  FREE_COMMISSION = "free_commission",
  GUARANTEE_INSTALLMENTS = "guarantee_installments",
  FIXED_PRICE_TERM = "fixed_price_term",
  NO_AVAL = "no_aval",
  NO_GUARANTEE = "no_guarantee",
  SERVICE_PRO = "service_pro",
}

export const PromotionBadgeSchema = z.object({
  label: z.string().min(1),
  type: z.nativeEnum(PromotionType),
  tag: z.string().min(1).optional(),
});

// Media and Location
const LatLngSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

export const MediaSchema = z.object({
  images: z.array(z.string().min(1)).min(1),
  tour360: z.string().min(1).optional(),
  video: z.string().min(1).optional(),
  map: LatLngSchema.optional(),
});

// Transit
export const TransitSchema = z.object({
  name: z.string().min(1),
  distanceMin: z.number().int().nonnegative(),
});

// Typology summary
export const TypologySummarySchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  count: z.number().int().nonnegative(),
  minPrice: z.number().int().positive().optional(),
  minM2: z.number().positive().optional(),
});

export const UnitSchema = z.object({
  id: z.string().min(1),
  tipologia: z.string().min(1),
  m2: z.number().positive(),
  price: z.number().int().positive(),
  estacionamiento: z.boolean(),
  bodega: z.boolean(),
  disponible: z.boolean(),
  // Extended fields (all optional for backward compatibility)
  codigoInterno: z.string().min(1).optional(),
  bedrooms: z.number().int().positive().optional(),
  bathrooms: z.number().int().positive().optional(),
  area_interior_m2: z.number().positive().optional(),
  area_exterior_m2: z.number().nonnegative().optional(),
  orientacion: z.string().min(1).optional(),
  piso: z.number().int().nonnegative().optional(),
  amoblado: z.boolean().optional(),
  petFriendly: z.boolean().optional(),
  parkingOptions: z.array(z.string().min(1)).optional(),
  storageOptions: z.array(z.string().min(1)).optional(),
  status: z.enum(["available", "reserved", "rented"]).optional(),
  promotions: z.array(PromotionBadgeSchema).optional(),
});

export const BuildingSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1),
  comuna: z.string().min(1),
  address: z.string().min(1),
  amenities: z.array(z.string().min(1)).min(1),
  gallery: z.array(z.string().min(1)).min(3),
  units: z.array(UnitSchema).min(1),
  // Extended fields (all optional for backward compatibility)
  coverImage: z.string().min(1).optional(),
  badges: z.array(PromotionBadgeSchema).optional(),
  serviceLevel: z.enum(["pro", "standard"]).optional(),
  media: MediaSchema.optional(),
  nearestTransit: TransitSchema.optional(),
  hasAvailability: z.boolean().optional(),
  precioRango: z
    .object({ min: z.number().int().nonnegative(), max: z.number().int().nonnegative() })
    .refine((v) => v.max >= v.min, { message: "max must be >= min" })
    .optional(),
  typologySummary: z.array(TypologySummarySchema).optional(),
});

export const BookingRequestSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(5),
  buildingId: z.string().min(1),
  unitId: z.string().min(1),
  message: z.string().optional(),
  preferredDate: z.string().datetime().optional(),
});

export const WaitlistRequestSchema = z.object({
  email: z.string().email(),
  phone: z.string().max(32).optional(),
});

export type Unit = z.infer<typeof UnitSchema>;
export type Building = z.infer<typeof BuildingSchema>;
export type BookingRequest = z.infer<typeof BookingRequestSchema>;
export type WaitlistRequest = z.infer<typeof WaitlistRequestSchema>;
export type PromotionBadge = z.infer<typeof PromotionBadgeSchema>;
export type TypologySummary = z.infer<typeof TypologySummarySchema>;
export type Media = z.infer<typeof MediaSchema>;


