"use client";

import React, { useState, useEffect, Suspense, lazy, useCallback, useRef, useMemo } from "react";
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

// V3 Components imports
import { StickyCtaBar, StickyCtaSidebar } from "@components/ui/StickyCtaBar";
import { PriceBreakdown } from "@components/property/PriceBreakdown";
import { AmenityChips, type AmenityChip } from "@components/property/AmenityChips";
import { BuildingLinkCard } from "@components/building/BuildingLinkCard";

// Legacy components
import { StickyMobileCTA } from "@components/StickyMobileCTA";
import { Header } from "@components/marketing/Header";
import { track } from "@lib/analytics";
import type { Unit, Building } from "@schemas/models";

// Lazy load components for better performance - V3 Optimized
const RelatedList = lazy(() => import("@components/lists/RelatedList").then(module => ({ default: module.RelatedList })));
const ImageGallery = lazy(() => import("@components/gallery/ImageGallery").then(module => ({ default: module.ImageGallery })));
const VisitSchedulerWrapper = lazy(() => import("@components/forms/VisitSchedulerWrapper").then(module => ({ default: module.default })));

// Design tokens for consistent styling
const DESIGN_TOKENS = {
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem'
  },
  colors: {
    primary: {
      50: '#eff6ff',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8'
    },
    success: {
      50: '#f0fdf4',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d'
    },
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827'
    }
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem'
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
  }
} as const;

// Custom hooks for V3 optimizations
const useIntersectionObserver = (callback: () => void, options = {}) => {
  const observerRef = useCallback((node: HTMLElement | null) => {
    if (node) {
      const observer = new IntersectionObserver(callback, {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      });
      observer.observe(node);
      return () => observer.disconnect();
    }
  }, [callback, options]);

  return observerRef;
};

const useThrottledCallback = (callback: Function, delay: number) => {
  const lastRun = useRef(Date.now());

  return useCallback((...args: any[]) => {
    if (Date.now() - lastRun.current >= delay) {
      callback(...args);
      lastRun.current = Date.now();
    }
  }, [callback, delay]);
};

const useLocalStorage = <T,>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
};

// Performance utilities
const memoizedCalculation = (fn: Function, deps: any[]) => {
  return useMemo(() => fn(), deps);
};

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

// Enhanced Loading Skeleton Component - V3
const PropertySkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content skeleton */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hero section skeleton */}
          <div className="space-y-4">
            <div className="h-8 bg-white/10 rounded-xl animate-pulse"></div>
            <div className="h-6 bg-white/10 rounded-lg animate-pulse w-3/4"></div>
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-8 bg-white/10 rounded-lg animate-pulse flex-1"></div>
              ))}
            </div>
          </div>
          
          {/* Gallery skeleton */}
          <div className="aspect-video bg-white/10 rounded-2xl animate-pulse"></div>
          
          {/* Content sections skeleton */}
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-3">
                <div className="h-6 bg-white/10 rounded animate-pulse w-1/3"></div>
                <div className="h-4 bg-white/10 rounded animate-pulse"></div>
                <div className="h-4 bg-white/10 rounded animate-pulse w-5/6"></div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Sidebar skeleton */}
        <div className="lg:col-span-1">
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-white/10 rounded-xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Collapsible Section Component
const CollapsibleSection: React.FC<{
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}> = ({ title, icon: Icon, children, defaultExpanded = false }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <section className="bg-white dark:bg-gray-800 rounded-xl lg:rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 lg:p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        aria-expanded={isExpanded}
        aria-controls={`section-${title.toLowerCase().replace(/\s+/g, '-')}`}
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        </div>
        <ChevronRight
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
            isExpanded ? 'rotate-90' : ''
          }`}
        />
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
            id={`section-${title.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <div className="p-4 lg:p-6 pt-0 lg:pt-0">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

// SEO Optimizations
const SEO_OPTIMIZATIONS = {
  structuredData: {
    "@context": "https://schema.org",
    "@type": "Apartment",
    "name": "Departamento en arriendo",
    "description": "Departamento moderno y funcional disponible para arriendo",
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

  // Cálculo del primer pago optimizado
  const calculateFirstPayment = useCallback(() => {
    const today = new Date();
    const moveIn = new Date(moveInDate);
    const daysInMonth = new Date(moveIn.getFullYear(), moveIn.getMonth() + 1, 0).getDate();
    const daysChargedCount = daysInMonth - moveIn.getDate() + 1;
    
    const proratedRent = (originalPrice / daysInMonth) * daysChargedCount;
    const proratedGC = (102000 / daysInMonth) * daysChargedCount;
    const parkingCost = includeParking ? 50000 : 0;
    const storageCost = includeStorage ? 30000 : 0;
    const initialDeposit = originalPrice * 0.33; // 33% de garantía
    const commissionToPay = 0; // 0% comisión
    
    const totalFirstPayment = proratedRent + proratedGC + parkingCost + storageCost + initialDeposit + commissionToPay;
    
    return {
      proratedRent,
      proratedGC,
      parkingCost,
      storageCost,
      initialDeposit,
      commissionToPay,
      totalFirstPayment,
      daysChargedCount,
      daysInMonth,
      promoDays: daysChargedCount,
      totalParking: parkingCost,
      totalStorage: storageCost
    };
  }, [originalPrice, moveInDate, includeParking, includeStorage]);

  const firstPaymentCalculation = memoizedCalculation(calculateFirstPayment, [originalPrice, moveInDate, includeParking, includeStorage]);

  // Funciones auxiliares
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-CL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatDateForSummary = (date: Date) => {
    return date.toLocaleDateString('es-CL', {
      day: 'numeric',
      month: 'short'
    });
  };

  const getSummaryPrice = () => {
    return firstPaymentCalculation.totalFirstPayment.toLocaleString('es-CL');
  };

  const handleDateChange = (date: Date) => {
    setMoveInDate(date);
  };

  const handleSendQuotation = () => {
    // Implementar envío de cotización
    console.log('Enviando cotización...');
  };

  const handleKeyDown = (e: React.KeyboardEvent, callback: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      callback();
    }
  };

  // Amenidades para el componente V3
  const amenityChips: AmenityChip[] = [
    { icon: Wifi, label: "WiFi", category: "basic" },
    { icon: Dumbbell, label: "Gimnasio", category: "luxury" },
    { icon: Coffee, label: "Cafetería", category: "luxury" },
    { icon: Car, label: "Estacionamiento", category: "basic" },
    { icon: Shield, label: "Seguridad 24/7", category: "security" },
    { icon: Users, label: "Conserjería", category: "basic" },
    { icon: Package, label: "Bodega", category: "basic" },
    { icon: Star, label: "Terraza", category: "outdoor" }
  ];

  // Loading state
  if (isLoading) {
    return <PropertySkeleton />;
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Error
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
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

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content (2/3) */}
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
                <Suspense fallback={<div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />}>
                  <ImageGallery images={building.gallery} />
                </Suspense>
              </section>

              {/* V3 Price Breakdown para móvil */}
              <section className="lg:hidden">
                <PriceBreakdown
                  rent={originalPrice}
                  commonExpenses={102000}
                  deposit={originalPrice}
                  fee={0}
                  currency="CLP"
                />
              </section>

              {/* V3 Amenity Chips */}
              <section>
                <AmenityChips items={amenityChips} maxVisible={6} />
              </section>

              {/* V3 Building Link Card */}
              <section>
                <BuildingLinkCard
                  buildingName={building.name}
                  photo={building.gallery[0] || "/images/edificio/original_79516B40-7BA9-4F4E-4F7D-7BA4C0A2A938-mg0578.jpg"}
                  href={`/building/${building.slug}`}
                  unitCount={building.units.length}
                  commune={building.comuna}
                  description={`Edificio moderno en ${building.comuna} con ${building.units.length} unidades disponibles`}
                />
              </section>

              {/* Propiedades relacionadas */}
              <section aria-label="Propiedades relacionadas" className="mt-12 lg:mt-16">
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

              {/* V3 Sticky CTA */}
              <StickyCtaBar
                priceMonthly={originalPrice}
                onBook={() => {
                  console.log('Botón Agendar visita clickeado');
                  window.dispatchEvent(new CustomEvent('openVisitScheduler'));
                }}
                onWhatsApp={() => {
                  const waLink = `https://wa.me/56912345678?text=Hola! Me interesa el departamento ${selectedUnit?.tipologia} en ${building.name}. ¿Podrías darme más información?`;
                  window.open(waLink, "_blank");
                }}
                propertyId={building.id}
                commune={building.comuna}
              />
            </div>

            {/* V3 Sticky CTA Sidebar for Desktop */}
            <StickyCtaSidebar
              priceMonthly={originalPrice}
              onBook={() => {
                console.log('Botón Agendar visita clickeado');
                window.dispatchEvent(new CustomEvent('openVisitScheduler'));
              }}
              onWhatsApp={() => {
                const waLink = `https://wa.me/56912345678?text=Hola! Me interesa el departamento ${selectedUnit?.tipologia} en ${building.name}. ¿Podrías darme más información?`;
                window.open(waLink, "_blank");
              }}
              propertyId={building.id}
              commune={building.comuna}
            />
          </div>
        </main>

        {/* Visit Scheduler Modal */}
        <Suspense fallback={null}>
          <VisitSchedulerWrapper
            buildingName={building.name}
            buildingId={building.id}
            unitId={selectedUnit?.id}
          />
        </Suspense>

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
