'use client';

import { clx } from '@lib/utils';
import { ThemeToggle } from '@components/ui/ThemeToggle';
import { ContactDropdown } from './ContactDropdown';

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
              <span className="text-sm font-bold text-white">E</span>
            </div>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold">Elkis Realtor</span>
          </a>
        </div>

        {/* Navegación y controles */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <ThemeToggle />
          
          {/* Dropdown de contacto */}
          <ContactDropdown />
        </div>
      </div>
    </header>
  );
}
