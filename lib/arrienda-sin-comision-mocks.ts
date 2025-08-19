/**
 * Mock data para la landing "Arrienda Sin Comisión"
 * 
 * Este archivo contiene datos temporales optimizados para demostrar las funcionalidades
 * de la landing con el edificio Home Amengual como caso principal.
 */

import { type BuildingSummary } from '../hooks/useFetchBuildings';
import { PromotionType } from '../schemas/models';

// Definir el tipo para la página de detalle
interface BuildingForArriendaSinComision extends BuildingSummary {
  amenities: string[];
  description: string;
  linkListing: string;
  tipologias: string[];
  unidades: Array<{
    id: string;
    typology: string;
    floor: string;
    number: string;
    price: number;
    area: number;
    bedrooms: number;
    bathrooms: number;
    available: boolean;
  }>;
}

// Mock específico para Home Amengual
export const HOME_AMENGUAL_MOCK: BuildingSummary = {
  id: "home-amengual",
  slug: "home-amengual",
  name: "Home Amengual",
  comuna: "Estación Central",
  address: "Av. Libertador Bernardo O'Higgins 1234, Estación Central",
  coverImage: "/images/edificio/original_79516B40-7BA9-4F4E-4F7D-7BA4C0A2A938-mg0578.jpg",
  gallery: [
    "/images/edificio/original_79516B40-7BA9-4F4E-4F7D-7BA4C0A2A938-mg0578.jpg",
    "/images/edificio/original_05CC1BCB-6719-A6F3-4299-F6078DC02E05-mg0345.jpg",
    "/images/edificio/original_311AE0D8-2A11-2E32-04F0-829F5F46775F-mg0348.jpg",
    "/images/edificio/original_58D0B1B6-BDBF-2FEB-A92F-82493157ADA7-mg0731.jpg",
    "/images/edificio/original_87F94E6E-7B88-8EDF-4AE9-481F4458226B-mg0608.jpg",
    "/images/edificio/original_9E2C7938-6514-1B1E-EB7D-90B7D9CC4386-mg0300.jpg",
    "/images/edificio/original_E83F6CA9-97BD-EE6D-9AF3-29C004963C07-mg0309.jpg",
    "/images/edificio/original_D02A4F27-BD68-D47B-14B1-185BE67CE479-mg0626.jpg",
    "/images/edificio/original_07050B6E-BC69-04EB-9619-584F161455C6-mg0659pano.jpg",
    "/images/edificio/original_62CDE25C-4152-E1A0-3ABC-BCAF57A614EB-mg0397pano.jpg"
  ],
  precioDesde: 450000,
  hasAvailability: true,
  badges: [
    {
      type: PromotionType.FREE_COMMISSION,
      label: "Sin comisión",
      tag: "0% Comisión"
    },
    {
      type: PromotionType.NO_AVAL,
      label: "Opción sin aval",
      tag: "Sin aval"
    },
    {
      type: PromotionType.NO_GUARANTEE,
      label: "Opción sin garantía",
      tag: "Sin garantía"
    },
    {
      type: PromotionType.FREE_COMMISSION,
      label: "Comisión gratis",
      tag: "Exclusivo"
    }
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
      count: 2,
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
      count: 2,
      minPrice: 620000
    }
  ]
};

// Solo usar Home Amengual para la landing
// Mock adicionales para mostrar el grid de 4 columnas
export const ADDITIONAL_BUILDINGS_MOCK: BuildingSummary[] = [
  {
    id: "home-amengual-2",
    slug: "home-amengual-2",
    name: "Home Amengual II",
    comuna: "Estación Central",
    address: "Av. Libertador Bernardo O'Higgins 1500, Estación Central",
    coverImage: "/images/edificio/original_05CC1BCB-6719-A6F3-4299-F6078DC02E05-mg0345.jpg",
    gallery: [
      "/images/edificio/original_05CC1BCB-6719-A6F3-4299-F6078DC02E05-mg0345.jpg",
      "/images/edificio/original_311AE0D8-2A11-2E32-04F0-829F5F46775F-mg0348.jpg",
      "/images/edificio/original_58D0B1B6-BDBF-2FEB-A92F-82493157ADA7-mg0731.jpg"
    ],
    precioDesde: 480000,
    hasAvailability: true,
    badges: [
      {
        type: PromotionType.FREE_COMMISSION,
        label: "Sin comisión",
        tag: "0% Comisión"
      },
      {
        type: PromotionType.NO_AVAL,
        label: "Opción sin aval",
        tag: "Sin aval"
      }
    ],
    typologySummary: [
      {
        key: "1D1B",
        label: "1 Dorm, 1 Baño",
        count: 3,
        minPrice: 480000
      },
      {
        key: "2D1B",
        label: "2 Dorm, 1 Baño",
        count: 2,
        minPrice: 550000
      }
    ]
  },
  {
    id: "home-amengual-3",
    slug: "home-amengual-3",
    name: "Home Amengual III",
    comuna: "Estación Central",
    address: "Av. Libertador Bernardo O'Higgins 1800, Estación Central",
    coverImage: "/images/edificio/original_311AE0D8-2A11-2E32-04F0-829F5F46775F-mg0348.jpg",
    gallery: [
      "/images/edificio/original_311AE0D8-2A11-2E32-04F0-829F5F46775F-mg0348.jpg",
      "/images/edificio/original_58D0B1B6-BDBF-2FEB-A92F-82493157ADA7-mg0731.jpg",
      "/images/edificio/original_87F94E6E-7B88-8EDF-4AE9-481F4458226B-mg0608.jpg"
    ],
    precioDesde: 520000,
    hasAvailability: true,
    badges: [
      {
        type: PromotionType.FREE_COMMISSION,
        label: "Sin comisión",
        tag: "0% Comisión"
      },
      {
        type: PromotionType.NO_GUARANTEE,
        label: "Opción sin garantía",
        tag: "Sin garantía"
      }
    ],
    typologySummary: [
      {
        key: "2D1B",
        label: "2 Dorm, 1 Baño",
        count: 4,
        minPrice: 520000
      },
      {
        key: "2D2B",
        label: "2 Dorm, 2 Baños",
        count: 2,
        minPrice: 580000
      }
    ]
  },
  {
    id: "home-amengual-4",
    slug: "home-amengual-4",
    name: "Home Amengual IV",
    comuna: "Estación Central",
    address: "Av. Libertador Bernardo O'Higgins 2100, Estación Central",
    coverImage: "/images/edificio/original_58D0B1B6-BDBF-2FEB-A92F-82493157ADA7-mg0731.jpg",
    gallery: [
      "/images/edificio/original_58D0B1B6-BDBF-2FEB-A92F-82493157ADA7-mg0731.jpg",
      "/images/edificio/original_87F94E6E-7B88-8EDF-4AE9-481F4458226B-mg0608.jpg",
      "/images/edificio/original_9E2C7938-6514-1B1E-EB7D-90B7D9CC4386-mg0300.jpg"
    ],
    precioDesde: 550000,
    hasAvailability: true,
    badges: [
      {
        type: PromotionType.FREE_COMMISSION,
        label: "Sin comisión",
        tag: "0% Comisión"
      },
      {
        type: PromotionType.FREE_COMMISSION,
        label: "Comisión gratis",
        tag: "Exclusivo"
      }
    ],
    typologySummary: [
      {
        key: "Estudio",
        label: "Estudio",
        count: 2,
        minPrice: 550000
      },
      {
        key: "1D1B",
        label: "1 Dorm, 1 Baño",
        count: 3,
        minPrice: 580000
      },
      {
        key: "2D2B",
        label: "2 Dorm, 2 Baños",
        count: 1,
        minPrice: 650000
      }
    ]
  }
];

export const LANDING_BUILDINGS_MOCK = [HOME_AMENGUAL_MOCK, ...ADDITIONAL_BUILDINGS_MOCK];

// Mock extendido para la página de detalle
export const HOME_AMENGUAL_EXTENDED: BuildingForArriendaSinComision = {
  ...HOME_AMENGUAL_MOCK,
  amenities: [
    "Piscina",
    "Gimnasio",
    "Sala de eventos",
    "Terraza",
    "Estacionamiento",
    "Seguridad 24/7",
    "Ascensor",
    "Jardín"
  ],
  description: "Home Amengual es un edificio premium ubicado en el corazón de Estación Central, diseñado para ofrecer el máximo confort y modernidad. Con 4 tipologías disponibles y las mejores amenidades, es la opción ideal para quienes buscan calidad de vida sin comprometer la ubicación estratégica.",
  linkListing: "https://maps.app.goo.gl/nLMtyQSTvepMAb1FA?g_st=ipc",
  tipologias: ["Estudio", "1D1B", "2D1B", "2D2B"],
  unidades: [
    {
      id: "1",
      typology: "Estudio",
      floor: "1",
      number: "101",
      price: 450000,
      area: 35,
      bedrooms: 0,
      bathrooms: 1,
      available: true
    },
    {
      id: "2",
      typology: "Estudio",
      floor: "1",
      number: "102",
      price: 480000,
      area: 38,
      bedrooms: 0,
      bathrooms: 1,
      available: true
    },
    {
      id: "3",
      typology: "1D1B",
      floor: "2",
      number: "201",
      price: 520000,
      area: 45,
      bedrooms: 1,
      bathrooms: 1,
      available: true
    },
    {
      id: "4",
      typology: "1D1B",
      floor: "2",
      number: "202",
      price: 550000,
      area: 48,
      bedrooms: 1,
      bathrooms: 1,
      available: true
    },
    {
      id: "5",
      typology: "2D1B",
      floor: "3",
      number: "301",
      price: 580000,
      area: 55,
      bedrooms: 2,
      bathrooms: 1,
      available: true
    },
    {
      id: "6",
      typology: "2D1B",
      floor: "3",
      number: "302",
      price: 610000,
      area: 58,
      bedrooms: 2,
      bathrooms: 1,
      available: true
    },
    {
      id: "7",
      typology: "2D2B",
      floor: "4",
      number: "401",
      price: 620000,
      area: 65,
      bedrooms: 2,
      bathrooms: 2,
      available: true
    },
    {
      id: "8",
      typology: "2D2B",
      floor: "4",
      number: "402",
      price: 650000,
      area: 68,
      bedrooms: 2,
      bathrooms: 2,
      available: true
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
