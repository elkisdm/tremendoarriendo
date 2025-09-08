import Image from "next/image";
import Link from "next/link";

type FeaturedBuildingItem = {
  id: string;
  slug: string;
  name: string;
  comuna: string;
  cover_image: string;
  precio_desde: number | null;
  has_availability: boolean;
};

type FeaturedGridProps = Record<string, never>;

async function fetchFeaturedBuildings(): Promise<FeaturedBuildingItem[]> {
  try {
    // URL absoluta para desarrollo
    const url = 'http://localhost:3000/api/landing/featured';
    // console.log('🌐 FeaturedGrid: Fetching from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Cache durante 5 minutos en desarrollo, 1 hora en producción
      next: {
        revalidate: process.env.NODE_ENV === 'production' ? 3600 : 300
      }
    });

    // console.log('📡 FeaturedGrid: Response status:', response.status);

    if (!response.ok) {
      // console.error(`Error fetching featured buildings: ${response.status} ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    // console.log('📦 FeaturedGrid: Response data:', data);

    return data.buildings || [];
  } catch (error) {
    // console.error('Error in fetchFeaturedBuildings:', error);
    return [];
  }
}

function formatPrice(price: number | null): string {
  if (!price || price <= 0) return "Consultar precio";
  if (price >= 1_000_000) {
    const millions = price / 1_000_000;
    return `$${millions.toFixed(0)}M`;
  }
  return `$${price.toLocaleString('es-CL')}`;
}

export default async function FeaturedGrid(_: FeaturedGridProps) {
  // console.log('🔍 FeaturedGrid: Iniciando fetch de proyectos destacados...');
  const buildings = await fetchFeaturedBuildings();
  // console.log('📊 FeaturedGrid: Proyectos obtenidos:', buildings.length, buildings);

  // Fallback si no hay proyectos destacados
  if (buildings.length === 0) {
    // console.log('⚠️ FeaturedGrid: No hay proyectos, mostrando fallback');
    return (
      <section aria-labelledby="featured-heading" className="px-6 py-12 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 id="featured-heading" className="text-2xl font-semibold">
            Proyectos destacados
          </h2>
          <div className="mt-8 rounded-2xl border border-border bg-card p-8 text-center">
            <p className="text-muted-foreground">
              Próximamente tendremos proyectos destacados disponibles
            </p>
          </div>
        </div>
      </section>
    );
  }

  // console.log('✅ FeaturedGrid: Mostrando', buildings.length, 'proyectos destacados');

  return (
    <section aria-labelledby="featured-heading" className="relative px-6 py-16 lg:px-8 lg:py-24">
      {/* Background gradient */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-bg via-bg to-surface/20"
      />

      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center">
          <h2 id="featured-heading" className="text-3xl font-bold tracking-tight sm:text-4xl">
            Proyectos destacados
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Descubre las mejores opciones disponibles con 0% comisión
          </p>
        </div>

        {/* Grid de proyectos */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {buildings.map((building) => (
            <article
              key={building.id}
              className="group relative overflow-hidden rounded-2xl bg-card shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-primary/10"
            >
              {/* Imagen */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={building.cover_image}
                  alt={`${building.name} en ${building.comuna}`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />

                {/* Badge de disponibilidad */}
                {building.has_availability && (
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center rounded-full bg-green-500/90 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
                      Disponible
                    </span>
                  </div>
                )}

                {/* Overlay de hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>

              {/* Contenido */}
              <div className="p-6">
                <div className="mb-2">
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {building.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{building.comuna}</p>
                </div>

                <div className="mb-4">
                  <p className="text-2xl font-bold text-primary">
                    {formatPrice(building.precio_desde)}
                  </p>
                  <p className="text-xs text-muted-foreground">Desde</p>
                </div>

                {/* CTA */}
                <Link
                  href={`/property/${building.slug}`}
                  aria-label={`Ver detalles de ${building.name}`}
                  className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all duration-200 hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
                >
                  Ver detalles
                  <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* CTA final */}
        <div className="mt-12 text-center">
          <Link
            href="/property"
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-primary/80 px-8 py-3 text-base font-semibold text-primary-foreground shadow-lg transition-all duration-200 hover:shadow-xl hover:shadow-primary/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
          >
            Ver todos los proyectos
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}


