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
  Calendar,
  MessageCircle,
  Package
} from "lucide-react";
import { ImageGallery } from "@components/gallery/ImageGallery";
import { StickyMobileCTA } from "@components/StickyMobileCTA";
import { Header } from "@components/marketing/Header";
import { track } from "@lib/analytics";
import type { Unit, Building } from "@schemas/models";
// import VisitSchedulerWrapper from "@components/forms/VisitSchedulerWrapper";

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
    <div
      className="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-300 flex items-center justify-between text-left group"
        aria-expanded={isOpen}
        aria-controls={`collapsible-${title.toLowerCase().replace(/\s+/g, '-')}`}
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
        <div
          className="p-2 rounded-lg bg-white dark:bg-gray-600 shadow-sm"
        >
          <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </div>
      </button>

      {isOpen && (
        <div
          id={`collapsible-${title.toLowerCase().replace(/\s+/g, '-')}`}
          className="overflow-hidden"
        >
          <div className="px-6 py-6 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700">
            {children}
          </div>
        </div>
      )}
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
  const [moveInDate, setMoveInDate] = useState<Date>(() => {
    const today = new Date();
    const firstDayNextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    return firstDayNextMonth;
  });
  const [includeParking, setIncludeParking] = useState(false);
  const [includeStorage, setIncludeStorage] = useState(false);
  const [isCalculationExpanded, setIsCalculationExpanded] = useState(false);

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

  // Función para calcular el primer pago optimizada
  const calculateFirstPayment = (startDate: Date) => {
    const RENT = originalPrice;
    const PARKING_RENT = includeParking ? 50000 : 0;
    const STORAGE_RENT = includeStorage ? 30000 : 0;
    const GC_RENT = Math.round(originalPrice * 0.21);
    const PROMO_RATE = 0.50;
    const DEPOSIT_MONTHS = 1;
    const DEPOSIT_INIT_PCT = 0.33;
    const COMMISSION_RATE = 0.50;
    const VAT = 0.19;
    const COMMISSION_BONIF_RATE = 1;

    const daysInMonth = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0).getDate();
    const daysCharged = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0).getTime() - startDate.getTime() + (24 * 60 * 60 * 1000);
    const daysChargedCount = Math.ceil(daysCharged / (24 * 60 * 60 * 1000));
    const prorateFactor = daysChargedCount / daysInMonth;

    const promoDays = Math.min(30, daysChargedCount);
    const regularDays = Math.max(0, daysChargedCount - 30);

    const dailyRent = RENT / 30;
    const dailyParking = PARKING_RENT / 30;
    const dailyStorage = STORAGE_RENT / 30;

    const promoRent = Math.round(dailyRent * promoDays * (1 - PROMO_RATE));
    const regularRent = Math.round(dailyRent * regularDays);
    const totalRent = promoRent + regularRent;

    const promoParking = Math.round(dailyParking * promoDays * (1 - PROMO_RATE));
    const regularParking = Math.round(dailyParking * regularDays);
    const totalParking = promoParking + regularParking;

    const promoStorage = Math.round(dailyStorage * promoDays * (1 - PROMO_RATE));
    const regularStorage = Math.round(dailyStorage * regularDays);
    const totalStorage = promoStorage + regularStorage;

    const netRentStorage = totalRent + totalParking + totalStorage;
    const proratedGC = Math.round(GC_RENT * prorateFactor);
    const totalDeposit = Math.round(DEPOSIT_MONTHS * (RENT + PARKING_RENT + STORAGE_RENT));
    const initialDeposit = Math.round(totalDeposit * DEPOSIT_INIT_PCT);

    const commissionBase = Math.round(COMMISSION_RATE * (RENT + PARKING_RENT + STORAGE_RENT));
    const commissionVAT = Math.round(commissionBase * VAT);
    const totalCommission = commissionBase + commissionVAT;
    const commissionToPay = Math.max(0, Math.round(totalCommission * (1 - COMMISSION_BONIF_RATE)));

    const totalFirstPayment = netRentStorage + proratedGC + initialDeposit + commissionToPay;

    return {
      netRentStorage,
      proratedGC,
      initialDeposit,
      commissionToPay,
      totalFirstPayment,
      daysChargedCount,
      daysInMonth,
      prorateFactor,
      promoDays,
      regularDays,
      totalRent,
      totalParking,
      totalStorage
    };
  };

  const firstPaymentCalculation = calculateFirstPayment(moveInDate);

  // Función para formatear fecha
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDateForSummary = (date: Date) => {
    return date.toLocaleDateString('es-CL', {
      day: 'numeric',
      month: 'short'
    });
  };

  const getSummaryText = () => {
    const dateText = formatDateForSummary(moveInDate);
    const total = firstPaymentCalculation.totalFirstPayment.toLocaleString('es-CL');
    return `Te mudas con $${total} el ${dateText}`;
  };

  const getSummaryPrice = () => {
    return firstPaymentCalculation.totalFirstPayment.toLocaleString('es-CL');
  };

  // Función para manejar cambio de fecha
  const handleDateChange = (date: Date) => {
    setMoveInDate(date);
  };

  // Función para enviar cotización
  const handleSendQuotation = () => {
    track("quotation_sent", {
      property_id: building.id,
      property_name: building.name,
      move_in_date: moveInDate.toISOString(),
      total_amount: firstPaymentCalculation.totalFirstPayment
    });
    alert(`Cotización enviada por email para mudanza el ${formatDate(moveInDate)}`);
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
        <main id="main-content" role="main" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
          {/* Header */}
          <div className="mb-4 lg:mb-8">
            <Header />
          </div>

          {/* Breadcrumb accesible */}
          <nav
            aria-label="Navegación de migas de pan"
            className="mb-4 lg:mb-6"
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
          </nav>

          {/* Layout principal: 3 columnas */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
            {/* Columna principal (2/3) */}
            <div className="lg:col-span-2 space-y-6 lg:space-y-8">
              {/* Hero ultra-optimizado para móvil */}
              <section className="space-y-2 lg:space-y-4">
                {/* Título y ubicación en una línea */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                  <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                    {building.name}
                  </h1>
                  <div className="flex items-center gap-1 lg:gap-2 text-sm lg:text-lg text-gray-600 dark:text-gray-400 mt-1 lg:mt-0">
                    <MapPin className="w-3 h-3 lg:w-5 lg:h-5" aria-hidden="true" />
                    <span>{building.comuna}</span>
                  </div>
                </div>

                {/* Badges ultra-compactos - Una sola línea fija */}
                <div className="flex gap-1 lg:gap-3 mb-3 lg:mb-8" role="group" aria-label="Características destacadas">
                  {primaryBadges.slice(0, 3).map((badge, index) => (
                    <div
                      key={badge.label}
                      className={`flex-1 lg:flex-none inline-flex items-center justify-center gap-1 lg:gap-3 px-2 lg:px-6 py-1.5 lg:py-3 bg-gradient-to-r ${badge.bgColor} text-white text-xs lg:text-sm font-bold rounded-lg lg:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20`}
                      tabIndex={0}
                      onKeyDown={(e) => handleKeyDown(e, () => { })}
                      role="button"
                      aria-label={badge.label}
                    >
                      <badge.icon className="w-3 h-3 lg:w-5 lg:h-5" aria-hidden="true" />
                      <span className="whitespace-nowrap hidden sm:inline">{badge.label}</span>
                      <span className="whitespace-nowrap sm:hidden">{badge.label.split(' ')[0]}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Galería de imágenes */}
              <section aria-label="Galería de imágenes de la propiedad">
                <ImageGallery images={building.gallery} />
              </section>

              {/* Sección de Precios y Promociones - Optimizada para móviles */}
              <section className="lg:hidden">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 space-y-4">
                  {/* Título de la unidad */}
                  <div className="text-center">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      Departamento {selectedUnit?.id || 'N/A'}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedUnit?.tipologia} • Piso {unitDetails.piso}
                    </p>
                  </div>

                  {/* Precio destacado - Ultra compacto estilo AssetPlan */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3">
                    <div className="space-y-2">
                      {/* Precio original tachado */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Valor arriendo</span>
                        <span className="text-sm line-through text-gray-500">${originalPrice.toLocaleString('es-CL')}</span>
                      </div>

                      {/* Precio con descuento */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-green-600">50% OFF primer mes</span>
                        <span className="text-lg font-bold text-gray-900 dark:text-white">${discountPrice.toLocaleString('es-CL')}</span>
                      </div>

                      {/* Gastos comunes */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Gasto común fijo</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">$102.000</span>
                      </div>

                      {/* Garantía */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Garantía</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">${originalPrice.toLocaleString('es-CL')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Badges de promoción adicionales - Estilo AssetPlan */}
                  <div className="flex flex-wrap gap-1">
                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 text-xs font-medium rounded-md">
                      <Info className="w-3 h-3" />
                      Comisión gratis
                    </div>
                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 text-xs font-medium rounded-md">
                      <Info className="w-3 h-3" />
                      Precio fijo por 12 meses
                    </div>
                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 text-xs font-medium rounded-md">
                      <Info className="w-3 h-3" />
                      50% OFF
                    </div>
                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 text-xs font-medium rounded-md">
                      <Info className="w-3 h-3" />
                      Garantía en cuotas
                    </div>
                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 text-xs font-medium rounded-md">
                      <Info className="w-3 h-3" />
                      Opción sin aval
                    </div>
                  </div>

                  {/* Características principales compactas */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-center mb-3 text-sm">
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

                  {/* Cálculo del primer pago compacto */}
                  <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl border border-green-200 dark:border-green-700 p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg">
                        <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        Cálculo del primer pago
                      </h3>
                    </div>

                    <div className="ml-11 mb-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Te mudas con
                        </span>
                        <span className="text-xl font-bold text-green-600 dark:text-green-400">
                          ${getSummaryPrice()}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        el {formatDateForSummary(moveInDate)}
                      </div>
                    </div>

                    <button
                      onClick={() => setIsCalculationExpanded(!isCalculationExpanded)}
                      className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors duration-75"
                    >
                      {isCalculationExpanded ? (
                        <>
                          <ChevronUp className="w-4 h-4" />
                          Ocultar detalles
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4" />
                          Ver más detalles
                        </>
                      )}
                    </button>

                    {/* Contenido desplegable con animación */}
                    <AnimatePresence>
                      {isCalculationExpanded && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: "auto" }}
                          exit={{ height: 0 }}
                          transition={{
                            duration: 0.1,
                            ease: "linear"
                          }}
                          className="overflow-hidden"
                        >
                          <div className="pt-4 space-y-4">
                            {/* Fecha de mudanza */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Fecha de mudanza
                              </label>
                              <div className="relative">
                                <input
                                  type="date"
                                  value={moveInDate.toISOString().split('T')[0]}
                                  onChange={(e) => handleDateChange(new Date(e.target.value))}
                                  min={new Date().toISOString().split('T')[0]}
                                  max={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                {firstPaymentCalculation.daysChargedCount} días del mes ({firstPaymentCalculation.daysInMonth} días totales)
                              </p>
                            </div>

                            {/* Servicios adicionales */}
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Servicios adicionales
                              </label>

                              {/* Estacionamiento */}
                              <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                                <div className="flex items-center gap-2">
                                  <Car className="w-4 h-4 text-orange-600" />
                                  <span className="text-sm text-gray-900 dark:text-white">Estacionamiento</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-gray-900 dark:text-white">$50.000</span>
                                  <input
                                    type="checkbox"
                                    checked={includeParking}
                                    onChange={(e) => setIncludeParking(e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                  />
                                </div>
                              </div>

                              {/* Bodega */}
                              <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                                <div className="flex items-center gap-2">
                                  <Package className="w-4 h-4 text-purple-600" />
                                  <span className="text-sm text-gray-900 dark:text-white">Bodega</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-gray-900 dark:text-white">$30.000</span>
                                  <input
                                    type="checkbox"
                                    checked={includeStorage}
                                    onChange={(e) => setIncludeStorage(e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Desglose detallado */}
                            <div className="space-y-2">
                              <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Desglose del primer pago</h4>

                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600 dark:text-gray-400">Renta del mes</span>
                                  <span className="font-medium text-gray-900 dark:text-white">
                                    ${originalPrice.toLocaleString('es-CL')}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600 dark:text-gray-400">Días adicionales</span>
                                  <span className="font-medium text-gray-900 dark:text-white">
                                    ${(originalPrice * (firstPaymentCalculation.daysChargedCount / firstPaymentCalculation.daysInMonth) - originalPrice).toLocaleString('es-CL')}
                                  </span>
                                </div>
                                {includeParking && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Estacionamiento</span>
                                    <span className="font-medium text-gray-900 dark:text-white">$50.000</span>
                                  </div>
                                )}
                                {includeStorage && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Bodega</span>
                                    <span className="font-medium text-gray-900 dark:text-white">$30.000</span>
                                  </div>
                                )}
                                <div className="border-t border-gray-200 dark:border-gray-600 pt-1">
                                  <div className="flex justify-between font-bold text-green-600 dark:text-green-400">
                                    <span>Total primer pago</span>
                                    <span>${firstPaymentCalculation.totalFirstPayment.toLocaleString('es-CL')}</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Sección de ahorros */}
                            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                              <h4 className="font-semibold text-green-800 dark:text-green-200 text-sm mb-2">¡Ahorras con nosotros!</h4>
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-green-700 dark:text-green-300">Comisión tradicional</span>
                                  <span className="font-medium text-green-800 dark:text-green-200">$150.000</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-green-700 dark:text-green-300">Nuestra comisión</span>
                                  <span className="font-medium text-green-800 dark:text-green-200">$0</span>
                                </div>
                                <div className="border-t border-green-200 dark:border-green-700 pt-1">
                                  <div className="flex justify-between font-bold text-green-800 dark:text-green-200">
                                    <span>Total ahorro</span>
                                    <span>$150.000</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Botón enviar cotización */}
                            <button
                              onClick={handleSendQuotation}
                              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-75 text-sm"
                            >
                              Enviar cotización por email
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* CTAs principales - Ultra compactos */}
                  <div className="space-y-2">
                    <button
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors duration-100 text-sm"
                      tabIndex={0}
                      onClick={() => {
                        const bookingForm = document.getElementById("booking-form");
                        if (bookingForm) {
                          bookingForm.scrollIntoView({ behavior: "smooth", block: "start" });
                          window.history.pushState(null, "", "#booking-form");
                          window.dispatchEvent(new HashChangeEvent("hashchange"));
                        }
                      }}
                      onKeyDown={(e) => handleKeyDown(e, () => {
                        const bookingForm = document.getElementById("booking-form");
                        if (bookingForm) {
                          bookingForm.scrollIntoView({ behavior: "smooth", block: "start" });
                          window.history.pushState(null, "", "#booking-form");
                          window.dispatchEvent(new HashChangeEvent("hashchange"));
                        }
                      })}
                      role="button"
                      aria-label="Solicitar visita"
                    >
                      Solicitar visita
                    </button>

                    <button
                      className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold py-2.5 px-4 rounded-lg transition-colors duration-100 text-sm"
                      tabIndex={0}
                      onClick={() => {
                        const link = buildWhatsAppUrl({ url: typeof window !== "undefined" ? window.location.href : undefined });
                        track("cta_whatsapp_click", { context: "property_sidebar" });
                        if (link) {
                          window.open(link, "_blank", "noopener,noreferrer");
                        }
                      }}
                      onKeyDown={(e) => handleKeyDown(e, () => {
                        const link = buildWhatsAppUrl({ url: typeof window !== "undefined" ? window.location.href : undefined });
                        track("cta_whatsapp_click", { context: "property_sidebar" });
                        if (link) {
                          window.open(link, "_blank", "noopener,noreferrer");
                        }
                      })}
                      role="button"
                      aria-label="Postular"
                    >
                      Postular
                    </button>
                  </div>
                </div>
              </section>

              {/* Secciones desplegables */}
              <section className="space-y-3 lg:space-y-4">
                {/* Detalles de la unidad mejorados */}
                <CollapsibleSection title="Detalles de la unidad" icon={Info} defaultOpen={true}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
                    {/* Información básica */}
                    <div className="flex items-center gap-2 lg:gap-3 p-2 lg:p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg lg:rounded-xl border border-indigo-200 dark:border-indigo-700">
                      <div className="p-2 bg-indigo-100 dark:bg-indigo-800 rounded-lg">
                        <Star className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white text-sm lg:text-base">{unitDetails.tipologia}</div>
                        <div className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">Tipología</div>
                      </div>
                    </div>

                    <div
                      className="flex items-center gap-2 lg:gap-3 p-2 lg:p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg lg:rounded-xl border border-indigo-200 dark:border-indigo-700"
                    >
                      <div className="p-2 bg-indigo-100 dark:bg-indigo-800 rounded-lg">
                        <Square className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white text-sm lg:text-base">{unitDetails.m2}</div>
                        <div className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">Metros cuadrados</div>
                      </div>
                    </div>

                    <div
                      className="flex items-center gap-2 lg:gap-3 p-2 lg:p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg lg:rounded-xl border border-indigo-200 dark:border-indigo-700"
                    >
                      <div className="p-2 bg-indigo-100 dark:bg-indigo-800 rounded-lg">
                        <MapPin className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white text-sm lg:text-base">{unitDetails.piso}</div>
                        <div className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">Piso</div>
                      </div>
                    </div>

                    <div
                      className="flex items-center gap-3 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-700"
                    >
                      <div className="p-2 bg-indigo-100 dark:bg-indigo-800 rounded-lg">
                        <Info className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white">{unitDetails.orientacion}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Orientación</div>
                      </div>
                    </div>

                    {/* Áreas específicas */}
                    {unitDetails.area_interior && (
                      <div
                        className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-700"
                      >
                        <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg">
                          <Square className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white">{unitDetails.area_interior}m²</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Área interior</div>
                        </div>
                      </div>
                    )}

                    {unitDetails.area_exterior && (
                      <div
                        className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-700"
                      >
                        <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg">
                          <Square className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white">{unitDetails.area_exterior}m²</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Área exterior</div>
                        </div>
                      </div>
                    )}

                    {/* Servicios y opciones */}
                    <div
                      className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-700"
                    >
                      <div className="p-2 bg-red-100 dark:bg-red-800 rounded-lg">
                        <Car className="w-5 h-5 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white">No disponible</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Estacionamiento</div>
                      </div>
                    </div>

                    <div
                      className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-700"
                    >
                      <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg">
                        <Square className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white">Desde $30.000</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Bodega</div>
                      </div>
                    </div>

                    {/* Características especiales */}
                    <div
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
                    </div>

                    <div
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
                    </div>

                    {/* Información de garantía */}
                    {unitDetails.garantia_cuotas && (
                      <div
                        className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-700"
                      >
                        <div className="p-2 bg-yellow-100 dark:bg-yellow-800 rounded-lg">
                          <Shield className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white">{unitDetails.garantia_cuotas} cuotas</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Garantía</div>
                        </div>
                      </div>
                    )}

                    {unitDetails.renta_minima && (
                      <div
                        className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-700"
                      >
                        <div className="p-2 bg-red-100 dark:bg-red-800 rounded-lg">
                          <DollarSign className="w-5 h-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white">${unitDetails.renta_minima.toLocaleString('es-CL')}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Renta mínima</div>
                        </div>
                      </div>
                    )}

                    {/* Código interno */}
                    {unitDetails.codigoInterno && (
                      <div
                        className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600"
                      >
                        <div className="p-2 bg-gray-100 dark:bg-gray-600 rounded-lg">
                          <Info className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white">{unitDetails.codigoInterno}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Código interno</div>
                        </div>
                      </div>
                    )}
                  </div>
                </CollapsibleSection>

                {/* Amenidades mejoradas */}
                <CollapsibleSection title="Amenidades del edificio" icon={Star}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {amenidades.map((amenidad, index) => (
                      <div
                        key={amenidad.nombre}
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
                          <div
                          >
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          </div>
                        )}
                      </div>
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
                        <div
                          key={feature}
                          className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-700"
                        >
                          <div className="p-1.5 bg-blue-100 dark:bg-blue-800 rounded-lg">
                            <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-3">
                      {[
                        "Calefacción individual",
                        "Logia incluida",
                        "Closet empotrado",
                        "Vista despejada"
                      ].map((feature, index) => (
                        <div
                          key={feature}
                          className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-700"
                        >
                          <div className="p-1.5 bg-blue-100 dark:bg-blue-800 rounded-lg">
                            <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CollapsibleSection>

                {/* Requisitos completos optimizados */}
                <CollapsibleSection title="Requisitos para arrendar" icon={Shield}>
                  <div className="space-y-6">
                    {/* Requisitos Generales */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                          <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">Requisitos Generales</h3>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                          <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                          <span className="text-sm text-gray-900 dark:text-white">Cédula de identidad chilena vigente</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                          <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                          <span className="text-sm text-gray-900 dark:text-white">Puntaje financiero 999 titular y aval(es)</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                          <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                          <span className="text-sm text-gray-900 dark:text-white">
                            Renta líquida igual o mayor a <span className="font-semibold text-blue-600 dark:text-blue-400">${(originalPrice * 3).toLocaleString('es-CL')}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Tipos de Trabajador */}
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Trabajador Dependiente */}
                      <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-700">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg">
                            <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                          </div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">Trabajador Dependiente</h3>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span className="text-sm text-gray-900 dark:text-white">Tres últimas liquidaciones de sueldo</span>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span className="text-sm text-gray-900 dark:text-white">Certificado de cotizaciones de AFP</span>
                          </div>
                        </div>
                      </div>

                      {/* Trabajador Independiente */}
                      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-700">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-lg">
                            <Square className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                          </div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">Trabajador Independiente</h3>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                            <CheckCircle className="w-4 h-4 text-purple-500 flex-shrink-0" />
                            <span className="text-sm text-gray-900 dark:text-white">Informe mensual de boletas de honorario (6 meses)</span>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                            <CheckCircle className="w-4 h-4 text-purple-500 flex-shrink-0" />
                            <span className="text-sm text-gray-900 dark:text-white">Carpeta tributaria o formulario 29 (6 meses)</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Nota para Extranjeros */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg flex-shrink-0">
                          <MessageCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                          Si eres extranjero y tienes cédula vencida puedes solicitar visita y/o postular presentando tu visa en trámite.
                        </p>
                      </div>
                    </div>
                  </div>
                </CollapsibleSection>

                {/* Información del edificio mejorada */}
                <CollapsibleSection title="Información del edificio" icon={Info}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div
                      className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-700"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-lg">
                          <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h4 className="font-bold text-gray-900 dark:text-white">Ubicación</h4>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 font-medium">{building.comuna}, Santiago</p>
                    </div>

                    <div
                      className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-700"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-lg">
                          <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h4 className="font-bold text-gray-900 dark:text-white">Construcción</h4>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 font-medium">2020</p>
                    </div>

                    <div
                      className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-700"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-lg">
                          <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h4 className="font-bold text-gray-900 dark:text-white">Unidades</h4>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 font-medium">{building.units.length} departamentos</p>
                    </div>

                    <div
                      className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-700"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-lg">
                          <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h4 className="font-bold text-gray-900 dark:text-white">Administración</h4>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 font-medium">Profesional con conserjería 24/7</p>
                    </div>
                  </div>
                </CollapsibleSection>
              </section>

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

              {/* Sticky Mobile CTA */}
              <StickyMobileCTA />
            </div>

            {/* Sidebar sticky (1/3) - Oculto en móviles */}
            <aside className="hidden lg:block lg:col-span-1">
              <div className="sticky top-8">
                <div className="bg-white dark:bg-gray-800 rounded-xl lg:rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 lg:p-6 space-y-4 lg:space-y-6">
                  {/* Título de la unidad */}
                  <div className="text-center">
                    <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      Departamento {selectedUnit?.id || 'N/A'}
                    </h2>
                    <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">
                      {selectedUnit?.tipologia} • Piso {unitDetails.piso}
                    </p>
                  </div>

                  {/* Precio destacado mejorado - Ultra compacto */}
                  <div className="text-center p-3 lg:p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg lg:rounded-xl border border-blue-200 dark:border-blue-700">
                    <div className="text-2xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-1 lg:mb-2">
                      ${originalPrice.toLocaleString('es-CL')}
                    </div>
                    <div className="text-sm lg:text-lg text-green-600 font-bold mb-1">
                      50% OFF primer mes
                    </div>
                    <div className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">
                      ${discountPrice.toLocaleString('es-CL')} primer mes
                    </div>
                    <div className="mt-2 lg:mt-3 text-xs text-gray-500 dark:text-gray-400">
                      Sin comisión de arriendo
                    </div>
                  </div>

                  {/* Información rápida de la unidad */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg lg:rounded-xl p-3 lg:p-4 space-y-2 lg:space-y-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-center mb-2 lg:mb-3 text-sm lg:text-base">
                      Características principales
                    </h3>
                    <div className="grid grid-cols-3 gap-2 lg:gap-3 text-center">
                      <div className="bg-white dark:bg-gray-600 rounded-lg p-1.5 lg:p-2">
                        <Bed className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600 mx-auto mb-1" />
                        <div className="text-xs lg:text-sm font-semibold text-gray-900 dark:text-white">
                          {unitDetails.dormitorios}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Dorm.</div>
                      </div>
                      <div className="bg-white dark:bg-gray-600 rounded-lg p-1.5 lg:p-2">
                        <Bath className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600 mx-auto mb-1" />
                        <div className="text-xs lg:text-sm font-semibold text-gray-900 dark:text-white">
                          {unitDetails.banos}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Baños</div>
                      </div>
                      <div className="bg-white dark:bg-gray-600 rounded-lg p-1.5 lg:p-2">
                        <Square className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600 mx-auto mb-1" />
                        <div className="text-xs lg:text-sm font-semibold text-gray-900 dark:text-white">
                          {unitDetails.m2}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">m²</div>
                      </div>
                    </div>
                  </div>

                  {/* Cálculo del primer pago - Rediseñado */}
                  <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg lg:rounded-xl border border-green-200 dark:border-green-700 p-3 lg:p-4">
                    {/* Header principal */}
                    <div className="flex items-center gap-2 lg:gap-3 mb-2 lg:mb-3">
                      <div className="p-1.5 lg:p-2 bg-green-100 dark:bg-green-800 rounded-lg">
                        <DollarSign className="w-4 h-4 lg:w-5 lg:h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm lg:text-base">
                        Cálculo del primer pago
                      </h3>
                    </div>

                    {/* Resumen destacado */}
                    <div className="ml-8 lg:ml-11 mb-3 lg:mb-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">
                          Te mudas con
                        </span>
                        <span className="text-lg lg:text-xl font-bold text-green-600 dark:text-green-400">
                          ${getSummaryPrice()}
                        </span>
                      </div>
                      <div className="text-xs lg:text-sm text-gray-500 dark:text-gray-400 mt-1">
                        el {formatDateForSummary(moveInDate)}
                      </div>
                    </div>

                    {/* Botón ver más detalles */}
                    <button
                      onClick={() => setIsCalculationExpanded(!isCalculationExpanded)}
                      className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors duration-75"
                    >
                      {isCalculationExpanded ? (
                        <>
                          <ChevronUp className="w-4 h-4" />
                          Ocultar detalles
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4" />
                          Ver más detalles
                        </>
                      )}
                    </button>

                    {/* Contenido desplegable con animación */}
                    <AnimatePresence>
                      {isCalculationExpanded && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: "auto" }}
                          exit={{ height: 0 }}
                          transition={{
                            duration: 0.1,
                            ease: "linear"
                          }}
                          className="overflow-hidden"
                        >
                          <div className="pt-4 space-y-4">
                            {/* Fecha de mudanza */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Fecha de mudanza
                              </label>
                              <div className="relative">
                                <input
                                  type="date"
                                  value={moveInDate.toISOString().split('T')[0]}
                                  onChange={(e) => handleDateChange(new Date(e.target.value))}
                                  min={new Date().toISOString().split('T')[0]}
                                  max={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                {firstPaymentCalculation.daysChargedCount} días del mes ({firstPaymentCalculation.daysInMonth} días totales)
                              </p>
                            </div>

                            {/* Servicios adicionales */}
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Servicios adicionales
                              </label>

                              {/* Estacionamiento */}
                              <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                                <div className="flex items-center gap-2">
                                  <Car className="w-4 h-4 text-orange-600" />
                                  <span className="text-sm text-gray-900 dark:text-white">Estacionamiento</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-gray-900 dark:text-white">$50.000</span>
                                  <input
                                    type="checkbox"
                                    checked={includeParking}
                                    onChange={(e) => setIncludeParking(e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                  />
                                </div>
                              </div>

                              {/* Bodega */}
                              <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                                <div className="flex items-center gap-2">
                                  <Square className="w-4 h-4 text-purple-600" />
                                  <span className="text-sm text-gray-900 dark:text-white">Bodega</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-gray-900 dark:text-white">$30.000</span>
                                  <input
                                    type="checkbox"
                                    checked={includeStorage}
                                    onChange={(e) => setIncludeStorage(e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Detalle del cálculo */}
                            <div className="space-y-2">
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Arriendo prorrateado:</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                  ${firstPaymentCalculation.netRentStorage.toLocaleString('es-CL')}
                                </span>
                              </div>
                              <div className="text-xs text-gray-500 pl-2">
                                • {firstPaymentCalculation.promoDays} días con 50% OFF: ${Math.round((originalPrice / 30) * firstPaymentCalculation.promoDays * 0.5).toLocaleString('es-CL')}
                                {firstPaymentCalculation.regularDays > 0 && (
                                  <span>
                                    <br />• {firstPaymentCalculation.regularDays} días precio normal: ${Math.round((originalPrice / 30) * firstPaymentCalculation.regularDays).toLocaleString('es-CL')}
                                  </span>
                                )}
                              </div>
                              {includeParking && (
                                <div className="flex justify-between items-center text-sm">
                                  <span className="text-gray-600 dark:text-gray-400">Estacionamiento:</span>
                                  <span className="font-medium text-orange-600">
                                    ${firstPaymentCalculation.totalParking.toLocaleString('es-CL')}
                                  </span>
                                </div>
                              )}
                              {includeStorage && (
                                <div className="flex justify-between items-center text-sm">
                                  <span className="text-gray-600 dark:text-gray-400">Bodega:</span>
                                  <span className="font-medium text-purple-600">
                                    ${firstPaymentCalculation.totalStorage.toLocaleString('es-CL')}
                                  </span>
                                </div>
                              )}
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Gastos comunes:</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                  ${firstPaymentCalculation.proratedGC.toLocaleString('es-CL')}
                                </span>
                              </div>
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Garantía inicial (33%):</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                  ${firstPaymentCalculation.initialDeposit.toLocaleString('es-CL')}
                                </span>
                              </div>
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Comisión corretaje:</span>
                                <span className="font-medium text-green-600">
                                  ${firstPaymentCalculation.commissionToPay.toLocaleString('es-CL')}
                                </span>
                              </div>
                              <div className="border-t border-gray-200 dark:border-gray-600 pt-2">
                                <div className="flex justify-between items-center">
                                  <span className="font-semibold text-gray-900 dark:text-white">Total primer pago:</span>
                                  <span className="text-lg font-bold text-green-600">
                                    ${firstPaymentCalculation.totalFirstPayment.toLocaleString('es-CL')}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Ahorros */}
                            <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-3">
                              <h4 className="text-sm font-semibold text-green-800 dark:text-green-200 mb-2">
                                ¡Te estás ahorrando!
                              </h4>
                              <div className="space-y-1 text-xs">
                                <div className="flex justify-between">
                                  <span className="text-green-700 dark:text-green-300">50% OFF primer mes:</span>
                                  <span className="font-semibold text-green-800 dark:text-green-200">
                                    ${Math.round((originalPrice / 30) * firstPaymentCalculation.promoDays * 0.5 + (includeParking ? (50000 / 30) * firstPaymentCalculation.promoDays * 0.5 : 0) + (includeStorage ? (30000 / 30) * firstPaymentCalculation.promoDays * 0.5 : 0)).toLocaleString('es-CL')}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-green-700 dark:text-green-300">Comisión gratis:</span>
                                  <span className="font-semibold text-green-800 dark:text-green-200">
                                    ${Math.round((originalPrice * 0.5) * 1.19).toLocaleString('es-CL')}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Botón enviar cotización */}
                            <button
                              onClick={handleSendQuotation}
                              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-75 text-sm"
                            >
                              Enviar cotización por email
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* CTA principal mejorado */}
                  <button
                    className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 text-white font-bold py-3 lg:py-4 px-4 lg:px-6 rounded-lg lg:rounded-xl shadow-lg transition-colors duration-100 border border-blue-500/20 text-sm lg:text-base"
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
                  </button>

                  {/* CTA secundario mejorado */}
                  <button
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-2.5 lg:py-3 px-4 lg:px-6 rounded-lg lg:rounded-xl shadow-lg transition-colors duration-100 flex items-center justify-center gap-2 border border-green-500/20 text-sm lg:text-base"
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
                  </button>


                </div>
              </div>
            </aside>
          </div>
        </main>

        {/* Visit Scheduler Modal */}
        {/* <VisitSchedulerWrapper
          buildingName={building.name}
          buildingId={building.id}
          unitId={selectedUnit?.id}
        /> */}

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

