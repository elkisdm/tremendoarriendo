"use client";
import { useEffect, useState } from "react";
import { motion, MotionConfig } from "framer-motion";
import { 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  Building, 
  MessageCircle,
  MessageSquare,
  DollarSign,
  Zap,
  CheckCircle
} from "lucide-react";
import { buildWaLink } from "@lib/whatsapp";
import { PromoBadge } from "./PromoBadge";
import { track } from "@lib/analytics";

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

// Componente para partículas sutiles con parallax
function FloatingParticles({ prefersReducedMotion }: { prefersReducedMotion: boolean }) {
  if (prefersReducedMotion) return null;

  const particles = [
    { id: 1, x: "15%", y: "25%", size: "5", delay: 0 },
    { id: 2, x: "80%", y: "20%", size: "7", delay: 0.5 },
    { id: 3, x: "20%", y: "75%", size: "4", delay: 1 },
    { id: 4, x: "75%", y: "80%", size: "6", delay: 1.5 },
    { id: 5, x: "45%", y: "15%", size: "5", delay: 2 },
    { id: 6, x: "30%", y: "65%", size: "4", delay: 2.5 },
    { id: 7, x: "65%", y: "45%", size: "6", delay: 3 },
    { id: 8, x: "85%", y: "65%", size: "5", delay: 3.5 },
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
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.6, 0],
            scale: [0, 1, 0.8],
            y: [-10, 10, -5],
          }}
          transition={{
            duration: 8,
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
    track('cta_waitlist_click');
    const waitlistElement = document.getElementById("waitlist");
    if (waitlistElement) {
      waitlistElement.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    }
  };

  const handleWhatsAppClick = () => {
    track('cta_whatsapp_click');
    const waLink = buildWaLink({
      propertyName: "la nueva experiencia de arriendo",
      comuna: "Santiago",
      url: "https://hommie.cl/coming-soon"
    });
    if (waLink) {
      window.open(waLink, "_blank");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const iconVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
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
            animation: prefersReducedMotion ? "none" : "gradientShift 8s ease-in-out infinite",
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

            {/* Legal breve */}
            <motion.p 
              variants={itemVariants}
              className="text-sm text-neutral-100/70 max-w-lg mx-auto leading-relaxed"
            >
              Precios "Desde" reales. // TODO(BLUEPRINT): copiar legal final.
            </motion.p>

            {/* CTAs debajo del legal */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4 mt-6"
            >
              {/* Botón primario "Notificarme" */}
              <motion.button
                onClick={handleWaitlistClick}
                className="rounded-2xl px-6 py-3 font-semibold bg-gradient-to-r from-[--brand-violet,#7C3AED] to-[--brand-aqua,#22D3EE] text-white shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-400/40 hover:shadow-xl transition-all duration-200"
                aria-label="Notificarme cuando esté listo"
              >
                Notificarme
              </motion.button>

              {/* Botón secundario "WhatsApp" */}
              {process.env.NEXT_PUBLIC_WHATSAPP_PHONE ? (
                <motion.a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_PHONE}?text=Hola%20me%20interesa%20el%20lanzamiento`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track('cta_whatsapp_click')}
                  className="rounded-2xl px-6 py-3 font-semibold bg-green-600 hover:bg-green-700 text-white shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-400/40 hover:shadow-xl transition-all duration-200"
                  aria-label="Contactar por WhatsApp"
                >
                  WhatsApp
                </motion.a>
              ) : (
                <motion.button
                  aria-disabled="true"
                  title="Configura NEXT_PUBLIC_WHATSAPP_PHONE"
                  className="rounded-2xl px-6 py-3 font-semibold bg-gray-500 text-white shadow-lg cursor-not-allowed opacity-50"
                >
                  WhatsApp
                </motion.button>
              )}
            </motion.div>

            {/* Subtítulo con mejor contraste */}
            <motion.p 
              variants={itemVariants}
              className="text-lg md:text-xl text-neutral-100 max-w-2xl mx-auto leading-relaxed drop-shadow-sm"
            >
              Estamos preparando la nueva experiencia de arriendo 0% comisión. Sin letra chica.
            </motion.p>

            {/* Sección de beneficios de la promoción con efectos glass mejorados */}
            <motion.div 
              variants={itemVariants}
              className="relative bg-white/5 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-white/10 hover:bg-white/8 transition-colors duration-200"
            >
              {/* Glass effect overlay */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-200" />
              
              <div className="relative z-10">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
                  🎉 ¡Ahorra hasta $500.000 en comisiones!
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-brand-aqua flex-shrink-0" />
                      <span className="text-neutral-100">0% comisión de corretaje</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-brand-aqua flex-shrink-0" />
                      <span className="text-neutral-100">Proceso 100% digital</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-brand-aqua flex-shrink-0" />
                      <span className="text-neutral-100">Edificios premium verificados</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-brand-aqua flex-shrink-0" />
                      <span className="text-neutral-100">Soporte personalizado 24/7</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-brand-aqua flex-shrink-0" />
                      <span className="text-neutral-100">Sin letra chica ni sorpresas</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-brand-aqua flex-shrink-0" />
                      <span className="text-neutral-100">Reserva sin compromiso</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-brand-violet/20 to-brand-aqua/20 rounded-2xl backdrop-blur-sm border border-white/10">
                  <div className="flex items-center justify-center space-x-2 text-white font-semibold">
                    <DollarSign className="w-5 h-5" />
                    <span>Ejemplo: Arriendo $800.000 → Ahorras $400.000 en comisión</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Grid de iconos con spacing ajustado */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-md mx-auto"
            >
              {icons.map(({ Icon, label }, index) => (
                <motion.div
                  key={index}
                  variants={iconVariants}
                  whileHover={{ 
                    y: prefersReducedMotion ? 0 : -4,
                    scale: prefersReducedMotion ? 1 : 1.05,
                  }}
                  transition={{ duration: 0.2 }}
                  className="group relative"
                  tabIndex={0}
                  role="button"
                  aria-label={label}
                >
                  <div className="relative p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/8 transition-colors duration-200">
                    <Icon 
                      className="w-8 h-8 text-brand-violet mb-2" 
                      aria-hidden="true"
                    />
                    <span className="text-sm text-neutral-100 font-medium block">
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
                className="inline-flex items-center px-8 py-4 text-lg font-semibold rounded-2xl bg-gradient-to-r from-brand-violet to-brand-aqua text-white shadow-lg shadow-violet-500/20 hover:shadow-xl hover:shadow-violet-500/30 transition-all duration-200 focus-ring"
                aria-label="Avísame cuando esté listo"
              >
                <Zap className="w-5 h-5 mr-2" />
                Avísame cuando esté listo
              </motion.button>

              {/* CTA WhatsApp */}
              <motion.button
                onClick={handleWhatsAppClick}
                className="inline-flex items-center px-8 py-4 text-lg font-semibold rounded-2xl bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20 hover:shadow-xl hover:shadow-green-600/30 transition-all duration-200 focus-ring"
                aria-label="Hablá con nosotros por WhatsApp"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Hablá con nosotros
              </motion.button>
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
            animation: gradientShift 8s ease-in-out infinite;
          }
        `}</style>
      </section>
    </MotionConfig>
  );
}
