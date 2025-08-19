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
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
      borderColor: "border-blue-200 dark:border-blue-800/30",
    },
    {
      number: "02",
      title: "Cotiza sin fricción",
      description: "Selecciona tipologías, ve precios finales y ahorra toda la comisión. Proceso 100% digital.",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
      borderColor: "border-emerald-200 dark:border-emerald-800/30",
    },
    {
      number: "03",
      title: "Reserva en minutos",
      description: "Te acompañamos en todo el proceso hasta la escrituración. Soporte personal dedicado.",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
      borderColor: "border-purple-200 dark:border-purple-800/30",
    },
  ];

  return (
    <>
      <section aria-labelledby="how-heading" className="px-6 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-6xl">
          {/* Header minimalista */}
          <MotionWrapper direction="up" delay={0.1}>
            <div className="text-center mb-16">
              <h2 id="how-heading" className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
                ¿Cómo funciona?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Proceso simple y transparente en 3 pasos
              </p>
            </div>
          </MotionWrapper>
          
          {/* Steps - diseño minimalista y simétrico */}
          <div className="grid gap-12 md:grid-cols-3">
            {steps.map((step, index) => (
              <MotionWrapper key={step.number} direction="up" delay={0.2 + index * 0.1}>
                <div className="relative group">
                  {/* Línea conectora en desktop */}
                  {index < steps.length - 1 && (
                    <div className="absolute left-full top-8 hidden h-px w-12 bg-gradient-to-r from-border to-transparent md:block" />
                  )}
                  
                  {/* Contenedor principal - más cuadrado y minimalista */}
                  <div className="relative bg-card border border-border/50 rounded-3xl p-8 h-full transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20">
                    
                    {/* Icono - diseño minimalista */}
                    <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6">
                      <div className={`w-full h-full rounded-2xl ${step.bgColor} ${step.borderColor} border-2 flex items-center justify-center ${step.color}`}>
                        {step.icon}
                      </div>
                    </div>
                    
                    {/* Número del paso - minimalista */}
                    <div className="text-center mb-6">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${step.color} ${step.bgColor} ${step.borderColor} border`}>
                        {step.number.slice(-1)}
                      </span>
                    </div>
                    
                    {/* Contenido */}
                    <div className="text-center">
                      <h3 className="text-xl font-semibold text-foreground mb-4">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              </MotionWrapper>
            ))}
          </div>
          
          {/* CTA - diseño minimalista */}
          <MotionWrapper direction="up" delay={0.5}>
            <div className="mt-20 text-center">
              <div className="max-w-2xl mx-auto bg-card border border-border/50 rounded-3xl p-8 lg:p-12 shadow-lg">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    ¿Listo para empezar?
                  </h3>
                  <p className="text-muted-foreground text-lg">
                    Déjanos tus datos y te contactaremos para ayudarte a encontrar tu próximo hogar
                  </p>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-medium text-foreground mb-2">
                      Te contactamos por el método que prefieras
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      WhatsApp, llamada telefónica o email
                    </p>
                  </div>
                  
                  <button
                    onClick={() => setIsContactModalOpen(true)}
                    className="w-full inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 px-8 py-4 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl hover:shadow-emerald-500/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-500 active:scale-[0.98]"
                  >
                    Quiero ser contactado
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </button>
                  
                  <p className="text-xs text-muted-foreground">
                    Sin compromiso • Respuesta en menos de 24 horas
                  </p>
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


