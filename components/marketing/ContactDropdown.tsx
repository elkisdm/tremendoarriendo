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
    }, 100); // Delay reducido para mayor fluidez
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
      {/* Botón principal con feedback visual */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900"
        aria-label="Opciones de contacto"
        aria-expanded={isOpen}
      >
        <MessageCircle className="w-4 h-4" />
        Contacto
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.button>

      {/* Abanico de Paleta de Colores Mejorado */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.4, rotateZ: -30 }}
            animate={{ opacity: 1, scale: 1, rotateZ: 0 }}
            exit={{ opacity: 0, scale: 0.4, rotateZ: -30 }}
            transition={{ 
              duration: 0.35, 
              ease: [0.25, 0.46, 0.45, 0.94],
              type: "spring",
              stiffness: 300,
              damping: 25
            }}
            className="absolute right-0 top-full mt-3 origin-bottom-right"
          >
            {/* Contenedor del abanico con espaciado natural */}
            <div className="relative flex flex-col items-end space-y-1.5">
              
              {/* Opción WhatsApp - Primera paleta */}
              <motion.button
                initial={{ x: -50, rotateZ: -25, opacity: 0, scale: 0.8 }}
                animate={{ x: 0, rotateZ: 0, opacity: 1, scale: 1 }}
                exit={{ x: -50, rotateZ: -25, opacity: 0, scale: 0.8 }}
                transition={{ 
                  duration: 0.25, 
                  delay: 0.05,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -2,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.95 }}
                onClick={handleWhatsApp}
                className="group flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-green-500 to-green-600 rounded-full shadow-lg hover:shadow-xl hover:shadow-green-500/30 transition-all duration-200"
              >
                <motion.div
                  whileHover={{ rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <MessageCircle className="w-4 h-4 text-white" />
                </motion.div>
                <span className="text-white text-sm font-medium whitespace-nowrap">WhatsApp</span>
              </motion.button>

              {/* Opción Llamada - Segunda paleta */}
              <motion.button
                initial={{ x: -35, rotateZ: -15, opacity: 0, scale: 0.8 }}
                animate={{ x: 0, rotateZ: 0, opacity: 1, scale: 1 }}
                exit={{ x: -35, rotateZ: -15, opacity: 0, scale: 0.8 }}
                transition={{ 
                  duration: 0.25, 
                  delay: 0.1,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -2,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCall}
                className="group flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-lg hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200"
              >
                <motion.div
                  whileHover={{ rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Phone className="w-4 h-4 text-white" />
                </motion.div>
                <span className="text-white text-sm font-medium whitespace-nowrap">Llamar</span>
              </motion.button>

              {/* Opción Contacto Modal - Tercera paleta */}
              <motion.button
                initial={{ x: -20, rotateZ: -5, opacity: 0, scale: 0.8 }}
                animate={{ x: 0, rotateZ: 0, opacity: 1, scale: 1 }}
                exit={{ x: -20, rotateZ: -5, opacity: 0, scale: 0.8 }}
                transition={{ 
                  duration: 0.25, 
                  delay: 0.15,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -2,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.95 }}
                onClick={handleContactModal}
                className="group flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full shadow-lg hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-200"
              >
                <motion.div
                  whileHover={{ rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Mail className="w-4 h-4 text-white" />
                </motion.div>
                <span className="text-white text-sm font-medium whitespace-nowrap">Contacto</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
