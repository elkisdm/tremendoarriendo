"use client";

import { motion } from "framer-motion";
import { Phone, MessageCircle } from "lucide-react";

interface StickyMobileCTAProps {
    phoneNumber?: string;
    whatsappNumber?: string;
}

export default function StickyMobileCTA({
    phoneNumber = "+56912345678",
    whatsappNumber = "+56912345678"
}: StickyMobileCTAProps) {
    return (
        <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="fixed bottom-4 left-4 right-4 z-50 md:hidden"
        >
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-900">
                            ¿Necesitas ayuda?
                        </h3>
                        <p className="text-sm text-slate-600">
                            Habla con un asesor ahora
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <a
                            href={`tel:${phoneNumber}`}
                            className="flex items-center justify-center w-12 h-12 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors duration-200"
                            aria-label="Llamar"
                        >
                            <Phone className="h-5 w-5" />
                        </a>

                        <a
                            href={`https://wa.me/${whatsappNumber}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center w-12 h-12 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-200"
                            aria-label="WhatsApp"
                        >
                            <MessageCircle className="h-5 w-5" />
                        </a>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
