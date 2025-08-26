"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface PriceBreakdownProps {
    priceMonthly: number;
    priceFrom: number;
    discountPercentage?: number;
    className?: string;
}

export function PriceBreakdown({
    priceMonthly,
    priceFrom,
    discountPercentage,
    className = ""
}: PriceBreakdownProps) {
    const [isExpanded, setIsExpanded] = React.useState(false);

    const savings = priceFrom - priceMonthly;
    const savingsPercentage = ((savings / priceFrom) * 100).toFixed(0);

    return (
        <div className={`bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 ${className}`}>
            <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Cálculo del primer pago
                    </h3>
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Arriendo mensual:</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                            ${priceMonthly.toLocaleString('es-CL')}
                        </span>
                    </div>

                    {isExpanded && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700"
                        >
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Precio desde:</span>
                                <span className="text-sm text-gray-500 dark:text-gray-500 line-through">
                                    ${priceFrom.toLocaleString('es-CL')}
                                </span>
                            </div>

                            {discountPercentage && (
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Descuento:</span>
                                    <span className="text-sm font-medium text-green-600 dark:text-green-400">
                                        -{discountPercentage}%
                                    </span>
                                </div>
                            )}

                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Ahorro mensual:</span>
                                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                                    ${savings.toLocaleString('es-CL')} ({savingsPercentage}%)
                                </span>
                            </div>
                        </motion.div>
                    )}

                    <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center">
                            <span className="text-base font-semibold text-gray-900 dark:text-white">
                                Total primer pago:
                            </span>
                            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                                ${priceMonthly.toLocaleString('es-CL')}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

