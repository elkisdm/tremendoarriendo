"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Bed, Bath, Square } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface BuildingLinkCardProps {
    id: string;
    name: string;
    address: string;
    commune: string;
    photo: string;
    priceFrom: number;
    bedrooms: number;
    bathrooms: number;
    area: number;
    className?: string;
}

export function BuildingLinkCard({
    id,
    name,
    address,
    commune,
    photo,
    priceFrom,
    bedrooms,
    bathrooms,
    area,
    className = ""
}: BuildingLinkCardProps) {
    return (
        <Link href={`/property/${id}`}>
            <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow ${className}`}
            >
                <div className="relative h-48">
                    <Image
                        src={photo}
                        alt={name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>

                <div className="p-4 space-y-3">
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">
                            {name}
                        </h3>
                        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                            <MapPin size={14} />
                            <span className="line-clamp-1">{address}, {commune}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                                <Bed size={14} />
                                <span>{bedrooms}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Bath size={14} />
                                <span>{bathrooms}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Square size={14} />
                                <span>{area}m²</span>
                            </div>
                        </div>

                        <p className="font-semibold text-blue-600 dark:text-blue-400">
                            ${priceFrom.toLocaleString('es-CL')}
                        </p>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}

export function BuildingLinkCardSkeleton({ className = "" }: { className?: string }) {
    return (
        <div className={`bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}>
            <div className="h-48 bg-gray-200 dark:bg-gray-700 animate-pulse" />
            <div className="p-4 space-y-3">
                <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2" />
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-8" />
                        ))}
                    </div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20" />
                </div>
            </div>
        </div>
    );
}

