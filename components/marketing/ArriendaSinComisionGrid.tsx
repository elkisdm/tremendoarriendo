import Link from "next/link";
import type { BuildingSummary } from "@/hooks/useFetchBuildings";
import LazyBuildingsGrid from "./LazyBuildingsGrid";
import { getSupabaseProcessor } from "@/lib/supabase-data-processor";

type ArriendaSinComisionGridProps = Record<string, never>;

async function fetchInitialBuildings(): Promise<{
  buildings: BuildingSummary[];
  total: number;
  hasMore: boolean;
}> {
  try {
    console.log('🔍 Cargando edificios iniciales para Arriendo Sin Comisión...');
    
    // Intentar usar el nuevo API endpoint específico
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/arrienda-sin-comision?limit=12&page=1`, {
      next: { revalidate: 3600 } // Cache por 1 hora
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ API Arriendo Sin Comisión: ${data.buildings.length} edificios cargados`);
      
      return {
        buildings: data.buildings,
        total: data.pagination.total,
        hasMore: data.pagination.hasMore
      };
    }
    
    // Fallback: usar el procesador directo
    console.log('⚠️ Fallback: usando procesador directo...');
    const processor = await getSupabaseProcessor();
    const result = await processor.getLandingBuildings(12, 0);
    
    console.log(`🏢 Edificios iniciales cargados: ${result.buildings.length} de ${result.total}`);
    
    // Convertir LandingBuilding a BuildingSummary
    const buildings: BuildingSummary[] = result.buildings.map(building => ({
      id: building.id,
      slug: building.slug,
      name: building.name,
      comuna: building.comuna,
      address: building.address,
      coverImage: building.coverImage,
      gallery: building.gallery,
      precioDesde: building.precioDesde,
      hasAvailability: building.hasAvailability,
      badges: building.badges.map(badge => ({
        type: badge.type as any,
        label: badge.label,
        description: badge.description,
      })),
      amenities: building.amenities,
      typologySummary: building.typologySummary,
    }));
    
    return {
      buildings,
      total: result.total,
      hasMore: result.hasMore
    };
    
  } catch (error) {
    console.error('❌ Error cargando datos de Arriendo Sin Comisión:', error);
    
    // Fallback: intentar cargar desde CSV si Supabase falla
    try {
      console.log('⚠️ Fallback: intentando cargar desde CSV...');
      const { getCSVProcessor } = await import("@lib/csv-data-processor");
      
      const csvProcessor = await getCSVProcessor();
      const csvBuildings = csvProcessor.getLandingBuildings();
      
      const buildings: BuildingSummary[] = csvBuildings.slice(0, 12).map(building => ({
        id: building.id,
        slug: building.slug,
        name: building.name,
        comuna: building.comuna,
        address: building.address,
        coverImage: building.coverImage,
        gallery: building.gallery,
        precioDesde: building.precioDesde,
        hasAvailability: building.hasAvailability,
        badges: building.badges.map(badge => ({
          type: badge.type as any,
          label: badge.label,
          description: badge.description,
        })),
        amenities: building.amenities,
        typologySummary: building.typologySummary,
      }));
      
      return {
        buildings,
        total: csvBuildings.length,
        hasMore: csvBuildings.length > 12
      };
      
    } catch (csvError) {
      console.error('❌ Error también en CSV:', csvError);
      return {
        buildings: [],
        total: 0,
        hasMore: false
      };
    }
  }
}

export default async function ArriendaSinComisionGrid(_: ArriendaSinComisionGridProps) {
  const { buildings, total, hasMore } = await fetchInitialBuildings();

  // Fallback si no hay edificios
  if (buildings.length === 0) {
    return (
      <section id="buildings-grid" aria-labelledby="buildings-heading" className="px-6 py-12 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 id="buildings-heading" className="text-2xl font-semibold text-center">
            Departamentos con 0% comisión
          </h2>
          <div className="mt-8 rounded-2xl border border-border bg-card p-8 text-center">
            <p className="text-muted-foreground">
              Próximamente tendremos departamentos con promociones especiales disponibles
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="buildings-grid" aria-labelledby="buildings-heading" className="relative px-6 py-16 lg:px-8 lg:py-24">
      {/* Background gradient */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-background to-muted/20"
      />

      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center">
          <h2 id="buildings-heading" className="text-3xl font-bold tracking-tight sm:text-4xl">
            Departamentos con{" "}
            <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
              0% comisión
            </span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Proyectos multifamily verificados con promociones especiales
          </p>
          {total > 0 && (
            <p className="mt-2 text-sm text-muted-foreground">
              {total} edificios disponibles
            </p>
          )}
        </div>

        {/* Grid de edificios con carga diferida */}
        <div className="mt-12">
          <LazyBuildingsGrid
            initialBuildings={buildings}
            total={total}
            hasMore={hasMore}
          />
        </div>

        {/* CTA adicional */}
        <div className="mt-12 text-center">
          <Link
            href="/cotizador"
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 px-8 py-4 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl hover:shadow-green-500/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500"
          >
            Cotizar arriendo
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16a2 2 0 002 2z" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
