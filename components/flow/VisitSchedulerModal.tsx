"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VisitScheduler } from "./VisitScheduler";

interface VisitSchedulerModalProps {
    isOpen: boolean;
    onClose: () => void;
    propertyId: string;
    propertyName: string;
    propertyAddress: string;
    onConfirm: (date: string, time: string) => void;
}

export function VisitSchedulerModal({
    isOpen,
    onClose,
    propertyId,
    propertyName,
    propertyAddress,
    onConfirm
}: VisitSchedulerModalProps) {
    const handleConfirm = (date: string, time: string) => {
        onConfirm(date, time);
        onClose();
    };

    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.3,
                ease: [0.4, 0, 0.2, 1]
            }
        },
        exit: {
            opacity: 0,
            transition: {
                duration: 0.2,
                ease: [0.4, 0, 0.2, 1]
            }
        }
    };

    const modalVariants = {
        hidden: {
            opacity: 0,
            scale: 0.95,
            y: 20
        },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                duration: 0.3,
                ease: [0.4, 0, 0.2, 1]
            }
        },
        exit: {
            opacity: 0,
            scale: 0.95,
            y: 20,
            transition: {
                duration: 0.2,
                ease: [0.4, 0, 0.2, 1]
            }
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={backdropVariants}
                    className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        variants={modalVariants}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-md max-h-[90vh] overflow-y-auto"
                    >
                        <VisitScheduler
                            propertyId={propertyId}
                            propertyName={propertyName}
                            propertyAddress={propertyAddress}
                            onConfirm={handleConfirm}
                            onCancel={onClose}
                        />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default VisitSchedulerModal;
