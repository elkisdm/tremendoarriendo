"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { MapPin, Quote, ArrowRight, Star } from "lucide-react";
import type { CommuneLifeData } from "@/data/communes/estacion-central";

interface CommuneLifeSectionProps {
    data: CommuneLifeData;
    className?: string;
}

export function CommuneLifeSection({ data, className = "" }: CommuneLifeSectionProps) {
    const prefersReducedMotion = useReducedMotion();
    const [hoveredPin, setHoveredPin] = useState<string | null>(null);

    // Configuración de animaciones respetando prefers-reduced-motion
    const animationConfig = {
        duration: prefersReducedMotion ? 0 : 0.6,
        ease: "easeOut"
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: animationConfig.duration,
                staggerChildren: prefersReducedMotion ? 0 : 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: animationConfig.duration, ease: animationConfig.ease }
        }
    };

    return (
        <section
            className={`py-16 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 ${className}`}
            aria-labelledby="commune-life-title"
        >
            <div className="container mx-auto px-4 max-w-7xl">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="space-y-16"
                >
                    {/* Hero Section */}
                    <motion.div variants={itemVariants} className="relative">
                        <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden">
                            <Image
                                src={data.hero.image}
                                alt={`Vista de ${data.name}`}
                                fill
                                className="object-cover"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                            <div className="absolute bottom-6 left-6 right-6 text-white">
                                <h2
                                    id="commune-life-title"
                                    className="text-3xl md:text-4xl font-bold mb-2"
                                >
                                    {data.hero.title}
                                </h2>
                                <p className="text-lg md:text-xl opacity-90">
                                    {data.hero.subtitle}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Highlights Grid */}
                    <motion.div variants={itemVariants} className="space-y-8">
                        <div className="text-center">
                            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                ¿Por qué vivir en {data.name}?
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                                Descubre las ventajas de vivir en esta comuna estratégicamente ubicada
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {data.highlights.map((highlight, _index) => (
                                <motion.div
                                    key={highlight.title}
                                    variants={itemVariants}
                                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="text-3xl flex-shrink-0" role="img" aria-label={highlight.title}>
                                            {highlight.icon}
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                                {highlight.title}
                                            </h4>
                                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                                {highlight.description}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Map Section */}
                    <motion.div variants={itemVariants} className="space-y-6">
                        <div className="text-center">
                            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                Ubicación estratégica
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Puntos de interés cercanos a tu futuro hogar
                            </p>
                        </div>

                        <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                            <div className="relative aspect-[16/10] rounded-xl overflow-hidden">
                                <Image
                                    src={data.map.image}
                                    alt={`Mapa de ${data.name} con puntos de interés`}
                                    fill
                                    className="object-cover"
                                />

                                {/* Map Pins */}
                                {data.map.pins.map((pin) => (
                                    <motion.button
                                        key={pin.label}
                                        className="absolute transform -translate-x-1/2 -translate-y-1/2"
                                        style={{
                                            left: `${pin.position.x}%`,
                                            top: `${pin.position.y}%`
                                        }}
                                        onMouseEnter={() => setHoveredPin(pin.label)}
                                        onMouseLeave={() => setHoveredPin(null)}
                                        onClick={() => setHoveredPin(hoveredPin === pin.label ? null : pin.label)}
                                        aria-label={`Ver información de ${pin.label}`}
                                        whileHover={{ scale: prefersReducedMotion ? 1 : 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <div className="relative">
                                            <MapPin className="w-6 h-6 text-red-500 drop-shadow-lg" />

                                            {/* Tooltip */}
                                            {hoveredPin === pin.label && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 10 }}
                                                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap z-10"
                                                >
                                                    {pin.label}
                                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
                                                </motion.div>
                                            )}
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Testimonial Section */}
                    <motion.div variants={itemVariants} className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white">
                        <div className="max-w-4xl mx-auto">
                            <div className="flex items-center justify-center mb-6">
                                <Quote className="w-8 h-8 text-blue-200" />
                            </div>

                            <blockquote className="text-center mb-8">
                                <p className="text-lg md:text-xl leading-relaxed mb-6 italic">
                                    "{data.testimonial.quote}"
                                </p>

                                <div className="flex items-center justify-center gap-4">
                                    <div className="relative w-16 h-16 rounded-full overflow-hidden">
                                        <Image
                                            src={data.testimonial.avatar}
                                            alt={`Foto de ${data.testimonial.author}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="text-left">
                                        <cite className="not-italic font-semibold text-lg">
                                            {data.testimonial.author}
                                        </cite>
                                        <p className="text-blue-200 text-sm">
                                            {data.testimonial.role}
                                        </p>
                                    </div>
                                </div>
                            </blockquote>

                            {/* Rating Stars */}
                            <div className="flex justify-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 fill-yellow-300 text-yellow-300" />
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* CTA Section */}
                    <motion.div variants={itemVariants} className="text-center">
                        <Link href={data.cta.href}>
                            <motion.button
                                className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                                whileHover={{ scale: prefersReducedMotion ? 1 : 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {data.cta.text}
                                <ArrowRight className="w-5 h-5" />
                            </motion.button>
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
