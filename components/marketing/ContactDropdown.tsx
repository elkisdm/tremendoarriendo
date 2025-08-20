'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MessageCircle, Mail, ChevronDown } from 'lucide-react';

export function ContactDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Manejar hover con delay para evitar parpadeo
  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150); // Pequeño delay para evitar que se cierre al mover el mouse
  };

  // Cleanup del timeout al desmontar
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleWhatsApp = () => {
    const message = encodeURIComponent('Hola! Me interesa saber más sobre los departamentos disponibles.');
    window.open(`https://wa.me/56993481594?text=${message}`, '_blank');
  };

  const handleCall = () => {
    window.open('tel:+56993481594', '_self');
  };

  const handleContactModal = () => {
    // Disparar evento personalizado para abrir el modal
    window.dispatchEvent(new CustomEvent('openContactModal'));
  };

  return (
    <div 
      className="relative" 
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Botón principal */}
      <button
        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900"
        aria-label="Opciones de contacto"
        aria-expanded={isOpen}
      >
        <MessageCircle className="w-4 h-4" />
        Contacto
        <ChevronDown 
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Abanico Glassmorphism Premium */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateX: -15 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotateX: -15 }}
            transition={{ 
              duration: 0.3, 
              ease: [0.25, 0.46, 0.45, 0.94],
              staggerChildren: 0.1
            }}
            className="absolute right-0 top-full mt-3 w-72 origin-top-right perspective-1000"
          >
            {/* Fondo con blur y transparencia */}
            <div className="relative">
              {/* Efecto de brillo superior */}
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gradient-to-b from-white/40 to-transparent rounded-full blur-sm"></div>
              
              {/* Contenedor principal glassmorphism */}
              <div className="relative bg-white/10 dark:bg-gray-900/10 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/30 shadow-2xl overflow-hidden">
                {/* Overlay de brillo */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent"></div>
                
                {/* Contenido del abanico */}
                <div className="relative p-2 space-y-1">
                  
                  {/* Opción WhatsApp */}
                  <motion.button
                    initial={{ opacity: 0, x: -20, rotateY: -15 }}
                    animate={{ opacity: 1, x: 0, rotateY: 0 }}
                    exit={{ opacity: 0, x: -20, rotateY: -15 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    onClick={handleWhatsApp}
                    className="group w-full flex items-center gap-4 p-3 rounded-xl bg-gradient-to-r from-green-500/10 to-green-600/10 hover:from-green-500/20 hover:to-green-600/20 border border-green-500/20 hover:border-green-500/40 transition-all duration-300 backdrop-blur-sm"
                  >
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-green-500/25 transition-all duration-300">
                        <MessageCircle className="w-5 h-5 text-white" />
                      </div>
                      {/* Brillo del icono */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 dark:text-white text-sm">WhatsApp</div>
                      <div className="text-xs text-gray-600 dark:text-gray-300">Chat directo</div>
                    </div>
                    {/* Indicador de hover */}
                    <div className="w-2 h-2 bg-green-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 scale-0 group-hover:scale-100"></div>
                  </motion.button>

                  {/* Opción Llamada */}
                  <motion.button
                    initial={{ opacity: 0, x: -20, rotateY: -15 }}
                    animate={{ opacity: 1, x: 0, rotateY: 0 }}
                    exit={{ opacity: 0, x: -20, rotateY: -15 }}
                    transition={{ duration: 0.2, ease: "easeOut", delay: 0.05 }}
                    onClick={handleCall}
                    className="group w-full flex items-center gap-4 p-3 rounded-xl bg-gradient-to-r from-blue-500/10 to-blue-600/10 hover:from-blue-500/20 hover:to-blue-600/20 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 backdrop-blur-sm"
                  >
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
                        <Phone className="w-5 h-5 text-white" />
                      </div>
                      {/* Brillo del icono */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 dark:text-white text-sm">Llamar</div>
                      <div className="text-xs text-gray-600 dark:text-gray-300">+56 9 9348 1594</div>
                    </div>
                    {/* Indicador de hover */}
                    <div className="w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 scale-0 group-hover:scale-100"></div>
                  </motion.button>

                  {/* Opción Contacto Modal */}
                  <motion.button
                    initial={{ opacity: 0, x: -20, rotateY: -15 }}
                    animate={{ opacity: 1, x: 0, rotateY: 0 }}
                    exit={{ opacity: 0, x: -20, rotateY: -15 }}
                    transition={{ duration: 0.2, ease: "easeOut", delay: 0.1 }}
                    onClick={handleContactModal}
                    className="group w-full flex items-center gap-4 p-3 rounded-xl bg-gradient-to-r from-purple-500/10 to-purple-600/10 hover:from-purple-500/20 hover:to-purple-600/20 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 backdrop-blur-sm"
                  >
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300">
                        <Mail className="w-5 h-5 text-white" />
                      </div>
                      {/* Brillo del icono */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 dark:text-white text-sm">Contacto</div>
                      <div className="text-xs text-gray-600 dark:text-gray-300">Formulario</div>
                    </div>
                    {/* Indicador de hover */}
                    <div className="w-2 h-2 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 scale-0 group-hover:scale-100"></div>
                  </motion.button>
                </div>
              </div>

              {/* Flecha del abanico con glassmorphism */}
              <div className="absolute -top-2 right-6 w-4 h-4 bg-white/10 dark:bg-gray-900/10 backdrop-blur-xl border-l border-t border-white/20 dark:border-gray-700/30 transform rotate-45"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
