// Constants and type definitions for adapter mappings

// Promotion tags that can be associated to badge labels coming from providers
export enum PromotionTag {
  DISCOUNT_PERCENT = "DISCOUNT_PERCENT",
  FREE_COMMISSION = "FREE_COMMISSION",
  GUARANTEE_INSTALLMENTS = "GUARANTEE_INSTALLMENTS",
  FIXED_PRICE_TERM = "FIXED_PRICE_TERM",
  NO_AVAL = "NO_AVAL",
  NO_GUARANTEE = "NO_GUARANTEE",
  SERVICE_PRO = "SERVICE_PRO",
}

// Map external badge labels to internal promotion tags
export const BADGE_LABEL_TO_TAG: Readonly<Record<string, PromotionTag>> = {
  "50% OFF": PromotionTag.DISCOUNT_PERCENT,
  "Comisión corretaje gratis": PromotionTag.FREE_COMMISSION,
  "Garantía en cuotas": PromotionTag.GUARANTEE_INSTALLMENTS,
  "Precio fijo 12 meses": PromotionTag.FIXED_PRICE_TERM,
  "Sin aval": PromotionTag.NO_AVAL,
  "Opción sin garantía": PromotionTag.NO_GUARANTEE,
  "Servicio Pro": PromotionTag.SERVICE_PRO,
} as const;

// Canonical internal amenity keys used by the app
export type InternalAmenityKey =
  | "piscina"
  | "gimnasio"
  | "quinchos"
  | "cowork"
  | "estacionamiento"
  | "conserjeria"
  | "seguridad"
  | "areas_verdes"
  | "juegos_infantiles"
  | "sala_eventos"
  | "sala_multiuso"
  | "lavanderia"
  | "bicicleteros";

// Map incoming amenity labels from providers to internal amenity keys
export const AMENITY_LABEL_TO_KEY: Readonly<Record<string, InternalAmenityKey>> = {
  // Common variants observed across sources
  "Piscina": "piscina",
  "Gimnasio": "gimnasio",
  "Quinchos": "quinchos",
  "Quincho": "quinchos",
  "Cowork": "cowork",
  "Estacionamiento": "estacionamiento",
  "Estacionamientos": "estacionamiento",
  "Conserjería": "conserjeria",
  "Conserjería 24/7": "conserjeria",
  "Seguridad": "seguridad",
  "Áreas verdes": "areas_verdes",
  "Areas verdes": "areas_verdes",
  "Juegos infantiles": "juegos_infantiles",
  "Sala de eventos": "sala_eventos",
  "Sala multiuso": "sala_multiuso",
  "Lavandería": "lavanderia",
  "Bicicleteros": "bicicleteros",
} as const;


