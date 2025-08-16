import { BookingRequestSchema, BuildingSchema } from "@schemas/models";
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
  const all = await readAll();
  const found = all.find((b) => b.slug === slug);
  if (!found) return null;
  return { ...found, precioDesde: calculatePrecioDesde(found.units) };
}

export async function getRelatedBuildings(slug: string, n = 3): Promise<(Building & { precioDesde: number | null })[]> {
  if (simulateLatency) {
    await delay(200 + Math.floor(Math.random() * 200));
  }
  const all = await readAll();
  const current = all.find((b) => b.slug === slug);
  if (!current) return [];
  const withPrecio = all
    .filter((b) => b.slug !== slug)
    .map((b) => ({ ...b, precioDesde: calculatePrecioDesde(b.units) }));

  const sameComuna = withPrecio.filter((b) => b.comuna === current.comuna);
  const others = withPrecio.filter((b) => b.comuna !== current.comuna);
  return [...sameComuna, ...others].slice(0, n);
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
