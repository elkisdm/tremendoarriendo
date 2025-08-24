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
  Coffee,
  Calendar
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
    <motion.div
      className="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-300"
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-300 flex items-center justify-between text-left group"
        aria-expanded={isOpen}
        aria-controls={`collapsible-${title.toLowerCase().replace(/\s+/g, '-')}`}
        whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.05)" }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center gap-4">
          {Icon && (
            <div className={`p-2 rounded-lg transition-colors duration-300 ${isOpen
              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 group-hover:text-blue-600 dark:group-hover:text-blue-400'
              }`}>
              <Icon className="w-5 h-5" />
            </div>
          )}
          <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
            {title}
          </h3>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="p-2 rounded-lg bg-white dark:bg-gray-600 shadow-sm"
        >
          <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            id={`collapsible-${title.toLowerCase().replace(/\s+/g, '-')}`}
            className="overflow-hidden"
          >
            <div className="px-6 py-6 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
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
    area_interior: selectedUnit?.area_interior_m2,
    area_exterior: selectedUnit?.area_exterior_m2,
    tipologia: selectedUnit?.tipologia || "1D1B",
    piso: selectedUnit?.piso || "N/A",
    orientacion: selectedUnit?.orientacion || "N/A",
    estacionamiento: selectedUnit?.estacionamiento || false,
    bodega: selectedUnit?.bodega || false,
    amoblado: selectedUnit?.amoblado || false,
    petFriendly: selectedUnit?.petFriendly || false,
    parkingOptions: selectedUnit?.parkingOptions || [],
    storageOptions: selectedUnit?.storageOptions || [],
    codigoInterno: selectedUnit?.codigoInterno,
    garantia_cuotas: selectedUnit?.guarantee_installments,
    garantia_meses: selectedUnit?.guarantee_months,
    renta_minima: selectedUnit?.renta_minima
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

                {/* Badges principales mejorados */}
                <div className="flex flex-wrap gap-3 mb-8" role="group" aria-label="Características destacadas">
                  {primaryBadges.map((badge, index) => (
                    <motion.div
                      key={badge.label}
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: 0.5 + index * 0.1,
                        type: "spring",
                        stiffness: 200
                      }}
                      whileHover={{
                        scale: 1.05,
                        y: -2,
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r ${badge.bgColor} text-white text-sm font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20`}
                      tabIndex={0}
                      onKeyDown={(e) => handleKeyDown(e, () => { })}
                      role="button"
                      aria-label={badge.label}
                    >
                      {/* Efecto de brillo */}
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300"></div>

                      <badge.icon className="w-5 h-5 relative z-10" aria-hidden="true" />
                      <span className="relative z-10">{badge.label}</span>

                      {/* Indicador de animación */}
                      <motion.div
                        className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.7, 1, 0.7]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: index * 0.5
                        }}
                      />
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
                {/* Detalles de la unidad mejorados */}
                <CollapsibleSection title="Detalles de la unidad" icon={Info} defaultOpen={true}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Información básica */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                      className="flex items-center gap-3 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-700"
                    >
                      <div className="p-2 bg-indigo-100 dark:bg-indigo-800 rounded-lg">
                        <Star className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white">{unitDetails.tipologia}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Tipología</div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                      className="flex items-center gap-3 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-700"
                    >
                      <div className="p-2 bg-indigo-100 dark:bg-indigo-800 rounded-lg">
                        <Square className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white">{unitDetails.m2}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Metros cuadrados</div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 }}
                      className="flex items-center gap-3 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-700"
                    >
                      <div className="p-2 bg-indigo-100 dark:bg-indigo-800 rounded-lg">
                        <MapPin className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white">{unitDetails.piso}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Piso</div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.4 }}
                      className="flex items-center gap-3 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-700"
                    >
                      <div className="p-2 bg-indigo-100 dark:bg-indigo-800 rounded-lg">
                        <Info className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white">{unitDetails.orientacion}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Orientación</div>
                      </div>
                    </motion.div>

                    {/* Áreas específicas */}
                    {unitDetails.area_interior && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.5 }}
                        className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-700"
                      >
                        <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg">
                          <Square className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white">{unitDetails.area_interior}m²</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Área interior</div>
                        </div>
                      </motion.div>
                    )}

                    {unitDetails.area_exterior && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.6 }}
                        className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-700"
                      >
                        <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg">
                          <Square className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white">{unitDetails.area_exterior}m²</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Área exterior</div>
                        </div>
                      </motion.div>
                    )}

                    {/* Servicios y opciones */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.7 }}
                      className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-700"
                    >
                      <div className="p-2 bg-red-100 dark:bg-red-800 rounded-lg">
                        <Car className="w-5 h-5 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white">No disponible</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Estacionamiento</div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.8 }}
                      className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-700"
                    >
                      <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg">
                        <Square className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white">Desde $30.000</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Bodega</div>
                      </div>
                    </motion.div>

                    {/* Características especiales */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.9 }}
                      className={`flex items-center gap-3 p-3 rounded-xl border ${unitDetails.amoblado
                        ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700'
                        : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'}`}
                    >
                      <div className={`p-2 rounded-lg ${unitDetails.amoblado
                        ? 'bg-orange-100 dark:bg-orange-800 text-orange-600 dark:text-orange-400'
                        : 'bg-gray-100 dark:bg-gray-600 text-gray-400'}`}>
                        <CheckCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white">
                          {unitDetails.amoblado ? 'Amoblado' : 'Sin amoblar'}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Estado</div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 1.0 }}
                      className={`flex items-center gap-3 p-3 rounded-xl border ${unitDetails.petFriendly
                        ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700'
                        : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'}`}
                    >
                      <div className={`p-2 rounded-lg ${unitDetails.petFriendly
                        ? 'bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-400'
                        : 'bg-gray-100 dark:bg-gray-600 text-gray-400'}`}>
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white">
                          {unitDetails.petFriendly ? 'Permitidas' : 'No permitidas'}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Mascotas</div>
                      </div>
                    </motion.div>

                    {/* Información de garantía */}
                    {unitDetails.garantia_cuotas && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 1.1 }}
                        className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-700"
                      >
                        <div className="p-2 bg-yellow-100 dark:bg-yellow-800 rounded-lg">
                          <Shield className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white">{unitDetails.garantia_cuotas} cuotas</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Garantía</div>
                        </div>
                      </motion.div>
                    )}

                    {unitDetails.renta_minima && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 1.2 }}
                        className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-700"
                      >
                        <div className="p-2 bg-red-100 dark:bg-red-800 rounded-lg">
                          <DollarSign className="w-5 h-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white">${unitDetails.renta_minima.toLocaleString('es-CL')}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Renta mínima</div>
                        </div>
                      </motion.div>
                    )}

                    {/* Código interno */}
                    {unitDetails.codigoInterno && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 1.3 }}
                        className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600"
                      >
                        <div className="p-2 bg-gray-100 dark:bg-gray-600 rounded-lg">
                          <Info className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white">{unitDetails.codigoInterno}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Código interno</div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </CollapsibleSection>

                {/* Amenidades mejoradas */}
                <CollapsibleSection title="Amenidades del edificio" icon={Star}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {amenidades.map((amenidad, index) => (
                      <motion.div
                        key={amenidad.nombre}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${amenidad.disponible
                          ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700'
                          : 'bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600'
                          }`}
                      >
                        <div className={`p-2 rounded-lg ${amenidad.disponible
                          ? 'bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-400'
                          : 'bg-gray-100 dark:bg-gray-600 text-gray-400'
                          }`}>
                          <amenidad.icon className="w-5 h-5" />
                        </div>
                        <span className={`flex-1 font-medium ${amenidad.disponible
                          ? 'text-gray-900 dark:text-white'
                          : 'text-gray-500 dark:text-gray-400'
                          }`}>
                          {amenidad.nombre}
                        </span>
                        {amenidad.disponible && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: index * 0.1 + 0.2 }}
                          >
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </CollapsibleSection>

                {/* Características principales mejoradas */}
                <CollapsibleSection title="Características principales" icon={CheckCircle}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      {[
                        "Ventanas termopanel",
                        "Agua caliente central",
                        "Cocina equipada",
                        "Seguridad 24/7"
                      ].map((feature, index) => (
                        <motion.div
                          key={feature}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-700"
                        >
                          <div className="p-1.5 bg-blue-100 dark:bg-blue-800 rounded-lg">
                            <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                    <div className="space-y-3">
                      {[
                        "Calefacción individual",
                        "Logia incluida",
                        "Closet empotrado",
                        "Vista despejada"
                      ].map((feature, index) => (
                        <motion.div
                          key={feature}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: (index + 4) * 0.1 }}
                          className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-700"
                        >
                          <div className="p-1.5 bg-blue-100 dark:bg-blue-800 rounded-lg">
                            <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </CollapsibleSection>

                {/* Requisitos básicos mejorados */}
                <CollapsibleSection title="Requisitos básicos" icon={Shield}>
                  <div className="space-y-4">
                    {[
                      `Renta mínima ${((building.precio_desde || 290000) * 3).toLocaleString('es-CL')}`,
                      "Sin deudas vencidas",
                      "Documentación al día",
                      "Garantía o codeudor",
                      "Antecedentes comerciales limpios",
                      "Capacidad de pago demostrable"
                    ].map((requirement, index) => (
                      <motion.div
                        key={requirement}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-700"
                      >
                        <div className="p-1.5 bg-orange-100 dark:bg-orange-800 rounded-lg">
                          <Shield className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">{requirement}</span>
                      </motion.div>
                    ))}
                  </div>
                </CollapsibleSection>

                {/* Información del edificio mejorada */}
                <CollapsibleSection title="Información del edificio" icon={Info}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                      className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-700"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-lg">
                          <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h4 className="font-bold text-gray-900 dark:text-white">Ubicación</h4>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 font-medium">{building.comuna}, Santiago</p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                      className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-700"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-lg">
                          <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h4 className="font-bold text-gray-900 dark:text-white">Construcción</h4>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 font-medium">2020</p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 }}
                      className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-700"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-lg">
                          <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h4 className="font-bold text-gray-900 dark:text-white">Unidades</h4>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 font-medium">{building.units.length} departamentos</p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.4 }}
                      className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-700"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-lg">
                          <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h4 className="font-bold text-gray-900 dark:text-white">Administración</h4>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 font-medium">Profesional con conserjería 24/7</p>
                    </motion.div>
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
                  {/* Título de la unidad */}
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      Departamento {selectedUnit?.id || 'N/A'}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedUnit?.tipologia} • Piso {unitDetails.piso}
                    </p>
                  </div>

                  {/* Precio destacado mejorado */}
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border border-blue-200 dark:border-blue-700">
                    <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                      ${originalPrice.toLocaleString('es-CL')}
                    </div>
                    <div className="text-lg text-green-600 font-bold mb-1">
                      50% OFF primer mes
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      ${discountPrice.toLocaleString('es-CL')} primer mes
                    </div>
                    <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                      Sin comisión de arriendo
                    </div>
                  </div>

                  {/* Información rápida de la unidad */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 space-y-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-center mb-3">
                      Características principales
                    </h3>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="bg-white dark:bg-gray-600 rounded-lg p-2">
                        <Bed className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">
                          {unitDetails.dormitorios}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Dorm.</div>
                      </div>
                      <div className="bg-white dark:bg-gray-600 rounded-lg p-2">
                        <Bath className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">
                          {unitDetails.banos}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Baños</div>
                      </div>
                      <div className="bg-white dark:bg-gray-600 rounded-lg p-2">
                        <Square className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">
                          {unitDetails.m2}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">m²</div>
                      </div>
                    </div>
                  </div>

                  {/* CTA principal mejorado */}
                  <motion.button
                    whileHover={{
                      scale: 1.02,
                      boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)"
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all duration-300 border border-blue-500/20"
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
                    <div className="flex items-center justify-center gap-2">
                      <Calendar className="w-5 h-5" />
                      <span>Agendar visita</span>
                    </div>
                  </motion.button>

                  {/* CTA secundario mejorado */}
                  <motion.button
                    whileHover={{
                      scale: 1.02,
                      boxShadow: "0 10px 25px rgba(34, 197, 94, 0.3)"
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 border border-green-500/20"
                    tabIndex={0}
                    onClick={() => {
                      const waLink = `https://wa.me/56912345678?text=Hola! Me interesa el departamento ${selectedUnit?.tipologia} en ${building.name}. ¿Podrías darme más información?`;
                      window.open(waLink, "_blank");
                    }}
                    onKeyDown={(e) => handleKeyDown(e, () => {
                      // Trigger WhatsApp
                      const waLink = `https://wa.me/56912345678?text=Hola! Me interesa el departamento ${selectedUnit?.tipologia} en ${building.name}. ¿Podrías darme más información?`;
                      window.open(waLink, "_blank");
                    })}
                    aria-label="Contactar por WhatsApp"
                  >
                    <Phone className="w-4 h-4" aria-hidden="true" />
                    <span>WhatsApp</span>
                  </motion.button>


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

