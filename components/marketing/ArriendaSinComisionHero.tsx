"use client";

import MotionWrapper from "@/components/ui/MotionWrapper";

export default function ArriendaSinComisionHero() {
  return (
    <section className="relative isolate overflow-hidden px-6 py-24 sm:py-32 lg:px-8">
      {/* Background gradient */}
      <div 
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          style={{
            clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-secondary opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
        />
      </div>

      <div className="mx-auto max-w-4xl text-center">
        {/* Badge destacado */}
        <MotionWrapper direction="down" delay={0.1}>
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 dark:from-cyan-400/20 dark:to-blue-400/20 blur-lg" />
              <p className="relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500/10 via-blue-500/5 to-purple-600/10 dark:from-cyan-400/10 dark:via-blue-400/5 dark:to-purple-500/10 px-4 py-2 text-sm font-semibold text-cyan-600 dark:text-cyan-400 ring-1 ring-inset ring-cyan-500/20 dark:ring-cyan-400/20 backdrop-blur-sm">
                <span className="flex h-2 w-2 items-center justify-center">
                  <span className="absolute h-2 w-2 animate-ping rounded-full bg-cyan-500 dark:bg-cyan-400 opacity-75" />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400" />
                </span>
                ⚡ Oportunidad única disponible
              </p>
            </div>
          </div>
        </MotionWrapper>

        {/* Título principal */}
        <MotionWrapper direction="up" delay={0.2}>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Arrienda{" "}
            <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 dark:from-cyan-400 dark:via-blue-400 dark:to-purple-500 bg-clip-text text-transparent">
              sin comisión
            </span>
            <br />
            <span className="text-3xl sm:text-4xl lg:text-5xl">en Estación Central</span>
          </h1>
        </MotionWrapper>

        {/* Subtítulo */}
        <MotionWrapper direction="up" delay={0.3}>
          <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl lg:text-2xl lg:leading-9">
            Descubre <strong>Home Amengual</strong>, un edificio premium con{" "}
            <br className="hidden sm:block" />
            las mejores amenidades y 0% de comisión garantizada.
          </p>
        </MotionWrapper>

        {/* CTAs */}
        <MotionWrapper direction="up" delay={0.4}>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
            <a
              href="#buildings-grid"
              className="group relative inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 dark:from-cyan-600 dark:to-blue-700 dark:hover:from-cyan-700 dark:hover:to-blue-800 px-8 py-4 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl hover:shadow-cyan-500/25 dark:hover:shadow-cyan-600/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-500 sm:px-10 sm:py-5 sm:text-lg"
            >
              <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-cyan-600 dark:to-blue-700 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
              <span className="relative">Ver edificio disponible</span>
            </a>
            
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('openContactModal'))}
              className="inline-flex items-center gap-2 rounded-2xl border border-border/50 bg-background/80 dark:bg-background/60 px-6 py-3 text-sm font-medium text-foreground backdrop-blur-sm transition-colors hover:bg-muted/50 dark:hover:bg-muted/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-500 sm:px-8 sm:py-4 sm:text-base"
            >
              Quiero ser contactado
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </button>
          </div>
        </MotionWrapper>

        {/* Indicadores de valor */}
        <MotionWrapper direction="up" delay={0.6}>
          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8">
            <div className="flex flex-col items-center">
              <div className="rounded-2xl bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-950/30 dark:to-cyan-900/30 p-4 ring-1 ring-cyan-200/50 dark:ring-cyan-800/50">
                <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">0%</div>
              </div>
              <p className="mt-2 text-sm font-medium text-muted-foreground">Comisión</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 p-4 ring-1 ring-blue-200/50 dark:ring-blue-800/50">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">8</div>
              </div>
              <p className="mt-2 text-sm font-medium text-muted-foreground">Unidades</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30 p-4 ring-1 ring-purple-200/50 dark:ring-purple-800/50">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">4</div>
              </div>
              <p className="mt-2 text-sm font-medium text-muted-foreground">Tipologías</p>
            </div>
          </div>
        </MotionWrapper>
      </div>
    </section>
  );
}

