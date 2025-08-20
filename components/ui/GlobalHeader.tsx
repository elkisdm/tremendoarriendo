"use client";

import { ArrowLeft, Phone, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";
import { buildWaLink } from "@lib/whatsapp";
import { track } from "@lib/analytics";

type GlobalHeaderProps = {
  showBackButton?: boolean;
  backUrl?: string;
  backText?: string;
  showContact?: boolean;
  contactPhone?: string;
  contactWhatsApp?: string;
  className?: string;
};

export function GlobalHeader({
  showBackButton = true,
  backUrl = "/arrienda-sin-comision",
  backText = "Volver a edificios",
  showContact = true,
  contactPhone = "+56912345678",
  contactWhatsApp = "+56912345678",
  className = ""
}: GlobalHeaderProps) {
  
  const handleBackClick = () => {
    if (backUrl) {
      sessionStorage.setItem('from-building-details', 'true');
      window.location.href = backUrl;
    }
  };

  const handlePhoneClick = () => {
    track("contact_phone_click");
    window.open(`tel:${contactPhone}`, '_self');
  };

  const handleWhatsAppClick = () => {
    track("contact_whatsapp_click");
    const waLink = buildWaLink(contactWhatsApp, "Hola, me interesa saber más sobre este edificio");
    window.open(waLink, '_blank');
  };

  return (
    <motion.header 
      className={`sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50 ${className}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          {/* Navegación izquierda */}
          <div className="flex items-center gap-4">
            {showBackButton && (
              <motion.button 
                onClick={handleBackClick}
                className="group inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                {backText}
              </motion.button>
            )}
          </div>

          {/* Controles centrales */}
          <div className="flex items-center gap-2">
            {/* Selector de tema */}
            <ThemeToggle />
          </div>

          {/* Contacto derecho */}
          {showContact && (
            <div className="flex items-center gap-2">
              {/* Botón WhatsApp */}
              <motion.button
                onClick={handleWhatsAppClick}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors dark:text-green-400 dark:bg-green-950/30 dark:hover:bg-green-950/50 border border-green-200 dark:border-green-800/50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Contactar por WhatsApp"
              >
                <MessageCircle className="h-4 w-4" />
                <span className="hidden sm:inline">WhatsApp</span>
              </motion.button>

              {/* Botón Teléfono */}
              <motion.button
                onClick={handlePhoneClick}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors dark:text-blue-400 dark:bg-blue-950/30 dark:hover:bg-blue-950/50 border border-blue-200 dark:border-blue-800/50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Llamar por teléfono"
              >
                <Phone className="h-4 w-4" />
                <span className="hidden sm:inline">Llamar</span>
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
}
