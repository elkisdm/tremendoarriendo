"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export interface AmenityChip {
    label: string;
    icon?: React.ReactNode;
    category?: string;
}

interface AmenityChipsProps {
    amenities: AmenityChip[];
    className?: string;
}

export function AmenityChips({ amenities, className = "" }: AmenityChipsProps) {
    return (
        <div className={`space-y-4 ${className}`}>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Amenities
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {amenities.map((amenity, index) => (
                    <motion.div
                        key={`amenity-${amenity.label}-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                        {amenity.icon || <Check size={16} className="text-green-600 dark:text-green-400 flex-shrink-0" />}
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                            {amenity.label}
                        </span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

export function AmenityChipsSkeleton({ className = "" }: { className?: string }) {
    return (
        <div className={`space-y-4 ${className}`}>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32"></div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Array.from({ length: 6 }).map((_, index) => (
                    <div
                        key={index}
                        className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"
                    />
                ))}
            </div>
        </div>
    );
}

