/**
 * Mock data para la landing "Arrienda Sin Comisión"
 * 
 * Este archivo contiene datos temporales optimizados para demostrar las funcionalidades
 * de la landing con el edificio Home Amengual como caso principal.
 */

import { PromotionType } from "@schemas/models";

// Mock específico para Home Amengual
export const HOME_AMENGUAL_MOCK = {
  id: "home-amengual",
  slug: "home-amengual",
  name: "Home Amengual",
  comuna: "Estación Central",
  address: "Gral Amengual 102, Estación Central",
  coverImage: "/images/edificio/estacioncentral-cover.jpg",
  gallery: [
    "/images/edificio/estacioncentral-cover.jpg",
    "/images/edificio/nunoa-1.jpg",
    "/images/edificio/lascondes-1.jpg",
    "/images/edificio/mirador-1.jpg"
  ],
  precioDesde: 450000,
  precioHasta: 650000,
  precioPromedio: 550000,
  hasAvailability: true,
  totalUnidades: 12,
  unidadesDisponibles: 8,
  badges: [
    {
      type: "promotion",
      label: "Sin comisión",
      tag: "0% Comisión",
      description: "Sin comisión de arrendamiento"
    },
    {
      type: "promotion", 
      label: "Garantía en cuotas",
      tag: "Flexible",
      description: "Paga tu garantía en cuotas"
    },
    {
      type: "special",
      label: "Pet Friendly",
      tag: "Mascotas",
      description: "Acepta mascotas"
    },
    {
      type: "promotion",
      label: "Opción sin garantía",
      tag: "Sin aval",
      description: "Arriendo sin garantía"
    },
    {
      type: "promotion",
      label: "Comisión gratis",
      tag: "Exclusivo",
      description: "Sin gastos de gestión"
    }
  ],
  amenities: [
    "Pet Friendly",
    "Estacionamiento",
    "Bodega", 
    "Seguridad 24/7",
    "Áreas Comunes",
    "Gimnasio",
    "Lavandería",
    "WiFi"
  ],
  typologySummary: [
    {
      key: "Estudio",
      label: "Estudio",
      count: 2,
      minPrice: 450000
    },
    {
      key: "1D1B",
      label: "1 Dorm, 1 Baño",
      count: 3,
      minPrice: 520000
    },
    {
      key: "2D1B", 
      label: "2 Dorm, 1 Baño",
      count: 2,
      minPrice: 580000
    },
    {
      key: "2D2B",
      label: "2 Dorm, 2 Baños", 
      count: 1,
      minPrice: 650000
    }
  ]
};

// Solo usar Home Amengual para la landing
export const LANDING_BUILDINGS_MOCK = [HOME_AMENGUAL_MOCK];

// Mock extendido para la página de detalle
export const HOME_AMENGUAL_EXTENDED = {
  ...HOME_AMENGUAL_MOCK,
  amenities: [
    "Pet Friendly",
    "Estacionamiento",
    "Bodega", 
    "Seguridad 24/7",
    "Áreas Comunes",
    "Gimnasio",
    "Lavandería",
    "WiFi",
    "Sala Multiuso",
    "Quincho",
    "Terraza",
    "Conserjería"
  ],
  description: "Home Amengual es un edificio moderno ubicado en el corazón de Estación Central, a pasos del metro y con excelente conectividad. Ofrece departamentos desde estudio hasta 2 dormitorios, con amenidades premium y la mejor ubicación.",
  linkListing: "https://www.assetplan.cl/arriendo/departamento/estacion-central/2-dormitorios/amengual/745?codigo_referido=elkis",
  tipologias: ["Estudio", "1D1B", "2D1B", "2D2B"],
  unidades: [
    {
      op: "225413",
      unidad: "207",
      tipologia: "Estudio",
      precio: 450000,
      m2: 28,
      orientacion: "Norte",
      estacionamiento: 0,
      bodega: 0,
      gc: 45000,
      aceptaMascotas: true,
      estado: "Disponible",
      especial: false,
      tremendaPromo: false,
      descuento: 0,
      mesesDescuento: 0,
      linkListing: "https://www.assetplan.cl/arriendo/departamento/estacion-central/estudio/amengual/745?selectedUnit=225413&codigo_referido=elkis"
    },
    {
      op: "225500",
      unidad: "305",
      tipologia: "1D1B",
      precio: 520000,
      m2: 35,
      orientacion: "Norte",
      estacionamiento: 1,
      bodega: 1,
      gc: 52000,
      aceptaMascotas: true,
      estado: "Disponible",
      especial: false,
      tremendaPromo: false,
      descuento: 0,
      mesesDescuento: 0,
      linkListing: "https://www.assetplan.cl/arriendo/departamento/estacion-central/1-dormitorio/amengual/745?codigo_referido=elkis"
    },
    {
      op: "225564",
      unidad: "405",
      tipologia: "2D1B",
      precio: 580000,
      m2: 42,
      orientacion: "Norte",
      estacionamiento: 1,
      bodega: 1,
      gc: 58000,
      aceptaMascotas: true,
      estado: "Disponible",
      especial: false,
      tremendaPromo: false,
      descuento: 0,
      mesesDescuento: 0,
      linkListing: "https://www.assetplan.cl/arriendo/departamento/estacion-central/2-dormitorios/amengual/745?selectedUnit=225564&codigo_referido=elkis"
    },
    {
      op: "225600",
      unidad: "505",
      tipologia: "2D2B",
      precio: 650000,
      m2: 48,
      orientacion: "Norte",
      estacionamiento: 1,
      bodega: 1,
      gc: 65000,
      aceptaMascotas: true,
      estado: "Disponible",
      especial: false,
      tremendaPromo: false,
      descuento: 0,
      mesesDescuento: 0,
      linkListing: "https://www.assetplan.cl/arriendo/departamento/estacion-central/2-dormitorios/amengual/745?codigo_referido=elkis"
    }
  ]
};

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
