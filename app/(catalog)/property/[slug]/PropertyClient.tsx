"use client";
import { useState, useEffect } from "react";
import { ImageGallery } from "@components/gallery/ImageGallery";
import { UnitSelector } from "@components/UnitSelector";
import { CostTable } from "@components/cost/CostTable";
import { AmenityList } from "@components/ui/AmenityList";
import { BookingForm } from "@components/forms/BookingForm";
import { RelatedList } from "@components/lists/RelatedList";
import { StickyMobileCTA } from "@components/StickyMobileCTA";
import { PropertyQuotationPanel } from "@components/quotation/PropertyQuotationPanel";
import { PromotionBadge } from "@components/ui/PromotionBadge";
import { buildWaLink } from "@lib/whatsapp";
import { track } from "@lib/analytics";
import { PromotionType } from "@schemas/models";
import type { Unit, Building, PromotionBadge as PromotionBadgeType } from "@schemas/models";

type PropertyClientProps = {
  building: Building & { precioDesde: number | null };
  relatedBuildings: (Building & { precioDesde: number | null })[];
};

// Helper function to get primary badge with priority
function getPrimaryBadge(badges?: PromotionBadgeType[]): PromotionBadgeType | null {
  if (!badges || badges.length === 0) return null;
  
  // Priority: FREE_COMMISSION first, then DISCOUNT_PERCENT, then others
  const freeCommission = badges.find(b => b.type === PromotionType.FREE_COMMISSION);
  if (freeCommission) return freeCommission;
  
  const discount = badges.find(b => b.type === PromotionType.DISCOUNT_PERCENT);
  if (discount) return discount;
  
  // Return first available badge
  return badges[0];
}

// Helper function to get secondary badges
function getSecondaryBadges(badges?: PromotionBadgeType[], primaryBadge?: PromotionBadgeType | null): PromotionBadgeType[] {
  if (!badges || badges.length === 0) return [];
  
  return badges.filter(badge => badge !== primaryBadge);
}

export function PropertyClient({ building, relatedBuildings }: PropertyClientProps) {
  const availableUnits = building.units.filter(unit => unit.disponible);
  const [selectedUnit, setSelectedUnit] = useState<Unit>(availableUnits[0]);

  // Analytics tracking on mount
  useEffect(() => {
    track("property_view", {
      property_id: building.id,
      property_name: building.name,
      property_slug: building.slug,
    });
  }, [building.id, building.name, building.slug]);

  const handleUnitChange = (unit: Unit) => {
    setSelectedUnit(unit);
  };

  const handleWhatsAppClick = () => {
    track("cta_whatsapp_click", {
      property_id: building.id,
      property_name: building.name,
    });
  };

  const handleBookingClick = () => {
    track("booking_submitted", {
      property_id: building.id,
      property_name: building.name,
    });
  };

  const whatsappUrl = buildWaLink({
    presetMessage: `Hola, me interesa ${building.name} en ${building.comuna}`,
    url: typeof window !== "undefined" ? window.location.href : undefined,
  });

  // Badge organization
  const primaryBadge = getPrimaryBadge(building.badges);
  const secondaryBadges = getSecondaryBadges(building.badges, primaryBadge);

  // Availability banner
  const availableCount = availableUnits.length;
  const availabilityText = availableCount === 1 
    ? "Última unidad disponible" 
    : `${availableCount} unidades disponibles`;

  return (
    <main id="main-content" role="main" className="min-h-screen bg-bg text-text">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section with CTA */}
        <div className="mb-8">
          {/* Building Name and Rating */}
          <div className="mb-4">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{building.name}</h1>
            <p className="text-subtext text-lg mb-2">{building.address}, {building.comuna}</p>
          </div>

          {/* Availability Banner */}
          {availableCount > 0 && (
            <div className="mb-4">
              <div className="inline-flex items-center px-3 py-2 bg-orange-500/80 text-white text-xs rounded-md font-medium">
                <span className="animate-pulse mr-2">●</span>
                {availabilityText}
              </div>
            </div>
          )}

          {/* Promotional Badges */}
          <div className="mb-6">
            {/* Primary Badge */}
            {primaryBadge && (
              <div className="mb-3">
                <PromotionBadge 
                  label={primaryBadge.label} 
                  tag={primaryBadge.tag}
                  variant="primary"
                />
              </div>
            )}
            
            {/* Secondary Badges */}
            {secondaryBadges.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {secondaryBadges.map((badge, index) => (
                  <PromotionBadge 
                    key={`${badge.label}-${index}`}
                    label={badge.label} 
                    tag={badge.tag}
                    variant="secondary"
                  />
                ))}
              </div>
            )}
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <button
              onClick={handleBookingClick}
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-2xl hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary transition-colors min-h-[44px]"
              aria-label="Agendar visita a la propiedad"
            >
              Agendar tu visita
            </button>
            
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                onClick={handleWhatsAppClick}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 bg-[var(--soft)] text-text font-semibold rounded-2xl hover:bg-[var(--soft)]/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--ring)] transition-colors min-h-[44px]"
                aria-label="Contactar por WhatsApp sobre esta propiedad"
              >
                Hablar por WhatsApp
              </a>
            )}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column - Gallery and Details */}
          <div className="lg:col-span-3 space-y-8">
            {/* Gallery */}
            <section aria-label="Galería de imágenes">
              <ImageGallery 
                images={building.gallery} 
                media={building.media}
                coverImage={building.coverImage}
                autoPlay={true}
                autoPlayInterval={4000}
              />
            </section>

            {/* Unit Selector */}
            <section aria-label="Selección de unidad">
              <h2 className="text-xl font-semibold mb-4">Selecciona una unidad</h2>
              <UnitSelector 
                units={availableUnits} 
                buildingId={building.id}
                defaultUnitId={selectedUnit?.id}
                onUnitChange={handleUnitChange}
              />
            </section>

            {/* Amenities */}
            <section aria-label="Amenidades">
              <h2 className="text-xl font-semibold mb-4">Amenidades</h2>
              <AmenityList items={building.amenities} />
            </section>
          </div>

          {/* Right Column - Costs and Booking */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cost Table */}
            <section aria-label="Detalles de costos">
              <CostTable unit={selectedUnit} promoLabel="$0" />
            </section>

            {/* Quotation Panel */}
            <section aria-label="Cotizador profesional">
              <PropertyQuotationPanel 
                building={building} 
                selectedUnit={selectedUnit}
                isAdmin={false}
              />
            </section>

            {/* Booking Form */}
            <section aria-label="Formulario de reserva" id="booking-form">
              <BookingForm 
                buildingId={building.id}
                buildingName={building.name}
                defaultUnitId={selectedUnit?.id}
              />
            </section>
          </div>
        </div>

        {/* Related Properties */}
        <section aria-label="Propiedades relacionadas" className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Propiedades relacionadas</h2>
          <RelatedList buildings={relatedBuildings} />
        </section>

        {/* Sticky Mobile CTA */}
        <StickyMobileCTA />
      </div>
    </main>
  );
}
