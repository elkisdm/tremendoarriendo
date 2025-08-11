import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LandingClient } from "../components/LandingClient";
import { BuildingCardSkeleton } from "../components/ui/BuildingCardSkeleton";
import { COMING_SOON } from "../lib/flags";

export const metadata: Metadata = {
  title: "Arrienda con 0% comisión",
  description: "Explora edificios disponibles, filtra por comuna y tipología, y agenda tu visita sin pagar comisión.",
  alternates: { canonical: "/" },
};

function LoadingFallback() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Arrienda con 0% de comisión</h1>
        <p className="text-[var(--subtext)]">Explora proyectos disponibles hoy</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, idx) => (
          <BuildingCardSkeleton key={`loading-skeleton-${idx}`} />
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  // Si COMING_SOON está habilitado, hacer redirect HTTP a /coming-soon
  if (COMING_SOON) {
    redirect('/coming-soon');
  }

  return (
    <main id="main-content" role="main">
      <Suspense fallback={<LoadingFallback />}>
        <LandingClient />
      </Suspense>

      {/* Sin letra chica */}
      <section aria-labelledby="sin-letra-chica" className="container mx-auto px-4 md:px-6 py-10">
        <h2 id="sin-letra-chica" className="text-xl md:text-2xl font-semibold">Sin letra chica</h2>
        <div className="mt-2 text-[var(--subtext)] max-w-3xl text-sm md:text-base">
          <p>
            Transparencia total: la comisión de corretaje es 0%. El arriendo mensual y los gastos asociados
            se informan antes de reservar. Puedes agendar y cancelar tu visita sin costo.
          </p>
          <p className="mt-2">{/* TODO(BLUEPRINT): texto legal final */}</p>
        </div>
      </section>
    </main>
  );
}
