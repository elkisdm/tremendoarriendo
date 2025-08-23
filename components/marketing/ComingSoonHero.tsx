"use client";
import { useEffect, useState, useRef } from "react";
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
  // CheckCircle,
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

let Motion: typeof import("framer-motion") | null = null;
let motion: any = null;
let MotionConfig: any = null;

async function ensureMotion() {
  if (!Motion) {
    Motion = await import("framer-motion");
    motion = Motion.motion;
    MotionConfig = Motion.MotionConfig;
  }
}

export function ComingSoonHero() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const triggerButtonRef = useRef<HTMLButtonElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    ensureMotion();
  }, []);

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
  } as const;

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
  } as const;

  const iconVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  } as const;

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
  } as const;

  const icons = [
    { Icon: ShieldCheck, label: "Seguridad garantizada" },
    { Icon: Sparkles, label: "Experiencia premium" },
    { Icon: Clock, label: "Proceso rápido" },
    { Icon: Building, label: "Edificios exclusivos" },
    { Icon: MessageCircle, label: "Soporte 24/7" },
  ];

  return (
    <div className="relative min-h-[70vh] flex items-center overflow-hidden bg-transparent">
      {/* Contenido principal */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center pt-20 pb-16 md:pb-24">
        {motion && MotionConfig ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Título principal con gradiente violeta→aqua y tipografía headline */}
            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[--brand-violet,#7C3AED] via-fuchsia-400 to-[--brand-aqua,#22D3EE] drop-shadow-sm"
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
              className="text-sm text-slate-300 max-w-lg mx-auto leading-relaxed"
            >
              Arriendos desde $210.000 pesos. Sin costos ocultos ni sorpresas.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4 mt-6"
            >
              <motion.button
                ref={triggerButtonRef}
                onClick={handleWaitlistClick}
                className="rounded-2xl px-6 py-3 font-semibold bg-gradient-to-r from-[--brand-violet,#7C3AED] to-[--brand-aqua,#22D3EE] text-white shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-400/40 hover:shadow-xl transition-all duration-200 min-h-[44px] flex items-center justify-center"
                aria-label="Notificarme cuando esté listo"
              >
                Notificarme
              </motion.button>

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

            {/* Subtítulo */}
            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-slate-100 max-w-2xl mx-auto leading-relaxed drop-shadow-sm"
            >
              Estamos preparando la nueva experiencia de arriendo 0% comisión. Sin letra chica.
            </motion.p>

            {/* Beneficios */}
            <div className="relative bg-white/5 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-white/10 hover:bg-white/8 transition-colors duration-200">
              <div className="relative z-10">
                <h2 className="text-xl md:text-2xl font-bold text-slate-100 mb-6 text-center">
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
                    >
                      <div className="flex flex-col items-center text-center space-y-3 h-full">
                        <Icon className="size-5 text-white/90" aria-hidden="true" />
                        <span className="text-sm text-slate-100 font-medium leading-tight">
                          {text}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-brand-violet/20 to-brand-aqua/20 rounded-2xl backdrop-blur-sm border border-white/10">
                  <div className="flex items-center justify-center space-x-2 text-slate-100 font-semibold text-center">
                    <DollarSign className="w-5 h-5" />
                    <span>Ejemplo: Arriendo $500.000 → Ahorras $297.500 en comisión (incluye IVA)</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          // Static fallback while motion loads
          <div className="space-y-8">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[--brand-violet,#7C3AED] via-fuchsia-400 to-[--brand-aqua,#22D3EE] drop-shadow-sm">
              Próximamente
            </h1>
            <PromoBadge />
            <p className="text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
              Arriendos desde $210.000 pesos. Sin costos ocultos ni sorpresas.
            </p>

            {/* CTAs - Static version */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4 mt-6">
              <button
                onClick={handleWaitlistClick}
                className="rounded-2xl px-6 py-3 font-semibold bg-gradient-to-r from-[--brand-violet,#7C3AED] to-[--brand-aqua,#22D3EE] text-white shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-400/40 hover:shadow-xl transition-all duration-200 min-h-[44px] flex items-center justify-center"
                aria-label="Notificarme cuando esté listo"
              >
                Notificarme
              </button>

              {(() => {
                const waUrl = buildWhatsAppUrl({
                  message: "Hola, me interesa el lanzamiento"
                });
                return waUrl ? (
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => track('cta_whatsapp_click', { source: 'coming-soon' })}
                    className="rounded-2xl px-6 py-3 font-semibold bg-green-600 hover:bg-green-700 text-white shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-400/40 hover:shadow-xl transition-all duration-200 min-h-[44px] flex items-center justify-center"
                    aria-label="Contactar por WhatsApp"
                  >
                    WhatsApp
                  </a>
                ) : (
                  <button
                    aria-disabled="true"
                    title="Configura WhatsApp en Vercel"
                    className="rounded-2xl px-6 py-3 font-semibold bg-gray-500 text-white shadow-lg cursor-not-allowed opacity-50 min-h-[44px] flex items-center justify-center"
                  >
                    WhatsApp
                  </button>
                );
              })()}
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal open={modalOpen} onClose={handleModalClose} title="Notificarme cuando esté listo">
        <WaitlistForm initialFocusRef={emailInputRef} />
      </Modal>
    </div>
  );
}
