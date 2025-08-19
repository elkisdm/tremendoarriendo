"use client";

import { useState } from "react";
import MotionWrapper from "@/components/ui/MotionWrapper";
import ContactModal from "./ContactModal";

export default function HowItWorks() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const steps = [
    {
      number: "01",
      title: "Explora proyectos",
      description: "Navega por nuestra selección de proyectos verificados con disponibilidad real y precios transparentes.",
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
      ),
      gradient: "from-blue-500 to-indigo-600",
      bgGradient: "from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20",
    },
    {
      number: "02",
      title: "Cotiza sin fricción",
      description: "Selecciona tipologías, ve precios finales y ahorra toda la comisión. Proceso 100% digital.",
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18a2.25 2.25 0 0 1-2.25 2.25h-1.5m-1.5 0h-1.5A2.25 2.25 0 0 1 6.75 18v-2.25m8.25-15v3a2.25 2.25 0 0 1-2.25 2.25h-1.5m1.5 0H9a2.25 2.25 0 0 0-2.25 2.25v3M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
      ),
      gradient: "from-green-500 to-emerald-600",
      bgGradient: "from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20",
    },
    {
      number: "03",
      title: "Reserva en minutos",
      description: "Te acompañamos en todo el proceso hasta la escrituración. Soporte personal dedicado.",
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
        </svg>
      ),
      gradient: "from-purple-500 to-violet-600",
      bgGradient: "from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20",
    },
  ];

  return (
    <>
      <section aria-labelledby="how-heading" className="px-6 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <MotionWrapper direction="up" delay={0.1}>
            <div className="text-center">
              <h2 id="how-heading" className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                ¿Cómo funciona?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Proceso simple y transparente en 3 pasos
              </p>
            </div>
          </MotionWrapper>
          
          {/* Steps */}
          <div className="mt-16">
            <ol className="grid gap-8 md:grid-cols-3 md:gap-12">
              {steps.map((step, index) => (
                <MotionWrapper key={step.number} direction="up" delay={0.2 + index * 0.1}>
                  <li className="relative">
                    {/* Connector line - solo en pantallas md+ */}
                    {index < steps.length - 1 && (
                      <div className="absolute left-1/2 top-20 hidden h-0.5 w-full -translate-x-1/2 bg-gradient-to-r from-border to-transparent md:block lg:top-24" />
                    )}
                    
                    <div className="relative">
                      {/* Icon container - más cuadrado y proporcional */}
                      <div className="mx-auto flex h-20 w-20 items-center justify-center lg:h-24 lg:w-24">
                        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.bgGradient} ring-1 ring-border/20`} />
                        <div className={`relative text-white`}>
                          <div className={`rounded-2xl bg-gradient-to-br ${step.gradient} p-4 lg:p-5`}>
                            {step.icon}
                          </div>
                        </div>
                      </div>
                      
                      {/* Step number - más cuadrado */}
                      <div className="mt-6 text-center">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-sm font-bold text-primary ring-1 ring-primary/20">
                          {step.number}
                        </span>
                      </div>
                      
                      {/* Content - contenedor más cuadrado */}
                      <div className="mt-8">
                        <div className="bg-card rounded-2xl p-6 ring-1 ring-border/20 shadow-sm">
                          <h3 className="text-xl font-semibold text-foreground lg:text-2xl text-center">
                            {step.title}
                          </h3>
                          <p className="mt-4 text-base leading-relaxed text-muted-foreground lg:text-lg text-center">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                </MotionWrapper>
              ))}
            </ol>
          </div>
          
          {/* CTA - contenedor más cuadrado y proporcional */}
          <MotionWrapper direction="up" delay={0.5}>
            <div className="mt-16 text-center">
              <div className="bg-card rounded-2xl border border-border shadow-lg ring-1 ring-border/20 overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 lg:p-12 text-white">
                  <h3 className="text-2xl font-semibold lg:text-3xl">
                    ¿Listo para empezar?
                  </h3>
                  <p className="mt-3 text-lg text-white/90">
                    Déjanos tus datos y te contactaremos para ayudarte a encontrar tu próximo hogar
                  </p>
                </div>
                <div className="p-8 lg:p-12">
                  <div className="max-w-md mx-auto space-y-6">
                    <div className="text-center">
                      <h4 className="text-lg font-medium text-foreground mb-2">
                        Te contactamos por el método que prefieras
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        WhatsApp, llamada telefónica o email
                      </p>
                    </div>
                    <button
                      onClick={() => setIsContactModalOpen(true)}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-8 py-4 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl hover:shadow-green-500/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500 active:scale-[0.98]"
                    >
                      Quiero ser contactado
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                    </button>
                    <p className="text-xs text-muted-foreground text-center">
                      Sin compromiso • Respuesta en menos de 24 horas
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </MotionWrapper>
        </div>
      </section>

      {/* Modal de contacto */}
      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
    </>
  );
}


