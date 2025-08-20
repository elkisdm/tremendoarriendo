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

      {/* Dropdown minimalista */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 top-full mt-1 w-56 origin-top-right"
          >
            {/* Contenido del dropdown */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              
              {/* Opción WhatsApp */}
              <button
                onClick={handleWhatsApp}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150"
              >
                <MessageCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white text-sm">WhatsApp</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Chat directo</div>
                </div>
              </button>

              {/* Opción Llamada */}
              <button
                onClick={handleCall}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150 border-t border-gray-100 dark:border-gray-700"
              >
                <Phone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white text-sm">Llamar</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">+56 9 9348 1594</div>
                </div>
              </button>

              {/* Opción Contacto Modal */}
              <button
                onClick={handleContactModal}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150 border-t border-gray-100 dark:border-gray-700"
              >
                <Mail className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white text-sm">Contacto</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Formulario</div>
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
