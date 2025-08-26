"use client";

import { motion } from "framer-motion";
import { MapPin, Bed, Bath, Square, Star, Phone, MessageCircle } from "lucide-react";

interface Building {
    id: string;
    name: string;
    commune: string;
    address: string;
    description: string;
    price: number;
    images: string[];
    amenities: string[];
    units: Array<{
        id: string;
        type: string;
        price: number;
        area: number;
        available: boolean;
    }>;
    rating: number;
    reviews: number;
    available: boolean;
}

interface ArriendaSinComisionBuildingDetailProps {
    building: Building;
}

export default function ArriendaSinComisionBuildingDetail({ building }: ArriendaSinComisionBuildingDetailProps) {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <section className="relative h-96 bg-gradient-to-br from-purple-600 to-pink-600">
                <div className="absolute inset-0 bg-black/20" />
                <div className="relative z-10 h-full flex items-center justify-center">
                    <div className="text-center text-white">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-4xl md:text-6xl font-bold mb-4"
                        >
                            {building.name}
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-xl md:text-2xl"
                        >
                            {building.commune}
                        </motion.p>
                    </div>
                </div>
            </section>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Images */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="bg-white rounded-2xl overflow-hidden shadow-lg"
                        >
                            <div className="aspect-video bg-gradient-to-br from-purple-400 to-pink-400 relative">
                                <div className="absolute inset-0 bg-black/10" />
                                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center">
                                    <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                                    <span className="text-sm font-semibold text-slate-900">
                                        {building.rating}
                                    </span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Description */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="bg-white rounded-2xl p-6 shadow-lg"
                        >
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">
                                Descripción
                            </h2>
                            <p className="text-slate-600 leading-relaxed">
                                {building.description}
                            </p>
                        </motion.div>

                        {/* Amenities */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="bg-white rounded-2xl p-6 shadow-lg"
                        >
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">
                                Amenidades
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {building.amenities.map((amenity, index) => (
                                    <div key={index} className="flex items-center text-slate-600">
                                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-3" />
                                        {amenity}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Price Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="bg-white rounded-2xl p-6 shadow-lg sticky top-6"
                        >
                            <div className="text-center mb-6">
                                <div className="text-3xl font-bold text-slate-900">
                                    ${building.price.toLocaleString()}
                                </div>
                                <div className="text-slate-500">por mes</div>
                            </div>

                            <div className="space-y-4">
                                <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200">
                                    Agendar Visita
                                </button>

                                <div className="flex gap-2">
                                    <a
                                        href="tel:+56912345678"
                                        className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white font-semibold py-3 rounded-xl hover:bg-green-600 transition-colors duration-200"
                                    >
                                        <Phone className="h-4 w-4" />
                                        Llamar
                                    </a>
                                    <a
                                        href="https://wa.me/56912345678"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white font-semibold py-3 rounded-xl hover:bg-blue-600 transition-colors duration-200"
                                    >
                                        <MessageCircle className="h-4 w-4" />
                                        WhatsApp
                                    </a>
                                </div>
                            </div>

                            {/* Units */}
                            <div className="mt-6 pt-6 border-t border-slate-200">
                                <h3 className="font-semibold text-slate-900 mb-3">
                                    Unidades Disponibles
                                </h3>
                                <div className="space-y-3">
                                    {building.units.map((unit) => (
                                        <div key={unit.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                            <div>
                                                <div className="font-semibold text-slate-900">{unit.type}</div>
                                                <div className="text-sm text-slate-500">{unit.area}m²</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-semibold text-slate-900">
                                                    ${unit.price.toLocaleString()}
                                                </div>
                                                <div className="text-sm text-green-600">Disponible</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Location */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="bg-white rounded-2xl p-6 shadow-lg"
                        >
                            <h3 className="font-semibold text-slate-900 mb-3 flex items-center">
                                <MapPin className="h-4 w-4 mr-2" />
                                Ubicación
                            </h3>
                            <p className="text-slate-600">{building.address}</p>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
