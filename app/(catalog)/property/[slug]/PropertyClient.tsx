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
  Calendar
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
            <div className="space-y-6">
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

              {/* INFORMACIÓN RÁPIDA - DISEÑO MINIMALISTA */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Características principales</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">2</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center gap-1">
                      <Bed className="w-4 h-4" />
                      Dormitorios
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">1</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center gap-1">
                      <Bath className="w-4 h-4" />
                      Baños
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{selectedUnit?.m2 || 45}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center gap-1">
                      <Square className="w-4 h-4" />
                      m²
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">2</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Piso</div>
                  </div>
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



          {/* PASO 5: LAYOUT PRINCIPAL OPTIMIZADO */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column - Información Detallada */}
            <div className="lg:col-span-8 space-y-8">

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
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Terminaciones</h3>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Ventanas: Termopanel en PVC</li>
                            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Agua caliente: Central</li>
                            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Cocina: Encimera Vitrocerámica</li>
                            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Piso baños: Porcelanato/Cerámica</li>
                            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Piso estar: Vinílico</li>
                            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Piso dormitorios: Vinílico</li>
                            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Chapa: Electrónica</li>
                            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Alarma: Sí</li>
                          </ul>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Equipamiento</h3>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Refrigerador</li>
                            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Campana</li>
                            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Cortinas Roller</li>
                            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Porta TV</li>
                            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Cama</li>
                            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Microondas</li>
                            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Horno Eléctrico</li>
                            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Sofá Cama</li>
                          </ul>
                        </div>
                      </div>
                    )}

                    {activeTab === 'caracteristicas' && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Comodidades del edificio {building.name}</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {building.amenities.map((amenity, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              {amenity}
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

            {/* Right Column - Sidebar optimizado */}
            <div className="lg:col-span-4 space-y-6">
              {/* Selector de Unidad */}
              <section aria-label="Selector de unidad">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl font-bold">{selectedUnit?.id || '207'}</span>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                      <ExternalLink className="w-4 h-4" />
                      Cambiar
                    </button>
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{building.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{building.address}, {building.comuna}</p>
                </div>
              </section>

              {/* Cost Table */}
              <section aria-label="Detalles de costos">
                <CostTable unit={selectedUnit} promoLabel="$0" />
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

