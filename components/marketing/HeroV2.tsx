import MotionWrapper from "@/components/ui/MotionWrapper";

export default function HeroV2() {
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
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 blur-lg" />
              <p className="relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 px-4 py-2 text-sm font-semibold text-primary ring-1 ring-inset ring-primary/20 backdrop-blur-sm">
                <span className="flex h-2 w-2 items-center justify-center">
                  <span className="absolute h-2 w-2 animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-primary" />
                </span>
                0% comisión garantizada
              </p>
            </div>
          </div>
        </MotionWrapper>

        {/* Título principal */}
        <MotionWrapper direction="up" delay={0.2}>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Invierte en{" "}
            <span className="bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
              arriendo
            </span>
            <br />
            sin comisión
          </h1>
        </MotionWrapper>

        {/* Subtítulo */}
        <MotionWrapper direction="up" delay={0.3}>
          <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl lg:text-2xl lg:leading-9">
            Proyectos nuevos verificados con disponibilidad real.{" "}
            <br className="hidden sm:block" />
            Precios actualizados y proceso 100% digital.
          </p>
        </MotionWrapper>

        {/* CTAs */}
        <MotionWrapper direction="up" delay={0.4}>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
            <a
              href="/coming-soon"
              className="group relative inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-primary to-primary/90 px-8 py-4 text-base font-semibold text-primary-foreground shadow-lg transition-all duration-200 hover:shadow-xl hover:shadow-primary/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary sm:px-10 sm:py-5 sm:text-lg"
            >
              <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary to-secondary opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
              <span className="relative">Quiero ser contactado</span>
            </a>
            
            <a
              href="#featured-heading"
              className="inline-flex items-center gap-2 rounded-2xl border border-border/50 bg-background/80 px-6 py-3 text-sm font-medium text-foreground backdrop-blur-sm transition-colors hover:bg-muted/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary sm:px-8 sm:py-4 sm:text-base"
            >
              Ver proyectos
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </div>
        </MotionWrapper>

        {/* Indicadores de valor */}
        <MotionWrapper direction="up" delay={0.6}>
          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8">
            <div className="flex flex-col items-center">
              <div className="rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 p-4 ring-1 ring-green-200/50 dark:from-green-950/20 dark:to-emerald-950/20 dark:ring-green-800/50">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">0%</div>
              </div>
              <p className="mt-2 text-sm font-medium text-muted-foreground">Comisión</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-4 ring-1 ring-blue-200/50 dark:from-blue-950/20 dark:to-indigo-950/20 dark:ring-blue-800/50">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">100%</div>
              </div>
              <p className="mt-2 text-sm font-medium text-muted-foreground">Digital</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-violet-50 p-4 ring-1 ring-purple-200/50 dark:from-purple-950/20 dark:to-violet-950/20 dark:ring-purple-800/50">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">24/7</div>
              </div>
              <p className="mt-2 text-sm font-medium text-muted-foreground">Disponible</p>
            </div>
          </div>
        </MotionWrapper>
      </div>

      {/* Background gradient inferior */}
      <div 
        aria-hidden="true"
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
      >
        <div
          style={{
            clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-secondary to-primary opacity-10 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
        />
      </div>
    </section>
  );
}


