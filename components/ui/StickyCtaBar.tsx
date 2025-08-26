"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Phone, MessageCircle } from 'lucide-react';
import { track } from '@lib/analytics';

interface StickyCtaBarProps {
    propertyId: string;
    commune: string;
    priceMonthly: number;
    onWhatsApp: () => void;
    onScheduleVisit: () => void;
    onCall: () => void;
}

export function StickyCtaBar({
    propertyId,
    commune,
    priceMonthly,
    onWhatsApp,
    onScheduleVisit,
    onCall
}: StickyCtaBarProps) {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 100);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleWhatsApp = useCallback(() => {
        track('cta_click', {
            type: 'whatsapp',
            propertyId,
            commune,
            priceMonthly
        });
        onWhatsApp();
    }, [onWhatsApp, propertyId, commune, priceMonthly]);

    const handleScheduleVisit = useCallback(() => {
        track('cta_click', {
            type: 'schedule_visit',
            propertyId,
            commune,
            priceMonthly
        });
        onScheduleVisit();
    }, [onScheduleVisit, propertyId, commune, priceMonthly]);

    const handleCall = useCallback(() => {
        track('cta_click', {
            type: 'call',
            propertyId,
            commune,
            priceMonthly
        });
        onCall();
    }, [onCall, propertyId, commune, priceMonthly]);

    const shouldShow = isScrolled;

    return (
        <AnimatePresence>
            {shouldShow && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg"
                >
                    <div className="px-3 sm:px-4 py-2 sm:py-3">
                        <div className="flex items-center justify-between gap-2 sm:gap-3">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    ${priceMonthly.toLocaleString('es-CL')}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    {commune}
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleScheduleVisit}
                                    className="flex items-center gap-1 py-2 sm:py-3 px-3 sm:px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <Calendar size={16} />
                                    <span className="hidden sm:inline">Visita</span>
                                </button>

                                <button
                                    onClick={handleWhatsApp}
                                    className="flex items-center gap-1 py-2 sm:py-3 px-3 sm:px-4 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    <MessageCircle size={16} />
                                    <span className="hidden sm:inline">WhatsApp</span>
                                </button>

                                <button
                                    onClick={handleCall}
                                    className="flex items-center gap-1 py-2 sm:py-3 px-3 sm:px-4 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    <Phone size={16} />
                                    <span className="hidden sm:inline">Llamar</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export function StickyCtaSidebar({
    propertyId,
    commune,
    priceMonthly,
    onWhatsApp,
    onScheduleVisit,
    onCall
}: StickyCtaBarProps) {
    const handleWhatsApp = useCallback(() => {
        track('cta_click', {
            type: 'whatsapp',
            propertyId,
            commune,
            priceMonthly
        });
        onWhatsApp();
    }, [onWhatsApp, propertyId, commune, priceMonthly]);

    const handleScheduleVisit = useCallback(() => {
        track('cta_click', {
            type: 'schedule_visit',
            propertyId,
            commune,
            priceMonthly
        });
        onScheduleVisit();
    }, [onScheduleVisit, propertyId, commune, priceMonthly]);

    const handleCall = useCallback(() => {
        track('cta_click', {
            type: 'call',
            propertyId,
            commune,
            priceMonthly
        });
        onCall();
    }, [onCall, propertyId, commune, priceMonthly]);

    return (
        <div className="hidden lg:block sticky top-4 space-y-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="space-y-4">
                    <div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            ${priceMonthly.toLocaleString('es-CL')}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {commune}
                        </p>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={handleScheduleVisit}
                            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Calendar size={18} />
                            Agendar visita
                        </button>

                        <button
                            onClick={handleWhatsApp}
                            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <MessageCircle size={18} />
                            WhatsApp
                        </button>

                        <button
                            onClick={handleCall}
                            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            <Phone size={18} />
                            Llamar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

