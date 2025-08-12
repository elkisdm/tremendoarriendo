"use client";
import { useEffect, useState, useRef } from "react";
import { motion, MotionConfig } from "framer-motion";
import { 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  Building, 
  Building2,
  MessageCircle,
  MessageSquare,
  DollarSign,
  Zap,
  CheckCircle,
  Smartphone,
  Headphones,
  FileText,
  Calendar
} from "lucide-react";
import { buildWhatsAppUrl } from "@lib/whatsapp";
import { PromoBadge } from "./PromoBadge";
import { track } from "@lib/analytics";
import { Modal } from "@components/ui/Modal";
import { WaitlistForm } from "./WaitlistForm";

// Componente para el background SVG pattern
function BackgroundPattern() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Grid pattern SVG */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.03] mix-blend-overlay"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern
            id="grid-coming-soon"
            width="10"
            height="10"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 10 0 L 0 0 0 10"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-white"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-coming-soon)" />
      </svg>
      
      {/* Hex pattern overlay */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.02] mix-blend-soft-light"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern
            id="hex-coming-soon"
            width="20"
            height="17.32"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(30)"
          >
            <polygon
              points="10,0 20,5.77 20,17.32 10,23.09 0,17.32 0,5.77"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.3"
              className="text-white"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hex-coming-soon)" />
      </svg>
    </div>
  );
}

// Componente para partículas sutiles con parallax - optimizado para performance
function FloatingParticles({ prefersReducedMotion }: { prefersReducedMotion: boolean }) {
  if (prefersReducedMotion) return null;

  // Reducir número de partículas para mejor performance
  const particles = [
    { id: 1, x: "15%", y: "25%", size: "4", delay: 0 },
    { id: 2, x: "80%", y: "20%", size: "6", delay: 2 },
    { id: 3, x: "20%", y: "75%", size: "3", delay: 4 },
    { id: 4, x: "75%", y: "80%", size: "5", delay: 6 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-r from-brand-violet/20 to-brand-aqua/20"
          style={{
            left: particle.x,
            top: particle.y,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.4, 0],
            y: [-5, 5],
          }}
          transition={{
            duration: 6,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export function ComingSoonHero() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const triggerButtonRef = useRef<HTMLButtonElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const handleWaitlistClick = () => {
    track('waitlist_open');
    setModalOpen(true);
  };

  const handleModalClose = () => {
    track('waitlist_close');
    setModalOpen(false);
  };





  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  const iconVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const benefitCardVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        delay: custom * 0.03,
        ease: "easeOut",
      },
    }),
  };

  const icons = [
    { Icon: ShieldCheck, label: "Seguridad garantizada" },
    { Icon: Sparkles, label: "Experiencia premium" },
    { Icon: Clock, label: "Proceso rápido" },
    { Icon: Building, label: "Edificios exclusivos" },
    { Icon: MessageCircle, label: "Soporte 24/7" },
  ];

  return (
    <MotionConfig reducedMotion={prefersReducedMotion ? "user" : "never"}>
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        {/* Background patterns and particles */}
        <BackgroundPattern />
        <FloatingParticles prefersReducedMotion={prefersReducedMotion} />
        
        {/* Gradiente animado de fondo */}
        <div 
          className={`absolute inset-0 ${
            prefersReducedMotion 
              ? "bg-gradient-to-br from-violet-900/20 via-purple-900/10 to-cyan-900/20" 
              : "animate-gradient"
          }`}
          style={{
            background: prefersReducedMotion 
              ? "linear-gradient(135deg, rgba(139, 108, 255, 0.1) 0%, rgba(0, 230, 179, 0.05) 50%, rgba(139, 108, 255, 0.1) 100%)"
              : "linear-gradient(135deg, rgba(139, 108, 255, 0.15) 0%, rgba(0, 230, 179, 0.1) 25%, rgba(139, 108, 255, 0.05) 50%, rgba(0, 230, 179, 0.1) 75%, rgba(139, 108, 255, 0.15) 100%)",
            backgroundSize: prefersReducedMotion ? "100% 100%" : "400% 400%",
            animation: prefersReducedMotion ? "none" : "gradientShift 6s ease-in-out infinite",
          }}
        />

        {/* Contenido principal */}
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center pt-20 pb-16 md:pb-24">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Título principal con gradiente violeta→aqua y tipografía headline */}
            <motion.h1 
              variants={itemVariants}
              className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[--brand-violet,#7C3AED] via-fuchsia-400 to-[--brand-aqua,#22D3EE]"
            >
              Próximamente
            </motion.h1>

            {/* Badge "Sin letra chica" */}
            <motion.div variants={itemVariants}>
              <PromoBadge />
            </motion.div>

            {/* Legal breve - mejorado contraste */}
            <motion.p 
              variants={itemVariants}
              className="text-sm text-neutral-100/80 max-w-lg mx-auto leading-relaxed"
            >
              Arriendos desde $210.000 pesos. Sin costos ocultos ni sorpresas.
            </motion.p>

            {/* CTAs debajo del legal */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4 mt-6"
            >
              {/* Botón primario "Notificarme" */}
              <motion.button
                ref={triggerButtonRef}
                onClick={handleWaitlistClick}
                className="rounded-2xl px-6 py-3 font-semibold bg-gradient-to-r from-[--brand-violet,#7C3AED] to-[--brand-aqua,#22D3EE] text-white shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-400/40 hover:shadow-xl transition-all duration-200 min-h-[44px] flex items-center justify-center"
                aria-label="Notificarme cuando esté listo"
              >
                Notificarme
              </motion.button>

              {/* Botón secundario "WhatsApp" */}
              {(() => {
                const waUrl = buildWhatsAppUrl({
                  message: "Hola, me interesa el lanzamiento"
                });
                return waUrl ? (
                  <motion.a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => track('cta_whatsapp_click', { source: 'coming-soon' })}
                    className="rounded-2xl px-6 py-3 font-semibold bg-green-600 hover:bg-green-700 text-white shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-400/40 hover:shadow-xl transition-all duration-200 min-h-[44px] flex items-center justify-center"
                    aria-label="Contactar por WhatsApp"
                  >
                    WhatsApp
                  </motion.a>
                ) : (
                  <motion.button
                    aria-disabled="true"
                    title="Configura WhatsApp en Vercel"
                    className="rounded-2xl px-6 py-3 font-semibold bg-gray-500 text-white shadow-lg cursor-not-allowed opacity-50 min-h-[44px] flex items-center justify-center"
                  >
                    WhatsApp
                  </motion.button>
                );
              })()}
            </motion.div>

            {/* Subtítulo con mejor contraste */}
            <motion.p 
              variants={itemVariants}
              className="text-lg md:text-xl text-neutral-100 max-w-2xl mx-auto leading-relaxed drop-shadow-sm"
            >
              Estamos preparando la nueva experiencia de arriendo 0% comisión. Sin letra chica.
            </motion.p>

            {/* Sección de beneficios de la promoción con tarjetas glass */}
            <motion.div 
              variants={itemVariants}
              className="relative bg-white/5 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-white/10 hover:bg-white/8 transition-colors duration-200"
            >
              {/* Glass effect overlay */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-200" />
              
              <div className="relative z-10">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-6 text-center">
                  🎉 ¡Ahorra hasta $500.000 en comisiones!
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { icon: ShieldCheck, text: "0% comisión de corretaje" },
                    { icon: Smartphone, text: "Proceso 100% digital" },
                    { icon: Building2, text: "Edificios premium verificados" },
                    { icon: Headphones, text: "Soporte personalizado 24/7" },
                    { icon: FileText, text: "Sin letra chica ni sorpresas" },
                    { icon: Calendar, text: "Reserva sin compromiso" }
                  ].map(({ icon: Icon, text }, index) => (
                    <motion.div
                      key={index}
                      variants={benefitCardVariants}
                      custom={index}
                      className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4 transition-all duration-200 will-change-transform hover:-translate-y-[1px] hover:bg-white/8"
                      whileHover={prefersReducedMotion ? {} : { y: -2 }}
                    >
                      <div className="flex flex-col items-center text-center space-y-3 h-full">
                        <Icon className="size-5 text-white/90" aria-hidden="true" />
                        <span className="text-sm text-neutral-100 font-medium leading-tight">
                          {text}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-brand-violet/20 to-brand-aqua/20 rounded-2xl backdrop-blur-sm border border-white/10">
                  <div className="flex items-center justify-center space-x-2 text-white font-semibold text-center">
                    <DollarSign className="w-5 h-5" />
                    <span>Ejemplo: Arriendo $500.000 → Ahorras $297.500 en comisión (incluye IVA)</span>
                  </div>
                  <div className="mt-3 text-center">
                    <span className="text-sm text-white/80">Precios desde: $210.000 pesos</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Grid de iconos con dimensiones uniformes y centrado */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-2xl mx-auto"
            >
              {icons.map(({ Icon, label }, index) => (
                <motion.div
                  key={index}
                  variants={iconVariants}
                  whileHover={{ 
                    y: prefersReducedMotion ? 0 : -2,
                  }}
                  transition={{ duration: 0.15 }}
                  className="group relative"
                  tabIndex={0}
                  role="button"
                  aria-label={label}
                >
                  <div className="relative p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/8 transition-colors duration-200 h-full min-h-[120px] flex flex-col items-center justify-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-400/40">
                    <Icon 
                      className="w-8 h-8 text-brand-violet mb-3" 
                      aria-hidden="true"
                    />
                    <span className="text-sm text-neutral-100 font-medium text-center leading-tight">
                      {label}
                    </span>
                    {/* Glass effect overlay */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTAs con sombras mejoradas */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              {/* CTA principal */}
              <motion.button
                onClick={handleWaitlistClick}
                className="inline-flex items-center px-8 py-4 text-lg font-semibold rounded-2xl bg-gradient-to-r from-brand-violet to-brand-aqua text-white shadow-lg shadow-violet-500/20 hover:shadow-xl hover:shadow-violet-500/30 transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-400/40 min-h-[44px]"
                aria-label="Avísame cuando esté listo"
              >
                <Zap className="w-5 h-5 mr-2" />
                Avísame cuando esté listo
              </motion.button>

              {/* CTA WhatsApp */}
              {(() => {
                const waUrl = buildWhatsAppUrl({
                  message: "Hola, me interesa la nueva experiencia de arriendo"
                });
                return waUrl ? (
                  <motion.a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => track('cta_whatsapp_click', { source: 'coming-soon' })}
                    className="inline-flex items-center px-8 py-4 text-lg font-semibold rounded-2xl bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20 hover:shadow-xl hover:shadow-green-600/30 transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-400/40 min-h-[44px]"
                    aria-label="Hablá con nosotros por WhatsApp"
                  >
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Hablá con nosotros
                  </motion.a>
                ) : (
                  <motion.button
                    aria-disabled="true"
                    title="Configura WhatsApp en Vercel"
                    className="inline-flex items-center px-8 py-4 text-lg font-semibold rounded-2xl bg-gray-500 text-white shadow-lg cursor-not-allowed opacity-50 min-h-[44px]"
                  >
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Hablá con nosotros
                  </motion.button>
                );
              })()}
            </motion.div>

            {/* Texto adicional con mejor contraste */}
            <motion.p 
              variants={itemVariants}
              className="text-sm text-neutral-100/80 max-w-md mx-auto drop-shadow-sm"
            >
              ¿Tenés dudas? Escribinos por WhatsApp y te respondemos al toque 🚀
            </motion.p>


          </motion.div>
        </div>

        {/* Estilos CSS para la animación del gradiente */}
        <style jsx>{`
          @keyframes gradientShift {
            0%, 100% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
          }
          
          .animate-gradient {
            animation: gradientShift 6s ease-in-out infinite;
          }
        `}</style>
      </section>

      {/* Modal de Waitlist */}
      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        title="Únete a la lista de espera"
        description="Te avisamos cuando lancemos la nueva experiencia de arriendo 0% comisión."
        initialFocusRef={emailInputRef}
      >
        <WaitlistForm initialFocusRef={emailInputRef} />
      </Modal>
    </MotionConfig>
  );
}
