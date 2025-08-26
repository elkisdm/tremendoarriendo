"use client";

import { motion } from "framer-motion";
import { Star, MapPin, Bed, Bath, Square } from "lucide-react";

interface FeaturedProperty {
    id: string;
    name: string;
    commune: string;
    price: number;
    image: string;
    rating: number;
    bedrooms: number;
    bathrooms: number;
    area: number;
}

const featuredProperties: FeaturedProperty[] = [
    {
        id: "1",
        name: "Departamento Las Condes",
        commune: "Las Condes",
        price: 850000,
        image: "/images/featured-1.jpg",
        rating: 4.8,
        bedrooms: 2,
        bathrooms: 2,
        area: 75,
    },
    {
        id: "2",
        name: "Loft Providencia",
        commune: "Providencia",
        price: 650000,
        image: "/images/featured-2.jpg",
        rating: 4.6,
        bedrooms: 1,
        bathrooms: 1,
        area: 45,
    },
    {
        id: "3",
        name: "Casa Ñuñoa",
        commune: "Ñuñoa",
        price: 1200000,
        image: "/images/featured-3.jpg",
        rating: 4.9,
        bedrooms: 3,
        bathrooms: 2,
        area: 120,
    },
];

export default function FeaturedGrid() {
    return (
        <section className="py-20 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-bold text-slate-900 mb-4">
                        Propiedades Destacadas
                    </h2>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Las mejores opciones seleccionadas para ti
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featuredProperties.map((property, index) => (
                        <motion.div
                            key={property.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                        >
                            <div className="relative h-48 bg-gradient-to-br from-purple-400 to-pink-400">
                                <div className="absolute inset-0 bg-black/20" />
                                <div className="absolute top-4 right-4 flex items-center bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                    <span className="text-sm font-semibold text-slate-900 ml-1">
                                        {property.rating}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="flex items-center text-slate-500 text-sm mb-2">
                                    <MapPin className="h-4 w-4 mr-1" />
                                    {property.commune}
                                </div>

                                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                                    {property.name}
                                </h3>

                                <div className="flex items-center justify-between mb-4">
                                    <div className="text-2xl font-bold text-slate-900">
                                        ${property.price.toLocaleString()}
                                    </div>
                                    <div className="text-sm text-slate-500">/mes</div>
                                </div>

                                <div className="flex items-center justify-between text-slate-600">
                                    <div className="flex items-center">
                                        <Bed className="h-4 w-4 mr-1" />
                                        <span className="text-sm">{property.bedrooms}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Bath className="h-4 w-4 mr-1" />
                                        <span className="text-sm">{property.bathrooms}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Square className="h-4 w-4 mr-1" />
                                        <span className="text-sm">{property.area}m²</span>
                                    </div>
                                </div>

                                <button className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200">
                                    Ver Detalles
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
