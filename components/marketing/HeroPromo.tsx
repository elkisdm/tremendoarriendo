"use client";
import { useEffect, useState } from "react";
import { PromotionBadge } from "../PromotionBadge";

// Lazy holders for framer-motion APIs
let Motion: typeof import("framer-motion");
let motion: any;
let MotionConfig: any;

async function ensureMotion() {
  if (!Motion) {
    Motion = await import("framer-motion");
    motion = Motion.motion;
    MotionConfig = Motion.MotionConfig;
  }
}

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
            id="grid"
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
        <rect width="100%" height="100%" fill="url(#grid)" />
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
            id="hex"
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
        <rect width="100%" height="100%" fill="url(#hex)" />
      </svg>
    </div>
  );
}

// Componente para partículas sutiles con parallax
function FloatingParticles({ prefersReducedMotion }: { prefersReducedMotion: boolean }) {
  if (prefersReducedMotion) return null;

  const particles = [
    { id: 1, x: "10%", y: "20%", size: "4", delay: 0 },
    { id: 2, x: "85%", y: "15%", size: "6", delay: 0.5 },
    { id: 3, x: "15%", y: "80%", size: "3", delay: 1 },
    { id: 4, x: "80%", y: "75%", size: "5", delay: 1.5 },
    { id: 5, x: "50%", y: "10%", size: "4", delay: 2 },
    { id: 6, x: "25%", y: "60%", size: "3", delay: 2.5 },
    { id: 7, x: "70%", y: "40%", size: "5", delay: 3 },
    { id: 8, x: "90%", y: "60%", size: "4", delay: 3.5 },
  ];

  if (!motion) return null;

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

// Componente para icon grid con efectos glass
function IconGrid() {
  if (!motion) return null;

  const icons = [
    { icon: "🏠", label: "Sin comisión" },
    { icon: "📅", label: "Agenda fácil" },
    { icon: "💰", label: "Precios claros" },
    { icon: "✅", label: "Sin letra chica" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
      {icons.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.2 + index * 0.1,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="group relative"
        >
          <div className="relative p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/8 transition-colors duration-200">
            <div className="text-2xl mb-2">{item.icon}</div>
            <div className="text-sm font-medium text-white/90">{item.label}</div>
            {/* Glass effect overlay */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function HeroPromo() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

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

  const handleExploreClick = () => {
    const listadoElement = document.getElementById("listado");
    if (listadoElement) {
      listadoElement.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    }
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
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  } as const;

  const badgeVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  } as const;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 md:p-10">
      <BackgroundPattern />
      {motion && MotionConfig ? (
        <MotionConfig reducedMotion={prefersReducedMotion ? "user" : "never"}>
          <div className="relative z-10">
            <div className="flex flex-col gap-6">
              <div>
                <div className="inline-flex items-center gap-2">
                  <PromotionBadge />
                </div>
                <h1 className="mt-3 text-3xl md:text-5xl font-extrabold tracking-tight">
                  Arrienda con 0% de comisión
                </h1>
                <p className="mt-2 text-[var(--subtext)] max-w-xl">
                  Compara, filtra y agenda visitas sin costo. Transparente, rápido y 100% digital.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleExploreClick}
                  className="rounded-xl px-4 py-2 text-sm font-medium text-white shadow bg-[radial-gradient(120%_120%_at_30%_10%,#8B6CFF_0%,#6D4AFF_40%,#5233D3_100%)] ring-1 ring-[var(--ring)] hover:brightness-110"
                >
                  Explorar propiedades
                </button>
              </div>
            </div>
          </div>

          <FloatingParticles prefersReducedMotion={prefersReducedMotion} />
          <div className="mt-8">
            <IconGrid />
          </div>
        </MotionConfig>
      ) : (
        // Static fallback while motion is loading
        <div className="relative z-10">
          <div className="flex flex-col gap-6">
            <div>
              <div className="inline-flex items-center gap-2">
                <PromotionBadge />
              </div>
              <h1 className="mt-3 text-3xl md:text-5xl font-extrabold tracking-tight">
                Arrienda con 0% de comisión
              </h1>
              <p className="mt-2 text-[var(--subtext)] max-w-xl">
                Compara, filtra y agenda visitas sin costo. Transparente, rápido y 100% digital.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleExploreClick}
                className="rounded-xl px-4 py-2 text-sm font-medium text-white shadow bg-[radial-gradient(120%_120%_at_30%_10%,#8B6CFF_0%,#6D4AFF_40%,#5233D3_100%)] ring-1 ring-[var(--ring)] hover:brightness-110"
              >
                Explorar propiedades
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
