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
  Building2,
  Sun,
  Heart,
  Car,
  Layers,
  Compass,
  Refrigerator,
  PawPrint,
  Wrench,
  Home,
  Droplets,
  Lock,
  Bell,
  Fan,
  Tv,
  Microwave,
  Sofa,
  PhoneCall,
  Dumbbell,
  Bike,
  WashingMachine,
  Wifi,
  ChefHat,
  Users2,
  Eye,
  Coffee,
  Bus,
  ArrowUpDown,
  ShoppingBag
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
import VisitSchedulerWrapper from "@components/forms/VisitSchedulerWrapper";

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
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);
  const [includeParking, setIncludeParking] = useState(false);
  const [includeStorage, setIncludeStorage] = useState(false);
  const [guaranteeInInstallments, setGuaranteeInInstallments] = useState(true);
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  const [urgencyData, setUrgencyData] = useState({ recentVisitors: 0, lastReservation: 0 });

  // Analytics tracking on mount
  useEffect(() => {
    track("property_view", {
      property_id: building.id,
      property_name: building.name,
      property_slug: building.slug,
    });
  }, [building.id, building.name, building.slug]);

  // Generar datos de urgencia solo en el cliente
  useEffect(() => {
    setUrgencyData({
      recentVisitors: Math.floor(Math.random() * 15) + 5,
      lastReservation: Math.floor(Math.random() * 60) + 5
    });
  }, []);

  // Scroll handler para sticky CTA
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setShowStickyCTA(scrollY > 800);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



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
    // Disparar evento personalizado para abrir el modal de agendamiento
    window.dispatchEvent(new CustomEvent('openVisitScheduler'));
  };

  const handleFAQToggle = (faqId: string) => {
    setOpenFAQ(openFAQ === faqId ? null : faqId);
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

  // Simular datos dinámicos para urgencia (usando estado para evitar hidratación)
  const { recentVisitors, lastReservation } = urgencyData;

  // Datos estratégicos basados en AssetPlan
  const originalPrice = selectedUnit?.price || 290000;
  const discountPrice = Math.round(originalPrice * 0.5); // 50% OFF primer mes

  // Función para calcular el primer pago según la lógica proporcionada
  const calculateFirstPayment = (startDate: Date) => {
    // Variables de entrada según la lógica
    const RENT = originalPrice;
    const PARKING_RENT = includeParking ? 50000 : 0; // $50.000 si está disponible
    const STORAGE_RENT = includeStorage ? 30000 : 0; // $30.000 si está disponible
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

    // Calcular días con descuento (primeros 30 días desde la fecha de mudanza)
    const promoDays = Math.min(30, daysChargedCount);
    const regularDays = Math.max(0, daysChargedCount - 30);

    // Calcular arriendo con descuento para los primeros 30 días
    const dailyRent = RENT / 30; // Arriendo diario
    const dailyParking = PARKING_RENT / 30; // Estacionamiento diario
    const dailyStorage = STORAGE_RENT / 30; // Bodega diaria

    const promoRent = Math.round(dailyRent * promoDays * (1 - PROMO_RATE)); // 50% OFF
    const regularRent = Math.round(dailyRent * regularDays); // Precio normal
    const totalRent = promoRent + regularRent;

    const promoParking = Math.round(dailyParking * promoDays * (1 - PROMO_RATE)); // 50% OFF
    const regularParking = Math.round(dailyParking * regularDays); // Precio normal
    const totalParking = promoParking + regularParking;

    const promoStorage = Math.round(dailyStorage * promoDays * (1 - PROMO_RATE)); // 50% OFF
    const regularStorage = Math.round(dailyStorage * regularDays); // Precio normal
    const totalStorage = promoStorage + regularStorage;

    const netRentStorage = totalRent + totalParking + totalStorage;

    const monthlyGC = GC_RENT + GC_STORAGE;
    const proratedGC = Math.round(monthlyGC * prorateFactor);

    const totalDeposit = Math.round(DEPOSIT_MONTHS * (RENT + PARKING_RENT + STORAGE_RENT));
    const initialDeposit = Math.round(totalDeposit * DEPOSIT_INIT_PCT);

    const commissionBase = Math.round(COMMISSION_RATE * (RENT + PARKING_RENT + STORAGE_RENT));
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
      prorateFactor,
      parkingRent: PARKING_RENT,
      storageRent: STORAGE_RENT,
      promoDays,
      regularDays
    };
  };

  const firstPaymentCalculation = calculateFirstPayment(moveInDate);

  // Función para calcular ahorros del mes 2 (días restantes del descuento)
  const calculateMonth2Savings = () => {
    // Calcular cuántos días del mes 1 se usaron
    const daysInFirstMonth = new Date(moveInDate.getFullYear(), moveInDate.getMonth() + 1, 0).getDate();
    const daysUsedInFirstMonth = daysInFirstMonth - moveInDate.getDate() + 1;

    // Los días restantes del descuento son los que faltan para completar 30 días
    const promoDaysRemaining = Math.max(0, 30 - daysUsedInFirstMonth);

    if (promoDaysRemaining === 0) return 0;

    const dailyRent = originalPrice / 30;
    const dailyParking = includeParking ? 50000 / 30 : 0;
    const dailyStorage = includeStorage ? 30000 / 30 : 0;

    const rentSavings = Math.round(dailyRent * promoDaysRemaining * 0.5);
    const parkingSavings = Math.round(dailyParking * promoDaysRemaining * 0.5);
    const storageSavings = Math.round(dailyStorage * promoDaysRemaining * 0.5);

    return rentSavings + parkingSavings + storageSavings;
  };

  const month2Savings = calculateMonth2Savings();

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
      <main id="main-content" role="main" className="min-h-screen bg-bg text-text">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {/* Header Section */}
          <div className="mb-6">
            <Header />
          </div>

          {/* Breadcrumbs estratégicos */}
          <div className="mb-4">
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
          </div>

          {/* HERO PRINCIPAL - SIMPLIFICADO */}
          {/* Badges destacados arriba */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold rounded-lg shadow-md">
                <Shield className="w-4 h-4" />
                <span>Administración Pro</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-semibold rounded-lg shadow-md">
                <DollarSign className="w-4 h-4" />
                <span>Comisión Gratis</span>
              </div>
            </div>
          </div>

          {/* LAYOUT 2 COLUMNAS - DISEÑO MINIMALISTA OPTIMIZADO */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* COLUMNA IZQUIERDA - INFORMACIÓN PRINCIPAL INTEGRADA */}
            <div>


              {/* INFORMACIÓN DE VALOR Y PROMOCIONES - COMPACTA */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 space-y-4">
                {/* Título de la propiedad */}
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Departamento {selectedUnit?.id || '207'}
                  </h1>
                  <div className="flex items-center gap-2 text-base text-gray-600 dark:text-gray-400">
                    <Home className="w-4 h-4" />
                    <span className="font-medium">{building.name}</span>
                    <span>•</span>
                    <span>{building.comuna}</span>
                  </div>
                </div>
                {/* Precios principales */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Arriendo mensual:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">${originalPrice.toLocaleString('es-CL')}</span>
                  </div>
                  <div className="flex justify-between items-center bg-orange-50 dark:bg-orange-900/20 p-2 rounded-lg border border-orange-200 dark:border-orange-800">
                    <span className="text-sm text-orange-700 dark:text-orange-300 font-medium">¡50% OFF primer mes!</span>
                    <span className="text-sm font-bold text-orange-600 dark:text-orange-400">${discountPrice.toLocaleString('es-CL')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Gasto común:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">${Math.round(originalPrice * 0.21).toLocaleString('es-CL')}</span>
                  </div>
                  <div className="flex justify-between items-center bg-green-50 dark:bg-green-900/20 p-2 rounded-lg border border-green-200 dark:border-green-800">
                    <span className="text-sm text-green-700 dark:text-green-300 font-medium">¡Comisión GRATIS!</span>
                    <span className="text-sm font-bold text-green-600 dark:text-green-400 line-through">${Math.round((originalPrice * 0.5) * 1.19).toLocaleString('es-CL')}</span>
                  </div>
                </div>

                {/* Badges de promociones */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-900 dark:text-white mb-2">Promociones actuales</h3>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { icon: Flame, label: "50% OFF primer mes" },
                      { icon: Calendar, label: "Precio fijo 12 meses" },
                      { icon: CheckCircle, label: "Opción sin aval" },
                      { icon: DollarSign, label: "Comisión gratis" }
                    ].map((badge, i) => (
                      <div
                        key={badge.label}
                        className="flex items-center gap-1.5 p-1.5 bg-orange-500 text-white rounded-md border border-orange-400 shadow-md cursor-pointer hover:bg-orange-600 transition-colors"
                      >
                        <badge.icon className="w-3 h-3" />
                        <span className="text-xs font-medium">{badge.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTAs */}
                <div className="space-y-3 pt-2">
                  <button
                    onClick={handleBookingClick}
                    className="w-full inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 transition-all duration-200 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                    aria-label="Agendar visita a la propiedad"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Agendar visita
                  </button>

                  <button
                    onClick={handleWhatsAppClick}
                    className="w-full inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500 transition-all duration-200 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                    aria-label="Contactar por WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Hablar por WhatsApp
                  </button>

                  {whatsappUrl && (
                    <motion.a
                      href={whatsappUrl}
                      onClick={handleWhatsAppClick}
                      target="_blank"
                      rel="noopener noreferrer"


                      whileTap="tap"
                      className="w-full inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500 transition-all duration-200 shadow-sm hover:shadow-md"
                      aria-label="Contactar por WhatsApp sobre esta propiedad"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Hablar por WhatsApp
                    </motion.a>
                  )}
                </div>
              </div>
            </div>

            {/* COLUMNA DERECHA - GALERÍA */}
            <div className="pt-0">
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

          {/* CARACTERÍSTICAS PRINCIPALES - ANCHURA COMPLETA - ANIMADA */}
          <motion.div
            className="mb-8"


            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Características principales</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {/* Dormitorios */}
                <motion.div
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"



                >
                  <Bed className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">1</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Dormitorio</div>
                  </div>
                </motion.div>

                {/* Baños */}
                <motion.div
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"



                >
                  <Bath className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">1</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Baño</div>
                  </div>
                </motion.div>

                {/* Metros cuadrados interior */}
                <motion.div
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"



                >
                  <Square className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">29</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">m² interior</div>
                  </div>
                </motion.div>

                {/* Metros cuadrados exterior */}
                <motion.div
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"



                >
                  <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">0</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">m² exterior</div>
                  </div>
                </motion.div>

                {/* Piso */}
                <motion.div
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"



                >
                  <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">2</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Piso</div>
                  </div>
                </motion.div>

                {/* Orientación */}
                <motion.div
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"



                >
                  <Compass className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Orientación</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Norte</div>
                  </div>
                </motion.div>

                {/* Mascotas */}
                <motion.div
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"



                >
                  <PawPrint className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Mascotas</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Permitidas</div>
                  </div>
                </motion.div>

                {/* Tipo de amoblado */}
                <motion.div
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"



                >
                  <Refrigerator className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Amoblado</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Básico</div>
                  </div>
                </motion.div>

                {/* Estacionamiento */}
                <motion.div
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"



                >
                  <Car className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Estacionamiento</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">No disponible</div>
                  </div>
                </motion.div>

                {/* Bodega */}
                <motion.div
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"



                >
                  <Package className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Bodega</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Desde $30.000</div>
                  </div>
                </motion.div>

                {/* Habitantes */}
                <motion.div
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"

                  custom={10}

                >
                  <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Habitantes</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">2 Max</div>
                  </div>
                </motion.div>

                {/* Cerradura */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Shield className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Cerradura</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Electrónica</div>
                  </div>
                </div>
              </div>

              {/* Metro cercano - JERARQUÍA VISUAL MEJORADA */}
              <div className="mt-6 p-6 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl border border-red-200 dark:border-red-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Ícono de Metro de Santiago - MÁS PROMINENTE */}
                    <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center shadow-lg">
                      <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 920 400" preserveAspectRatio="xMidYMid meet">
                        <g transform="translate(0.000000,400.000000) scale(0.100000,-0.100000)" fill="currentColor" stroke="none">
                          <path d="M4220 3926 c-616 -71 -1141 -313 -1522 -702 -295 -301 -452 -614 -513 -1023 -20 -140 -19 -252 5 -407 33 -220 90 -395 187 -574 318 -589 990 -1018 1750 -1116 65 -8 154 -20 198 -26 157 -21 478 4 740 57 854 173 1534 750 1715 1455 76 294 77 540 5 821 -130 502 -497 943 -1016 1217 -272 145 -542 233 -864 282 -177 28 -515 35 -685 16z m700 -274 c265 -50 431 -103 645 -206 533 -259 880 -666 990 -1166 26 -118 31 -343 11 -475 -113 -729 -788 -1307 -1691 -1447 -199 -31 -539 -30 -740 0 -265 41 -470 105 -700 217 -301 147 -527 330 -709 572 -196 261 -295 550 -296 858 0 309 104 612 298 870 67 88 235 258 327 330 294 230 656 385 1036 444 74 11 148 23 164 25 17 2 149 3 295 1 210 -3 287 -8 370 -23z" />
                          <path d="M3150 2544 c-213 -387 -271 -500 -264 -513 6 -9 129 -231 274 -493 l264 -478 24 43 c13 23 136 245 274 494 l250 452 -273 493 c-149 271 -273 494 -273 495 -1 1 -125 -221 -276 -493z" />
                          <path d="M4510 3011 c0 -5 -77 -148 -171 -317 -94 -170 -211 -382 -261 -472 -49 -89 -92 -170 -95 -180 -3 -12 71 -154 194 -378 110 -197 231 -416 269 -486 38 -70 71 -128 74 -128 4 0 369 655 519 932 14 26 28 48 31 47 3 0 58 -98 124 -217 242 -442 421 -762 426 -762 3 0 12 15 21 33 9 17 129 236 268 486 138 250 251 459 251 464 0 5 -26 57 -59 116 -142 259 -378 684 -428 774 l-55 99 -92 -165 c-50 -90 -172 -311 -271 -490 -99 -180 -182 -327 -185 -327 -3 0 -127 220 -275 490 -149 269 -273 490 -277 490 -5 0 -8 -4 -8 -9z" />
                        </g>
                      </svg>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-900 dark:text-white">Metro Ecuador</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="text-red-600 dark:text-red-400 font-semibold">Línea 1</span> • 5 minutos, 450 metros
                      </div>
                      <div className="text-xs text-red-600 dark:text-red-400 font-medium mt-1">🚶‍♂️ Caminata rápida</div>
                    </div>
                  </div>
                  <button className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-all duration-200 shadow-md hover:shadow-lg">
                    <MapPin className="w-4 h-4" />
                    Ver mapa
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* STICKY TOP MINIMALISTA - ANIMADO */}
          <AnimatePresence>
            {showStickyCTA && (
              <motion.div
                className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"



                exit="exit"
              >
                <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/20 dark:border-gray-700/50 max-w-sm">
                  {/* Información básica del departamento */}
                  <div className="mb-4 pb-3 border-b border-gray-200/50 dark:border-gray-600/50">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                        <Home className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                          {building.name}
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Depto {selectedUnit?.id || '207'} • {building.comuna}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600 dark:text-gray-400">
                        {originalPrice.toLocaleString('es-CL')} CLP
                      </span>
                      <span className="text-orange-600 dark:text-orange-400 font-medium">
                        50% OFF primer mes
                      </span>
                    </div>
                  </div>

                  {/* CTAs apilados - ANIMADOS */}
                  <div className="space-y-2">
                    <motion.button
                      onClick={handleBookingClick}


                      whileTap="tap"
                      className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm"
                      aria-label="Agendar visita a la propiedad"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Agendar visita
                    </motion.button>

                    {whatsappUrl && (
                      <motion.a
                        href={whatsappUrl}
                        onClick={handleWhatsAppClick}
                        target="_blank"
                        rel="noopener noreferrer"


                        whileTap="tap"
                        className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 shadow-sm"
                        aria-label="Contactar por WhatsApp sobre esta propiedad"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Hablar por WhatsApp
                      </motion.a>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

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
                              <Home className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Terminaciones</h3>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                              <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/10 rounded-lg flex items-center justify-center">
                                <Square className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              </div>
                              <span className="text-sm text-gray-700 dark:text-gray-300">Ventanas: Termopanel en PVC</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                              <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/10 rounded-lg flex items-center justify-center">
                                <Droplets className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              </div>
                              <span className="text-sm text-gray-700 dark:text-gray-300">Agua caliente: Central</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                              <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/10 rounded-lg flex items-center justify-center">
                                <Square className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              </div>
                              <span className="text-sm text-gray-700 dark:text-gray-300">Cocina: Encimera Vitrocerámica</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                              <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/10 rounded-lg flex items-center justify-center">
                                <Square className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              </div>
                              <span className="text-sm text-gray-700 dark:text-gray-300">Piso baños: Porcelanato/Cerámica</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                              <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/10 rounded-lg flex items-center justify-center">
                                <Square className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              </div>
                              <span className="text-sm text-gray-700 dark:text-gray-300">Piso estar: Vinílico</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                              <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/10 rounded-lg flex items-center justify-center">
                                <Square className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              </div>
                              <span className="text-sm text-gray-700 dark:text-gray-300">Piso dormitorios: Vinílico</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                              <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/10 rounded-lg flex items-center justify-center">
                                <Lock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              </div>
                              <span className="text-sm text-gray-700 dark:text-gray-300">Chapa: Electrónica</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                              <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/10 rounded-lg flex items-center justify-center">
                                <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              </div>
                              <span className="text-sm text-gray-700 dark:text-gray-300">Alarma: Sí</span>
                            </div>
                          </div>
                        </div>

                        {/* Equipamiento */}
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                              <Wrench className="w-4 h-4 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Equipamiento</h3>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                              <div className="w-8 h-8 bg-green-50 dark:bg-green-900/10 rounded-lg flex items-center justify-center">
                                <Refrigerator className="w-4 h-4 text-green-600 dark:text-green-400" />
                              </div>
                              <span className="text-sm text-gray-700 dark:text-gray-300">Refrigerador</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                              <div className="w-8 h-8 bg-green-50 dark:bg-green-900/10 rounded-lg flex items-center justify-center">
                                <Fan className="w-4 h-4 text-green-600 dark:text-green-400" />
                              </div>
                              <span className="text-sm text-gray-700 dark:text-gray-300">Campana</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                              <div className="w-8 h-8 bg-green-50 dark:bg-green-900/10 rounded-lg flex items-center justify-center">
                                <Square className="w-4 h-4 text-green-600 dark:text-green-400" />
                              </div>
                              <span className="text-sm text-gray-700 dark:text-gray-300">Cortinas Roller</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                              <div className="w-8 h-8 bg-green-50 dark:bg-green-900/10 rounded-lg flex items-center justify-center">
                                <Tv className="w-4 h-4 text-green-600 dark:text-green-400" />
                              </div>
                              <span className="text-sm text-gray-700 dark:text-gray-300">Porta TV</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                              <div className="w-8 h-8 bg-green-50 dark:bg-green-900/10 rounded-lg flex items-center justify-center">
                                <Bed className="w-4 h-4 text-green-600 dark:text-green-400" />
                              </div>
                              <span className="text-sm text-gray-700 dark:text-gray-300">Cama</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                              <div className="w-8 h-8 bg-green-50 dark:bg-green-900/10 rounded-lg flex items-center justify-center">
                                <Microwave className="w-4 h-4 text-green-600 dark:text-green-400" />
                              </div>
                              <span className="text-sm text-gray-700 dark:text-gray-300">Microondas</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                              <div className="w-8 h-8 bg-green-50 dark:bg-green-900/10 rounded-lg flex items-center justify-center">
                                <Square className="w-4 h-4 text-green-600 dark:text-green-400" />
                              </div>
                              <span className="text-sm text-gray-700 dark:text-gray-300">Horno Eléctrico</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                              <div className="w-8 h-8 bg-green-50 dark:bg-green-900/10 rounded-lg flex items-center justify-center">
                                <Sofa className="w-4 h-4 text-green-600 dark:text-green-400" />
                              </div>
                              <span className="text-sm text-gray-700 dark:text-gray-300">Sofá Cama</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'caracteristicas' && (
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                            <Building2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Comodidades del edificio {building.name}</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {building.amenities.map((amenity, index) => {
                            // Función para obtener el icono apropiado según la comodidad
                            const getAmenityIcon = (amenityName: string) => {
                              const lowerAmenity = amenityName.toLowerCase();
                              if (lowerAmenity.includes('acceso') || lowerAmenity.includes('control')) return <Lock className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
                              if (lowerAmenity.includes('citófono') || lowerAmenity.includes('intercom')) return <PhoneCall className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
                              if (lowerAmenity.includes('gimnasio') || lowerAmenity.includes('gym')) return <Dumbbell className="w-4 h-4 text-green-600 dark:text-green-400" />;
                              if (lowerAmenity.includes('bicicletero') || lowerAmenity.includes('bici')) return <Bike className="w-4 h-4 text-green-600 dark:text-green-400" />;
                              if (lowerAmenity.includes('lavandería') || lowerAmenity.includes('lavadora')) return <WashingMachine className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
                              if (lowerAmenity.includes('internet') || lowerAmenity.includes('wifi')) return <Wifi className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
                              if (lowerAmenity.includes('quincho') || lowerAmenity.includes('bbq')) return <ChefHat className="w-4 h-4 text-orange-600 dark:text-orange-400" />;
                              if (lowerAmenity.includes('gourmet') || lowerAmenity.includes('evento')) return <Users2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
                              if (lowerAmenity.includes('seguridad')) return <Eye className="w-4 h-4 text-red-600 dark:text-red-400" />;
                              if (lowerAmenity.includes('terraza') || lowerAmenity.includes('panorámica')) return <Sun className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />;
                              if (lowerAmenity.includes('lounge') || lowerAmenity.includes('salón')) return <Coffee className="w-4 h-4 text-brown-600 dark:text-brown-400" />;
                              if (lowerAmenity.includes('transporte') || lowerAmenity.includes('cercano')) return <Bus className="w-4 h-4 text-green-600 dark:text-green-400" />;
                              if (lowerAmenity.includes('conserjería') || lowerAmenity.includes('concierge')) return <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
                              if (lowerAmenity.includes('ascensor') || lowerAmenity.includes('elevador')) return <ArrowUpDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />;
                              if (lowerAmenity.includes('comercio') || lowerAmenity.includes('tienda')) return <ShoppingBag className="w-4 h-4 text-orange-600 dark:text-orange-400" />;
                              return <CheckCircle className="w-4 h-4 text-green-500" />;
                            };

                            return (
                              <div
                                key={index}
                                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                              >
                                <div className="w-8 h-8 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                                  {getAmenityIcon(amenity)}
                                </div>
                                <span className="text-sm text-gray-900 dark:text-white font-medium">{amenity}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {activeTab === 'requisitos' && (
                      <div className="space-y-8">
                        {/* Requisitos Generales */}
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                              <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Requisitos Generales</h3>
                          </div>
                          <div className="grid gap-3">
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
                              <span className="text-sm text-gray-900 dark:text-white">Renta líquida igual o mayor a <span className="font-semibold text-blue-600 dark:text-blue-400">${(originalPrice * 3).toLocaleString('es-CL')}</span></span>
                            </div>
                          </div>
                        </div>

                        {/* Tipos de Trabajador */}
                        <div className="grid md:grid-cols-2 gap-6">
                          {/* Trabajador Dependiente */}
                          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                <Users className="w-4 h-4 text-green-600 dark:text-green-400" />
                              </div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Trabajador Dependiente</h3>
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
                          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                                <Square className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                              </div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Trabajador Independiente</h3>
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
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                              <MessageCircle className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                            </div>
                            <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                              Si eres extranjero y tienes cédula vencida puedes solicitar visita y/o postular presentando tu visa en trámite.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'faq' && (
                      <div className="space-y-4">
                        {/* FAQ 1: Requisitos para arrendar */}
                        <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                          <button
                            onClick={() => handleFAQToggle('requisitos')}
                            className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                          >
                            <span className="font-semibold text-gray-900 dark:text-white leading-relaxed tracking-wide">¿Cuáles son los requisitos para arrendar?</span>
                            <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${openFAQ === 'requisitos' ? 'rotate-180' : ''}`} />
                          </button>
                          {openFAQ === 'requisitos' && (
                            <div className="px-6 pb-4">
                              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                  Los requisitos varían dependiendo del departamento que elijas, pero en general son: acreditar renta suficiente, demostrar que no tienes deudas vencidas y, en ciertos casos, contar con un aval.
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* FAQ 2: Aval */}
                        <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                          <button
                            onClick={() => handleFAQToggle('aval')}
                            className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                          >
                            <span className="font-semibold text-gray-900 dark:text-white leading-relaxed tracking-wide">¿Necesito contar con un aval para poder arrendar?</span>
                            <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${openFAQ === 'aval' ? 'rotate-180' : ''}`} />
                          </button>
                          {openFAQ === 'aval' && (
                            <div className="px-6 pb-4">
                              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                  Tener un aval es obligatorio en algunas propiedades mientras que en otras es opcional.
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* FAQ 3: Mascotas */}
                        <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                          <button
                            onClick={() => handleFAQToggle('mascotas')}
                            className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                          >
                            <span className="font-semibold text-gray-900 dark:text-white leading-relaxed tracking-wide">¿Cuáles son las condiciones para arrendar un departamento que acepta mascotas?</span>
                            <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${openFAQ === 'mascotas' ? 'rotate-180' : ''}`} />
                          </button>
                          {openFAQ === 'mascotas' && (
                            <div className="px-6 pb-4">
                              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                                  <li className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <span>La aceptación de mascotas depende del propietario del departamento.</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <span>Peso máximo de 20 kg y cumplir con la Ley de Tenencia Responsable de Mascotas (Ley 21.020) y reglamentos del edificio para tranquilidad, seguridad y salud.</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <span>Mascotas permitidas: perros, gatos, peces en pecera. Prohibidas: exóticas, peligrosas, silvestres o protegidas.</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <span>Notificar al arrendador si adquiere mascota después de firmar contrato. Mascotas siempre con correa en áreas comunes.</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <span>El arrendatario asume responsabilidad total por daños o molestias causadas por la mascota y debe respetar todas las regulaciones.</span>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* FAQ 4: Duración del contrato */}
                        <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                          <button
                            onClick={() => handleFAQToggle('duracion')}
                            className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                          >
                            <span className="font-semibold text-gray-900 dark:text-white leading-relaxed tracking-wide">¿Cuánto dura el contrato?</span>
                            <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${openFAQ === 'duracion' ? 'rotate-180' : ''}`} />
                          </button>
                          {openFAQ === 'duracion' && (
                            <div className="px-6 pb-4">
                              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                  Los contratos de arriendo típicamente tienen una duración de 12 meses, con opción de renovación según las condiciones establecidas.
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* FAQ 5: Trabajo nuevo */}
                        <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                          <button
                            onClick={() => handleFAQToggle('trabajo-nuevo')}
                            className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                          >
                            <span className="font-semibold text-gray-900 dark:text-white leading-relaxed tracking-wide">Tengo un trabajo nuevo ¿puedo postular si aún no tengo liquidaciones de sueldo?</span>
                            <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${openFAQ === 'trabajo-nuevo' ? 'rotate-180' : ''}`} />
                          </button>
                          {openFAQ === 'trabajo-nuevo' && (
                            <div className="px-6 pb-4">
                              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                  Sí, siempre que tengas un contrato indefinido.
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* FAQ 6: Capacidad de personas */}
                        <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                          <button
                            onClick={() => handleFAQToggle('capacidad')}
                            className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                          >
                            <span className="font-semibold text-gray-900 dark:text-white leading-relaxed tracking-wide">¿Cuántas personas pueden vivir en la propiedad?</span>
                            <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${openFAQ === 'capacidad' ? 'rotate-180' : ''}`} />
                          </button>
                          {openFAQ === 'capacidad' && (
                            <div className="px-6 pb-4">
                              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                  Una capacidad máxima de 2 personas por dormitorio (menores de 3 años con los padres).
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* FAQ 7: Garantía en cuotas */}
                        <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                          <button
                            onClick={() => handleFAQToggle('garantia-cuotas')}
                            className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                          >
                            <span className="font-semibold text-gray-900 dark:text-white leading-relaxed tracking-wide">¿Se puede pagar la garantía en cuotas?</span>
                            <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${openFAQ === 'garantia-cuotas' ? 'rotate-180' : ''}`} />
                          </button>
                          {openFAQ === 'garantia-cuotas' && (
                            <div className="px-6 pb-4">
                              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                  Esto depende de cada departamento. Te recomendamos seleccionar un departamento y solicitar una visita para obtener más información sobre los costos iniciales.
                                </p>
                              </div>
                            </div>
                          )}
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

                  {/* Opciones adicionales - Estacionamiento y Bodega */}
                  <div className="mb-6 space-y-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Servicios adicionales
                    </label>

                    {/* Estacionamiento */}
                    <div className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${false ? 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600'
                      }`}>
                      <div className="flex items-center gap-3">
                        <Car className={`w-5 h-5 ${false ? 'text-gray-400' : 'text-orange-600 dark:text-orange-400'}`} />
                        <div>
                          <span className={`text-sm font-medium ${false ? 'text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                            Estacionamiento
                          </span>
                          <p className={`text-xs ${false ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>
                            {false ? 'No disponible' : '$50.000 mensual'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-semibold ${false ? 'text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                          ${false ? '0' : '50.000'}
                        </span>
                        <input
                          type="checkbox"
                          checked={includeParking}
                          onChange={(e) => setIncludeParking(e.target.checked)}
                          disabled={false}
                          className={`w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500 ${false ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        />
                      </div>
                    </div>

                    {/* Bodega */}
                    <div className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${true ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600' : 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                      }`}>
                      <div className="flex items-center gap-3">
                        <Package className={`w-5 h-5 ${true ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400'}`} />
                        <div>
                          <span className={`text-sm font-medium ${true ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                            Bodega
                          </span>
                          <p className={`text-xs ${true ? 'text-gray-500 dark:text-gray-400' : 'text-gray-400'}`}>
                            {true ? 'Desde $30.000 mensual' : 'No disponible'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-semibold ${true ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                          ${true ? '30.000' : '0'}
                        </span>
                        <input
                          type="checkbox"
                          checked={includeStorage}
                          onChange={(e) => setIncludeStorage(e.target.checked)}
                          disabled={!true}
                          className={`w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 ${!true ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        />
                      </div>
                    </div>


                  </div>

                  {/* Detalle del cálculo */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Arriendo prorrateado:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        ${firstPaymentCalculation.netRentStorage.toLocaleString('es-CL')}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 pl-2">
                      • {firstPaymentCalculation.promoDays} días con 50% OFF: ${Math.round((originalPrice / 30) * firstPaymentCalculation.promoDays * 0.5).toLocaleString('es-CL')}
                      {firstPaymentCalculation.regularDays > 0 && (
                        <span>
                          <br />• {firstPaymentCalculation.regularDays} días precio normal: ${Math.round((originalPrice / 30) * firstPaymentCalculation.regularDays).toLocaleString('es-CL')}
                        </span>
                      )}
                    </div>
                    {includeParking && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Estacionamiento prorrateado:</span>
                        <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                          ${Math.round((50000 / 30) * firstPaymentCalculation.promoDays * 0.5 + (50000 / 30) * firstPaymentCalculation.regularDays).toLocaleString('es-CL')}
                        </span>
                      </div>
                    )}
                    {includeStorage && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Bodega prorrateada:</span>
                        <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                          ${Math.round((30000 / 30) * firstPaymentCalculation.promoDays * 0.5 + (30000 / 30) * firstPaymentCalculation.regularDays).toLocaleString('es-CL')}
                        </span>
                      </div>
                    )}
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

                  {/* Sección de Ahorros */}
                  <div className="mb-6">
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                      <h4 className="text-sm font-semibold text-green-800 dark:text-green-200 mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                        </svg>
                        ¡Te estás ahorrando!
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-green-700 dark:text-green-300">50% OFF primer mes:</span>
                          <span className="text-sm font-semibold text-green-800 dark:text-green-200">
                            ${Math.round((originalPrice / 30) * firstPaymentCalculation.promoDays * 0.5 + (includeParking ? (50000 / 30) * firstPaymentCalculation.promoDays * 0.5 : 0) + (includeStorage ? (30000 / 30) * firstPaymentCalculation.promoDays * 0.5 : 0)).toLocaleString('es-CL')}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-green-700 dark:text-green-300">Comisión corretaje gratis:</span>
                          <span className="text-sm font-semibold text-green-800 dark:text-green-200">
                            ${Math.round((originalPrice * 0.5) * 1.19).toLocaleString('es-CL')}
                          </span>
                        </div>
                        <div className="border-t border-green-300 dark:border-green-700 pt-2 mt-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-semibold text-green-800 dark:text-green-200">Total ahorrado:</span>
                            <span className="text-base font-bold text-green-900 dark:text-green-100">
                              ${(Math.round((originalPrice / 30) * firstPaymentCalculation.promoDays * 0.5 + (includeParking ? (50000 / 30) * firstPaymentCalculation.promoDays * 0.5 : 0) + (includeStorage ? (30000 / 30) * firstPaymentCalculation.promoDays * 0.5 : 0)) + Math.round((originalPrice * 0.5) * 1.19)).toLocaleString('es-CL')}
                            </span>
                          </div>
                        </div>
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

      {/* Visit Scheduler Modal */}
      <VisitSchedulerWrapper
        buildingName={building.name}
        buildingId={building.id}
        unitId={selectedUnit?.id}
      />
    </div>
  );
}

