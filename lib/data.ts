import { BookingRequestSchema, BuildingSchema, PromotionType } from "@schemas/models";
import type { BookingRequest, Building, Unit } from "@schemas/models";
import { fromAssetPlan } from "@lib/adapters/assetplan";

type ListFilters = {
  comuna?: string;
  tipologia?: string;
  minPrice?: number;
  maxPrice?: number;
};

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
const simulateLatency = process.env.NODE_ENV !== "production";

function calculatePrecioDesde(units: Unit[]): number | null {
  const disponibles = units.filter((u) => u.disponible);
  if (disponibles.length === 0) return null;
  return Math.min(...disponibles.map((u) => u.price));
}

function validateBuilding(raw: unknown): Building {
  const parsed = BuildingSchema.parse(raw);
  return parsed;
}

// Nueva función para leer desde Supabase
async function readFromSupabase(): Promise<Building[] | null> {
  try {
    console.log('🔍 Intentando leer desde Supabase...');
    
    // Importar Supabase dinámicamente solo cuando se necesita
    const { supabase, supabaseAdmin } = await import("@lib/supabase");
    
    // Usar el cliente admin para evitar problemas de permisos
    const client = supabaseAdmin || supabase;
    
    if (!client) {
      console.error('No Supabase client available');
      return null;
    }
    
    // Obtener edificios con sus unidades usando la relación correcta
    const { data: buildingsData, error: buildingsError } = await client
      .from('buildings')
      .select(`
        id,
        slug,
        nombre,
        comuna,
        direccion,
        precio_desde,
        precio_hasta,
        has_availability,
        units (
          id,
          tipologia,
          area_m2,
          area_interior_m2,
          area_exterior_m2,
          precio,
          disponible,
          bedrooms,
          bathrooms,
          orientacion,
          pet_friendly,
          gastos_comunes,
          status
        )
      `)
      .eq('provider', 'assetplan') // Filtrar solo edificios de AssetPlan
      .order('nombre')
      .limit(100); // Aumentar el límite para obtener más edificios

    if (buildingsError) {
      // console.error('Error fetching buildings from Supabase:', buildingsError);
      return null;
    }

    if (!buildingsData || buildingsData.length === 0) {
      // console.log('No buildings found in Supabase');
      return null;
    }

    // console.log(`✅ Encontrados ${buildingsData.length} edificios en Supabase`);

    // Mantener edificios que al menos tengan unidades (aunque no estén disponibles)
    const buildingsWithUnits = buildingsData.filter((building) => {
      const units = building.units || [];
      return units.length > 0;
    });

    // console.log(`✅ ${buildingsWithUnits.length} edificios con unidades (pueden estar no disponibles)`);

    // Transformar los datos al formato esperado
    const buildings: Building[] = buildingsWithUnits.map((building: unknown) => {
      const b = building as any;
      return {
        id: b.id,
        slug: b.slug || `edificio-${b.id}`,
        name: b.nombre, // Mapear nombre -> name
        comuna: b.comuna,
        address: b.direccion || 'Dirección no disponible', // Mapear direccion -> address
        // Fallbacks amigables mientras se cargan datos reales en DB
        amenities: Array.isArray(b.amenities) && b.amenities.length > 0
          ? b.amenities
          : ['Piscina', 'Gimnasio'],
        gallery: Array.isArray(b.gallery) && b.gallery.length > 0
          ? b.gallery
          : [
              '/images/lascondes-cover.jpg',
              '/images/lascondes-1.jpg', 
              '/images/lascondes-2.jpg'
            ],
        coverImage: b.cover_image || b.coverImage || (Array.isArray(b.gallery) && b.gallery.length > 0 ? b.gallery[0] : '/images/lascondes-cover.jpg'),
        badges: [],
        serviceLevel: undefined,
        // Campos v2 del esquema real
        precio_desde: b.precio_desde,
        precio_hasta: b.precio_hasta,
        gc_mode: b.gc_mode,
        featured: b.featured,
        units: (b.units || []).map((unit: unknown) => {
          const u = unit as any;
          return {
            id: u.id,
            tipologia: u.tipologia || 'No especificada',
            m2: u.area_m2 || u.area_interior_m2 || 50,
            price: u.precio || u.price || 500000,
            estacionamiento: Boolean(u.parking_ids && u.parking_ids !== 'x'),
            bodega: Boolean(u.storage_ids && u.storage_ids !== 'x'),
            disponible: u.disponible || false,
            bedrooms: u.bedrooms || 1,
            bathrooms: u.bathrooms || 1,
            // Campos extendidos v2
            area_interior_m2: u.area_interior_m2,
            area_exterior_m2: u.area_exterior_m2,
            orientacion: u.orientacion,
            piso: u.piso,
            amoblado: u.amoblado,
            petFriendly: u.pet_friendly,
            parking_ids: u.parking_ids,
            storage_ids: u.storage_ids,
            parking_opcional: u.parking_opcional,
            storage_opcional: u.storage_opcional,
            guarantee_installments: u.guarantee_installments,
            guarantee_months: u.guarantee_months,
            rentas_necesarias: u.rentas_necesarias,
            renta_minima: u.renta_minima
          };
        })
      };
    });

    // console.log(`✅ Transformados ${buildings.length} edificios al formato esperado`);
    
    // Validar los edificios uno por uno para identificar cuáles fallan
    // console.log('🔍 Validando edificios...');
    const validatedBuildings: Building[] = [];
    
    for (let i = 0; i < buildings.length; i++) {
      try {
        const validated = validateBuilding(buildings[i]);
        validatedBuildings.push(validated);
      } catch (_error) {
        // console.error(`❌ Error validando edificio ${i + 1} (${buildings[i].name}):`, _error);
      }
    }
    
    // console.log(`✅ ${validatedBuildings.length} edificios validados exitosamente`);
    
    return validatedBuildings;
  } catch (_error) {
    // console.error('Error reading from Supabase:', _error);
    return null;
  }
}

export async function readAll(): Promise<Building[]> {
  console.log('🚀 Función readAll() iniciada');
  
  // Si la variable de entorno está habilitada, intentar leer desde Supabase
  const USE_SUPABASE = process.env.USE_SUPABASE === "true";
  
  console.log(`🔧 USE_SUPABASE: ${USE_SUPABASE}`);
  
  if (USE_SUPABASE) {
    console.log('🔄 Llamando a readFromSupabase()...');
    const fromSupabase = await readFromSupabase();
    if (fromSupabase && fromSupabase.length > 0) {
      console.log(`✅ Usando ${fromSupabase.length} edificios desde Supabase (datos reales)`);
      return fromSupabase;
    } else {
      // console.log('⚠️ No se pudieron obtener datos de Supabase, usando fallback');
    }
  }

  // Fallback: Intentar leer archivos AssetPlan solo si Supabase falla
  const fromAssetPlanFiles = await readAssetPlanSources();
  if (fromAssetPlanFiles && fromAssetPlanFiles.length > 0) {
    console.log(`✅ Usando ${fromAssetPlanFiles.length} edificios desde archivos AssetPlan (fallback)`);
    return fromAssetPlanFiles;
  }

  // Si no hay datos AssetPlan, check flag
  const USE_ASSETPLAN_SOURCE =
    typeof process !== "undefined" && typeof process.env !== "undefined"
      ? process.env.USE_ASSETPLAN_SOURCE === "true"
      : false;

  // No hay datos disponibles - esto no debería pasar en producción
  console.error('❌ No se pudieron obtener datos de ninguna fuente');
  return [];
}

export async function getAllBuildings(filters?: ListFilters, searchTerm?: string): Promise<(Building & { precioDesde: number | null })[]> {
  if (simulateLatency) {
    await delay(200 + Math.floor(Math.random() * 200));
  }
  const all = await readAll();

  let list = all.map((b) => ({ ...b, precioDesde: calculatePrecioDesde(b.units) }));

  if (filters) {
    const { comuna, tipologia, minPrice, maxPrice } = filters;
    if (comuna && comuna !== "Todas") {
      list = list.filter((b) => b.comuna.toLowerCase() === comuna.toLowerCase());
    }
    if (tipologia && tipologia !== "Todas") {
      list = list.filter((b) => b.units.some((u) => u.tipologia.toLowerCase() === tipologia.toLowerCase()));
    }
    if (typeof minPrice === "number") {
      list = list.filter((b) => (b.precioDesde ?? Infinity) >= minPrice);
    }
    if (typeof maxPrice === "number") {
      list = list.filter((b) => (b.precioDesde ?? 0) <= maxPrice);
    }
  }

  return list;
}

export async function getBuildingBySlug(slug: string): Promise<(Building & { precioDesde: number | null }) | null> {
  if (simulateLatency) {
    await delay(200 + Math.floor(Math.random() * 200));
  }
  
  // Mock específico para Home Amengual con departamento 207
  if (slug === "home-amengual") {
    return { ...HOME_AMENGUAL_WITH_UNIT_207, precioDesde: calculatePrecioDesde(HOME_AMENGUAL_WITH_UNIT_207.units) };
  }
  
  const all = await readAll();
  const found = all.find((b) => b.slug === slug);
  if (!found) return null;
  return { ...found, precioDesde: calculatePrecioDesde(found.units) };
}

export async function getRelatedBuildings(slug: string, n = 3): Promise<(Building & { precioDesde: number | null })[]> {
  if (simulateLatency) {
    await delay(200 + Math.floor(Math.random() * 200));
  }
  
  let current: Building | null = null;
  
  // Si es home-amengual, usar el mock específico
  if (slug === "home-amengual") {
    current = HOME_AMENGUAL_WITH_UNIT_207;
  } else {
    try {
      const all = await readAll();
      current = all.find((b) => b.slug === slug) || null;
    } catch (error) {
      console.log(`⚠️ Error obteniendo edificio ${slug}, usando mocks`);
      current = null;
    }
  }
  
  if (!current) {
    console.log(`❌ No se encontró el edificio actual: ${slug}, usando mocks`);
    // Usar mocks cuando no hay datos disponibles
    return generateMockRelatedBuildings(HOME_AMENGUAL_WITH_UNIT_207, n);
  }
  
  try {
    // Obtener todos los edificios para buscar relacionados
    const all = await readAll();
    
    // Calcular precio desde para todas las propiedades
    const withPrecio = all
      .filter((b) => b.slug !== slug)
      .map((b) => ({ ...b, precioDesde: calculatePrecioDesde(b.units) }));

    // Función para calcular similitud entre propiedades
    const calculateSimilarity = (building: Building & { precioDesde: number | null }): number => {
      let score = 0;
      
      // Misma comuna (peso alto)
      if (building.comuna === current.comuna) {
        score += 50;
      }
      
      // Rango de precio similar (peso medio)
      const currentPrice = calculatePrecioDesde(current.units);
      if (currentPrice !== null && building.precioDesde !== null) {
        const priceDiff = Math.abs(building.precioDesde - currentPrice);
        const priceSimilarity = Math.max(0, 100 - (priceDiff / currentPrice) * 100);
        score += priceSimilarity * 0.3;
      }
      
      // Mismo nivel de servicio (peso medio)
      if (building.serviceLevel === current.serviceLevel) {
        score += 20;
      }
      
      // Tipologías similares (peso bajo)
      const currentTypologies = current.typologySummary?.map((t: any) => t.key) || [];
      const buildingTypologies = building.typologySummary?.map((t: any) => t.key) || [];
      const commonTypologies = currentTypologies.filter((t: string) => buildingTypologies.includes(t));
      score += commonTypologies.length * 5;
      
      // Disponibilidad (peso bajo)
      const availableUnits = building.units.filter((u: Unit) => u.disponible);
      if (availableUnits.length > 0) {
        score += 10;
      }
      
      return score;
    };

    // Ordenar por similitud y tomar las mejores
    const sortedBySimilarity = withPrecio
      .map(building => ({
        ...building,
        similarityScore: calculateSimilarity(building)
      }))
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, n * 2) // Tomar más propiedades para tener más opciones
      .map(({ similarityScore, ...building }) => building);

    // Si no hay suficientes propiedades relacionadas, agregar mocks
    if (sortedBySimilarity.length < n) {
      const mockBuildings = generateMockRelatedBuildings(current, n - sortedBySimilarity.length);
      return [...sortedBySimilarity, ...mockBuildings];
    }

    return sortedBySimilarity.slice(0, n);
  } catch (error) {
    console.log(`⚠️ Error obteniendo propiedades relacionadas, usando mocks`);
    // Usar mocks cuando hay error
    return generateMockRelatedBuildings(current, n);
  }
}

// Función para generar mocks de propiedades relacionadas
function generateMockRelatedBuildings(current: Building, count: number): (Building & { precioDesde: number | null })[] {
  const mockBuildings: (Building & { precioDesde: number | null })[] = [];
  
  const mockData = [
    {
      id: "mock-1",
      slug: "edificio-mock-1",
      name: "Residencial Las Condes Premium",
      comuna: "Las Condes",
      address: "Av. Apoquindo 1234, Las Condes",
      coverImage: "/images/edificio/original_79516B40-7BA9-4F4E-4F7D-7BA4C0A2A938-mg0578.jpg",
      gallery: [
        "/images/edificio/original_79516B40-7BA9-4F4E-4F7D-7BA4C0A2A938-mg0578.jpg",
        "/images/edificio/original_05CC1BCB-6719-A6F3-4299-F6078DC02E05-mg0345.jpg"
      ],
      amenities: ["Piscina", "Gimnasio", "Seguridad 24/7", "Estacionamiento"],
      badges: [
        { type: PromotionType.FREE_COMMISSION, label: "Comisión gratis", tag: "Exclusivo" },
        { type: PromotionType.NO_AVAL, label: "Sin aval", tag: "Flexible" }
      ],
      units: [
        {
          id: "101",
          tipologia: "1D1B",
          m2: 45,
          price: 350000,
          disponible: true,
          petFriendly: true,
          estacionamiento: true,
          bodega: false,
          piso: 1,
          orientacion: "N" as const,
          parkingOptions: ["Estacionamiento incluido"],
          storageOptions: []
        }
      ],
      serviceLevel: "pro" as const,
      typologySummary: [{ key: "1D1B", label: "1 Dormitorio 1 Baño", count: 1, minPrice: 350000 }],
      precioDesde: 350000,
      precio_hasta: 350000,
      hasAvailability: true
    },
    {
      id: "mock-2",
      slug: "edificio-mock-2",
      name: "Torre Providencia Central",
      comuna: "Providencia",
      address: "Av. Providencia 5678, Providencia",
      coverImage: "/images/edificio/original_05CC1BCB-6719-A6F3-4299-F6078DC02E05-mg0345.jpg",
      gallery: [
        "/images/edificio/original_05CC1BCB-6719-A6F3-4299-F6078DC02E05-mg0345.jpg",
        "/images/edificio/original_79516B40-7BA9-4F4E-4F7D-7BA4C0A2A938-mg0578.jpg"
      ],
      amenities: ["Terraza", "Sala de eventos", "Bicicletero", "Lavandería"],
      badges: [
        { type: PromotionType.NO_GUARANTEE, label: "Precio fijo", tag: "Estable" },
        { type: PromotionType.FREE_COMMISSION, label: "50% OFF", tag: "Primer mes" }
      ],
      units: [
        {
          id: "205",
          tipologia: "2D1B",
          m2: 65,
          price: 480000,
          disponible: true,
          petFriendly: false,
          estacionamiento: true,
          bodega: true,
          piso: 2,
          orientacion: "E" as const,
          parkingOptions: ["Estacionamiento incluido"],
          storageOptions: ["Bodega incluida"]
        }
      ],
      serviceLevel: "standard" as const,
      typologySummary: [{ key: "2D1B", label: "2 Dormitorios 1 Baño", count: 1, minPrice: 480000 }],
      precioDesde: 480000,
      precio_hasta: 480000,
      hasAvailability: true
    },
    {
      id: "mock-3",
      slug: "edificio-mock-3",
      name: "Complejo Ñuñoa Residencial",
      comuna: "Ñuñoa",
      address: "Av. Grecia 9012, Ñuñoa",
      coverImage: "/images/edificio/original_311AE0D8-2A11-2E32-04F0-829F5F46775F-mg0348.jpg",
      gallery: [
        "/images/edificio/original_311AE0D8-2A11-2E32-04F0-829F5F46775F-mg0348.jpg",
        "/images/edificio/original_58D0B1B6-BDBF-2FEB-A92F-82493157ADA7-mg0731.jpg"
      ],
      amenities: ["Quincho", "Sala gourmet", "Conserjería", "Ascensor"],
      badges: [
        { type: PromotionType.NO_AVAL, label: "Opción sin aval", tag: "Sin aval" },
        { type: PromotionType.FREE_COMMISSION, label: "Comisión gratis", tag: "Exclusivo" }
      ],
      units: [
        {
          id: "301",
          tipologia: "3D2B",
          m2: 85,
          price: 650000,
          disponible: true,
          petFriendly: true,
          estacionamiento: true,
          bodega: true,
          piso: 3,
          orientacion: "S" as const,
          parkingOptions: ["Estacionamiento incluido", "Estacionamiento adicional"],
          storageOptions: ["Bodega incluida"]
        }
      ],
      serviceLevel: "pro" as const,
      typologySummary: [{ key: "3D2B", label: "3 Dormitorios 2 Baños", count: 1, minPrice: 650000 }],
      precioDesde: 650000,
      precio_hasta: 650000,
      hasAvailability: true
    }
  ];

  for (let i = 0; i < count && i < mockData.length; i++) {
    const mock = mockData[i];
    // Ajustar el precio para que sea similar al edificio actual
    const currentPrice = calculatePrecioDesde(current.units);
    const adjustedPrice = currentPrice ? currentPrice * (0.8 + Math.random() * 0.4) : mock.precioDesde;
    
    mockBuildings.push({
      ...mock,
      precioDesde: Math.round(adjustedPrice),
      precio_hasta: Math.round(adjustedPrice),
      units: mock.units.map(unit => ({
        ...unit,
        price: Math.round(adjustedPrice)
      }))
    });
  }

  return mockBuildings;
}

export async function createBooking(payload: BookingRequest): Promise<{ id: string }>{
  BookingRequestSchema.parse(payload);
  if (simulateLatency) {
    await delay(200 + Math.floor(Math.random() * 200));
  }
  const id = `bk_${Math.random().toString(36).slice(2, 10)}`;
  return { id };
}

export type { Building, Unit, BookingRequest };


// Server-only: discover and read data/sources/assetplan-*.json and map via adapter
async function readAssetPlanSources(): Promise<Building[] | null> {
  // Avoid attempting to use Node APIs in the browser bundle
  if (typeof window !== "undefined") return null;

  try {
    // Use eval to avoid bundlers trying to include Node built-ins in client chunks
    const pathMod = (await (0, eval)("import('node:path')")) as typeof import("node:path");
    const fs = (await (0, eval)("import('node:fs/promises')")) as typeof import("node:fs/promises");

    const sourcesDir = pathMod.join(process.cwd(), "data", "sources");
    let dirEntries: string[] = [];
    try {
      dirEntries = await fs.readdir(sourcesDir);
    } catch {
      return null; // directory may not exist
    }

    const targetFiles = dirEntries.filter((name) => /^assetplan-.*\.json$/i.test(name));
    if (targetFiles.length === 0) return null;

    const buildings: Building[] = [];
    for (const fileName of targetFiles) {
      const filePath = pathMod.join(sourcesDir, fileName);
      try {
        const content = await fs.readFile(filePath, "utf-8");
        const json = JSON.parse(content);
        if (Array.isArray(json)) {
          for (const raw of json) {
            try {
              const mapped = fromAssetPlan(raw as unknown as any);
              buildings.push(validateBuilding(mapped));
            } catch {
              // ignore malformed item
            }
          }
        } else if (json && typeof json === "object") {
          try {
            const mapped = fromAssetPlan(json as unknown as any);
            buildings.push(validateBuilding(mapped));
          } catch {
            // ignore malformed file
          }
        }
      } catch {
        // ignore file read/parse errors and continue
      }
    }

    return buildings.length > 0 ? buildings : null;
  } catch {
    return null;
  }
}

export async function getUnitWithBuilding(unitId: string): Promise<{ unit: Unit; building: Building } | null> {
  try {
    const buildings = await readAll();
    if (!buildings) return null;

    for (const building of buildings) {
      const unit = building.units?.find((u: Unit) => u.id === unitId);
      if (unit) {
        return { unit, building };
      }
    }
    return null;
  } catch (error) {
    console.error('Error getting unit with building:', error);
    throw error;
  }
}

/**
 * Obtiene edificios que tienen unidades con promociones reales
 * Esta función filtra edificios que realmente tienen promociones en Supabase
 */
export async function getBuildingsWithRealPromotions(): Promise<Building[]> {
  try {
    console.log('🔍 Buscando edificios con promociones reales...');
    
    // Importar Supabase dinámicamente
    const { supabase, supabaseAdmin } = await import("@lib/supabase");
    const client = supabaseAdmin || supabase;
    
    if (!client) {
      console.error('No Supabase client available');
      return [];
    }
    
    // Obtener edificios que tienen unidades con promociones no vacías
    const { data: buildingsWithPromotions, error } = await client
      .from('buildings')
      .select(`
        id,
        slug,
        nombre,
        comuna,
        direccion,
        precio_desde,
        precio_hasta,
        has_availability,
        units!inner(
          id,
          tipologia,
          area_m2,
          area_interior_m2,
          area_exterior_m2,
          precio,
          disponible,
          bedrooms,
          bathrooms,
          orientacion,
          pet_friendly,
          gastos_comunes,
          status,
          promotions
        )
      `)
      .eq('provider', 'assetplan')
      .not('units.promotions', 'is', null)
      .not('units.promotions', 'eq', '[]')
      .order('nombre')
      .limit(20);

    if (error) {
      console.error('Error fetching buildings with promotions:', error);
      return [];
    }

    if (!buildingsWithPromotions || buildingsWithPromotions.length === 0) {
      console.log('⚠️ No se encontraron edificios con promociones reales');
      return [];
    }

    console.log(`✅ Encontrados ${buildingsWithPromotions.length} edificios con promociones reales`);

    // Transformar los datos al formato esperado
    const buildings: Building[] = buildingsWithPromotions.map((building: unknown) => {
      const b = building as any;
      return {
        id: b.id,
        slug: b.slug || `edificio-${b.id}`,
        name: b.nombre,
        comuna: b.comuna,
        address: b.direccion || 'Dirección no disponible',
        amenities: Array.isArray(b.amenities) && b.amenities.length > 0
          ? b.amenities
          : ['Piscina', 'Gimnasio'],
        gallery: Array.isArray(b.gallery) && b.gallery.length > 0
          ? b.gallery
          : [
              '/images/lascondes-cover.jpg',
              '/images/lascondes-1.jpg', 
              '/images/lascondes-2.jpg'
            ],
        coverImage: b.cover_image || b.coverImage || (Array.isArray(b.gallery) && b.gallery.length > 0 ? b.gallery[0] : '/images/lascondes-cover.jpg'),
        badges: [], // Las promociones vienen de las unidades
        serviceLevel: undefined,
        precio_desde: b.precio_desde,
        precio_hasta: b.precio_hasta,
        gc_mode: b.gc_mode,
        featured: b.featured,
        units: (b.units || []).map((unit: unknown) => {
          const u = unit as any;
          return {
            id: u.id,
            tipologia: u.tipologia || 'No especificada',
            m2: u.area_m2 || u.area_interior_m2 || 50,
            price: u.precio || u.price || 500000,
            estacionamiento: Boolean(u.parking_ids && u.parking_ids !== 'x'),
            bodega: Boolean(u.storage_ids && u.storage_ids !== 'x'),
            disponible: u.disponible || false,
            bedrooms: u.bedrooms || 1,
            bathrooms: u.bathrooms || 1,
            area_interior_m2: u.area_interior_m2,
            area_exterior_m2: u.area_exterior_m2,
            orientacion: u.orientacion,
            piso: u.piso,
            amoblado: u.amoblado,
            petFriendly: u.pet_friendly,
            parking_ids: u.parking_ids,
            storage_ids: u.storage_ids,
            parking_opcional: u.parking_opcional,
            storage_opcional: u.storage_opcional,
            guarantee_installments: u.guarantee_installments,
            guarantee_months: u.guarantee_months,
            rentas_necesarias: u.rentas_necesarias,
            renta_minima: u.renta_minima,
            // Incluir promociones reales de la unidad
            promotions: u.promotions ? JSON.parse(u.promotions) : []
          };
        })
      };
    });

    // Validar los edificios
    const validatedBuildings: Building[] = [];
    for (let i = 0; i < buildings.length; i++) {
      try {
        const validated = validateBuilding(buildings[i]);
        validatedBuildings.push(validated);
      } catch (_error) {
        // console.error(`❌ Error validando edificio ${i + 1} (${buildings[i].name}):`, _error);
      }
    }

    console.log(`✅ ${validatedBuildings.length} edificios con promociones reales validados`);
    return validatedBuildings;
    
  } catch (error) {
    console.error('Error getting buildings with real promotions:', error);
    return [];
  }
}

// Mock específico para Home Amengual con departamento 207
const HOME_AMENGUAL_WITH_UNIT_207: Building = {
  id: "home-amengual",
  slug: "home-amengual",
  name: "Home Inclusive Ecuador",
  comuna: "Estación Central",
  address: "Gral. Amengual 0148, Estación Central",
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
  media: {
    images: [
      // Imágenes específicas del departamento 207
      "/Imagenes/Home Inclusive Amengual/Depto 207/original_A8E7145A-B129-782B-C614-965C55E0A8A3-ecuador04.jpg",
      "/Imagenes/Home Inclusive Amengual/Depto 207/original_A9F310EB-EFF4-9438-AD96-BAEA85DD19BA-ecuador06.jpg",
      "/Imagenes/Home Inclusive Amengual/Depto 207/original_A9F310EB-EFF4-9438-AD96-BAEA85DD19BA-ecuador06 (1).jpg",
      // Imágenes del edificio como respaldo
      "/images/edificio/original_79516B40-7BA9-4F4E-4F7D-7BA4C0A2A938-mg0578.jpg",
      "/images/edificio/original_05CC1BCB-6719-A6F3-4299-F6078DC02E05-mg0345.jpg"
    ]
  },
  amenities: [
    "Accesos controlados",
    "Citófono",
    "Gimnasio",
    "Bicicletero",
    "Lavandería",
    "Sala de internet",
    "Quincho",
    "Sala gourmet / eventos",
    "Seguridad",
    "Terraza panorámica",
    "Salón lounge",
    "Transporte cercano",
    "Conserjería",
    "Ascensor",
    "Cerca a comercios"
  ],
  badges: [
    {
      type: PromotionType.FREE_COMMISSION,
      label: "Comisión gratis",
      tag: "Exclusivo"
    },
    {
      type: PromotionType.NO_AVAL,
      label: "Garantía en cuotas",
      tag: "Flexible"
    },
    {
      type: PromotionType.NO_GUARANTEE,
      label: "Precio fijo 12 meses",
      tag: "Estable"
    },
    {
      type: PromotionType.FREE_COMMISSION,
      label: "50% OFF",
      tag: "Primer mes"
    },
    {
      type: PromotionType.NO_AVAL,
      label: "Opción sin aval",
      tag: "Sin aval"
    }
  ],
  units: [
    {
      id: "207",
      tipologia: "1D1B",
      m2: 45,
      price: 290000, // Precio original
      disponible: true,
      petFriendly: true,
      estacionamiento: true,
      bodega: false,
      piso: 2,
      orientacion: "S",
      parkingOptions: ["Estacionamiento incluido"],
      storageOptions: []
    },
    {
      id: "301",
      tipologia: "1D1B",
      m2: 48,
      price: 360000,
      disponible: true,
      petFriendly: false,
      estacionamiento: true,
      bodega: false,
      piso: 3,
      orientacion: "N",
      parkingOptions: ["Estacionamiento incluido"],
      storageOptions: []
    },
    {
      id: "302",
      tipologia: "1D1B",
      m2: 46,
      price: 350000,
      disponible: true,
      petFriendly: true,
      estacionamiento: true,
      bodega: false,
      piso: 3,
      orientacion: "O",
      parkingOptions: ["Estacionamiento incluido"],
      storageOptions: []
    },
    {
      id: "401",
      tipologia: "2D1B",
      m2: 65,
      price: 450000,
      disponible: true,
      petFriendly: true,
      estacionamiento: true,
      bodega: false,
      piso: 4,
      orientacion: "E",
      parkingOptions: ["Estacionamiento incluido"],
      storageOptions: []
    },
    {
      id: "402",
      tipologia: "2D1B",
      m2: 68,
      price: 470000,
      disponible: true,
      petFriendly: true,
      estacionamiento: true,
      bodega: true,
      piso: 4,
      orientacion: "N",
      parkingOptions: ["Estacionamiento incluido"],
      storageOptions: ["Bodega incluida"]
    },
    {
      id: "501",
      tipologia: "3D2B",
      m2: 85,
      price: 650000,
      disponible: true,
      petFriendly: true,
      estacionamiento: true,
      bodega: true,
      piso: 5,
      orientacion: "N",
      parkingOptions: ["Estacionamiento incluido", "Estacionamiento adicional"],
      storageOptions: ["Bodega incluida"]
    },
    {
      id: "502",
      tipologia: "3D2B",
      m2: 90,
      price: 680000,
      disponible: true,
      petFriendly: true,
      estacionamiento: true,
      bodega: true,
      piso: 5,
      orientacion: "E",
      parkingOptions: ["Estacionamiento incluido", "Estacionamiento adicional"],
      storageOptions: ["Bodega incluida"]
    }
  ],
  precio_desde: 290000,
  precio_hasta: 650000,
  hasAvailability: true
};
