/**
 * Mock data para la landing "Arrienda Sin Comisión"
 * 
 * Este archivo contiene datos temporales que serán migrados a Supabase:
 * - Badges de promoción
 * - Amenidades
 * - Galerías de imágenes
 * 
 * TODO: Migrar estos datos a Supabase cuando estén disponibles las tablas correspondientes
 */

import { PromotionType } from "@schemas/models";

export const MOCK_PROMOTIONS = [
  { 
    label: "0% Comisión", 
    tag: "Exclusivo por tiempo limitado", 
    type: PromotionType.FREE_COMMISSION
  },
  { 
    label: "0% Comisión", 
    tag: "Congela precio 12 meses", 
    type: PromotionType.FREE_COMMISSION
  },
  { 
    label: "0% Comisión", 
    tag: "Hasta 50% dcto 1er mes", 
    type: PromotionType.FREE_COMMISSION
  },
  { 
    label: "0% Comisión", 
    tag: "Sin gastos de gestión", 
    type: PromotionType.FREE_COMMISSION
  },
];

export const MOCK_AMENITIES_SETS = [
  ["Gimnasio", "Piscina", "Cowork", "Quinchos", "Pet friendly"],
  ["Sala Multiuso", "Lavandería", "Conserjería 24/7", "Bicicletero"],
  ["Rooftop", "Piscina temperada", "Sauna", "Salón Gourmet"],
  ["Terraza", "Sala de eventos", "Quincho", "Bodega"],
  ["Spa", "Gimnasio 24/7", "Cowork", "Lavandería"],
  ["Piscina", "Quincho", "Sala de juegos", "Conserjería"],
  ["Gym", "Co-working", "Lavandería", "Bicicletero", "Pet Care"],
];

export const MOCK_GALLERY_SETS = [
  ["/images/nunoa-1.jpg", "/images/nunoa-2.jpg", "/images/nunoa-3.jpg"],
  ["/images/lascondes-1.jpg", "/images/lascondes-2.jpg", "/images/lascondes-3.jpg", "/images/lascondes-4.jpg"],
  ["/images/mirador-1.jpg", "/images/mirador-2.jpg", "/images/mirador-3.jpg", "/images/mirador-4.jpg"],
];

export const MOCK_COVER_IMAGES = [
  "/images/nunoa-cover.jpg",
  "/images/lascondes-cover.jpg", 
  "/images/mirador-cover.jpg",
];

/**
 * Función para asignar datos mock a un edificio basado en su índice
 * Esto asegura consistencia en los datos asignados
 */
export function assignMockDataToBuilding(building: any, index: number) {
  const hasPromotion = index % 3 === 0; // Cada 3 edificios tiene promoción
  
  // Usar datos reales de Supabase cuando estén disponibles, sino usar mocks
  const realAmenities = building.amenities && building.amenities.length > 0;
  const realGallery = building.gallery && building.gallery.length > 0;
  const realCover = building.coverImage;
  
  // Verificar disponibilidad real
  const buildingUnits = building.units || [];
  const availableUnits = buildingUnits.filter((unit: any) => unit.disponible);
  const hasAvailability = availableUnits.length > 0;
  
  return {
    hasPromotion,
    promotion: hasPromotion ? MOCK_PROMOTIONS[index % MOCK_PROMOTIONS.length] : null,
    amenities: realAmenities 
      ? building.amenities.slice(0, 6) 
      : MOCK_AMENITIES_SETS[index % MOCK_AMENITIES_SETS.length],
    gallery: realGallery 
      ? building.gallery 
      : MOCK_GALLERY_SETS[index % MOCK_GALLERY_SETS.length],
    coverImage: realCover 
      ? building.coverImage 
      : MOCK_COVER_IMAGES[index % MOCK_COVER_IMAGES.length],
    hasAvailability,
    // Datos reales de precio y disponibilidad
    precioDesde: hasAvailability 
      ? Math.min(...availableUnits.map((unit: any) => unit.price || unit.precio || 0))
      : building.precio_desde || building.precioDesde || 0,
  };
}

/**
 * Configuración para facilitar la migración futura
 */
export const MIGRATION_CONFIG = {
  // Cuando estos campos estén disponibles en Supabase, actualizar estas banderas
  USE_REAL_PROMOTIONS: false,
  USE_REAL_AMENITIES: false, 
  USE_REAL_GALLERY: false,
  USE_REAL_COVERS: false,
  
  // Campos de Supabase que mapearán a los datos mock
  SUPABASE_MAPPING: {
    promotions: 'building_promotions', // tabla futura
    amenities: 'building_amenities',   // tabla futura  
    gallery: 'building_images',        // tabla futura
    cover: 'cover_image_url',          // campo futuro
  }
};
