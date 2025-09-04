"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { clx } from "@lib/utils";

interface PropertyGalleryProps {
    images: string[];
    initialIndex?: number;
    autoPlay?: boolean;
    autoPlayInterval?: number;
    compact?: boolean;
}

const DEFAULT_BLUR = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==";

export function PropertyGallery({
    images,
    initialIndex = 0,
    autoPlay = false,
    autoPlayInterval = 5000,
    compact = false
}: PropertyGalleryProps) {
    const [active, setActive] = useState(initialIndex);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(autoPlay);
    const [isLoading, setIsLoading] = useState(true);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const isInitialRenderRef = useRef(true);

    // Check for reduced motion preference
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);

        const handleChange = (e: MediaQueryListEvent) => {
            setPrefersReducedMotion(e.matches);
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    // Auto-play functionality
    useEffect(() => {
        if (!autoPlay || !isPlaying || prefersReducedMotion) {
            if (autoPlayRef.current) {
                clearInterval(autoPlayRef.current);
                autoPlayRef.current = null;
            }
            return;
        }

        autoPlayRef.current = setInterval(() => {
            setActive((prev) => (prev + 1) % images.length);
        }, autoPlayInterval);

        return () => {
            if (autoPlayRef.current) {
                clearInterval(autoPlayRef.current);
            }
        };
    }, [autoPlay, isPlaying, autoPlayInterval, images.length, prefersReducedMotion]);

    const nextImage = useCallback(() => {
        setActive((prev) => (prev + 1) % images.length);
    }, [images.length]);

    const prevImage = useCallback(() => {
        setActive((prev) => (prev - 1 + images.length) % images.length);
    }, [images.length]);

    const handleKeyDown = (event: React.KeyboardEvent) => {
        switch (event.key) {
            case 'ArrowRight':
                event.preventDefault();
                nextImage();
                break;
            case 'ArrowLeft':
                event.preventDefault();
                prevImage();
                break;
            case 'Escape':
                event.preventDefault();
                setIsFullscreen(false);
                break;
            case ' ':
                event.preventDefault();
                setIsPlaying(!isPlaying);
                break;
        }
    };

    const handleImageLoad = () => {
        setIsLoading(false);
    };

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    if (!images || images.length === 0) {
        return null;
    }

    // Aspect ratios optimizados para imágenes de propiedades
    const aspectRatioClass = compact
        ? "aspect-[4/3] md:aspect-[3/2]"
        : "aspect-[4/3] md:aspect-[3/2] lg:aspect-[16/10]";

    return (
        <>
            {/* Main Gallery */}
            <div
                className="w-full space-y-3"
                role="region"
                aria-label="Galería de imágenes de la propiedad"
                ref={containerRef}
            >
                {/* Main Image Container */}
                <div className={clx(
                    "relative overflow-hidden rounded-2xl ring-1 ring-white/10 group cursor-pointer",
                    aspectRatioClass
                )}>
                    {/* Loading State */}
                    {isLoading && (
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse flex items-center justify-center">
                            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        </div>
                    )}

                    {/* Main Image */}
                    <Image
                        src={images[active]}
                        alt={`Imagen ${active + 1} de ${images.length} de la galería`}
                        fill
                        sizes={compact
                            ? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            : "(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                        }
                        className={clx(
                            "object-cover transition-all duration-700 ease-out",
                            isLoading ? "opacity-0" : "opacity-100",
                            !prefersReducedMotion && "group-hover:scale-105 transition-transform duration-700 ease-out"
                        )}
                        placeholder="blur"
                        blurDataURL={DEFAULT_BLUR}
                        priority={isInitialRenderRef.current && active === 0}
                        onLoad={handleImageLoad}
                        onClick={toggleFullscreen}
                    />

                    {/* Navigation Controls */}
                    {images.length > 1 && (
                        <>
                            {/* Previous Button */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    prevImage();
                                }}
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white/50"
                                aria-label="Imagen anterior"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>

                            {/* Next Button */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    nextImage();
                                }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white/50"
                                aria-label="Imagen siguiente"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>

                            {/* Image Counter */}
                            <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium">
                                {active + 1} / {images.length}
                            </div>

                            {/* Auto-play Controls */}
                            {autoPlay && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        togglePlay();
                                    }}
                                    className="absolute bottom-4 left-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300"
                                    aria-label={isPlaying ? "Pausar" : "Reproducir"}
                                >
                                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                </button>
                            )}
                        </>
                    )}

                    {/* Fullscreen Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleFullscreen();
                        }}
                        className="absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white/50"
                        aria-label="Ver en pantalla completa"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                    </button>
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {images.map((image, i) => (
                            <button
                                key={i}
                                onClick={() => setActive(i)}
                                className={clx(
                                    "shrink-0 aspect-video rounded-lg md:rounded-xl overflow-hidden ring-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] transition-all duration-300 ease-out",
                                    !prefersReducedMotion && "motion-reduce:transition-none",
                                    compact
                                        ? "w-16 md:w-20"
                                        : "w-20 md:w-24 lg:w-28",
                                    i === active
                                        ? "ring-[var(--ring)] scale-105"
                                        : "ring-white/10 hover:ring-white/20 hover:scale-102"
                                )}
                            >
                                <Image
                                    src={image}
                                    alt={`Miniatura ${i + 1}`}
                                    width={112}
                                    height={84}
                                    className="w-full h-full object-cover"
                                    placeholder="blur"
                                    blurDataURL={DEFAULT_BLUR}
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Fullscreen Modal */}
            <AnimatePresence>
                {isFullscreen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
                        onKeyDown={handleKeyDown}
                        tabIndex={-1}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setIsFullscreen(false)}
                            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 z-10"
                            aria-label="Cerrar"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {/* Fullscreen Image */}
                        <div className="relative w-full h-full flex items-center justify-center p-4">
                            <Image
                                src={images[active]}
                                alt={`Imagen ${active + 1} de ${images.length} en pantalla completa`}
                                fill
                                className="object-contain"
                                sizes="100vw"
                                priority
                            />

                            {/* Fullscreen Navigation */}
                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-4 rounded-full transition-all duration-300"
                                        aria-label="Imagen anterior"
                                    >
                                        <ChevronLeft className="w-8 h-8" />
                                    </button>

                                    <button
                                        onClick={nextImage}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-4 rounded-full transition-all duration-300"
                                        aria-label="Imagen siguiente"
                                    >
                                        <ChevronRight className="w-8 h-8" />
                                    </button>

                                    {/* Fullscreen Counter */}
                                    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-lg font-medium">
                                        {active + 1} / {images.length}
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

export default PropertyGallery;
