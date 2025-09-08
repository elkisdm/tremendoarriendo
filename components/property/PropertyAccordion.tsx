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
        <div className="bg-gray-800:bg-gray-800 rounded-2xl border border-gray-700:border-gray-700 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            {/* Header informativo y tocable */}
            <button
                onClick={onToggle}
                className="w-full px-4 py-4 flex items-center justify-between text-left hover:bg-gray-900:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
                aria-expanded={isOpen}
                aria-controls={`accordion-${id}`}
            >
                <div className="flex items-center gap-3 flex-1">
                    <div className="text-cyan-600 dark:text-cyan-400">
                        {icon}
                    </div>
                    <div className="flex-1">
                        <h3 className="text-base font-semibold text-white:text-white">
                            {title}
                        </h3>
                        <p className="text-sm text-gray-300:text-gray-400 mt-1">
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
                                <div className="pt-3 border-t border-gray-700:border-gray-700">
                                    <button
                                        onClick={cta.action}
                                        className={`w-full px-4 py-3 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 ${cta.variant === "primary"
                                            ? "bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg hover:shadow-xl"
                                            : "bg-gray-800:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-white:text-white"
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
    const [openSections, setOpenSections] = useState<string[]>(["caracteristicas"]);

    const toggleSection = (sectionId: string) => {
        setOpenSections(prev =>
            prev.includes(sectionId)
                ? prev.filter(id => id !== sectionId)
                : [...prev, sectionId]
        );
    };

    // Lógica inteligente: solo una sección abierta a la vez
    const openSection = (sectionId: string) => {
        setOpenSections([sectionId]);
    };

    const closeSection = (sectionId: string) => {
        setOpenSections(prev => prev.filter(id => id !== sectionId));
    };

    const toggleSectionSmart = (sectionId: string) => {
        if (openSections.includes(sectionId)) {
            closeSection(sectionId);
        } else {
            openSection(sectionId);
        }
    };

    const showCompleteInfo = () => {
        // Abre la sección que no esté abierta
        const closedSections = ["caracteristicas", "requisitos", "info-edificio"].filter(
            id => !openSections.includes(id)
        );
        if (closedSections.length > 0) {
            openSection(closedSections[0]);
        }
    };

    const showLessInfo = () => {
        // Cierra todas excepto la primera
        setOpenSections(["caracteristicas"]);
    };

    // Datos para el resumen técnico
    const tipologia = selectedUnit?.tipologia || "2D";
    const m2 = selectedUnit?.area_interior_m2 || selectedUnit?.m2 || 48;
    const orientacion = selectedUnit?.orientacion || "Norte";
    const calefaccion = "Eléctrica"; // Default value
    const petFriendly = "Pet-friendly"; // Default value
    const estacionamiento = selectedUnit?.estacionamiento ? "Con estacionamiento" : "Sin estacionamiento";
    const bodega = selectedUnit?.bodega ? "Con bodega" : "Sin bodega";

    // Datos para requisitos
    const ingresoMinimo = Math.round((selectedUnit?.price || building.precio_desde || 290000) * 2.5);
    const requisitos = [
        `Ingreso líquido ≥ $${ingresoMinimo.toLocaleString('es-CL')} mensual`,
        "Sin morosidad vigente en DICOM",
        "CI vigente y legible",
        "Últimas 3 liquidaciones de sueldo",
        "Sin antecedentes penales"
    ];

    // Datos para info del edificio
    const amenities = building.amenities || [];
    const tiempoMetro = 6; // Default metro time
    const administracion = "Assetplan"; // Default administration
    const horarios = "Lun-Vie 9:00-18:00"; // Default hours

    return (
        <section className="space-y-4">
            {/* Controles inteligentes de acordeón */}
            <div className="flex gap-2 justify-center mb-4">
                <button
                    onClick={showCompleteInfo}
                    className="px-4 py-2 text-sm font-medium text-gray-300:text-gray-400 hover:text-white:hover:text-white hover:bg-gray-800:hover:bg-gray-700 rounded-lg transition-all duration-200 relative group"
                    title="Abre la siguiente sección disponible para ver más información"
                >
                    Ver información completa
                    <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 bg-gray-800:bg-gray-800 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                        Abre siguiente sección
                    </span>
                </button>
                <button
                    onClick={showLessInfo}
                    className="px-4 py-2 text-sm font-medium text-gray-300:text-gray-400 hover:text-white:hover:text-white hover:bg-gray-800:hover:bg-gray-700 rounded-lg transition-all duration-200 relative group"
                    title="Cierra todas las secciones excepto características"
                >
                    Ver menos
                    <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 bg-gray-800:bg-gray-800 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                        Solo características
                    </span>
                </button>
            </div>

            {/* Indicador de sección activa */}
            <div className="text-center mb-4">
                <p className="text-xs text-gray-400:text-gray-400">
                    {openSections.length === 0 ? "Sin información visible" :
                        openSections.length === 1 ? "Viendo: " +
                            (openSections[0] === "caracteristicas" ? "Características" :
                                openSections[0] === "requisitos" ? "Requisitos" : "Información del edificio")
                            : "Múltiples secciones abiertas"}
                </p>
            </div>

            {/* 1. Características (abierto por defecto) */}
            <AccordionItem
                id="caracteristicas"
                title="Características"
                icon={<CheckCircle className="w-5 h-5" />}
                summary={`${tipologia} · ${m2} m² · ${orientacion} · ${selectedUnit?.bedrooms || 1}D${selectedUnit?.bathrooms || 1}B`}
                isOpen={openSections.includes("caracteristicas")}
                onToggle={() => toggleSectionSmart("caracteristicas")}
            >
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
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
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Calefacción: {calefaccion}</span>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{petFriendly}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{estacionamiento}</span>
                        </div>
                        {selectedUnit?.bodega && (
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">Bodega incluida</span>
                            </div>
                        )}
                        {selectedUnit?.amoblado && (
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">Amoblado</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Información adicional de la unidad */}
                {(selectedUnit?.bedrooms || selectedUnit?.bathrooms) && (
                    <div className="pt-3 border-t border-gray-700:border-gray-700">
                        <div className="grid grid-cols-2 gap-4">
                            {selectedUnit?.bedrooms && (
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-blue-500" />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                        {selectedUnit.bedrooms} dormitorio{selectedUnit.bedrooms > 1 ? 's' : ''}
                                    </span>
                                </div>
                            )}
                            {selectedUnit?.bathrooms && (
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-blue-500" />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                        {selectedUnit.bathrooms} baño{selectedUnit.bathrooms > 1 ? 's' : ''}
                                    </span>
                                </div>
                            )}
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
                onToggle={() => toggleSectionSmart("requisitos")}
                cta={{
                    text: "Preaprobación en 30s",
                    action: onPreapproval || (() => console.log("Preaprobación")),
                    variant: "primary"
                }}
            >
                <div className="space-y-3">
                    <p className="text-sm text-gray-300:text-gray-400">
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
                onToggle={() => toggleSectionSmart("info-edificio")}
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
                            <h4 className="font-medium text-white:text-white mb-2">Amenidades del edificio</h4>
                            <div className="grid grid-cols-2 gap-2">
                                {amenities.slice(0, 6).map((amenity, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">{amenity}</span>
                                    </div>
                                ))}
                                {amenities.length > 6 && (
                                    <div className="col-span-2 text-sm text-gray-400:text-gray-400">
                                        +{amenities.length - 6} amenidades más
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Información adicional */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-medium text-white:text-white mb-2">Ubicación</h4>
                            <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                                <p>Metro a {tiempoMetro} minutos</p>
                                <p>Comuna: {building.comuna}</p>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-medium text-white:text-white mb-2">Administración</h4>
                            <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                                <p>{administracion}</p>
                                <p>{horarios}</p>
                            </div>
                        </div>
                    </div>

                    {/* Reglas del edificio - Comentado hasta que se agregue al schema */}
                    {/* {building.reglas && building.reglas.length > 0 && (
                        <div>
                            <h4 className="font-medium text-white:text-white mb-2">Reglas del edificio</h4>
                            <div className="space-y-1">
                                {building.reglas.map((regla, index) => (
                                    <div key={index} className="flex items-start gap-2">
                                        <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">{regla}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )} */}
                </div>
            </AccordionItem>
        </section>
    );
}
