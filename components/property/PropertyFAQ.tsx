"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, FileText, Shield, HelpCircle } from "lucide-react";

interface FAQItem {
    question: string;
    answer: string;
}

interface PropertyFAQProps {
    faqs?: FAQItem[];
    className?: string;
}

const DEFAULT_FAQS: FAQItem[] = [
    {
        question: "¿Qué documentos necesito para arrendar?",
        answer: "Necesitarás tu cédula de identidad, comprobantes de ingresos (últimos 3 meses), aval con propiedades o garantía bancaria, y referencias personales y laborales."
    },
    {
        question: "¿Se permiten mascotas en el edificio?",
        answer: "Sí, el edificio es pet-friendly. Solo necesitas informar al administrador y cumplir con las normas de convivencia establecidas en el reglamento."
    },
    {
        question: "¿Cuánto tiempo toma el proceso de arriendo?",
        answer: "El proceso completo toma entre 3-5 días hábiles desde la aprobación hasta la firma del contrato, incluyendo la revisión de documentos y la evaluación crediticia."
    }
];

export function PropertyFAQ({ faqs = DEFAULT_FAQS, className = "" }: PropertyFAQProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: [0.4, 0, 0.2, 1],
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20, scale: 0.95 },
        visible: {
            opacity: 1,
            x: 0,
            scale: 1,
            transition: {
                duration: 0.4,
                ease: [0.4, 0, 0.2, 1]
            }
        }
    };

    return (
        <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className={`space-y-8 ${className}`}
        >
            {/* Header */}
            <div className="text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <HelpCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                        Preguntas frecuentes
                    </h2>
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Resolvemos las dudas más comunes sobre el proceso de arriendo
                </p>
            </div>

            {/* FAQ List */}
            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <motion.div
                        key={index}
                        variants={itemVariants}
                        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                    >
                        <button
                            onClick={() => toggleFAQ(index)}
                            className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                            aria-expanded={openIndex === index}
                            aria-controls={`faq-answer-${index}`}
                        >
                            <span className="font-semibold text-gray-900 dark:text-white pr-4">
                                {faq.question}
                            </span>
                            <div className="flex-shrink-0">
                                {openIndex === index ? (
                                    <ChevronUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                )}
                            </div>
                        </button>

                        <AnimatePresence>
                            {openIndex === index && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                                    id={`faq-answer-${index}`}
                                    className="overflow-hidden"
                                >
                                    <div className="px-6 pb-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                                        {faq.answer}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>

            {/* Legal Links */}
            <motion.div
                variants={itemVariants}
                className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 lg:p-8"
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                        <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Información legal
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <a
                        href="/legal/contrato-arriendo"
                        className="flex items-center gap-3 p-4 bg-white dark:bg-gray-700 rounded-xl hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-600 group"
                    >
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                Contrato de arriendo
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Descarga el modelo
                            </p>
                        </div>
                    </a>

                    <a
                        href="/legal/terminos-condiciones"
                        className="flex items-center gap-3 p-4 bg-white dark:bg-gray-700 rounded-xl hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-600 group"
                    >
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                            <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                                Términos y condiciones
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Lee nuestros términos
                            </p>
                        </div>
                    </a>

                    <a
                        href="/legal/politica-privacidad"
                        className="flex items-center gap-3 p-4 bg-white dark:bg-gray-700 rounded-xl hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-600 group"
                    >
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
                            <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                Política de privacidad
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Protección de datos
                            </p>
                        </div>
                    </a>
                </div>

                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                    <div className="flex items-start gap-3">
                        <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                        <div>
                            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                                ¿Necesitas ayuda?
                            </h4>
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                                Si tienes más preguntas, no dudes en contactarnos por WhatsApp o llamarnos al +56 9 1234 5678
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.section>
    );
}

export default PropertyFAQ;
