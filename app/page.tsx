import { Suspense } from "react";
import type { Metadata } from "next";
import { LandingClient } from "../components/LandingClient";
import { BuildingCardSkeleton } from "../components/ui/BuildingCardSkeleton";
import { COMING_SOON } from "../lib/flags";

export const revalidate = 0; // Sin cache para forzar revalidación

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

// Componente de Coming Soon - Versión simple para debug
function ComingSoonContent() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center max-w-3xl mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
          Muy pronto
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-gray-300">
          Estamos preparando la nueva experiencia de arriendo <strong>0% comisión</strong>
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-2">0% comisión</h3>
            <p className="text-gray-300">Sin costos ocultos ni letra chica</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-2">Stock verificado</h3>
            <p className="text-gray-300">Disponibilidad actualizada en tiempo real</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-2">Agenda fácil</h3>
            <p className="text-gray-300">WhatsApp o web, tú eliges</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-2">Transparencia total</h3>
            <p className="text-gray-300">Condiciones claras desde el inicio</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  // Debug: mostrar el valor de COMING_SOON
  console.log('COMING_SOON value:', COMING_SOON);
  
  // Si COMING_SOON está habilitado, mostrar contenido de coming soon
  if (COMING_SOON) {
    return <ComingSoonContent />;
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
