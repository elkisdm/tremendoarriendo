'use client';

import { clx } from '@lib/utils';
import { ThemeToggle } from '@components/ui/ThemeToggle';
import { ContactDropdown } from './ContactDropdown';
import { Heart, Bell, User, Search, Menu, MapPin, Phone } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-lg shadow-black/5">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo y Branding */}
          <div className="flex items-center space-x-8">
            <a 
              href="/" 
              className="flex items-center space-x-3 group"
              aria-label="Ir al inicio"
            >
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-all duration-300 group-hover:scale-105">
                  <span className="text-xl font-black text-white tracking-tight">E</span>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent tracking-tight">
                  Elkis Realtor
                </span>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider uppercase">
                  Propiedades Premium
                </span>
              </div>
            </a>

            {/* Navegación Principal */}
            <nav className="hidden lg:flex items-center space-x-8">
              <a 
                href="/property" 
                className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 relative group"
              >
                Propiedades
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a 
                href="/arrienda-sin-comision" 
                className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 relative group"
              >
                Sin Comisión
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a 
                href="/cotizador" 
                className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 relative group"
              >
                Cotizador
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a 
                href="/mi-bio" 
                className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 relative group"
              >
                Sobre Mí
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
              </a>
            </nav>
          </div>

          {/* Acciones y Controles */}
          <div className="flex items-center space-x-4">
            {/* Botón de búsqueda */}
            <button 
              className="p-3 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-200 group"
              aria-label="Buscar propiedades"
            >
              <Search className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
            </button>

            {/* Botón de favoritos */}
            <button 
              className="p-3 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200 group relative"
              aria-label="Ver favoritos"
            >
              <Heart className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Notificaciones */}
            <button 
              className="p-3 text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-xl transition-all duration-200 group relative"
              aria-label="Notificaciones"
            >
              <Bell className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
            </button>

            {/* Theme Toggle */}
            <div className="p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
              <ThemeToggle />
            </div>
            
            {/* Perfil de usuario */}
            <button 
              className="p-3 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-xl transition-all duration-200 group"
              aria-label="Mi perfil"
            >
              <User className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
            </button>
            
            {/* Dropdown de contacto */}
            <div className="p-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg shadow-blue-500/25">
              <ContactDropdown />
            </div>

            {/* Menú móvil */}
            <button 
              className="lg:hidden p-3 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-200 group"
              aria-label="Menú principal"
            >
              <Menu className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
            </button>
          </div>
        </div>

        {/* Información de contacto rápida */}
        <div className="hidden lg:flex items-center justify-center mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span className="font-medium">Santiago, Chile</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
              <Phone className="w-4 h-4 text-green-600" />
              <span className="font-medium">+56 9 1234 5678</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-green-600 font-semibold">Disponible 24/7</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
