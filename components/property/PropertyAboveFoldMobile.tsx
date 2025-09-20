"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Share2, Heart, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import type { Building, Unit } from "@schemas/models";

interface PropertyAboveFoldMobileProps {
    building: Building;
    selectedUnit: Unit;
    variant?: "catalog" | "marketing" | "admin";
    onScheduleVisit: () => void;
    onWhatsApp?: () => void;
    onSave?: () => void;
    onShare?: () => void;
}

export function PropertyAboveFoldMobile({
    building,
    selectedUnit,
    variant = "catalog",
    onScheduleVisit,
    onWhatsApp,
    onSave,
    onShare
}: PropertyAboveFoldMobileProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isSaved, setIsSaved] = useState(false);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    // Calcular precio total por mes (arriendo + GGCC)
    const arriendo = selectedUnit?.price || building.precio_desde || 290000;
    const ggcc = 45000; // Default GGCC value
    const precioTotalMes = arriendo + ggcc;

    // Datos para chips y badges
    const tipologia = selectedUnit?.tipologia || "2D";
    const m2 = selectedUnit?.area_interior_m2 || selectedUnit?.m2 || 48;
    const petFriendly = true; // Default pet friendly
    const minutosMetro = 6; // Default metro time
    const stock = building.units?.filter(u => u.disponible).length || 7;

    // Navegación de imágenes
    const totalImages = building.gallery?.length || 1;
    const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % totalImages);
    const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + totalImages) % totalImages);

    // Gestos táctiles para navegación
    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe && totalImages > 1) {
            nextImage();
        }
        if (isRightSwipe && totalImages > 1) {
            prevImage();
        }
    };

    // Hero image con fallback
    const heroImage = building.gallery?.[0] || building.coverImage || "/images/lascondes-cover.jpg";

    return (
        <section aria-labelledby="af-title" className="relative">
            {/* 1. Barra superior mínima (sticky, 56px) */}
            <div className="sticky top-0 z-30 h-14 backdrop-blur bg-white/80 dark:bg-black/30 border-b border-gray-200/50 dark:border-gray-700/50 flex items-center justify-between px-4">
                <nav aria-label="breadcrumb" className="text-xs text-gray-800 dark:text-slate-300">
                    <span className="font-medium">{building.comuna}</span>
                    <span className="mx-2 text-gray-300:text-slate-400">·</span>
                    <span className="text-gray-700 dark:text-slate-300">{building.name}</span>
                </nav>
                <div className="flex gap-3">
                    <button
                        onClick={onShare}
                        className="w-8 h-8 flex items-center justify-center text-gray-800 dark:text-white hover:bg-gray-800:hover:bg-white/10 rounded-full transition-colors"
                        aria-label="Compartir propiedad"
                    >
                        <Share2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => {
                            setIsSaved(!isSaved);
                            onSave?.();
                        }}
                        className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${isSaved
                            ? "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-400/20"
                            : "text-gray-800 dark:text-white hover:bg-gray-800:hover:bg-white/10"
                            }`}
                        aria-label={isSaved ? "Quitar de favoritos" : "Guardar en favoritos"}
                    >
                        <Heart className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
                    </button>
                </div>
            </div>

            {/* 2. Hero visual (full-width, ratio estable 4:3) */}
            <div
                className="relative w-full aspect-[4/3] bg-gray-900"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                <Image
                    src={heroImage}
                    alt={`${building.name} - ${tipologia} en ${building.comuna}`}
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover"
                />

                {/* Overlay de degradado suave para legibilidad */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                {/* Indicador 1/N + controles de navegación */}
                <div className="absolute top-4 right-4 bg-black/50 text-white text-sm font-medium px-3 py-1.5 rounded-full backdrop-blur">
                    {currentImageIndex + 1} / {totalImages}
                </div>

                {/* Barra de progreso sutil */}
                {totalImages > 1 && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-black/20">
                        <div
                            className="h-full bg-cyan-500 transition-all duration-300 ease-out"
                            style={{ width: `${((currentImageIndex + 1) / totalImages) * 100}%` }}
                        />
                    </div>
                )}

                {/* Controles de navegación */}
                {totalImages > 1 && (
                    <>
                        <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                            aria-label="Imagen anterior"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                            aria-label="Imagen siguiente"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </>
                )}

                {/* Botón "Ver fotos" */}
                <button
                    onClick={() => {/* TODO: Abrir galería fullscreen */ }}
                    className="absolute bottom-4 left-4 bg-white/90 text-gray-900 px-4 py-2 rounded-full text-sm font-medium hover:bg-white transition-colors"
                >
                    Ver fotos
                </button>

                {/* Indicador de gestos táctiles */}
                {totalImages > 1 && (
                    <div className="absolute bottom-4 right-4 text-white/70 text-xs bg-black/30 px-2 py-1 rounded-full backdrop-blur">
                        ← Desliza →
                    </div>
                )}
            </div>

            {/* Paginador visual (dots) - Solo si hay más de 1 imagen */}
            {totalImages > 1 && (
                <div className="flex justify-center gap-2 mt-4 px-4 py-2">
                    {Array.from({ length: totalImages }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentImageIndex(i)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 ${i === currentImageIndex
                                ? "bg-cyan-600 w-4 shadow-sm"
                                : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                                }`}
                            aria-label={`Ir a imagen ${i + 1}`}
                            aria-current={i === currentImageIndex ? "true" : "false"}
                        />
                    ))}
                </div>
            )}

            {/* 3. Headline + Precio total/mes */}
            <div className="px-4 py-6 bg-gray-800:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
                <h1 id="af-title" className="text-xl font-semibold leading-tight text-white:text-white">
                    {tipologia} luminoso en {building.comuna}
                </h1>

                <div className="mt-3">
                    <p className="text-2xl font-bold text-white:text-white">
                        ${precioTotalMes.toLocaleString('es-CL')}
                        <span className="text-sm font-normal text-gray-400:text-slate-400 ml-2">
                            / mes (arriendo + GGCC)
                        </span>
                    </p>
                    <p className="text-xs text-gray-400:text-slate-500 mt-1">
                        Respaldado por Assetplan
                    </p>
                </div>

                {/* 4. Badges clave (scroll mínimo) */}
                <div className="mt-4 flex flex-wrap items-center gap-2">
                    {/* Badge principal: 0% comisión */}
                    <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-cyan-50 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/40 shadow-sm">
                        0% comisión
                    </span>

                    {/* Chips de características */}
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-900:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-700:border-gray-600 shadow-sm">
                        {m2} m²
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-900:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-700:border-gray-600 shadow-sm">
                        {petFriendly ? 'Pet-friendly' : 'No mascotas'}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-900:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-700:border-gray-600 shadow-sm">
                        Metro {minutosMetro}'
                    </span>

                    {/* Badge de urgencia si stock bajo */}
                    {stock <= 3 && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/40 shadow-sm">
                            Quedan {stock}
                        </span>
                    )}
                </div>
            </div>

            {/* 5. Sticky CTA (aparece tras ~120px) */}
            <StickyCtaBar
                price={precioTotalMes}
                onScheduleVisit={onScheduleVisit}
                onWhatsApp={onWhatsApp}
            />
        </section>
    );
}

// Componente StickyCtaBar separado para mejor organización
interface StickyCtaBarProps {
    price: number;
    onScheduleVisit: () => void;
    onWhatsApp?: () => void;
}

function StickyCtaBar({ price, onScheduleVisit, onWhatsApp }: StickyCtaBarProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            setIsVisible(scrollY > 120);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur border-t border-gray-700:border-gray-700 shadow-lg px-4 py-3 safe-area-bottom">
            <div className="flex items-center justify-between gap-4">
                {/* Mini precio a la izquierda */}
                <div className="flex-shrink-0">
                    <p className="text-lg font-bold text-white:text-white">
                        ${price.toLocaleString('es-CL')}
                    </p>
                    <p className="text-xs text-gray-400:text-slate-500">/ mes</p>
                </div>

                {/* CTAs */}
                <div className="flex gap-3 flex-1">
                    <button
                        onClick={onScheduleVisit}
                        className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 shadow-lg hover:shadow-xl"
                    >
                        Agendar visita
                    </button>

                    {onWhatsApp && (
                        <button
                            onClick={onWhatsApp}
                            className="w-12 h-12 bg-green-600 hover:bg-green-700 text-white rounded-xl flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-lg hover:shadow-xl"
                            aria-label="Contactar por WhatsApp"
                        >
                            <MessageCircle className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
