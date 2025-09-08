"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, HelpCircle, Phone, Calendar, DollarSign, Shield, Users } from "lucide-react";
import type { Building } from "@schemas/models";

interface PropertyFAQProps {
    building: Building;
    variant?: "catalog" | "marketing" | "admin";
    className?: string;
}

interface FAQItem {
    question: string;
    answer: string;
    category: string;
    icon: React.ComponentType<{ className?: string }>;
}

export function PropertyFAQ({ building, variant = "catalog", className = "" }: PropertyFAQProps) {
    const [openItems, setOpenItems] = useState<Set<number>>(new Set([0])); // Primer item abierto por defecto

    const faqData: FAQItem[] = [
        {
            question: "¿Cuál es el proceso para arrendar esta propiedad?",
            answer: "El proceso es simple: 1) Agenda una visita, 2) Completa la documentación (RUT, comprobantes de ingresos, aval), 3) Firma el contrato, 4) Paga el primer mes + garantía. Todo se puede hacer en línea o en persona.",
            category: "Proceso",
            icon: Calendar
        },
        {
            question: "¿Qué incluye el precio del arriendo?",
            answer: "El precio incluye el arriendo base de la unidad. Los gastos comunes (agua, luz, gas) se cobran por separado según el consumo real. La garantía equivale a un mes de arriendo y se devuelve al finalizar el contrato.",
            category: "Precios",
            icon: DollarSign
        },
        {
            question: "¿Puedo tener mascotas en esta propiedad?",
            answer: "Sí, esta propiedad es pet-friendly. Solo requerimos que las mascotas estén registradas y tengan sus vacunas al día. No hay restricciones de tamaño o raza.",
            category: "Políticas",
            icon: Users
        },
        {
            question: "¿Qué tan segura es la zona?",
            answer: "La zona cuenta con vigilancia privada 24/7, cámaras de seguridad, y está ubicada en un sector residencial tranquilo. Además, hay una comisaría a 3 cuadras y patrullas regulares de Carabineros.",
            category: "Seguridad",
            icon: Shield
        },
        {
            question: "¿Cuáles son los horarios para visitar la propiedad?",
            answer: "Ofrecemos visitas de lunes a domingo de 9:00 AM a 8:00 PM. Para horarios especiales o fuera de estos rangos, contáctanos directamente y coordinamos una visita personalizada.",
            category: "Visitas",
            icon: Phone
        },
        {
            question: "¿Qué documentos necesito para arrendar?",
            answer: "Necesitarás: RUT vigente, 3 últimas liquidaciones de sueldo, certificado de trabajo, aval con propiedades o ingresos, y antecedentes comerciales. Te ayudamos con todo el proceso.",
            category: "Documentación",
            icon: HelpCircle
        }
    ];

    const toggleItem = (index: number) => {
        const newOpenItems = new Set(openItems);
        if (newOpenItems.has(index)) {
            newOpenItems.delete(index);
        } else {
            newOpenItems.add(index);
        }
        setOpenItems(newOpenItems);
    };

    // Agrupar FAQs por categoría
    const faqByCategory = faqData.reduce((acc, item) => {
        if (!acc[item.category]) {
            acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
    }, {} as Record<string, FAQItem[]>);

    const categories = Object.keys(faqByCategory);

    return (
        <section className={`bg-gray-800:bg-gray-800 rounded-2xl shadow-lg border border-gray-700:border-gray-700 p-6 lg:p-8 ${className}`}>
            {/* Header */}
            <div className="text-center mb-8">
                <h2 className="text-2xl lg:text-3xl font-bold text-white:text-white mb-4">
                    Preguntas frecuentes
                </h2>
                <p className="text-base lg:text-lg text-gray-300:text-gray-300">
                    Resolvemos las dudas más comunes sobre esta propiedad
                </p>
            </div>

            {/* FAQs organizadas por categoría */}
            <div className="space-y-8">
                {categories.map((category, categoryIndex) => (
                    <div key={category} className="space-y-4">
                        <h3 className="text-lg lg:text-xl font-semibold text-white:text-white border-b border-gray-700:border-gray-700 pb-2">
                            {category}
                        </h3>

                        <div className="space-y-3">
                            {faqByCategory[category].map((item, itemIndex) => {
                                const globalIndex = faqData.findIndex(faq => faq.question === item.question);
                                const isOpen = openItems.has(globalIndex);

                                return (
                                    <div key={globalIndex} className="bg-gray-900:bg-gray-700 rounded-xl overflow-hidden">
                                        {/* Pregunta clickeable */}
                                        <button
                                            onClick={() => toggleItem(globalIndex)}
                                            className="w-full px-4 py-4 text-left flex items-center justify-between hover:bg-gray-800:hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            aria-expanded={isOpen}
                                            aria-controls={`faq-answer-${globalIndex}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                                    <item.icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                                </div>
                                                <span className="font-medium text-white:text-white text-sm lg:text-base">
                                                    {item.question}
                                                </span>
                                            </div>
                                            {isOpen ? (
                                                <ChevronUp className="w-5 h-5 text-gray-400:text-gray-400 flex-shrink-0" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5 text-gray-400:text-gray-400 flex-shrink-0" />
                                            )}
                                        </button>

                                        {/* Respuesta colapsable */}
                                        <AnimatePresence>
                                            {isOpen && (
                                                <motion.div
                                                    id={`faq-answer-${globalIndex}`}
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="px-4 pb-4">
                                                        <p className="text-sm lg:text-base text-gray-300:text-gray-300 leading-relaxed">
                                                            {item.answer}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* CTA de contacto */}
            <div className="mt-8 text-center">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
                    <h3 className="text-lg font-semibold text-white:text-white mb-2">
                        ¿Tienes más preguntas?
                    </h3>
                    <p className="text-sm text-gray-300:text-gray-300 mb-4">
                        Nuestro equipo está disponible para ayudarte con cualquier consulta
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-200">
                            <Phone className="w-4 h-4" />
                            Llamar ahora
                        </button>
                        <button className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-white:text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-200">
                            <Calendar className="w-4 h-4" />
                            Agendar visita
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
