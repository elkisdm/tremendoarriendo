"use client";
import React, { useState, useEffect, Suspense, lazy, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { ImageGallery } from "@components/gallery/ImageGallery";
import { StickyMobileCTA } from "@components/StickyMobileCTA";
import { Header } from "@components/marketing/Header";
import { track } from "@lib/analytics";
import type { Unit, Building } from "@schemas/models";
import { VisitSchedulerModal } from "@components/flow/VisitSchedulerModal";

// Componentes de propiedad
import { PropertyAboveFoldMobile } from "./PropertyAboveFoldMobile";
import { PropertyBreadcrumb } from "./PropertyBreadcrumb";
import { PropertySidebar } from "./PropertySidebar";
import { PropertySections } from "./PropertySections";
import { CommuneLifeSection } from "./CommuneLifeSection";
import { PropertyFAQ } from "./PropertyFAQ";

// Lazy load components for better performance
const RelatedList = lazy(() => import("@components/lists/RelatedList").then(module => ({ default: module.RelatedList })));

// Error Boundary Component
class ErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean; error: Error | null }
> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("PropertyClient Error:", error, errorInfo);
        track("error", { error: error.message, component: "PropertyClient" });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-6">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 max-w-md text-center">
                        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            Algo salió mal
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            No pudimos cargar la información de la propiedad. Por favor, intenta de nuevo.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-semibold transition-colors"
                        >
                            Recargar página
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

// Loading Skeleton Component
const PropertySkeleton = () => (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main content skeleton */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="h-8 bg-white/10 rounded-xl animate-pulse"></div>
                    <div className="h-64 bg-white/10 rounded-2xl animate-pulse"></div>
                    <div className="space-y-4">
                        <div className="h-6 bg-white/10 rounded animate-pulse"></div>
                        <div className="h-6 bg-white/10 rounded animate-pulse w-3/4"></div>
                    </div>
                </div>
                {/* Sidebar skeleton */}
                <div className="lg:col-span-1">
                    <div className="bg-white/5 rounded-2xl p-6 space-y-4">
                        <div className="h-8 bg-white/10 rounded animate-pulse"></div>
                        <div className="h-12 bg-white/10 rounded-xl animate-pulse"></div>
                        <div className="h-12 bg-white/10 rounded-xl animate-pulse"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

interface PropertyClientProps {
    building: Building;
    relatedBuildings: Building[];
    defaultUnitId?: string;
    variant?: "catalog" | "marketing" | "admin";
}

export function PropertyClient({
    building,
    relatedBuildings,
    defaultUnitId,
    variant = "catalog"
}: PropertyClientProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Calcular precios para usar en StickyMobileCTA
    const originalPrice = building.precio_desde || 290000;
    const discountPrice = Math.round(originalPrice * 0.5);

    // Analytics tracking on mount
    useEffect(() => {
        track("property_view", {
            property_id: building.id,
            property_name: building.name,
            property_slug: building.slug,
            variant
        });
    }, [building.id, building.name, building.slug, variant]);

    // Listen for custom event to open modal
    useEffect(() => {
        const handleOpenModal = () => {
            setIsModalOpen(true);
        };

        window.addEventListener('openVisitScheduler', handleOpenModal);
        return () => {
            window.removeEventListener('openVisitScheduler', handleOpenModal);
        };
    }, []);

    // Handle errors gracefully
    useEffect(() => {
        if (!building) {
            setError("No se pudo cargar la información de la propiedad");
        } else if (building && building.units.filter(unit => unit.disponible).length === 0) {
            setError("No hay unidades disponibles en esta propiedad");
        } else {
            setError(null); // Clear any previous errors
        }
    }, [building]);

    // Handle modal confirmation
    const handleModalConfirm = (date: string, time: string, leadData: any) => {
        console.log('Visita confirmada:', { date, time, leadData, building: building.name });
        track("visit_scheduled", {
            property_id: building.id,
            property_name: building.name,
            date,
            time,
            variant
        });
        alert(`¡Visita agendada exitosamente!\n\nPropiedad: ${building.name}\nFecha: ${date}\nHora: ${time}\n\nTe contactaremos pronto.`);
        setIsModalOpen(false);
    };

    // Función para enviar cotización
    const handleSendQuotation = () => {
        track("quotation_sent", {
            property_id: building.id,
            property_name: building.name,
            variant
        });
        alert(`Cotización enviada por email para la propiedad ${building.name}`);
    };

    // Handle keyboard navigation
    const handleKeyDown = useCallback((e: React.KeyboardEvent, action: () => void) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            action();
        }
    }, []);

    // Show loading state
    if (isLoading) {
        return <PropertySkeleton />;
    }

    // Show error state
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 max-w-md text-center">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Error de carga
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-semibold transition-colors"
                        aria-label="Recargar página"
                    >
                        Recargar página
                    </button>
                </div>
            </div>
        );
    }

    return (
        <ErrorBoundary>
            <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
                <main id="main-content" role="main" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
                    {/* Header */}
                    <div className="mb-4 lg:mb-8">
                        <Header />
                    </div>

                    {/* Breadcrumb accesible */}
                    <PropertyBreadcrumb building={building} variant={variant} />

                    {/* Layout principal: 3 columnas */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
                        {/* Columna principal (2/3) */}
                        <div className="lg:col-span-2 space-y-6 lg:space-y-8">
                            {/* Above the fold móvil optimizado para conversión */}
                            <PropertyAboveFoldMobile
                                building={building}
                                selectedUnit={building.units.find(unit => unit.disponible) || null}
                                variant={variant}
                                onScheduleVisit={() => setIsModalOpen(true)}
                                onWhatsApp={() => {
                                    // TODO: Implementar WhatsApp
                                    console.log("WhatsApp clicked");
                                }}
                                onSave={() => {
                                    // TODO: Implementar guardar en favoritos
                                    console.log("Save clicked");
                                }}
                                onShare={() => {
                                    // TODO: Implementar compartir
                                    console.log("Share clicked");
                                }}
                            />

                            {/* Galería de imágenes */}
                            <section aria-label="Galería de imágenes de la propiedad">
                                <ImageGallery images={building.gallery} />
                            </section>

                            {/* Secciones desplegables */}
                            <PropertySections
                                building={building}
                                unitDetails={{
                                    tipologia: building.units.find(unit => unit.disponible)?.tipologia || "1D1B",
                                    m2: building.units.find(unit => unit.disponible)?.m2 || 45,
                                    piso: building.units.find(unit => unit.disponible)?.piso || "N/A",
                                    orientacion: building.units.find(unit => unit.disponible)?.orientacion || "N/A",
                                    area_interior: building.units.find(unit => unit.disponible)?.area_interior_m2,
                                    area_exterior: building.units.find(unit => unit.disponible)?.area_exterior_m2,
                                    estacionamiento: building.units.find(unit => unit.disponible)?.estacionamiento || false,
                                    bodega: building.units.find(unit => unit.disponible)?.bodega || false,
                                    amoblado: building.units.find(unit => unit.disponible)?.amoblado || false,
                                    petFriendly: building.units.find(unit => unit.disponible)?.petFriendly || false,
                                    garantia_cuotas: building.units.find(unit => unit.disponible)?.guarantee_installments,
                                    renta_minima: building.units.find(unit => unit.disponible)?.renta_minima,
                                    codigoInterno: building.units.find(unit => unit.disponible)?.codigoInterno
                                }}
                                originalPrice={building.precio_desde || 290000}
                                variant={variant}
                            />

                            {/* Cómo es vivir en la comuna */}
                            <CommuneLifeSection building={building} variant={variant} />

                            {/* Propiedades relacionadas */}
                            <section
                                aria-label="Propiedades relacionadas"
                                className="mt-12 lg:mt-16"
                            >
                                <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-4 lg:mb-6">
                                    Propiedades relacionadas
                                </h2>
                                <Suspense fallback={
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="h-64 bg-white/5 rounded-2xl animate-pulse" aria-hidden="true"></div>
                                        ))}
                                    </div>
                                }>
                                    <RelatedList buildings={relatedBuildings as (Building & { precioDesde: number | null })[]} />
                                </Suspense>
                            </section>

                            {/* Preguntas frecuentes */}
                            <PropertyFAQ building={building} variant={variant} />

                            {/* Sticky Mobile CTA */}
                            <StickyMobileCTA
                                onScheduleVisit={() => setIsModalOpen(true)}
                                price={originalPrice}
                                discountPrice={discountPrice}
                            />
                        </div>

                        {/* Sidebar sticky (1/3) - Oculto en móviles */}
                        <PropertySidebar
                            building={building}
                            selectedUnit={building.units.find(unit => unit.disponible) || null}
                            unitDetails={{
                                dormitorios: building.units.find(unit => unit.disponible)?.bedrooms || 1,
                                banos: building.units.find(unit => unit.disponible)?.bathrooms || 1,
                                m2: building.units.find(unit => unit.disponible)?.m2 || 45,
                                piso: building.units.find(unit => unit.disponible)?.piso || "N/A"
                            }}
                            originalPrice={building.precio_desde || 290000}
                            discountPrice={Math.round((building.precio_desde || 290000) * 0.5)}
                            firstPaymentCalculation={{
                                totalFirstPayment: Math.round((building.precio_desde || 290000) * 1.5),
                                netRentStorage: building.precio_desde || 290000,
                                proratedGC: Math.round((building.precio_desde || 290000) * 0.21),
                                initialDeposit: Math.round((building.precio_desde || 290000) * 0.33),
                                commissionToPay: 0,
                                daysChargedCount: 30,
                                daysInMonth: 30,
                                promoDays: 30,
                                regularDays: 0,
                                totalRent: building.precio_desde || 290000,
                                totalParking: 0,
                                totalStorage: 0
                            }}
                            moveInDate={new Date()}
                            includeParking={false}
                            includeStorage={false}
                            onDateChange={() => { }}
                            onParkingChange={() => { }}
                            onStorageChange={() => { }}
                            onSendQuotation={handleSendQuotation}
                            onScheduleVisit={() => setIsModalOpen(true)}
                            variant={variant}
                        />
                    </div>
                </main>

                {/* Visit Scheduler Modal Premium */}
                <VisitSchedulerModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    propertyId={building.id}
                    propertyName={building.name}
                    propertyAddress={building.address}
                    propertyImage={building.coverImage}
                    propertyDetails={{
                        bedrooms: building.units.find(unit => unit.disponible)?.bedrooms || 1,
                        bathrooms: building.units.find(unit => unit.disponible)?.bathrooms || 1,
                        parking: building.units.find(unit => unit.disponible)?.estacionamiento || false,
                        area: building.units.find(unit => unit.disponible)?.m2 || 45,
                        price: building.units.find(unit => unit.disponible)?.price || building.precio_desde || 290000
                    }}
                    onConfirm={handleModalConfirm}
                />
            </div>
        </ErrorBoundary>
    );
}
