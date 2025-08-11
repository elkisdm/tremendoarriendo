import { Suspense } from "react";
import type { Metadata } from "next";
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

// Componente de Coming Soon - Versión funcional con formulario y WhatsApp
function ComingSoonContent() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-violet-400">
            Muy pronto
          </h1>
          <p className="text-xl md:text-2xl mb-4 text-gray-300">
            Estamos preparando la nueva experiencia de arriendo
          </p>
          <p className="text-2xl md:text-3xl font-bold text-violet-400 mb-8">
            0% comisión
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white/5 border border-white p-6">
            <h3 className="text-lg font-semibold mb-2 text-violet-300">0% comisión</h3>
            <p className="text-gray-300">Sin costos ocultos ni letra chica</p>
          </div>
          <div className="bg-white/5 border border-white p-6">
            <h3 className="text-lg font-semibold mb-2 text-violet-300">Stock verificado</h3>
            <p className="text-gray-300">Disponibilidad actualizada en tiempo real</p>
          </div>
          <div className="bg-white/5 border border-white p-6">
            <h3 className="text-lg font-semibold mb-2 text-violet-300">Agenda fácil</h3>
            <p className="text-gray-300">WhatsApp o web, tú eliges</p>
          </div>
          <div className="bg-white/5 border border-white p-6">
            <h3 className="text-lg font-semibold mb-2 text-violet-300">Transparencia total</h3>
            <p className="text-gray-300">Condiciones claras desde el inicio</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white/5 border border-white p-8 mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">¡Sé el primero en saberlo!</h2>
          <p className="text-gray-300 mb-6">
            Déjanos tu email y te avisamos cuando esté listo. También puedes contactarnos directamente por WhatsApp.
          </p>
          
          {/* Email Form */}
          <form className="mb-6">
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="tu@email.com"
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-violet-500 text-white font-semibold"
              >
                Notificarme
              </button>
            </div>
          </form>

          {/* WhatsApp Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="https://wa.me/56912345678?text=Hola! Me interesa saber más sobre el arriendo con 0% comisión"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-3 bg-green-600 text-white font-semibold"
            >
              📱 Contactar por WhatsApp
            </a>
            <span className="text-gray-400 text-sm">o</span>
            <a
              href="mailto:hola@elkisrealtor.cl"
              className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 border border-white/20 text-white font-semibold"
            >
              📧 Enviar email
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="text-gray-400 text-sm">
          <p>© 2024 Hommie. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
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
