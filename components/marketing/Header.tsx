'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clx } from '@lib/utils';
import { ThemeToggle } from '@components/ui/ThemeToggle';
import { ContactDropdown } from './ContactDropdown';
import { Heart, Bell, User, Search, Menu, X } from 'lucide-react';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Cerrar menú al cambiar tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevenir scroll del body cuando el menú está abierto
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Manejar tecla Escape para cerrar menú
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-lg shadow-black/5">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-2 lg:py-4">
        <div className="flex items-center justify-between max-w-none">
          {/* Logo y Branding */}
          <div className="flex items-center space-x-6 lg:space-x-8 xl:space-x-12">
            <a
              href="/"
              className="flex items-center space-x-3 group"
              aria-label="Ir al inicio"
            >
              <div className="relative">
                <div className="w-8 h-8 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-all duration-300 group-hover:scale-105">
                  <span className="text-sm lg:text-xl font-black text-white tracking-tight">E</span>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-xl lg:rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg lg:text-2xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent tracking-tight">
                  Elkis Realtor
                </span>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider uppercase hidden sm:block">
                  Propiedades Premium
                </span>
              </div>
            </a>

            {/* Navegación Principal */}
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
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
          <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-3 xl:space-x-4">
            {/* Botón de búsqueda */}
            <button
              className="hidden sm:block p-2 lg:p-3 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg lg:rounded-xl transition-all duration-200 group"
              aria-label="Buscar propiedades"
            >
              <Search className="w-4 h-4 lg:w-5 lg:h-5 group-hover:scale-110 transition-transform duration-200" />
            </button>

            {/* Botón de favoritos */}
            <button
              className="hidden sm:block p-2 lg:p-3 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg lg:rounded-xl transition-all duration-200 group relative"
              aria-label="Ver favoritos"
            >
              <Heart className="w-4 h-4 lg:w-5 lg:h-5 group-hover:scale-110 transition-transform duration-200" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Notificaciones */}
            <button
              className="hidden sm:block p-2 lg:p-3 text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg lg:rounded-xl transition-all duration-200 group relative"
              aria-label="Notificaciones"
            >
              <Bell className="w-4 h-4 lg:w-5 lg:h-5 group-hover:scale-110 transition-transform duration-200" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
            </button>

            {/* Theme Toggle */}
            <div className="p-1 bg-gray-100 dark:bg-gray-800 rounded-lg lg:rounded-xl">
              <ThemeToggle />
            </div>

            {/* Perfil de usuario */}
            <button
              className="hidden sm:block p-2 lg:p-3 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg lg:rounded-xl transition-all duration-200 group"
              aria-label="Mi perfil"
            >
              <User className="w-4 h-4 lg:w-5 lg:h-5 group-hover:scale-110 transition-transform duration-200" />
            </button>

            {/* Dropdown de contacto */}
            <div className="p-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg lg:rounded-xl shadow-lg shadow-blue-500/25">
              <ContactDropdown />
            </div>

            {/* Menú móvil */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 lg:p-3 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg lg:rounded-xl transition-all duration-200 group"
              aria-label={isMobileMenuOpen ? "Cerrar menú principal" : "Abrir menú principal"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <motion.div
                animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {isMobileMenuOpen ? (
                  <X className="w-4 h-4 lg:w-5 lg:h-5 group-hover:scale-110 transition-transform duration-200" />
                ) : (
                  <Menu className="w-4 h-4 lg:w-5 lg:h-5 group-hover:scale-110 transition-transform duration-200" />
                )}
              </motion.div>
            </button>
          </div>
        </div>
      </div>

      {/* Drawer Móvil */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={toggleMobileMenu}
              aria-hidden="true"
            />

            {/* Drawer */}
            <motion.div
              id="mobile-menu"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30 
              }}
              className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white dark:bg-gray-900 shadow-2xl z-50 lg:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Menú de navegación móvil"
            >
              {/* Header del drawer */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-xl flex items-center justify-center">
                    <span className="text-sm font-black text-white">E</span>
                  </div>
                  <span className="text-lg font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent">
                    Elkis Realtor
                  </span>
                </div>
                <button
                  onClick={toggleMobileMenu}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                  aria-label="Cerrar menú"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navegación móvil */}
              <nav className="p-4 space-y-2" role="navigation" aria-label="Navegación principal">
                <a
                  href="/property"
                  className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-200 font-medium"
                  onClick={toggleMobileMenu}
                >
                  Propiedades
                </a>
                <a
                  href="/arrienda-sin-comision"
                  className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-200 font-medium"
                  onClick={toggleMobileMenu}
                >
                  Sin Comisión
                </a>
                <a
                  href="/cotizador"
                  className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-200 font-medium"
                  onClick={toggleMobileMenu}
                >
                  Cotizador
                </a>
                <a
                  href="/mi-bio"
                  className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-200 font-medium"
                  onClick={toggleMobileMenu}
                >
                  Sobre Mí
                </a>
              </nav>

              {/* Acciones móviles */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                <div className="flex items-center justify-between px-4 py-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Tema</span>
                  <ThemeToggle />
                </div>
                
                <button className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200">
                  <User className="w-4 h-4 mr-2" />
                  Mi Perfil
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
