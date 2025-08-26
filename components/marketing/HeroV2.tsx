"use client";

import { motion } from "framer-motion";
import { Search, MapPin, Home } from "lucide-react";

export default function HeroV2() {
    return (
        <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_50%)]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-8"
                >
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="inline-flex items-center px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium"
                    >
                        <span className="w-2 h-2 bg-purple-400 rounded-full mr-2" />
                        Arriendo 0% Comisión
                    </motion.div>

                    {/* Main Heading */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-5xl md:text-7xl font-bold text-white leading-tight"
                    >
                        Encuentra tu
                        <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            hogar ideal
                        </span>
                        sin comisiones
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed"
                    >
                        Miles de propiedades disponibles en las mejores comunas de Santiago.
                        Proceso 100% digital, sin letra chica.
                    </motion.p>

                    {/* Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="max-w-2xl mx-auto"
                    >
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar por dirección, comuna, tipología..."
                                className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                            <button className="absolute inset-y-0 right-0 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-r-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200">
                                Buscar
                            </button>
                        </div>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="flex flex-wrap justify-center gap-8 text-center"
                    >
                        <div className="flex flex-col items-center">
                            <div className="text-3xl font-bold text-white">500+</div>
                            <div className="text-slate-400 text-sm">Propiedades</div>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="text-3xl font-bold text-white">15</div>
                            <div className="text-slate-400 text-sm">Comunas</div>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="text-3xl font-bold text-white">0%</div>
                            <div className="text-slate-400 text-sm">Comisión</div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
