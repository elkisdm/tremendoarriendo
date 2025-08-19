'use client';

import { clx } from '@lib/utils';
import { ThemeToggle } from '@components/ui/ThemeToggle';

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-soft/50 bg-bg/80 backdrop-blur-sm">
      <div className="container-page flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <a 
            href="/" 
            className="flex items-center gap-2 text-xl font-bold text-text hover:text-ring transition-colors"
            aria-label="Ir al inicio"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-ring to-ring/80">
              <span className="text-sm font-bold text-white">H</span>
            </div>
            <span>Hommie</span>
          </a>
        </div>

        {/* Navegación y controles */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <ThemeToggle />
          
          {/* Botón de contacto */}
          <a 
            href="/coming-soon" 
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-ring to-ring/80 hover:from-ring/90 hover:to-ring/70 text-white px-4 py-2 text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-ring/25 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-bg"
          >
            Contacto
          </a>
        </div>
      </div>
    </header>
  );
}
