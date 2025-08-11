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

// Componente de Coming Soon - Versión completa con formulario y WhatsApp
function ComingSoonContent() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="coming-soon-grid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
            </pattern>
            <pattern id="coming-soon-hex" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M50 0 L100 25 L100 75 L50 100 L0 75 L0 25 Z" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.2"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#coming-soon-grid)"/>
          <rect width="100%" height="100%" fill="url(#coming-soon-hex)"/>
        </svg>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-violet-400/30 rounded-full animate-pulse"
            style={{
              left: `${10 + (i * 10)}%`,
              top: `${20 + (i * 8)}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: '3s'
            }}
          />
        ))}
      </div>

      <div className="text-center max-w-4xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
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
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
            <h3 className="text-lg font-semibold mb-2 text-violet-300">0% comisión</h3>
            <p className="text-gray-300">Sin costos ocultos ni letra chica</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
            <h3 className="text-lg font-semibold mb-2 text-violet-300">Stock verificado</h3>
            <p className="text-gray-300">Disponibilidad actualizada en tiempo real</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
            <h3 className="text-lg font-semibold mb-2 text-violet-300">Agenda fácil</h3>
            <p className="text-gray-300">WhatsApp o web, tú eliges</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
            <h3 className="text-lg font-semibold mb-2 text-violet-300">Transparencia total</h3>
            <p className="text-gray-300">Condiciones claras desde el inicio</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">¡Sé el primero en saberlo!</h2>
          <p className="text-gray-300 mb-6">
            Déjanos tu email y te avisamos cuando esté listo. También puedes contactarnos directamente por WhatsApp.
          </p>
          
          {/* Email Form */}
          <form className="mb-6" onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="tu@email.com"
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-violet-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-violet-600 hover:to-cyan-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                Notificarme
              </button>
            </div>
          </form>

          {/* WhatsApp Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '56912345678'}?text=Hola! Me interesa saber más sobre el arriendo con 0% comisión`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-900"
              aria-disabled={!Boolean(process.env.NEXT_PUBLIC_WHATSAPP_PHONE)}
              title={!Boolean(process.env.NEXT_PUBLIC_WHATSAPP_PHONE) ? "Pronto disponible" : undefined}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              Contactar por WhatsApp
            </a>
            <span className="text-gray-400 text-sm">o</span>
            <a
              href="mailto:hola@elkisrealtor.cl"
              className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Enviar email
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
