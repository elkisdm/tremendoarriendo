"use client";
import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ImageGallery } from "@components/gallery/ImageGallery";
import { AmenityList } from "@components/ui/AmenityList";
import { PromotionBadge } from "@components/ui/PromotionBadge";
import { ArrowLeft, MapPin, Users, Home, Sparkles, ExternalLink, Calendar, MessageCircle, Clock, Star, CheckCircle, Zap, TrendingUp, Eye, Wifi, Car, Dumbbell, Waves, Shield, Coffee, WashingMachine, AirVent, ParkingCircle, TreePine, Camera, Lock, Wrench, ChevronLeft, ChevronRight, Building2, Bed, Bath, Sofa, Utensils, Baby, Dog, Bike, Percent, CreditCard, Heart, Award, Gift, Tag, DollarSign, ShoppingCart, CalendarDays, Gamepad2, Tv, Music, BookOpen, Palette, Globe, Phone, Mail, Smartphone, Monitor, Printer, Projector, Headphones, Speaker, Lightbulb, Fan, Thermometer, Snowflake, Sun, Moon, Cloud, CloudRain, CloudLightning, CloudSnow, Wind, Umbrella } from "lucide-react";

// Función local para obtener el badge principal
function getPrimaryBadge(badges?: Array<{ label: string; tag?: string; type: string }>) {
  if (!badges || badges.length === 0) return null;
  return badges[0];
}

// Función para obtener colores y bordes de badges consistentes con building cards
const getBadgeColor = (label: string) => {
  if (label.includes('Sin comisión') || label.includes('Comisión gratis')) {
    return "bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-white border-cyan-300/50";
  }
  if (label.includes('Garantía en cuotas')) {
    return "bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-blue-300/50";
  }
  if (label.includes('Opción sin garantía')) {
    return "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-300/50";
  }
  if (label.includes('Precio fijo') || label.includes('12 meses')) {
    return "bg-gradient-to-r from-purple-500 to-violet-500 text-white border-purple-300/50";
  }
  if (label.includes('cuotas')) {
    return "bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-cyan-300/50";
  }
  if (label.includes('sin aval')) {
    return "bg-gradient-to-r from-orange-500 to-red-500 text-white border-orange-300/50";
  }
  if (label.includes('OFF') || label.includes('%')) {
    return "bg-gradient-to-r from-red-500 to-pink-500 text-white border-red-300/50";
  }
  return "bg-gradient-to-r from-gray-500 to-gray-600 text-white border-gray-300/50";
};

// Función para obtener icono de badge de promoción
const getBadgeIcon = (label: string) => {
  const labelLower = label.toLowerCase();
  
  if (labelLower.includes('sin comisión') || labelLower.includes('comisión gratis')) {
    return DollarSign;
  }
  if (labelLower.includes('garantía en cuotas')) {
    return CreditCard;
  }
  if (labelLower.includes('opción sin garantía')) {
    return Heart;
  }
  if (labelLower.includes('precio fijo') || labelLower.includes('12 meses')) {
    return Award;
  }
  if (labelLower.includes('cuotas')) {
    return CalendarDays;
  }
  if (labelLower.includes('sin aval')) {
    return Gift;
  }
  if (labelLower.includes('off') || labelLower.includes('%')) {
    return Percent;
  }
  if (labelLower.includes('descuento')) {
    return Tag;
  }
  if (labelLower.includes('especial')) {
    return Star;
  }
  if (labelLower.includes('nuevo')) {
    return Sparkles;
  }
  
  return Sparkles; // Icono por defecto
};

// Función para obtener icono de amenidad
const getAmenityIcon = (amenity: string) => {
  const amenityLower = amenity.toLowerCase();
  
  if (amenityLower.includes('wifi') || amenityLower.includes('internet')) return Wifi;
  if (amenityLower.includes('estacionamiento') || amenityLower.includes('parking')) return Car;
  if (amenityLower.includes('gimnasio') || amenityLower.includes('gym')) return Dumbbell;
  if (amenityLower.includes('piscina') || amenityLower.includes('pool')) return Waves;
  if (amenityLower.includes('seguridad') || amenityLower.includes('security')) return Shield;
  if (amenityLower.includes('café') || amenityLower.includes('cafe')) return Coffee;
  if (amenityLower.includes('lavandería') || amenityLower.includes('laundry')) return WashingMachine;
  if (amenityLower.includes('aire acondicionado') || amenityLower.includes('ac')) return AirVent;
  if (amenityLower.includes('parque') || amenityLower.includes('garden')) return TreePine;
  if (amenityLower.includes('cctv') || amenityLower.includes('cámara')) return Camera;
  if (amenityLower.includes('portero') || amenityLower.includes('doorman')) return Lock;
  if (amenityLower.includes('mantenimiento')) return Wrench;
  if (amenityLower.includes('dormitorio') || amenityLower.includes('bedroom')) return Bed;
  if (amenityLower.includes('baño') || amenityLower.includes('bathroom')) return Bath;
  if (amenityLower.includes('sala') || amenityLower.includes('living')) return Sofa;
  if (amenityLower.includes('cocina') || amenityLower.includes('kitchen')) return Utensils;
  if (amenityLower.includes('niños') || amenityLower.includes('kids')) return Baby;
  if (amenityLower.includes('mascotas') || amenityLower.includes('pet')) return Dog;
  if (amenityLower.includes('bicicletas') || amenityLower.includes('bike')) return Bike;
  if (amenityLower.includes('edificio') || amenityLower.includes('building')) return Building2;
  if (amenityLower.includes('juegos') || amenityLower.includes('games')) return Gamepad2;
  if (amenityLower.includes('tv') || amenityLower.includes('televisión')) return Tv;
  if (amenityLower.includes('música') || amenityLower.includes('music')) return Music;
  if (amenityLower.includes('biblioteca') || amenityLower.includes('library')) return BookOpen;
  if (amenityLower.includes('arte') || amenityLower.includes('art')) return Palette;
  if (amenityLower.includes('internacional') || amenityLower.includes('international')) return Globe;
  if (amenityLower.includes('teléfono') || amenityLower.includes('phone')) return Phone;
  if (amenityLower.includes('email') || amenityLower.includes('mail')) return Mail;
  if (amenityLower.includes('smartphone') || amenityLower.includes('celular')) return Smartphone;
  if (amenityLower.includes('monitor') || amenityLower.includes('pantalla')) return Monitor;
  if (amenityLower.includes('impresora') || amenityLower.includes('printer')) return Printer;
  if (amenityLower.includes('proyector') || amenityLower.includes('projector')) return Projector;
  if (amenityLower.includes('audífonos') || amenityLower.includes('headphones')) return Headphones;
  if (amenityLower.includes('altavoces') || amenityLower.includes('speaker')) return Speaker;
  if (amenityLower.includes('luz') || amenityLower.includes('light')) return Lightbulb;
  if (amenityLower.includes('ventilador') || amenityLower.includes('fan')) return Fan;
  if (amenityLower.includes('temperatura') || amenityLower.includes('thermometer')) return Thermometer;
  if (amenityLower.includes('clima') || amenityLower.includes('weather')) return Cloud;
  
  return Sparkles; // Icono por defecto
};

// Interfaz para datos del CSV
interface CSVUnit {
  op: string;
  unidad: string;
  tipologia: string;
  precio: number;
  m2: number;
  orientacion: string;
  estacionamiento: number;
  bodega: number;
  gc: number;
  aceptaMascotas: boolean;
  estado: string;
  especial: boolean;
  tremendaPromo: boolean;
  descuento: number;
  mesesDescuento: number;
  linkListing: string;
}

interface BuildingForArriendaSinComision {
  id: string;
  slug: string;
  name: string;
  comuna: string;
  address: string;
  coverImage: string;
  gallery: string[];
  precioDesde: number;
  precioHasta: number;
  precioPromedio: number;
  hasAvailability: boolean;
  totalUnidades: number;
  unidadesDisponibles: number;
  badges: Array<{ label: string; tag?: string; type: string }>;
  amenities: string[];
  tipologias: string[];
  unidades: CSVUnit[];
  selectedTypology?: string | null;
}

interface ArriendaSinComisionBuildingDetailProps {
  building: BuildingForArriendaSinComision;
}

export default function ArriendaSinComisionBuildingDetail({ building }: ArriendaSinComisionBuildingDetailProps) {
  const [hoveredTypology, setHoveredTypology] = useState<string | null>(null);
  const [showUrgencyBanner, setShowUrgencyBanner] = useState(true);
  
  const primaryBadge = getPrimaryBadge(building.badges);
  
  // Memoizar cálculos costosos
  const {
    availableUnits,
    typologyGroups,
    availableTypologies,
    totalAvailableUnits,
    minPrice,
    maxPrice,
    avgPrice
  } = useMemo(() => {
    const availableUnits = building.unidades.filter(unit => 
      !unit.estado || unit.estado.toLowerCase() === 'disponible'
    );
    
    const typologyGroups = availableUnits.reduce((acc, unit) => {
      const key = unit.tipologia;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(unit);
      return acc;
    }, {} as Record<string, typeof availableUnits>);
    
    const availableTypologies = Object.keys(typologyGroups);
    const totalAvailableUnits = availableUnits.length;
    const minPrice = Math.min(...availableUnits.map(u => u.precio));
    const maxPrice = Math.max(...availableUnits.map(u => u.precio));
    const avgPrice = Math.round(availableUnits.reduce((sum, u) => sum + u.precio, 0) / totalAvailableUnits);
    
    return {
      availableUnits,
      typologyGroups,
      availableTypologies,
      totalAvailableUnits,
      minPrice,
      maxPrice,
      avgPrice
    };
  }, [building.unidades]);

  const formatPrice = (price: number): string => {
    if (price >= 1_000_000) {
      const millions = price / 1_000_000;
      return `$${millions.toFixed(0)}M`;
    }
    return `$${price.toLocaleString('es-CL')}`;
  };

  const formatTypologyLabel = (tipology: string): string => {
    const mapping: Record<string, string> = {
      'Studio': 'Studio',
      '1D1B': '1 Dormitorio, 1 Baño',
      '2D1B': '2 Dormitorios, 1 Baño',
      '2D2B': '2 Dormitorios, 2 Baños',
      '3D2B': '3 Dormitorios, 2 Baños',
      '1 dormitorio': '1 Dormitorio',
      '2 dormitorios': '2 Dormitorios',
      '3 dormitorios': '3 Dormitorios',
      '4 dormitorios': '4 Dormitorios',
      'Estudio': 'Estudio'
    };
    return mapping[tipology] || tipology;
  };

  // Función para abrir Google Maps
  const openGoogleMaps = () => {
    window.open('https://maps.app.goo.gl/nLMtyQSTvepMAb1FA?g_st=ipc', '_blank');
  };

  // Simular visitas recientes para crear urgencia
  const recentVisitors = Math.floor(Math.random() * 15) + 5;
  const lastReservation = Math.floor(Math.random() * 60) + 5; // minutos

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Banner de urgencia optimizado y centrado */}
      <AnimatePresence>
        {showUrgencyBanner && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 text-white py-4 relative overflow-hidden"
          >
            <div className="container mx-auto max-w-7xl px-4">
              <div className="flex items-center justify-center gap-6 text-sm font-medium">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center"
                >
                  <Zap className="w-4 h-4" />
                </motion.div>
                <span>🔥 {recentVisitors} personas viendo este edificio</span>
                <span className="hidden sm:inline">•</span>
                <span>⏰ Última reserva hace {lastReservation} minutos</span>
                <span className="hidden sm:inline">•</span>
                <span>🎯 Solo {totalAvailableUnits} unidades disponibles</span>
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

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section - Redistribuido para mejor aprovechamiento */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Navegación */}
          <div className="flex items-center gap-4 mb-8">
            <button 
              onClick={() => {
                sessionStorage.setItem('from-building-details', 'true');
                window.location.href = '/arrienda-sin-comision';
              }}
              className="group inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Volver a edificios
            </button>
          </div>

          {/* Layout principal redistribuido */}
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Columna izquierda - Información principal (7/12) */}
            <div className="lg:col-span-7 space-y-8">
              {/* Header con nombre, ubicación y badges */}
              <div className="space-y-6">
                {/* Nombre y ubicación */}
                <div className="space-y-4">
                  {/* Título minimalista y serio */}
                  <h1 className="text-5xl md:text-6xl font-bold text-foreground dark:text-white leading-tight">
                    {building.name}
                  </h1>
                  
                  <div className="flex items-center gap-3 text-lg md:text-xl text-muted-foreground">
                    <MapPin className="h-5 w-5 md:h-6 md:w-6" />
                    <span className="font-medium">{building.comuna}</span>
                    <span className="text-muted-foreground">•</span>
                    <span>{building.address}</span>
                    <motion.button
                      onClick={openGoogleMaps}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors dark:text-blue-400 dark:bg-blue-950/30 dark:hover:bg-blue-950/50 border border-blue-200 dark:border-blue-800/50"
                      aria-label="Abrir ubicación en Google Maps"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Mapa
                    </motion.button>
                  </div>
                </div>

                {/* Badges con iconos y bordes de colores */}
                {building.badges && building.badges.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {building.badges.map((badge, index) => {
                      const BadgeIcon = getBadgeIcon(badge.label);
                      return (
                        <motion.div
                          key={badge.label}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                        >
                          <div className={`${getBadgeColor(badge.label)} px-3 py-2 text-xs font-semibold rounded-lg shadow-md text-center border flex items-center justify-center gap-1.5`}>
                            <BadgeIcon className="w-3 h-3" />
                            {badge.label}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Columna derecha - Galería prominente (5/12) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Galería optimizada */}
              <motion.div 
                className="relative"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <ImageGallery 
                  images={building.gallery} 
                  coverImage={building.coverImage}
                  autoPlay={true}
                  autoPlayInterval={4000}
                  compact={false}
                />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Estadísticas centradas en toda la página */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <motion.div 
                className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-sm rounded-2xl p-4 border border-amber-200/50 dark:border-amber-800/30"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                    {formatPrice(minPrice)}
                  </div>
                  <div className="text-xs text-muted-foreground">Precio desde</div>
                  <div className="text-xs text-amber-600 dark:text-amber-400 flex items-center justify-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Especial
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 backdrop-blur-sm rounded-2xl p-4 border border-emerald-200/50 dark:border-emerald-800/30"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {totalAvailableUnits}
                  </div>
                  <div className="text-xs text-muted-foreground">Disponibles</div>
                  <div className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
                    <Eye className="w-3 h-3" />
                    {recentVisitors} viendo
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 backdrop-blur-sm rounded-2xl p-4 border border-blue-200/50 dark:border-blue-800/30"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {availableTypologies.length}
                  </div>
                  <div className="text-xs text-muted-foreground">Tipologías</div>
                  <div className="text-xs text-blue-600 dark:text-blue-400 flex items-center justify-center gap-1">
                    <Star className="w-3 h-3" />
                    Premium
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="bg-gradient-to-br from-purple-500/10 to-violet-500/10 backdrop-blur-sm rounded-2xl p-4 border border-purple-200/50 dark:border-purple-800/30"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    ⭐
                  </div>
                  <div className="text-xs text-muted-foreground">Calificación</div>
                  <div className="text-xs text-purple-600 dark:text-purple-400 flex items-center justify-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    4.9/5
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Amenities con iconos centradas */}
        {building.amenities && building.amenities.length > 0 && (
          <motion.section 
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold mb-2">Estilo de vida premium</h3>
              <p className="text-muted-foreground">Descubre todas las amenidades que hacen de este edificio tu próximo hogar</p>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {building.amenities.map((amenity, index) => {
                  const IconComponent = getAmenityIcon(amenity);
                  return (
                    <motion.div
                      key={amenity}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.1 + index * 0.1 }}
                      className="bg-card/50 backdrop-blur-sm rounded-2xl p-4 border-2 border-amber-200/30 dark:border-amber-800/30 text-center hover:bg-card/70 hover:border-amber-300/50 dark:hover:border-amber-700/50 transition-all duration-300 hover:scale-105"
                    >
                      <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-xl flex items-center justify-center border border-amber-300/30 dark:border-amber-700/30">
                        <IconComponent className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                      </div>
                      <p className="text-sm font-medium text-foreground">{amenity}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.section>
        )}

        {/* Selector de tipología optimizado - ENFOQUE PRINCIPAL */}
        {availableTypologies.length > 0 && (
          <motion.section 
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <div className="text-center mb-12">
              <h3 className="text-4xl font-bold mb-4">Elige tu tipología ideal</h3>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Selecciona la que mejor se adapte a tu estilo de vida y descubre todas las opciones disponibles
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {availableTypologies.map((typology, index) => {
                const units = typologyGroups[typology];
                const minPrice = Math.min(...units.map(u => u.precio));
                const maxM2 = Math.max(...units.map(u => u.m2));
                const minM2 = Math.min(...units.map(u => u.m2));
                const isHovered = hoveredTypology === typology;
                
                return (
                  <motion.div
                    key={typology}
                    className="group relative bg-card/50 backdrop-blur-sm rounded-3xl p-8 border-2 transition-all duration-300 cursor-pointer overflow-hidden"
                    style={{
                      borderColor: isHovered ? '#f59e0b' : 'var(--border)',
                      backgroundColor: isHovered ? 'rgba(245, 158, 11, 0.05)' : 'var(--card)'
                    }}
                    whileHover={{ 
                      scale: 1.02, 
                      y: -4,
                      boxShadow: "0 20px 40px rgba(245, 158, 11, 0.15)"
                    }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.3 + index * 0.1 }}
                    onHoverStart={() => setHoveredTypology(typology)}
                    onHoverEnd={() => setHoveredTypology(null)}
                  >
                    {/* Efecto de brillo en hover */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/10 to-transparent"
                      initial={{ x: '-100%' }}
                      animate={{ x: isHovered ? '100%' : '-100%' }}
                      transition={{ duration: 0.6 }}
                    />

                    <div className="space-y-6 relative z-10">
                      {/* Header de tipología */}
                      <div className="flex items-center gap-4">
                        <motion.div 
                          className="w-16 h-16 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          {typology.includes('Estudio') ? <Home className="h-8 w-8" /> : <Users className="h-8 w-8" />}
                        </motion.div>
                        <div>
                          <h4 className="font-bold text-2xl">{formatTypologyLabel(typology)}</h4>
                          <p className="text-sm text-muted-foreground">
                            {units.length} unidad{units.length !== 1 ? 'es' : ''} disponible{units.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>

                      {/* Información clave */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Precio desde:</span>
                          <span className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                            {formatPrice(minPrice)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Superficie:</span>
                          <span className="font-semibold text-lg">
                            {minM2}-{maxM2} m²
                          </span>
                        </div>
                      </div>

                      {/* CTA principal */}
                      <Link
                        href={`/arrienda-sin-comision/${building.slug}/unidad/${typology.toLowerCase().replace(/\s+/g, '-')}`}
                        className="block w-full"
                      >
                        <motion.button
                          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-4 rounded-2xl font-semibold hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-300 group-hover:scale-105 text-lg"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Ver Departamentos
                        </motion.button>
                      </Link>

                      {/* Información adicional */}
                      <div className="text-xs text-muted-foreground text-center">
                        ✨ Sin comisión • Pet friendly • Garantía en cuotas
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}
