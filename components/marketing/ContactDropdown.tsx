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

      {/* Abanico de Paleta de Colores */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.3, rotateZ: -45 }}
            animate={{ opacity: 1, scale: 1, rotateZ: 0 }}
            exit={{ opacity: 0, scale: 0.3, rotateZ: -45 }}
            transition={{ 
              duration: 0.4, 
              ease: [0.34, 1.56, 0.64, 1],
              type: "spring",
              stiffness: 200,
              damping: 20
            }}
            className="absolute right-0 top-full mt-2 origin-bottom-right"
          >
            {/* Contenedor del abanico */}
            <div className="relative flex flex-col items-end space-y-2">
              
              {/* Opción WhatsApp - Primera paleta */}
              <motion.button
                initial={{ x: -60, rotateZ: -30, opacity: 0 }}
                animate={{ x: 0, rotateZ: 0, opacity: 1 }}
                exit={{ x: -60, rotateZ: -30, opacity: 0 }}
                transition={{ 
                  duration: 0.3, 
                  delay: 0.1,
                  ease: [0.34, 1.56, 0.64, 1]
                }}
                onClick={handleWhatsApp}
                className="group flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-green-500 to-green-600 rounded-full shadow-lg hover:shadow-xl hover:shadow-green-500/30 transition-all duration-300 hover:scale-105 hover:-translate-y-1"
              >
                <MessageCircle className="w-4 h-4 text-white" />
                <span className="text-white text-sm font-medium whitespace-nowrap">WhatsApp</span>
              </motion.button>

              {/* Opción Llamada - Segunda paleta */}
              <motion.button
                initial={{ x: -40, rotateZ: -20, opacity: 0 }}
                animate={{ x: 0, rotateZ: 0, opacity: 1 }}
                exit={{ x: -40, rotateZ: -20, opacity: 0 }}
                transition={{ 
                  duration: 0.3, 
                  delay: 0.2,
                  ease: [0.34, 1.56, 0.64, 1]
                }}
                onClick={handleCall}
                className="group flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-lg hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105 hover:-translate-y-1"
              >
                <Phone className="w-4 h-4 text-white" />
                <span className="text-white text-sm font-medium whitespace-nowrap">Llamar</span>
              </motion.button>

              {/* Opción Contacto Modal - Tercera paleta */}
              <motion.button
                initial={{ x: -20, rotateZ: -10, opacity: 0 }}
                animate={{ x: 0, rotateZ: 0, opacity: 1 }}
                exit={{ x: -20, rotateZ: -10, opacity: 0 }}
                transition={{ 
                  duration: 0.3, 
                  delay: 0.3,
                  ease: [0.34, 1.56, 0.64, 1]
                }}
                onClick={handleContactModal}
                className="group flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full shadow-lg hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105 hover:-translate-y-1"
              >
                <Mail className="w-4 h-4 text-white" />
                <span className="text-white text-sm font-medium whitespace-nowrap">Contacto</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
