"use client";
import { Calendar, MessageCircle } from "lucide-react";
import { track } from "@lib/analytics";
import { buildWhatsAppUrl } from "@lib/whatsapp";

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
    const link = buildWhatsAppUrl({ url: typeof window !== "undefined" ? window.location.href : undefined });
    track("cta_whatsapp_click", { context: "sticky_mobile" });
    if (link) {
      window.open(link, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      <div
        className="bg-bg/95 backdrop-blur-sm border-t border-soft/50 p-3 lg:p-4"
        style={{
          paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))"
        }}
      >
        <div className="flex gap-2 lg:gap-3 max-w-sm mx-auto">
          <button
            onClick={handleBookingClick}
            className="flex-1 flex items-center justify-center gap-2 px-3 lg:px-4 py-2.5 lg:py-3 bg-ring text-white text-sm lg:text-base font-medium rounded-lg hover:bg-ring/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-bg transition-colors motion-reduce:transition-none"
            aria-label="Ir al formulario de reserva de visita"
          >
            <Calendar className="w-4 h-4" aria-hidden="true" />
            <span>Reservar visita</span>
          </button>

          <button
            onClick={handleWhatsAppClick}
            className="flex items-center justify-center gap-2 px-3 lg:px-4 py-2.5 lg:py-3 bg-emerald-600 text-white text-sm lg:text-base font-medium rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-bg transition-colors motion-reduce:transition-none disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Contactar por WhatsApp"
            aria-disabled={!process.env.NEXT_PUBLIC_WHATSAPP_PHONE}
            disabled={!process.env.NEXT_PUBLIC_WHATSAPP_PHONE}
            title={!process.env.NEXT_PUBLIC_WHATSAPP_PHONE ? "Pronto disponible" : undefined}
          >
            <MessageCircle className="w-4 h-4" aria-hidden="true" />
            <span className="sr-only">WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
}
