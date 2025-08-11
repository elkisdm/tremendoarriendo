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
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Muy pronto</h1>
        <p className="text-xl">Estamos preparando la nueva experiencia de arriendo 0% comisión</p>
      </div>
    </div>
  );
}
