"use client";

import { motion } from "framer-motion";
import { Search, Calendar, Key, CheckCircle } from "lucide-react";

const steps = [
    {
        icon: Search,
        title: "Busca tu propiedad",
        description: "Encuentra la propiedad perfecta en nuestra plataforma con filtros avanzados",
        color: "from-blue-500 to-cyan-500",
    },
    {
        icon: Calendar,
        title: "Agenda tu visita",
        description: "Reserva una visita virtual o presencial en el horario que prefieras",
        color: "from-purple-500 to-pink-500",
    },
    {
        icon: Key,
        title: "Firma digital",
        description: "Completa todo el proceso de arriendo de forma 100% digital",
        color: "from-green-500 to-emerald-500",
    },
    {
        icon: CheckCircle,
        title: "¡Disfruta tu hogar!",
        description: "Recibe las llaves y disfruta de tu nueva casa sin comisiones",
        color: "from-orange-500 to-red-500",
    },
];

export default function HowItWorks() {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-bold text-slate-900 mb-4">
                        ¿Cómo funciona?
                    </h2>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Proceso simple y transparente en solo 4 pasos
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="text-center"
                        >
                            <div className="relative">
                                {/* Step Number */}
                                <div className="absolute -top-2 -left-2 w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                    {index + 1}
                                </div>

                                {/* Icon */}
                                <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${step.color} flex items-center justify-center shadow-lg`}>
                                    <step.icon className="h-8 w-8 text-white" />
                                </div>

                                {/* Connector Line */}
                                {index < steps.length - 1 && (
                                    <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-slate-200 to-slate-300 transform translate-x-4" />
                                )}
                            </div>

                            <h3 className="text-xl font-semibold text-slate-900 mb-3">
                                {step.title}
                            </h3>
                            <p className="text-slate-600 leading-relaxed">
                                {step.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="text-center mt-16"
                >
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-8 text-white">
                        <h3 className="text-2xl font-bold mb-4">
                            ¿Listo para encontrar tu hogar?
                        </h3>
                        <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
                            Únete a miles de personas que ya encontraron su hogar ideal sin pagar comisiones de corretaje
                        </p>
                        <button className="bg-white text-purple-600 font-semibold px-8 py-3 rounded-xl hover:bg-slate-100 transition-colors duration-200">
                            Comenzar Búsqueda
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
