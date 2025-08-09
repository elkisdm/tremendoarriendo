"use client";
import { Calendar, MessageCircle } from "lucide-react";
import { track } from "@lib/analytics";

export function StickyMobileCTA() {
  const handleBookingClick = () => {
    const bookingForm = document.getElementById("booking-form");
    if (bookingForm) {
      bookingForm.scrollIntoView({ behavior: "smooth", block: "start" });
      // Update URL hash for focus management
      window.history.pushState(null, "", "#booking-form");
      // Trigger focus management
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    }
  };

  const handleWhatsAppClick = () => {
    track("cta_whatsapp_click", { context: "sticky_mobile" });
    window.open(
      "https://wa.me/56993481594?text=Hola%20Elkis%2C%20quiero%20visitar%20una%20unidad",
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      <div 
        className="bg-[var(--bg)]/95 backdrop-blur-sm border-t border-white/10 p-4"
        style={{
          paddingBottom: "calc(1rem + env(safe-area-inset-bottom))"
        }}
      >
        <div className="flex gap-3 max-w-sm mx-auto">
          <button
            onClick={handleBookingClick}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[var(--ring)] text-white font-medium rounded-lg hover:bg-[var(--ring)]/90 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:ring-offset-2 focus:ring-offset-[var(--bg)] transition-colors motion-reduce:transition-none"
            aria-label="Ir al formulario de reserva de visita"
          >
            <Calendar className="w-4 h-4" aria-hidden="true" />
            <span>Reservar visita</span>
          </button>
          
          <button
            onClick={handleWhatsAppClick}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-[var(--bg)] transition-colors motion-reduce:transition-none"
            aria-label="Contactar por WhatsApp"
          >
            <MessageCircle className="w-4 h-4" aria-hidden="true" />
            <span className="sr-only">WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
}
