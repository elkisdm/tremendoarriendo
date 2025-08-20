'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MessageCircle, Mail, ChevronDown } from 'lucide-react';

export function ContactDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleWhatsApp = () => {
    const message = encodeURIComponent('Hola! Me interesa saber más sobre los departamentos disponibles.');
    window.open(`https://wa.me/56993481594?text=${message}`, '_blank');
    setIsOpen(false);
  };

  const handleCall = () => {
    window.open('tel:+56993481594', '_self');
    setIsOpen(false);
  };

  const handleContactModal = () => {
    // Disparar evento personalizado para abrir el modal
    window.dispatchEvent(new CustomEvent('openContactModal'));
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botón principal */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-ring to-ring/80 hover:from-ring/90 hover:to-ring/70 text-white px-4 py-2 text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-ring/25 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-bg"
        aria-label="Abrir opciones de contacto"
        aria-expanded={isOpen}
      >
        <MessageCircle className="w-4 h-4" />
        Contacto
        <ChevronDown 
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Dropdown tipo abanico */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 top-full mt-2 w-64 origin-top-right"
          >
            {/* Contenido del dropdown */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              
              {/* Opción WhatsApp */}
              <button
                onClick={handleWhatsApp}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors duration-150 group"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center group-hover:bg-green-600 transition-colors">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 dark:text-white">WhatsApp</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Chat directo</div>
                </div>
              </button>

              {/* Opción Llamada */}
              <button
                onClick={handleCall}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-150 group border-t border-gray-100 dark:border-gray-700"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 dark:text-white">Llamar</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">+56 9 9348 1594</div>
                </div>
              </button>

              {/* Opción Contacto Modal */}
              <button
                onClick={handleContactModal}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors duration-150 group border-t border-gray-100 dark:border-gray-700"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center group-hover:bg-purple-600 transition-colors">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 dark:text-white">Contacto</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Formulario</div>
                </div>
              </button>
            </div>

            {/* Flecha del dropdown */}
            <div className="absolute -top-2 right-4 w-4 h-4 bg-white dark:bg-gray-800 border-l border-t border-gray-200 dark:border-gray-700 transform rotate-45"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
