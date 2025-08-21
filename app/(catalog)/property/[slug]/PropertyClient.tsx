"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Flame,
  DollarSign,
  Shield,
  ChevronRight,
  ChevronDown,
  CheckCircle,
  Phone,
  MessageCircle,
  ExternalLink,
  MapPin,
  Bed,
  Bath,
  Square,
  Star,
  Calendar,
  Package,
  Users,
  Building2
} from "lucide-react";
import { ImageGallery } from "@components/gallery/ImageGallery";
import { UnitSelector } from "@components/UnitSelector";
import { CostTable } from "@components/cost/CostTable";
import { BookingForm } from "@components/forms/BookingForm";
import { RelatedList } from "@components/lists/RelatedList";
import { StickyMobileCTA } from "@components/StickyMobileCTA";
import { PropertyQuotationPanel } from "@components/quotation/PropertyQuotationPanel";
import { Header } from "@components/marketing/Header";
import { buildWaLink } from "@lib/whatsapp";
import { track } from "@lib/analytics";
import { PromotionType } from "@schemas/models";
import type { Unit, Building, PromotionBadge as PromotionBadgeType } from "@schemas/models";

type PropertyClientProps = {
  building: Building & { precioDesde: number | null };
  relatedBuildings: (Building & { precioDesde: number | null })[];
  defaultUnitId?: string;
};



export function PropertyClient({ building, relatedBuildings, defaultUnitId }: PropertyClientProps) {
  const availableUnits = building.units.filter(unit => unit.disponible);

  // Seleccionar unidad por defecto basada en defaultUnitId o la primera disponible
  const getDefaultUnit = () => {
    if (defaultUnitId) {
      const unit = availableUnits.find(u => u.id === defaultUnitId);
      if (unit) return unit;
    }
    return availableUnits[0];
  };

  const [selectedUnit, setSelectedUnit] = useState<Unit>(getDefaultUnit());
  const [showUrgencyBanner, setShowUrgencyBanner] = useState(true);
  const [activeTab, setActiveTab] = useState<'detalle' | 'caracteristicas' | 'requisitos' | 'faq'>('detalle');
  const [moveInDate, setMoveInDate] = useState<Date>(() => {
    const today = new Date();
    const firstDayNextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    return firstDayNextMonth;
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

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

  // Availability banner
  const availableCount = availableUnits.length;
  const availabilityText = availableCount === 1
    ? "Última unidad disponible"
    : `${availableCount} unidades disponibles`;

  // Simular datos dinámicos para urgencia
  const recentVisitors = Math.floor(Math.random() * 15) + 5;
  const lastReservation = Math.floor(Math.random() * 60) + 5; // minutos

  // Datos estratégicos basados en AssetPlan
  const originalPrice = selectedUnit?.price || 290000;
  const discountPrice = Math.round(originalPrice * 0.5); // 50% OFF primer mes

  // Función para calcular el primer pago según la lógica proporcionada
  const calculateFirstPayment = (startDate: Date) => {
    // Variables de entrada según la lógica
    const RENT = originalPrice;
    const STORAGE_RENT = 0; // Sin bodega por defecto
    const GC_RENT = Math.round(originalPrice * 0.21); // Gasto común 21% del arriendo
    const GC_STORAGE = 0; // Sin gasto común de bodega
    const PROMO_RATE = 0.50; // 50% de descuento
    const DEPOSIT_MONTHS = 1;
    const DEPOSIT_INIT_PCT = 0.33; // 33% inicial de garantía
    const COMMISSION_RATE = 0.50; // 50% de comisión
    const VAT = 0.19; // IVA 19%
    const COMMISSION_BONIF_RATE = 1; // 100% bonificada
    const EXTRA_FEES = 0; // Sin costos extra

    // Cálculos según la lógica
    const daysInMonth = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0).getDate();
    const daysCharged = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0).getTime() - startDate.getTime() + (24 * 60 * 60 * 1000);
    const daysChargedCount = Math.ceil(daysCharged / (24 * 60 * 60 * 1000));
    const prorateFactor = daysChargedCount / daysInMonth;

    const monthlyRentStorage = RENT + STORAGE_RENT;
    const proratedRentStorage = Math.round(monthlyRentStorage * prorateFactor);
    const promoDiscount = Math.round(proratedRentStorage * PROMO_RATE);
    const netRentStorage = proratedRentStorage - promoDiscount;

    const monthlyGC = GC_RENT + GC_STORAGE;
    const proratedGC = Math.round(monthlyGC * prorateFactor);

    const totalDeposit = Math.round(DEPOSIT_MONTHS * monthlyRentStorage);
    const initialDeposit = Math.round(totalDeposit * DEPOSIT_INIT_PCT);

    const commissionBase = Math.round(COMMISSION_RATE * monthlyRentStorage);
    const commissionVAT = Math.round(commissionBase * VAT);
    const totalCommission = commissionBase + commissionVAT;
    const commissionToPay = Math.max(0, Math.round(totalCommission * (1 - COMMISSION_BONIF_RATE)));

    const totalFirstPayment = netRentStorage + proratedGC + initialDeposit + EXTRA_FEES + commissionToPay;

    return {
      netRentStorage,
      proratedGC,
      initialDeposit,
      commissionToPay,
      totalFirstPayment,
      daysChargedCount,
      daysInMonth,
      prorateFactor
    };
  };

  const firstPaymentCalculation = calculateFirstPayment(moveInDate);

  // Función para obtener la fecha máxima (30 días desde hoy)
  const getMaxDate = () => {
    const today = new Date();
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 30);
    return maxDate;
  };

  // Función para formatear fecha
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Función para manejar cambio de fecha
  const handleDateChange = (date: Date) => {
    setMoveInDate(date);
    setShowDatePicker(false);
  };

  // Función para enviar cotización por email
  const handleSendQuotation = () => {
    track("quotation_sent", {
      property_id: building.id,
      property_name: building.name,
      move_in_date: moveInDate.toISOString(),
      total_amount: firstPaymentCalculation.totalFirstPayment
    });

    // Aquí se implementaría la lógica para enviar el email
    // Por ahora solo mostraremos un alert
    alert(`Cotización enviada por email para mudanza el ${formatDate(moveInDate)}`);
  };

  // PASO 2: Badges estratégicos optimizados (solo 3 principales)
  const strategicBadges = [
    { label: "Comisión gratis", icon: DollarSign, color: "from-green-500 to-emerald-500" },
    { label: "50% OFF primer mes", icon: Flame, color: "from-orange-500 to-red-500" },
    { label: "Garantía en cuotas", icon: Shield, color: "from-indigo-500 to-blue-500" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Banner de urgencia */}
      <AnimatePresence>
        {showUrgencyBanner && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 text-white py-3 relative overflow-hidden"
          >
            <div className="container mx-auto max-w-7xl px-4">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-xs sm:text-sm font-medium">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-4 h-4 sm:w-5 sm:h-5 bg-white/20 rounded-full flex items-center justify-center"
                >
                  <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                </motion.div>
                <span>🔥 {recentVisitors} personas viendo</span>
                <span className="hidden sm:inline">•</span>
                <span>⏰ Última reserva hace {lastReservation} min</span>
                <span className="hidden sm:inline">•</span>
                <span>🎯 {availableCount} unidades disponibles</span>
                <button
                  onClick={() => setShowUrgencyBanner(false)}
                  className="absolute right-4 text-white/80 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main id="main-content" role="main" className="min-h-screen bg-bg text-text">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {/* Header Section */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Header />
            <div className="border-b border-border/50 my-6"></div>
          </motion.div>

          {/* Breadcrumbs estratégicos */}
          <motion.div
            className="mb-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
              <a href="/" className="hover:text-foreground transition-colors">Home</a>
              <ChevronRight className="w-4 h-4" />
              <a href="/property" className="hover:text-foreground transition-colors">Arriendo departamentos</a>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground">{building.comuna}</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground font-medium">{building.name}</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground font-medium">{selectedUnit?.tipologia}</span>
            </nav>
          </motion.div>

          {/* PASO 1: HERO SECTION REESTRUCTURADO - 2 COLUMNAS */}
          <div className="mb-8">
            {/* Availability Banner compacto */}
            {availableCount > 0 && (
              <div className="mb-4">
                <div className="inline-flex items-center px-3 py-1.5 bg-orange-500/90 text-white text-xs rounded-lg font-medium">
                  <span className="animate-pulse mr-2">●</span>
                  {availabilityText}
                </div>
              </div>
            )}
          </div>

          {/* NÚMERO DEL DEPARTAMENTO */}
          <div className="mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Departamento {selectedUnit?.id || '207'}
            </h1>
          </div>

          {/* BADGES PRINCIPALES - ESTILO GRÁFICO ANTERIOR */}
          <div className="flex flex-wrap gap-2 mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-xs font-medium rounded-lg border border-green-200 dark:border-green-800">
              <DollarSign className="w-3 h-3" />
              Comisión gratis
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-lg border border-blue-200 dark:border-blue-800">
              <Star className="w-3 h-3" />
              Administración Pro
            </div>
          </div>

          {/* LAYOUT 2 COLUMNAS - DISEÑO MINIMALISTA OPTIMIZADO */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* COLUMNA IZQUIERDA - INFORMACIÓN PRINCIPAL INTEGRADA */}
            <div>
              {/* CONTENEDOR PRINCIPAL INTEGRADO - PRECIOS, PROMOCIONES Y CTAS */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 space-y-5">
                {/* UBICACIÓN */}
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {building.name} - {building.address}, {building.comuna}
                  </p>
                </div>

                {/* PRECIOS */}
                <div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Valor arriendo</h2>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Arriendo mensual:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">${originalPrice.toLocaleString('es-CL')}</span>
                    </div>
                    <div className="flex justify-between items-center bg-orange-50 dark:bg-orange-900/20 p-2 rounded-lg border border-orange-200 dark:border-orange-800">
                      <span className="text-sm text-orange-700 dark:text-orange-300 font-medium">¡50% OFF primer mes!</span>
                      <span className="text-lg font-bold text-orange-600 dark:text-orange-400">${discountPrice.toLocaleString('es-CL')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Gasto común fijo:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">${Math.round(originalPrice * 0.21).toLocaleString('es-CL')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Garantía:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">${originalPrice.toLocaleString('es-CL')}</span>
                    </div>
                    <div className="flex justify-between items-center bg-green-50 dark:bg-green-900/20 p-2 rounded-lg border border-green-200 dark:border-green-800">
                      <span className="text-sm text-green-700 dark:text-green-300 font-medium">Comisión corretaje:</span>
                      <span className="text-sm line-through text-green-600 dark:text-green-400 font-medium">${Math.round((originalPrice * 0.5) * 1.19).toLocaleString('es-CL')}</span>
                    </div>
                  </div>
                </div>

                {/* BADGES DE PROMOCIÓN INTEGRADOS - MÁS PEQUEÑOS */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-900 dark:text-white mb-2">Promociones actuales</h3>
                  <div className="grid grid-cols-2 gap-1.5">
                    <div className="flex items-center gap-1.5 p-1.5 bg-orange-50 dark:bg-orange-900/20 rounded-md border border-orange-200 dark:border-orange-800">
                      <Flame className="w-3 h-3 text-orange-600 dark:text-orange-400" />
                      <span className="text-xs font-medium text-orange-700 dark:text-orange-300">50% OFF primer mes</span>
                    </div>
                    <div className="flex items-center gap-1.5 p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
                      <Shield className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                      <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Garantía en cuotas</span>
                    </div>
                    <div className="flex items-center gap-1.5 p-1.5 bg-purple-50 dark:bg-purple-900/20 rounded-md border border-purple-200 dark:border-purple-800">
                      <Calendar className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                      <span className="text-xs font-medium text-purple-700 dark:text-purple-300">Precio fijo 12 meses</span>
                    </div>
                    <div className="flex items-center gap-1.5 p-1.5 bg-indigo-50 dark:bg-indigo-900/20 rounded-md border border-indigo-200 dark:border-indigo-800">
                      <CheckCircle className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                      <span className="text-xs font-medium text-indigo-700 dark:text-indigo-300">Sin gastos ocultos</span>
                    </div>
                  </div>
                </div>

                {/* CTAS INTEGRADOS */}
                <div className="space-y-2">
                  <button
                    onClick={handleBookingClick}
                    className="w-full inline-flex items-center justify-center px-3 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 transition-colors min-h-[40px]"
                    aria-label="Agendar visita a la propiedad"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Agendar visita
                  </button>

                  {whatsappUrl && (
                    <a
                      href={whatsappUrl}
                      onClick={handleWhatsAppClick}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center px-3 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500 transition-colors min-h-[40px]"
                      aria-label="Contactar por WhatsApp sobre esta propiedad"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Hablar por WhatsApp
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* COLUMNA DERECHA - GALERÍA */}
            <div>
              <section aria-label="Galería de imágenes">
                <ImageGallery
                  images={building.gallery}
                  media={building.media}
                  coverImage={building.coverImage}
                  autoPlay={true}
                  autoPlayInterval={4000}
                />
              </section>

              {/* BOTÓN VER VIDEO */}
              <div className="mt-4">
                <button
                  className="w-full inline-flex items-center justify-center px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 transition-colors min-h-[48px] shadow-sm border border-blue-200 dark:border-blue-800"
                  aria-label="Ver video de la propiedad"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  Ver video
                </button>
              </div>
            </div>
          </div>

          {/* CARACTERÍSTICAS PRINCIPALES - ANCHURA COMPLETA */}
          <div className="mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Características principales</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {/* Dormitorios */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Bed className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">1</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Dormitorio</div>
                  </div>
                </div>

                {/* Baños */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Bath className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">1</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Baño</div>
                  </div>
                </div>

                {/* Metros cuadrados interior */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Square className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">29</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">m² interior</div>
                  </div>
                </div>

                {/* Metros cuadrados exterior */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">0</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">m² exterior</div>
                  </div>
                </div>

                {/* Piso */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v2H7V5zm6 4H7v2h6V9zm0 4H7v2h6v-2z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">2</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Piso</div>
                  </div>
                </div>

                {/* Orientación */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Orientación</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Norte</div>
                  </div>
                </div>

                {/* Mascotas */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Mascotas</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Permitidas</div>
                  </div>
                </div>

                {/* Tipo de amoblado */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Amoblado</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Completo</div>
                  </div>
                </div>

                {/* Estacionamiento */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 2h12v8H6V6z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Estacionamiento</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Opcional</div>
                  </div>
                </div>

                {/* Bodega */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Package className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Bodega</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Opcional</div>
                  </div>
                </div>

                {/* Habitantes */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Habitantes</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">2 Max</div>
                  </div>
                </div>

                {/* Cerradura */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Shield className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Cerradura</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Electrónica</div>
                  </div>
                </div>
              </div>

              {/* Metro cercano - Información de ubicación */}
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Ícono de metro con imagen */}
                    <div className="relative">
                      <img
                        src="/images/metro/metro-icon.png"
                        alt="Metro Línea 1"
                        className="w-6 h-6"
                      />
                      {/* Círculo rojo de línea 1 */}
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">1</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">Metro Ecuador</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Línea 1 • 5 minutos, 450 metros</div>
                    </div>
                  </div>
                  {/* Botón ver en mapa */}
                  <button
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 transition-colors"
                    aria-label="Ver ubicación en mapa"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    Ver mapa
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* PASO 5: LAYOUT PRINCIPAL OPTIMIZADO - 2 COLUMNAS IGUALES */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Información Detallada */}
            <div className="space-y-8">

              {/* Tabs Estratégicos */}
              <section aria-label="Información detallada">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="border-b border-gray-200 dark:border-gray-700">
                    <nav className="flex space-x-8 px-6">
                      {[
                        { id: 'detalle', label: 'Detalle' },
                        { id: 'caracteristicas', label: 'Características' },
                        { id: 'requisitos', label: 'Requisitos' },
                        { id: 'faq', label: 'Preguntas frecuentes' }
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id as 'detalle' | 'caracteristicas' | 'requisitos' | 'faq')}
                          className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </nav>
                  </div>

                  {/* Tab Content */}
                  <div className="p-6">
                    {activeTab === 'detalle' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Terminaciones */}
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Terminaciones</h3>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3 p-2 bg-white dark:bg-gray-800 rounded-lg">
                              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">Ventanas: Termopanel en PVC</span>
                            </div>
                            <div className="flex items-center gap-3 p-2 bg-white dark:bg-gray-800 rounded-lg">
                              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">Agua caliente: Central</span>
                            </div>
                            <div className="flex items-center gap-3 p-2 bg-white dark:bg-gray-800 rounded-lg">
                              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">Cocina: Encimera Vitrocerámica</span>
                            </div>
                            <div className="flex items-center gap-3 p-2 bg-white dark:bg-gray-800 rounded-lg">
                              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">Piso baños: Porcelanato/Cerámica</span>
                            </div>
                            <div className="flex items-center gap-3 p-2 bg-white dark:bg-gray-800 rounded-lg">
                              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">Piso estar: Vinílico</span>
                            </div>
                            <div className="flex items-center gap-3 p-2 bg-white dark:bg-gray-800 rounded-lg">
                              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">Piso dormitorios: Vinílico</span>
                            </div>
                            <div className="flex items-center gap-3 p-2 bg-white dark:bg-gray-800 rounded-lg">
                              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">Chapa: Electrónica</span>
                            </div>
                            <div className="flex items-center gap-3 p-2 bg-white dark:bg-gray-800 rounded-lg">
                              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">Alarma: Sí</span>
                            </div>
                          </div>
                        </div>

                        {/* Equipamiento */}
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                              <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5l-1 1h2a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1h-2v1a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 011-1h2l1-1H8a1 1 0 01-1-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
                              </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Equipamiento</h3>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3 p-2 bg-white dark:bg-gray-800 rounded-lg">
                              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">Refrigerador</span>
                            </div>
                            <div className="flex items-center gap-3 p-2 bg-white dark:bg-gray-800 rounded-lg">
                              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">Campana</span>
                            </div>
                            <div className="flex items-center gap-3 p-2 bg-white dark:bg-gray-800 rounded-lg">
                              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">Cortinas Roller</span>
                            </div>
                            <div className="flex items-center gap-3 p-2 bg-white dark:bg-gray-800 rounded-lg">
                              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">Porta TV</span>
                            </div>
                            <div className="flex items-center gap-3 p-2 bg-white dark:bg-gray-800 rounded-lg">
                              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">Cama</span>
                            </div>
                            <div className="flex items-center gap-3 p-2 bg-white dark:bg-gray-800 rounded-lg">
                              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">Microondas</span>
                            </div>
                            <div className="flex items-center gap-3 p-2 bg-white dark:bg-gray-800 rounded-lg">
                              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">Horno Eléctrico</span>
                            </div>
                            <div className="flex items-center gap-3 p-2 bg-white dark:bg-gray-800 rounded-lg">
                              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">Sofá Cama</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'caracteristicas' && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Comodidades del edificio {building.name}</h3>
                        <div className="flex flex-wrap gap-3">
                          {building.amenities.map((amenity, index) => (
                            <div
                              key={index}
                              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm bg-gray-50 dark:bg-gray-700 ring-1 ring-gray-200 dark:ring-gray-600 transition-colors hover:bg-gray-100 dark:hover:bg-gray-600"
                            >
                              <CheckCircle className="w-4 h-4 text-green-500" aria-hidden="true" />
                              <span className="text-gray-900 dark:text-white">{amenity}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === 'requisitos' && (
                      <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="text-lg font-semibold mb-3">Requisitos generales</h3>
                            <ul className="space-y-2 text-sm">
                              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-blue-500" /> Cédula de identidad chilena vigente</li>
                              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-blue-500" /> Puntaje financiero 999 titular y aval(es)</li>
                              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-blue-500" /> Renta líquida igual o mayor a ${(originalPrice * 3).toLocaleString('es-CL')}</li>
                            </ul>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold mb-3 text-blue-600">Trabajador dependiente</h3>
                            <ul className="space-y-2 text-sm">
                              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-blue-500" /> Tres últimas liquidaciones de sueldo</li>
                              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-blue-500" /> Certificado de cotizaciones de AFP</li>
                            </ul>
                            <h3 className="text-lg font-semibold mb-3 mt-4 text-blue-600">Trabajador independiente</h3>
                            <ul className="space-y-2 text-sm">
                              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-blue-500" /> Informe mensual de boletas de honorario (6 meses)</li>
                              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-blue-500" /> Carpeta tributaria o formulario 29 (6 meses)</li>
                            </ul>
                          </div>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                          <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                            Si eres extranjero y tienes cédula vencida puedes solicitar visita y/o postular presentando tu visa en trámite.
                          </p>
                        </div>
                      </div>
                    )}

                    {activeTab === 'faq' && (
                      <div className="space-y-4">
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
                          <button className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800">
                            <span className="font-medium">¿Cuáles son los requisitos para arrendar?</span>
                            <ChevronDown className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
                          <button className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800">
                            <span className="font-medium">¿Necesito contar con un aval para poder arrendar?</span>
                            <ChevronDown className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column - Cálculo del primer pago */}
            <div className="space-y-6">
              {/* Cálculo del primer pago */}
              <section aria-label="Cálculo del primer pago">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Cálculo del primer pago</h3>

                  {/* Selector de fecha de mudanza */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Fecha de mudanza
                    </label>
                    <div className="relative">
                      <button
                        onClick={() => setShowDatePicker(!showDatePicker)}
                        className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <span>{formatDate(moveInDate)}</span>
                        <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                      </button>

                      {/* Calendario */}
                      {showDatePicker && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10 p-3">
                          <div className="grid grid-cols-7 gap-1 text-xs">
                            {['D', 'L', 'Ma', 'Mi', 'J', 'V', 'S'].map((day, index) => (
                              <div key={`day-${index}`} className="p-2 text-center text-gray-500 font-medium">
                                {day}
                              </div>
                            ))}
                            {Array.from({ length: 30 }, (_, i) => {
                              const date = new Date();
                              date.setDate(date.getDate() + i + 1);
                              const isSelected = date.toDateString() === moveInDate.toDateString();
                              const isDisabled = date > getMaxDate();

                              return (
                                <button
                                  key={i}
                                  onClick={() => !isDisabled && handleDateChange(date)}
                                  disabled={isDisabled}
                                  className={`p-2 text-center text-sm rounded ${isSelected
                                    ? 'bg-blue-600 text-white'
                                    : isDisabled
                                      ? 'text-gray-300 cursor-not-allowed'
                                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                                >
                                  {date.getDate()}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Cálculo basado en {firstPaymentCalculation.daysChargedCount} días del mes ({firstPaymentCalculation.daysInMonth} días totales)
                    </p>
                  </div>

                  {/* Detalle del cálculo */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Arriendo prorrateado:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        ${firstPaymentCalculation.netRentStorage.toLocaleString('es-CL')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Gastos comunes prorrateados:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        ${firstPaymentCalculation.proratedGC.toLocaleString('es-CL')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Garantía inicial (33%):</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        ${firstPaymentCalculation.initialDeposit.toLocaleString('es-CL')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Comisión corretaje:</span>
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">
                        ${firstPaymentCalculation.commissionToPay.toLocaleString('es-CL')}
                      </span>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-base font-semibold text-gray-900 dark:text-white">Total primer pago:</span>
                        <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                          ${firstPaymentCalculation.totalFirstPayment.toLocaleString('es-CL')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Botón enviar cotización */}
                  <button
                    onClick={handleSendQuotation}
                    className="w-full inline-flex items-center justify-center px-4 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    Enviar cotización por email
                  </button>
                </div>
              </section>

              {/* Información de Reajuste */}
              <section aria-label="Información de reajuste">
                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                  <p className="text-xs text-amber-800 dark:text-amber-200">
                    Tu arriendo se reajustará por primera vez en agosto de 2026 y después cada 6 meses según UF.
                  </p>
                </div>
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
    </div>
  );
}

