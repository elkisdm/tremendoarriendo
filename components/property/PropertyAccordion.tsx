"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, CheckCircle, AlertCircle, Info, Building2, Zap, Shield, Users } from "lucide-react";
import type { Building, Unit } from "@schemas/models";

interface AccordionItemProps {
    id: string;
    title: string;
    icon: React.ReactNode;
    summary: string;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
    cta?: {
        text: string;
        action: () => void;
        variant?: "primary" | "secondary";
    };
}

function AccordionItem({ id, title, icon, summary, isOpen, onToggle, children, cta }: AccordionItemProps) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            {/* Header informativo y tocable */}
            <button
                onClick={onToggle}
                className="w-full px-4 py-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
                aria-expanded={isOpen}
                aria-controls={`accordion-${id}`}
            >
                <div className="flex items-center gap-3 flex-1">
                    <div className="text-cyan-600 dark:text-cyan-400">
                        {icon}
                    </div>
                    <div className="flex-1">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                            {title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {summary}
                        </p>
                    </div>
                </div>

                {/* Chevron integrado */}
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-gray-400 dark:text-gray-500"
                >
                    <ChevronDown className="w-5 h-5" />
                </motion.div>
            </button>

            {/* Contenido animado */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        id={`accordion-${id}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="px-4 pb-4 space-y-4">
                            {children}

                            {/* CTA contextual */}
                            {cta && (
                                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                                    <button
                                        onClick={cta.action}
                                        className={`w-full px-4 py-3 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 ${cta.variant === "primary"
                                                ? "bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg hover:shadow-xl"
                                                : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
                                            }`}
                                    >
                                        {cta.text}
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

interface PropertyAccordionProps {
    building: Building;
    selectedUnit: Unit | null;
    onScheduleVisit: () => void;
    onPreapproval?: () => void;
}

export function PropertyAccordion({
    building,
    selectedUnit,
    onScheduleVisit,
    onPreapproval
}: PropertyAccordionProps) {
    const [openSections, setOpenSections] = useState<string[]>(["resumen-tecnico"]);

    const toggleSection = (sectionId: string) => {
        setOpenSections(prev =>
            prev.includes(sectionId)
                ? prev.filter(id => id !== sectionId)
                : [...prev, sectionId]
        );
    };

    const openAll = () => setOpenSections(["resumen-tecnico", "requisitos", "info-edificio"]);
    const closeAll = () => setOpenSections([]);

    // Datos para el resumen técnico
    const tipologia = selectedUnit?.tipologia || "2D";
    const m2 = selectedUnit?.area_interior_m2 || selectedUnit?.area_total_m2 || 48;
    const orientacion = selectedUnit?.orientacion || "Norte";
    const calefaccion = selectedUnit?.calefaccion || "Eléctrica";
    const petFriendly = building.pet_friendly ? "Pet-friendly" : "No mascotas";
    const estacionamiento = selectedUnit?.estacionamiento ? "Con estacionamiento" : "Sin estacionamiento";
    const bodega = selectedUnit?.bodega ? "Con bodega" : "Sin bodega";

    // Datos para requisitos
    const ingresoMinimo = Math.round((selectedUnit?.precio || building.precio_desde || 290000) * 2.5);
    const requisitos = [
        `Ingreso líquido ≥ $${ingresoMinimo.toLocaleString('es-CL')} mensual`,
        "Sin morosidad vigente en DICOM",
        "CI vigente y legible",
        "Últimas 3 liquidaciones de sueldo",
        "Sin antecedentes penales"
    ];

    // Datos para info del edificio
    const amenities = building.amenities || [];
    const tiempoMetro = building.tiempo_metro || 6;
    const administracion = building.administracion || "Assetplan";
    const horarios = building.horarios || "Lun-Vie 9:00-18:00";

    return (
        <section className="space-y-4">
            {/* Controles de acordeón */}
            <div className="flex gap-2 justify-center mb-4">
                <button
                    onClick={openAll}
                    className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
                >
                    Abrir todo
                </button>
                <button
                    onClick={closeAll}
                    className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
                >
                    Cerrar todo
                </button>
            </div>

            {/* 1. Resumen Técnico (abierto por defecto) */}
            <AccordionItem
                id="resumen-tecnico"
                title="Resumen Técnico"
                icon={<Zap className="w-5 h-5" />}
                summary={`${tipologia} · ${m2} m² · ${orientacion} · ${petFriendly}`}
                isOpen={openSections.includes("resumen-tecnico")}
                onToggle={() => toggleSection("resumen-tecnico")}
            >
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Tipología: {tipologia}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Superficie: {m2} m²</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Orientación: {orientacion}</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Calefacción: {calefaccion}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{petFriendly}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{estacionamiento}</span>
                        </div>
                    </div>
                </div>

                {selectedUnit?.bodega && (
                    <div className="pt-2">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Bodega incluida</span>
                        </div>
                    </div>
                )}
            </AccordionItem>

            {/* 2. Requisitos para arrendar */}
            <AccordionItem
                id="requisitos"
                title="Requisitos para arrendar"
                icon={<Shield className="w-5 h-5" />}
                summary={`Ingreso ≥ $${(ingresoMinimo / 1000000).toFixed(1)}M · Sin morosidad · 5 docs`}
                isOpen={openSections.includes("requisitos")}
                onToggle={() => toggleSection("requisitos")}
                cta={{
                    text: "Preaprobación en 30s",
                    action: onPreapproval || (() => console.log("Preaprobación")),
                    variant: "primary"
                }}
            >
                <div className="space-y-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Para arrendar esta propiedad necesitas cumplir con los siguientes requisitos:
                    </p>

                    <div className="space-y-2">
                        {requisitos.map((requisito, index) => (
                            <div key={index} className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">{requisito}</span>
                            </div>
                        ))}
                    </div>

                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 shadow-sm">
                        <div className="flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                            <div className="text-sm">
                                <p className="font-medium text-amber-800 dark:text-amber-200">
                                    ¿Cumples con todos los requisitos?
                                </p>
                                <p className="text-amber-700 dark:text-amber-300 mt-1">
                                    Haz tu preaprobación en solo 30 segundos y asegura tu visita.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </AccordionItem>

            {/* 3. Información del edificio */}
            <AccordionItem
                id="info-edificio"
                title="Información del edificio"
                icon={<Building2 className="w-5 h-5" />}
                summary={`${amenities.length} amenidades · Metro a ${tiempoMetro}′ · ${administracion}`}
                isOpen={openSections.includes("info-edificio")}
                onToggle={() => toggleSection("info-edificio")}
                cta={{
                    text: "Ver todas las unidades del edificio",
                    action: () => console.log("Ver todas las unidades"),
                    variant: "secondary"
                }}
            >
                <div className="space-y-4">
                    {/* Amenidades */}
                    {amenities.length > 0 && (
                        <div>
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Amenidades del edificio</h4>
                            <div className="grid grid-cols-2 gap-2">
                                {amenities.slice(0, 6).map((amenity, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">{amenity}</span>
                                    </div>
                                ))}
                                {amenities.length > 6 && (
                                    <div className="col-span-2 text-sm text-gray-500 dark:text-gray-400">
                                        +{amenities.length - 6} amenidades más
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Información adicional */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Ubicación</h4>
                            <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                                <p>Metro a {tiempoMetro} minutos</p>
                                <p>Comuna: {building.comuna}</p>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Administración</h4>
                            <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                                <p>{administracion}</p>
                                <p>{horarios}</p>
                            </div>
                        </div>
                    </div>

                    {/* Reglas del edificio */}
                    {building.reglas && building.reglas.length > 0 && (
                        <div>
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Reglas del edificio</h4>
                            <div className="space-y-1">
                                {building.reglas.map((regla, index) => (
                                    <div key={index} className="flex items-start gap-2">
                                        <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">{regla}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </AccordionItem>
        </section>
    );
}
