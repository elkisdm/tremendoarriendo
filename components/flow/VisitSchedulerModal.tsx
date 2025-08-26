"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface VisitSchedulerModalProps {
    isOpen: boolean;
    onClose: () => void;
    propertyId: string;
    propertyName: string;
    propertyAddress: string;
    onConfirm: (date: string, time: string, leadData?: { name: string; email: string; phone: string }) => void;
}

export function VisitSchedulerModal({
    isOpen,
    onClose,
    propertyId,
    propertyName,
    propertyAddress,
    onConfirm
}: VisitSchedulerModalProps) {
    const handleConfirm = (date: string, time: string, leadData?: { name: string; email: string; phone: string }) => {
        onConfirm(date, time, leadData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Agendar visita
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h3 className="font-medium text-gray-900 dark:text-white">{propertyName}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{propertyAddress}</p>
                            </div>

                            <div className="text-center py-8">
                                <p className="text-gray-600 dark:text-gray-400">
                                    Funcionalidad de agendamiento en desarrollo...
                                </p>
                                <button
                                    onClick={() => handleConfirm("2024-01-15", "10:00")}
                                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Confirmar visita de prueba
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

