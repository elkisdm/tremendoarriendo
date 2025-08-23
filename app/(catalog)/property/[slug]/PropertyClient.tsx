"use client";
import React, { useState, useEffect, Suspense, lazy, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame,
  DollarSign,
  Shield,
  ChevronRight,
  CheckCircle,
  Phone,
  MapPin,
  Bed,
  Bath,
  Square,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Info,
  Star,
  Users,
  Car,
  Wifi,
  Dumbbell,
  Coffee
} from "lucide-react";
import { ImageGallery } from "@components/gallery/ImageGallery";
import { StickyMobileCTA } from "@components/StickyMobileCTA";
import { Header } from "@components/marketing/Header";
import { track } from "@lib/analytics";
import type { Unit, Building } from "@schemas/models";
import VisitSchedulerWrapper from "@components/forms/VisitSchedulerWrapper";

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

// Collapsible Section Component
interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  children,
  defaultOpen = false,
  icon: Icon
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-between text-left"
        aria-expanded={isOpen}
        aria-controls={`collapsible-${title.toLowerCase().replace(/\s+/g, '-')}`}
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />}
          <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            id={`collapsible-${title.toLowerCase().replace(/\s+/g, '-')}`}
            className="overflow-hidden"
          >
            <div className="px-6 py-4 bg-white dark:bg-gray-900">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// SEO and Performance optimizations
const SEO_OPTIMIZATIONS = {
  structuredData: {
    "@context": "https://schema.org",
    "@type": "ApartmentComplex",
    "name": "Home Inclusive Ecuador",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Estación Central"
    },
    "image": "/images/edificio/original_79516B40-7BA9-4F4E-4F7D-7BA4C0A2A938-mg0578.jpg",
    "url": "https://elkisrealtor.cl/property/home-amengual",
    "offers": [
      {
        "@type": "Offer",
        "price": 290000,
        "priceCurrency": "CLP",
        "availability": "https://schema.org/InStock"
      }
    ]
  }
};

interface PropertyClientProps {
  building: Building;
  relatedBuildings: Building[];
  defaultUnitId?: string;
}

export function PropertyClient({ building, relatedBuildings, defaultUnitId }: PropertyClientProps) {
  const availableUnits = building.units.filter(unit => unit.disponible);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

  // Seleccionar unidad por defecto basada en defaultUnitId o la primera disponible
  const getDefaultUnit = useCallback(() => {
    if (defaultUnitId) {
      const unit = availableUnits.find(u => u.id === defaultUnitId);
      if (unit) return unit;
    }
    return availableUnits[0] || null;
  }, [defaultUnitId, availableUnits]);

  // Inicializar unidad seleccionada
  useEffect(() => {
    const defaultUnit = getDefaultUnit();
    if (defaultUnit) {
      setSelectedUnit(defaultUnit);
    }
  }, [getDefaultUnit]);

  // Analytics tracking on mount
  useEffect(() => {
    track("property_view", {
      property_id: building.id,
      property_name: building.name,
      property_slug: building.slug,
    });
  }, [building.id, building.name, building.slug]);

  // Handle errors gracefully
  useEffect(() => {
    if (!building) {
      setError("No se pudo cargar la información de la propiedad");
    } else if (building && availableUnits.length === 0) {
      setError("No hay unidades disponibles en esta propiedad");
    } else {
      setError(null); // Clear any previous errors
    }
  }, [building, availableUnits.length]);

  // Datos estratégicos basados en AssetPlan
  const originalPrice = selectedUnit?.price || building.precio_desde || 290000;
  const discountPrice = Math.round(originalPrice * 0.5); // 50% OFF primer mes

  // PASO 4: Badges estratégicos simplificados (máximo 3 principales)
  const primaryBadges = [
    { label: "0% comisión", icon: DollarSign, color: "green", bgColor: "from-green-500 to-emerald-500" },
    { label: "50% OFF primer mes", icon: Flame, color: "orange", bgColor: "from-orange-500 to-red-500" },
    { label: "Garantía en cuotas", icon: Shield, color: "blue", bgColor: "from-indigo-500 to-blue-500" }
  ];

  // Datos dinámicos de la unidad seleccionada
  const unitDetails = {
    dormitorios: selectedUnit?.bedrooms || 1,
    banos: selectedUnit?.bathrooms || 1,
    m2: selectedUnit?.m2 || 45,
    tipologia: selectedUnit?.tipologia || "1D1B",
    piso: selectedUnit?.piso || "N/A",
    orientacion: selectedUnit?.orientacion || "N/A"
  };

  // Amenidades del edificio
  const amenidades = [
    { nombre: "WiFi incluido", icon: Wifi, disponible: true },
    { nombre: "Estacionamiento", icon: Car, disponible: building.amenities.includes("estacionamiento") },
    { nombre: "Gimnasio", icon: Dumbbell, disponible: building.amenities.includes("gimnasio") },
    { nombre: "Sala común", icon: Coffee, disponible: building.amenities.includes("sala_comun") },
    { nombre: "Seguridad 24/7", icon: Shield, disponible: true },
    { nombre: "Conserjería", icon: Users, disponible: building.amenities.includes("conserjeria") }
  ];

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
        <main id="main-content" role="main" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header con animación de entrada */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-8"
          >
            <Header />
          </motion.div>

          {/* Breadcrumb accesible */}
          <motion.nav
            aria-label="Navegación de migas de pan"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
            className="mb-6"
          >
            <ol className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <a
                  href="/"
                  className="hover:text-blue-600 transition-colors"
                  aria-label="Ir al inicio"
                >
                  Inicio
                </a>
              </li>
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
              <li>
                <a
                  href="/catalog"
                  className="hover:text-blue-600 transition-colors"
                  aria-label="Ver catálogo de propiedades"
                >
                  Propiedades
                </a>
              </li>
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
              <li className="text-gray-900 dark:text-white font-medium" aria-current="page">
                {building.name}
              </li>
            </ol>
          </motion.nav>

          {/* Layout principal: 3 columnas */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Columna principal (2/3) */}
            <div className="lg:col-span-2 space-y-8">
              {/* Hero minimalista */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                className="space-y-4"
              >
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                  {building.name}
                </h1>
                <div className="flex items-center gap-2 text-lg text-gray-600 dark:text-gray-400">
                  <MapPin className="w-5 h-5" aria-hidden="true" />
                  <span>{building.comuna}</span>
                </div>

                {/* Badges principales simplificados */}
                <div className="flex flex-wrap gap-2 mb-6" role="group" aria-label="Características destacadas">
                  {primaryBadges.map((badge) => (
                    <motion.div
                      key={badge.label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.5 + Math.random() * 0.3 }}
                      whileHover={{ scale: 1.05 }}
                      className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${badge.bgColor} text-white text-sm font-semibold rounded-xl shadow-md`}
                      tabIndex={0}
                      onKeyDown={(e) => handleKeyDown(e, () => { })}
                      role="button"
                      aria-label={badge.label}
                    >
                      <badge.icon className="w-4 h-4" aria-hidden="true" />
                      <span>{badge.label}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.section>

              {/* Galería de imágenes */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                aria-label="Galería de imágenes de la propiedad"
              >
                <ImageGallery images={building.gallery} />
              </motion.section>

              {/* Secciones desplegables */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
                className="space-y-4"
              >
                {/* Detalles de la unidad */}
                <CollapsibleSection title="Detalles de la unidad" icon={Info} defaultOpen={true}>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Bed className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">{unitDetails.dormitorios} dormitorio{unitDetails.dormitorios > 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bath className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">{unitDetails.banos} baño{unitDetails.banos > 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Square className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">{unitDetails.m2}m²</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <span className="font-medium">{unitDetails.tipologia}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-green-600" />
                      <span className="font-medium">Piso {unitDetails.piso}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Info className="w-5 h-5 text-purple-600" />
                      <span className="font-medium">{unitDetails.orientacion}</span>
                    </div>
                  </div>
                </CollapsibleSection>

                {/* Amenidades */}
                <CollapsibleSection title="Amenidades del edificio" icon={Star}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {amenidades.map((amenidad) => (
                      <div key={amenidad.nombre} className="flex items-center gap-3">
                        <amenidad.icon className={`w-5 h-5 ${amenidad.disponible ? 'text-green-600' : 'text-gray-400'}`} />
                        <span className={amenidad.disponible ? 'text-gray-900 dark:text-white' : 'text-gray-500'}>
                          {amenidad.nombre}
                        </span>
                        {amenidad.disponible && (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                    ))}
                  </div>
                </CollapsibleSection>

                {/* Características principales */}
                <CollapsibleSection title="Características principales" icon={CheckCircle}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      {[
                        "Ventanas termopanel",
                        "Agua caliente central",
                        "Cocina equipada",
                        "Seguridad 24/7"
                      ].map((feature) => (
                        <div key={feature} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      {[
                        "Calefacción individual",
                        "Logia incluida",
                        "Closet empotrado",
                        "Vista despejada"
                      ].map((feature) => (
                        <div key={feature} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CollapsibleSection>

                {/* Requisitos básicos */}
                <CollapsibleSection title="Requisitos básicos" icon={Shield}>
                  <div className="space-y-3">
                    {[
                      `Renta mínima ${((building.precio_desde || 290000) * 3).toLocaleString('es-CL')}`,
                      "Sin deudas vencidas",
                      "Documentación al día",
                      "Garantía o codeudor",
                      "Antecedentes comerciales limpios",
                      "Capacidad de pago demostrable"
                    ].map((requirement) => (
                      <div key={requirement} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-500" />
                        <span>{requirement}</span>
                      </div>
                    ))}
                  </div>
                </CollapsibleSection>

                {/* Información del edificio */}
                <CollapsibleSection title="Información del edificio" icon={Info}>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Ubicación</h4>
                      <p className="text-gray-600 dark:text-gray-400">{building.comuna}, Santiago</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Año de construcción</h4>
                      <p className="text-gray-600 dark:text-gray-400">2020</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Total de unidades</h4>
                      <p className="text-gray-600 dark:text-gray-400">{building.units.length} departamentos</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Administración</h4>
                      <p className="text-gray-600 dark:text-gray-400">Profesional con conserjería 24/7</p>
                    </div>
                  </div>
                </CollapsibleSection>
              </motion.section>

              {/* Propiedades relacionadas */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
                aria-label="Propiedades relacionadas"
                className="mt-16"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
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
              </motion.section>

              {/* Sticky Mobile CTA */}
              <StickyMobileCTA />
            </div>

            {/* Sidebar sticky (1/3) */}
            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              className="lg:col-span-1"
            >
              <div className="sticky top-8">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 space-y-6">
                  {/* Precio destacado */}
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                      ${originalPrice.toLocaleString('es-CL')}
                    </div>
                    <div className="text-lg text-green-600 font-semibold">
                      50% OFF primer mes
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      ${discountPrice.toLocaleString('es-CL')} primer mes
                    </div>
                  </div>

                  {/* CTA principal */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-all duration-200"
                    tabIndex={0}
                    onClick={() => {
                      // Disparar evento personalizado para abrir el modal
                      console.log('Botón Agendar visita clickeado');
                      window.dispatchEvent(new CustomEvent('openVisitScheduler'));
                    }}
                    onKeyDown={(e) => handleKeyDown(e, () => {
                      // Trigger visit scheduler
                      window.dispatchEvent(new CustomEvent('openVisitScheduler'));
                    })}
                    aria-label="Agendar visita a la propiedad"
                  >
                    Agendar visita
                  </motion.button>

                  {/* CTA secundario */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                    tabIndex={0}
                    onKeyDown={(e) => handleKeyDown(e, () => {
                      // Trigger WhatsApp
                      const waLink = `https://wa.me/56912345678?text=Hola! Me interesa el departamento ${selectedUnit?.tipologia} en ${building.name}. ¿Podrías darme más información?`;
                      window.open(waLink, "_blank");
                    })}
                    aria-label="Contactar por WhatsApp"
                  >
                    <Phone className="w-4 h-4" aria-hidden="true" />
                    WhatsApp
                  </motion.button>

                  {/* Información adicional */}
                  <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <Bed className="w-4 h-4" aria-hidden="true" />
                      <span>{unitDetails.dormitorios} dormitorio{unitDetails.dormitorios > 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bath className="w-4 h-4" aria-hidden="true" />
                      <span>{unitDetails.banos} baño{unitDetails.banos > 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Square className="w-4 h-4" aria-hidden="true" />
                      <span>{unitDetails.m2}m²</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.aside>
          </div>
        </main>

        {/* Visit Scheduler Modal */}
        <VisitSchedulerWrapper
          buildingName={building.name}
          buildingId={building.id}
          unitId={selectedUnit?.id}
        />

        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              ...SEO_OPTIMIZATIONS.structuredData,
              name: building.name,
              address: {
                "@type": "PostalAddress",
                "addressLocality": building.comuna
              },
              offers: [
                {
                  "@type": "Offer",
                  "price": originalPrice,
                  "priceCurrency": "CLP",
                  "availability": "https://schema.org/InStock"
                }
              ]
            })
          }}
        />
      </div>
    </ErrorBoundary>
  );
}

