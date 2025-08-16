export default function Trust() {
  const stats = [
    {
      number: "1.2M+",
      label: "UF en proyectos",
      description: "Volumen total en nuestra plataforma",
    },
    {
      number: "98%",
      label: "Clientes satisfechos",
      description: "Proceso sin complicaciones",
    },
    {
      number: "15+",
      label: "Proyectos activos",
      description: "Disponibilidad verificada",
    },
  ];

  const partners = [
    {
      name: "Inmobiliaria Verificada",
      logo: "📋",
      description: "Socios certificados",
    },
    {
      name: "Proceso Seguro",
      logo: "🔒",
      description: "Transacciones protegidas",
    },
    {
      name: "Soporte 24/7",
      logo: "💬",
      description: "Atención personalizada",
    },
    {
      name: "Documentación Legal",
      logo: "📄",
      description: "Todo en regla",
    },
  ];

  return (
    <section aria-labelledby="trust-heading" className="px-6 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center">
          <h2 id="trust-heading" className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Confían en nosotros
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Respaldados por resultados y transparencia
          </p>
        </div>

        {/* Stats section */}
        <div className="mt-16">
          <div className="grid gap-8 sm:grid-cols-3">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="rounded-3xl border border-border bg-gradient-to-br from-card to-muted/20 p-8">
                  <div className="text-4xl font-bold text-primary lg:text-5xl">
                    {stat.number}
                  </div>
                  <div className="mt-2 text-lg font-semibold text-foreground">
                    {stat.label}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {stat.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Partners section */}
        <div className="mt-20">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-foreground">
              Garantías y soporte
            </h3>
            <p className="mt-2 text-muted-foreground">
              Todo lo que necesitas para invertir con confianza
            </p>
          </div>
          
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {partners.map((partner, index) => (
              <div
                key={index}
                className="group rounded-2xl border border-border bg-card p-6 text-center transition-all duration-200 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-primary/5 text-3xl">
                  {partner.logo}
                </div>
                <h4 className="mt-4 font-semibold text-foreground">
                  {partner.name}
                </h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  {partner.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className="mt-20">
          <div className="rounded-3xl border border-border bg-gradient-to-br from-muted/30 to-muted/10 p-8 lg:p-12">
            <div className="text-center">
              <blockquote className="text-xl font-medium italic text-foreground lg:text-2xl">
                "La experiencia más transparente que he tenido invirtiendo en arriendo. 
                Sin comisiones ocultas y con soporte en cada paso."
              </blockquote>
              <footer className="mt-6">
                <div className="flex items-center justify-center space-x-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-secondary" />
                  <div className="text-left">
                    <cite className="font-semibold text-foreground not-italic">
                      María González
                    </cite>
                    <div className="text-sm text-muted-foreground">
                      Inversionista - Las Condes
                    </div>
                  </div>
                </div>
              </footer>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-16 text-center">
          <p className="text-lg text-muted-foreground">
            ¿Listo para unirte a nuestra comunidad de inversionistas?
          </p>
          <div className="mt-6">
            <a
              href="/coming-soon"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-primary/90 px-8 py-4 text-base font-semibold text-primary-foreground shadow-lg transition-all duration-200 hover:shadow-xl hover:shadow-primary/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
            >
              Comenzar ahora
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}


