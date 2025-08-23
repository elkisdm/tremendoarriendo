'use client';

import { clx } from '@lib/utils';
import { ThemeToggle } from '@components/ui/ThemeToggle';
import { ContactDropdown } from './ContactDropdown';
import { Heart, Bell, User, Search, Menu } from 'lucide-react';

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

        {/* Navegación central - Oculto en móvil */}
        <nav className="hidden md:flex items-center gap-6">
          <a href="/property" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Propiedades
          </a>
          <a href="/arrienda-sin-comision" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Sin Comisión
          </a>
          <a href="/cotizador" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Cotizador
          </a>
          <a href="/mi-bio" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Sobre Mí
          </a>
        </nav>

        {/* Navegación y controles */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Botón de búsqueda */}
          <button
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
            aria-label="Buscar propiedades"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Botón de favoritos */}
          <button
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
            aria-label="Ver favoritos"
          >
            <Heart className="w-4 h-4" />
          </button>

          {/* Notificaciones */}
          <button
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors relative"
            aria-label="Notificaciones"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Perfil de usuario */}
          <button
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
            aria-label="Mi perfil"
          >
            <User className="w-4 h-4" />
          </button>

          {/* Dropdown de contacto */}
          <ContactDropdown />

          {/* Menú móvil */}
          <button
            className="md:hidden p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
            aria-label="Menú principal"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
