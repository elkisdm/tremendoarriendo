"use client";
import { useState } from "react";
import { ImageGallery } from "@components/gallery/ImageGallery";
import { UnitSelector } from "@components/UnitSelector";
import { CostTable } from "@components/cost/CostTable";
import { AmenityList } from "@components/ui/AmenityList";
import { BookingForm } from "@components/forms/BookingForm";
import { RelatedList } from "@components/lists/RelatedList";
import { StickyMobileCTA } from "@components/StickyMobileCTA";
import { PropertyQuotationPanel } from "@components/quotation/PropertyQuotationPanel";
import type { Unit, Building } from "@schemas/models";

type PropertyClientProps = {
  building: Building & { precioDesde: number | null };
  relatedBuildings: (Building & { precioDesde: number | null })[];
};

export function PropertyClient({ building, relatedBuildings }: PropertyClientProps) {
  const availableUnits = building.units.filter(unit => unit.disponible);
  const [selectedUnit, setSelectedUnit] = useState<Unit>(availableUnits[0]);

  const handleUnitChange = (unit: Unit) => {
    setSelectedUnit(unit);
  };

  return (
    <main id="main-content" role="main" className="min-h-screen bg-bg text-text">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{building.name}</h1>
          <p className="text-subtext text-lg">{building.address}, {building.comuna}</p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Gallery and Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gallery */}
            <section aria-label="Galería de imágenes">
              <ImageGallery 
                images={building.gallery} 
                media={building.media}
                coverImage={building.coverImage}
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
          <div className="lg:col-span-1 space-y-6">
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
      </div>

      {/* Sticky Mobile CTA */}
      <StickyMobileCTA />
    </main>
  );
}
