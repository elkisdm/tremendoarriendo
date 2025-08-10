"use client";
import { useEffect, useState } from "react";
import { m } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { PromotionBadge } from "@components/ui/PromotionBadge";
import { PrimaryButton } from "@components/ui/PrimaryButton";
import { track } from "@lib/analytics";
import { buildWaLink } from "@lib/whatsapp";
import { BuildingCard } from "@components/BuildingCard";
import { FilterBar, type FilterValues } from "@components/filters/FilterBar";
import { getAllBuildings } from "@lib/data";
import type { Building } from "@schemas/models";
import type { BuildingSummary } from "@hooks/useFetchBuildings";

// Client page does not export route metadata

export default function Page(){
  const [filters, setFilters] = useState<FilterValues>({ comuna: "Todas", tipologia: "Todas", minPrice: null, maxPrice: null });
  const [sort, setSort] = useState("price-asc");
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<(Building & { precioDesde: number | null })[]>([]);

  function toBuildingSummary(b: Building & { precioDesde: number | null }): BuildingSummary {
    const hasAvailability = Array.isArray(b.units) && b.units.some((u) => u.disponible);
    return {
      id: b.id,
      slug: b.slug,
      name: b.name,
      comuna: b.comuna,
      address: b.address,
      gallery: b.gallery,
      coverImage: b.coverImage,
      badges: b.badges,
      serviceLevel: b.serviceLevel,
      precioDesde: b.precioDesde ?? 0,
      precioRango: b.precioDesde ? { min: b.precioDesde, max: b.precioDesde } : undefined,
      hasAvailability,
      typologySummary: b.typologySummary,
    };
  }

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const data = await getAllBuildings({ 
        ...filters,
        minPrice: filters.minPrice ?? undefined,
        maxPrice: filters.maxPrice ?? undefined
      });
      if (mounted) setItems(data);
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, [filters, sort]);

  return (
    <div className="min-h-[100dvh]">
      <header role="banner" className="sticky top-0 z-40 backdrop-blur bg-[var(--bg)]/70 ring-1 ring-white/10">
        <div className="container mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl" style={{ background: "conic-gradient(from_180deg_at_50%_50%,#6D4AFF, #00E6B3, #FF8A00, #6D4AFF)"}} aria-hidden/>
            <span className="font-semibold">Hommie · 0% Comisión</span>
          </div>
          <nav className="hidden md:flex items-center gap-4 text-sm text-[var(--subtext)]">
            <a className="hover:text-white" href="#">Cómo funciona</a>
            <a className="hover:text-white" href="#">Preguntas</a>
            <a className="hover:text-white" href="#">Contacto</a>
          </nav>
          <PrimaryButton 
            onClick={() => { 
              track("cta_whatsapp_click", { context: "landing_header" }); 
              const link = buildWaLink({ url: typeof window !== "undefined" ? window.location.href : undefined });
              if (link) window.open(link, "_blank");
            }}
            aria-disabled={!Boolean(process.env.NEXT_PUBLIC_WHATSAPP_PHONE)}
            disabled={!Boolean(process.env.NEXT_PUBLIC_WHATSAPP_PHONE)}
            title={!Boolean(process.env.NEXT_PUBLIC_WHATSAPP_PHONE) ? "Pronto disponible" : undefined}
          >
            Quiero esta promo
          </PrimaryButton>
        </div>
      </header>

      <main id="main-content" role="main" className="container mx-auto px-4 md:px-6 py-6">
        <section className="relative overflow-hidden rounded-3xl p-6 md:p-10 bg-gradient-to-br from-[#111122] via-[#19192C] to-[#0B0B10] ring-1 ring-white/10">
          <div className="max-w-3xl">
            <PromotionBadge tag="Campaña Activa" />
            <h1 className="mt-4 text-3xl md:text-5xl font-bold tracking-tight text-white">
              Arrienda con <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8B6CFF] to-[#00E6B3]">0% de comisión</span>
            </h1>
            <p className="mt-3 text-[var(--subtext)] max-w-xl">
              Elige entre edificios con excelentes amenities, reserva tu visita y congela el precio por 12 meses. Promoción por tiempo limitado.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a href="#grid" className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"><PrimaryButton>Explorar edificios</PrimaryButton></a>
              <div className="inline-flex items-center gap-2 text-[var(--subtext)] text-sm">
                <ShieldCheck className="w-4 h-4" aria-hidden/> Sin letra chica
              </div>
            </div>
          </div>
          <div className="pointer-events-none absolute -right-16 -top-16 w-72 h-72 rounded-full blur-3xl opacity-25" style={{ background: "radial-gradient(60%_60%_at_50%_50%,#6D4AFF,transparent)"}}/>
        </section>

        <div className="mt-6">
          <FilterBar 
            value={filters} 
            onChange={setFilters} 
            onApply={() => {
              track("filter_applied", {
                comuna: filters.comuna,
                tipologia: filters.tipologia,
                minPrice: filters.minPrice ?? undefined,
                maxPrice: filters.maxPrice ?? undefined,
                results_count: items.length,
              });
            }} 
            onClear={() => setFilters({ comuna: "Todas", tipologia: "Todas", minPrice: null, maxPrice: null })} 
            sort={sort} 
            onSort={setSort}
            isLoading={loading}
          />
        </div>

        <section id="grid" className="mt-6">
          <div role="status" aria-live="polite" className="sr-only">
            {loading ? "Cargando resultados" : `${items.length} edificios encontrados`}
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-2xl h-80 bg-white/5 ring-1 ring-white/10" />
              ))}
            </div>
          ) : items.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
              {items.map((b, i) => (
                <m.div key={b.id} layout>
                  <BuildingCard building={toBuildingSummary(b)} priority={i === 0} />
                </m.div>
              ))}
            </div>
          ) : (
            <div className="text-center text-[var(--subtext)] py-20">No encontramos resultados con esos filtros.</div>
          )}
        </section>
      </main>

      <footer role="contentinfo" className="mt-14 border-t border-white/10">
        <div className="container mx-auto px-4 md:px-6 py-8 text-sm text-[var(--subtext)] flex flex-col md:flex-row items-center justify-between gap-3">
          <div>© {new Date().getFullYear()} Hommie. Todos los derechos reservados.</div>
          <div className="flex items-center gap-4">
            <a className="hover:text-white" href="#">Términos</a>
            <a className="hover:text-white" href="#">Privacidad</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
