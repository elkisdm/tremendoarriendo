"use client";

import { motion } from "framer-motion";
import { Shield, Users, Award, Clock } from "lucide-react";

const trustFactors = [
    {
        icon: Shield,
        title: "100% Seguro",
        description: "Proceso verificado y protegido",
        color: "text-green-500",
    },
    {
        icon: Users,
        title: "500+ Clientes",
        description: "Satisfechos con nuestro servicio",
        color: "text-blue-500",
    },
    {
        icon: Award,
        title: "Mejor Precio",
        description: "Garantizado sin comisiones",
        color: "text-purple-500",
    },
    {
        icon: Clock,
        title: "24/7 Soporte",
        description: "Atención disponible siempre",
        color: "text-orange-500",
    },
];

const testimonials = [
    {
        name: "María González",
        location: "Las Condes",
        text: "Encontré mi departamento ideal sin pagar comisiones. El proceso fue súper fácil y transparente.",
        rating: 5,
    },
    {
        name: "Carlos Rodríguez",
        location: "Providencia",
        text: "Excelente servicio. Ahorré más de $300.000 en comisiones y todo fue digital.",
        rating: 5,
    },
    {
        name: "Ana Silva",
        location: "Ñuñoa",
        text: "Recomiendo 100% esta plataforma. Proceso rápido y sin sorpresas.",
        rating: 5,
    },
];

export default function Trust() {
    return (
        <section className="py-20 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Trust Factors */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-bold text-slate-900 mb-4">
                        ¿Por qué confiar en nosotros?
                    </h2>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Miles de personas ya confían en nuestro servicio
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                    {trustFactors.map((factor, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="text-center"
                        >
                            <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-white shadow-lg flex items-center justify-center`}>
                                <factor.icon className={`h-8 w-8 ${factor.color}`} />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                {factor.title}
                            </h3>
                            <p className="text-slate-600">
                                {factor.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Testimonials */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h3 className="text-3xl font-bold text-slate-900 mb-4">
                        Lo que dicen nuestros clientes
                    </h3>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-2xl p-6 shadow-lg"
                        >
                            <div className="flex items-center mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <svg
                                        key={i}
                                        className="w-5 h-5 text-yellow-400 fill-current"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <p className="text-slate-600 mb-4 italic">
                                "{testimonial.text}"
                            </p>
                            <div>
                                <div className="font-semibold text-slate-900">
                                    {testimonial.name}
                                </div>
                                <div className="text-sm text-slate-500">
                                    {testimonial.location}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="mt-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-8 text-white text-center"
                >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <div className="text-3xl font-bold">500+</div>
                            <div className="text-purple-100">Propiedades</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold">1000+</div>
                            <div className="text-purple-100">Clientes</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold">$50M+</div>
                            <div className="text-purple-100">Ahorrado</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold">4.9</div>
                            <div className="text-purple-100">Rating</div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
