'use client';

import { MotionConfig, useReducedMotion, m } from 'framer-motion';
import { Sparkles, ShieldCheck, Building2, Clock } from 'lucide-react';

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
              className="text-white/20"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-coming-soon)" />
      </svg>

      {/* Hex pattern SVG */}
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
            height="20"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(30)"
          >
            <polygon
              points="10,1 19,5.5 19,14.5 10,19 1,14.5 1,5.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.3"
              className="text-white/30"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hex-coming-soon)" />
      </svg>
    </div>
  );
}

// Componente para partículas sutiles
function FloatingParticles() {
  const reduce = useReducedMotion();
  
  if (reduce) return null;

  const particles = [
    { x: '10%', y: '20%', size: 'w-2 h-2', delay: 0 },
    { x: '85%', y: '15%', size: 'w-1 h-1', delay: 0.5 },
    { x: '15%', y: '80%', size: 'w-1.5 h-1.5', delay: 1 },
    { x: '90%', y: '70%', size: 'w-1 h-1', delay: 1.5 },
    { x: '50%', y: '10%', size: 'w-1 h-1', delay: 2 },
    { x: '70%', y: '90%', size: 'w-2 h-2', delay: 2.5 },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle, index) => (
        <m.div
          key={index}
          className={`absolute ${particle.size} bg-gradient-to-r from-brand-violet/30 to-brand-aqua/30 rounded-full blur-sm`}
          style={{
            left: particle.x,
            top: particle.y,
          }}
          animate={{
            y: [0, -10, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

export default function ComingSoonPage() {
  const reduce = useReducedMotion();
  const base = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };
  const t = { duration: 0.45, ease: [0.22, 1, 0.36, 1] };

  return (
    <MotionConfig reducedMotion="user">
      <section className="relative isolate min-h-[70vh] flex items-center">
        {/* Background patterns */}
        <BackgroundPattern />
        <FloatingParticles />
        
        {/* Gradient overlay */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-violet-900/40 via-fuchsia-700/25 to-cyan-700/30" />
        
        <div className="mx-auto max-w-3xl px-4 text-center">
          <m.div {...(!reduce ? { ...base, transition: { ...t, delay: 0.05 } } : {})}>
            <span className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 backdrop-blur text-white/90">
              <Sparkles className="size-4" aria-hidden />
              Próximamente
            </span>
          </m.div>

          <m.h1
            className="mt-4 text-4xl md:text-6xl font-extrabold leading-tight bg-clip-text text-transparent
                       bg-gradient-to-r from-[--brand-violet,#7C3AED] via-fuchsia-400 to-[--brand-aqua,#22D3EE]"
            {...(!reduce ? { ...base, transition: { ...t, delay: 0.1 } } : {})}
          >
            Muy pronto: Arriendo 0% comisión
          </m.h1>

          <m.p
            className="mt-4 text-lg md:text-xl text-white/80"
            {...(!reduce ? { ...base, transition: { ...t, delay: 0.15 } } : {})}
          >
            Experiencia simple, transparente y <strong>sin letra chica</strong>.
          </m.p>

          <m.div
            className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left"
            {...(!reduce ? { ...base, transition: { ...t, delay: 0.2 } } : {})}
          >
            {[
              { icon: ShieldCheck, title: '0% comisión', desc: 'Sin costos ocultos.' },
              { icon: Building2,  title: 'Stock verificado', desc: 'Disponibilidad actualizada.' },
              { icon: Clock,      title: 'Agenda fácil', desc: 'WhatsApp o web.' },
              { icon: Sparkles,   title: 'Sin letra chica', desc: 'Condiciones claras.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4 flex items-start gap-3 hover:bg-white/8 transition-colors">
                <Icon className="size-5 text-white/90" aria-hidden />
                <div>
                  <p className="font-semibold text-white">{title}</p>
                  <p className="text-white/70 text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </m.div>
        </div>
      </section>
    </MotionConfig>
  );
}
