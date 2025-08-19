'use client';

import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { clx } from '@lib/utils';

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

        {/* Navigation and Actions */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
