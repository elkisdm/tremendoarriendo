"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, User, Mail, Phone, MapPin, CheckCircle, AlertCircle, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { track } from '@lib/analytics';
import MotionWrapper from '../ui/MotionWrapper';

interface VisitSchedulerModalProps {
    isOpen: boolean;
    onClose: () => void;
    buildingName: string;
    buildingId: string;
    unitId?: string;
}

type VisitStep = 'data' | 'schedule' | 'confirmation';

// Componente Confetti para éxito
const Confetti = () => {
    const colors = ['#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'];

    return (
        <div className="fixed inset-0 pointer-events-none z-50">
            {Array.from({ length: 50 }).map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                        backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                        left: `${Math.random() * 100}%`,
                        top: '-10px'
                    }}
                    initial={{ y: -10, x: 0, rotate: 0, opacity: 1 }}
                    animate={{
                        y: window.innerHeight + 10,
                        x: Math.random() * 200 - 100,
                        rotate: Math.random() * 360,
                        opacity: 0
                    }}
                    transition={{
                        duration: 2 + Math.random() * 1,
                        ease: "easeOut",
                        delay: Math.random() * 0.3
                    }}
                />
            ))}
        </div>
    );
};

// Horarios disponibles (simulados - luego se conectarán con Google Calendar)
const availableTimeSlots = [
    { id: '09:00', label: '9:00 AM', available: true },
    { id: '10:00', label: '10:00 AM', available: true },
    { id: '11:00', label: '11:00 AM', available: true },
    { id: '12:00', label: '12:00 PM', available: false },
    { id: '13:00', label: '1:00 PM', available: true },
    { id: '14:00', label: '2:00 PM', available: true },
    { id: '15:00', label: '3:00 PM', available: true },
    { id: '16:00', label: '4:00 PM', available: true },
    { id: '17:00', label: '5:00 PM', available: false },
    { id: '18:00', label: '6:00 PM', available: true },
];

// Próximas fechas disponibles
const getAvailableDates = () => {
    const dates = [];
    const today = new Date();

    for (let i = 1; i <= 14; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);

        // Excluir domingos
        if (date.getDay() !== 0) {
            dates.push({
                id: date.toISOString().split('T')[0],
                label: date.toLocaleDateString('es-CL', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                }),
                fullDate: date.toLocaleDateString('es-CL', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }),
                available: true
            });
        }
    }

    return dates;
};

export default function VisitSchedulerModal({
    isOpen,
    onClose,
    buildingName,
    buildingId,
    unitId
}: VisitSchedulerModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        rut: '',
        selectedDate: '',
        selectedTime: '',
        notes: ''
    });

    const [currentStep, setCurrentStep] = useState<VisitStep>('data');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');
    const [showConfetti, setShowConfetti] = useState(false);

    const modalRef = useRef<HTMLDivElement>(null);
    const nameInputRef = useRef<HTMLInputElement>(null);

    const availableDates = getAvailableDates();

    // Cerrar modal con Escape
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
            // Focus en el primer input
            setTimeout(() => nameInputRef.current?.focus(), 100);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    // Cerrar modal al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    // Efecto de confetti al completar
    useEffect(() => {
        if (isSuccess) {
            setShowConfetti(true);
            const timer = setTimeout(() => setShowConfetti(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [isSuccess]);

    const validateStep = (step: VisitStep): boolean => {
        setError('');

        switch (step) {
            case 'data':
                if (!formData.name.trim()) {
                    setError('El nombre es requerido');
                    return false;
                }
                if (!formData.email.trim()) {
                    setError('El email es requerido');
                    return false;
                }
                if (!formData.phone.trim()) {
                    setError('El teléfono es requerido');
                    return false;
                }
                if (!formData.rut.trim()) {
                    setError('El RUT es requerido');
                    return false;
                }

                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(formData.email)) {
                    setError('Por favor ingresa un email válido');
                    return false;
                }

                const phoneRegex = /^\+?[0-9]{8,12}$/;
                if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
                    setError('Por favor ingresa un teléfono válido');
                    return false;
                }
                break;

            case 'schedule':
                if (!formData.selectedDate) {
                    setError('Por favor selecciona una fecha');
                    return false;
                }
                if (!formData.selectedTime) {
                    setError('Por favor selecciona un horario');
                    return false;
                }
                break;
        }

        return true;
    };

    const handleNextStep = () => {
        if (validateStep(currentStep)) {
            if (currentStep === 'data') {
                setCurrentStep('schedule');
            } else if (currentStep === 'schedule') {
                setCurrentStep('confirmation');
            }
        }
    };

    const handlePreviousStep = () => {
        if (currentStep === 'schedule') {
            setCurrentStep('data');
        } else if (currentStep === 'confirmation') {
            setCurrentStep('schedule');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        setIsLoading(true);

        // Trackear submit
        track('visit_scheduled', {
            property_id: buildingId,
            unit_id: unitId || '',
            visit_date: formData.selectedDate,
            visit_time: formData.selectedTime
        });

        try {
            const response = await fetch('/api/booking', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    phone: formData.phone.trim(),
                    buildingId,
                    unitId: unitId || '',
                    preferredDate: new Date(`${formData.selectedDate}T${formData.selectedTime}:00`).toISOString(),
                    message: `Agendamiento de visita para ${buildingName}. ${formData.notes ? `Notas: ${formData.notes}` : ''}`,
                    type: 'visit_scheduling'
                }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setIsSuccess(true);
                track('visit_scheduled_success', {
                    property_id: buildingId,
                    unit_id: unitId || ''
                });
            } else {
                let errorMessage = 'Tuvimos un problema, intenta de nuevo';

                if (response.status === 400) {
                    errorMessage = 'Revisa los datos ingresados';
                } else if (response.status === 429) {
                    errorMessage = 'Demasiados intentos, prueba en un minuto';
                } else if (data.error) {
                    errorMessage = data.error;
                }

                throw new Error(errorMessage);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al agendar la visita');
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setIsSuccess(false);
        setError('');
        setCurrentStep('data');
        setFormData({
            name: '',
            email: '',
            phone: '',
            rut: '',
            selectedDate: '',
            selectedTime: '',
            notes: ''
        });
    };

    const getStepProgress = () => {
        switch (currentStep) {
            case 'data': return 0.33;
            case 'schedule': return 0.66;
            case 'confirmation': return 1;
            default: return 0;
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Confetti */}
            <AnimatePresence>
                {showConfetti && <Confetti />}
            </AnimatePresence>

            {/* Backdrop */}
            <motion.div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
            />

            {/* Modal */}
            <MotionWrapper direction="up" delay={0.1}>
                <motion.div
                    ref={modalRef}
                    className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl shadow-2xl ring-1 ring-gray-200 dark:ring-gray-700 overflow-hidden max-h-[90vh] flex flex-col"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                >
                    {/* Header */}
                    <motion.div
                        className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 p-6 text-white flex-shrink-0 relative overflow-hidden"
                        initial={{ y: -15, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.2, delay: 0.05 }}
                    >
                        {/* Animated background pattern */}
                        <motion.div
                            className="absolute inset-0 opacity-10"
                            animate={{
                                backgroundPosition: ['0% 0%', '100% 100%'],
                            }}
                            transition={{
                                duration: 20,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                            style={{
                                backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 50%)',
                                backgroundSize: '200% 200%'
                            }}
                        />

                        <div className="relative z-10 flex items-center justify-between">
                            <div>
                                <motion.h2
                                    className="text-xl font-bold"
                                    initial={{ x: -15, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ duration: 0.2, delay: 0.1 }}
                                >
                                    Agendar visita
                                </motion.h2>
                                <motion.p
                                    className="mt-1 text-blue-100 text-sm"
                                    initial={{ x: -15, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ duration: 0.2, delay: 0.15 }}
                                >
                                    {buildingName}
                                </motion.p>
                            </div>
                            <motion.button
                                onClick={onClose}
                                className="p-2 hover:bg-white/10 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-white/20 relative group"
                                aria-label="Cerrar modal"
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ x: 15, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.2, delay: 0.1 }}
                            >
                                <svg className="w-5 h-5 transition-transform group-hover:rotate-90" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Progress Bar */}
                    <motion.div
                        className="h-1 bg-gray-200 dark:bg-gray-700 relative overflow-hidden"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: getStepProgress() }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <motion.div
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 relative"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                            {/* Shimmer effect */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                animate={{
                                    x: ['-100%', '100%']
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                            />
                        </motion.div>
                    </motion.div>

                    {/* Content - Scrollable */}
                    <div className="flex-1 overflow-y-auto p-6">
                        <AnimatePresence mode="wait">
                            {isSuccess ? (
                                <motion.div
                                    key="success"
                                    className="text-center space-y-4"
                                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -20, scale: 0.9 }}
                                    transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
                                >
                                    <motion.div
                                        className="flex justify-center"
                                        initial={{ scale: 0, rotate: -180 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 200 }}
                                    >
                                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center relative">
                                            <motion.div
                                                className="absolute inset-0 bg-green-500/20 rounded-full"
                                                animate={{
                                                    scale: [1, 1.2, 1],
                                                    opacity: [0.5, 0, 0.5]
                                                }}
                                                transition={{
                                                    duration: 2,
                                                    repeat: Infinity,
                                                    ease: "easeInOut"
                                                }}
                                            />
                                            <CheckCircle
                                                className="w-8 h-8 text-green-600 dark:text-green-400 relative z-10"
                                            />
                                        </div>
                                    </motion.div>
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: 0.3 }}
                                    >
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                            ¡Visita agendada exitosamente!
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                                            Te hemos enviado un email de confirmación con los detalles de tu visita.
                                        </p>
                                        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                            <p className="text-sm text-blue-800 dark:text-blue-200">
                                                <strong>Fecha:</strong> {formData.selectedDate && new Date(formData.selectedDate).toLocaleDateString('es-CL', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                            <p className="text-sm text-blue-800 dark:text-blue-200">
                                                <strong>Hora:</strong> {formData.selectedTime}
                                            </p>
                                        </div>
                                    </motion.div>
                                    <motion.div
                                        className="flex gap-3"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: 0.4 }}
                                    >
                                        <motion.button
                                            type="button"
                                            onClick={handleReset}
                                            className="flex-1 rounded-xl px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                            whileHover={{ scale: 1.02, y: -2 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            Agendar otra
                                        </motion.button>
                                        <motion.button
                                            type="button"
                                            onClick={onClose}
                                            className="flex-1 rounded-xl px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                            whileHover={{ scale: 1.02, y: -2 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            Cerrar
                                        </motion.button>
                                    </motion.div>
                                </motion.div>
                            ) : currentStep === 'data' ? (
                                // Paso 1: Datos personales
                                <motion.form
                                    key="data"
                                    onSubmit={(e) => { e.preventDefault(); handleNextStep(); }}
                                    className="space-y-4"
                                    initial={{ opacity: 0, x: -15 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 15 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: 0.1 }}
                                    >
                                        <label htmlFor="name" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                            Nombre completo *
                                        </label>
                                        <motion.input
                                            ref={nameInputRef}
                                            id="name"
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                            className="w-full rounded-xl px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                                            placeholder="Tu nombre completo"
                                            required
                                            disabled={isLoading}
                                            whileFocus={{ scale: 1.01 }}
                                            whileHover={{ scale: 1.005 }}
                                        />
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: 0.2 }}
                                    >
                                        <label htmlFor="email" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                            Email *
                                        </label>
                                        <motion.input
                                            id="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                            className="w-full rounded-xl px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                                            placeholder="tu@email.com"
                                            required
                                            disabled={isLoading}
                                            whileFocus={{ scale: 1.01 }}
                                            whileHover={{ scale: 1.005 }}
                                        />
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: 0.3 }}
                                    >
                                        <label htmlFor="phone" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                            Teléfono *
                                        </label>
                                        <motion.input
                                            id="phone"
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                            className="w-full rounded-xl px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                                            placeholder="+56912345678"
                                            required
                                            disabled={isLoading}
                                            whileFocus={{ scale: 1.01 }}
                                            whileHover={{ scale: 1.005 }}
                                        />
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: 0.4 }}
                                    >
                                        <label htmlFor="rut" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                            RUT *
                                        </label>
                                        <motion.input
                                            id="rut"
                                            type="text"
                                            value={formData.rut}
                                            onChange={(e) => setFormData(prev => ({ ...prev, rut: e.target.value }))}
                                            className="w-full rounded-xl px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                                            placeholder="12.345.678-9"
                                            required
                                            disabled={isLoading}
                                            whileFocus={{ scale: 1.01 }}
                                            whileHover={{ scale: 1.005 }}
                                        />
                                    </motion.div>

                                    {/* Error */}
                                    <AnimatePresence>
                                        {error && (
                                            <motion.div
                                                className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30"
                                                initial={{ opacity: 0, y: -10, scale: 0.95, x: -20 }}
                                                animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
                                                exit={{ opacity: 0, y: -10, scale: 0.95, x: 20 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <AlertCircle className="w-4 h-4 text-red-500" />
                                                    <p className="text-sm text-red-700 dark:text-red-400 font-medium">{error}</p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Botón Continuar */}
                                    <motion.button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full rounded-xl px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                                        whileHover={{ scale: 1.02, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: 0.4 }}
                                    >
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                                            animate={{
                                                x: ['-100%', '100%']
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                ease: "linear"
                                            }}
                                        />
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            Continuar
                                            <ChevronRight className="w-4 h-4" />
                                        </span>
                                    </motion.button>
                                </motion.form>
                            ) : currentStep === 'schedule' ? (
                                // Paso 2: Selección de fecha y hora (estilo Calendly)
                                <motion.div
                                    key="schedule"
                                    className="space-y-4"
                                    initial={{ opacity: 0, x: 15 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -15 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {/* Selección de fecha */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.2, delay: 0.05 }}
                                    >
                                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                                            Selecciona una fecha *
                                        </label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {availableDates.slice(0, 8).map((date, index) => (
                                                <motion.button
                                                    key={date.id}
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, selectedDate: date.id, selectedTime: '' }))}
                                                    className={`p-3 rounded-xl border-2 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/20 relative overflow-hidden group ${formData.selectedDate === date.id
                                                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 shadow-md'
                                                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
                                                        }`}
                                                    whileHover={{ scale: 1.01, y: -1 }}
                                                    whileTap={{ scale: 0.99 }}
                                                    initial={{ opacity: 0, x: -15 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ duration: 0.2, delay: 0.1 + index * 0.02 }}
                                                >
                                                    <div className="text-center">
                                                        <div className={`font-medium text-sm ${formData.selectedDate === date.id ? 'text-blue-700 dark:text-blue-300' : 'text-gray-900 dark:text-white'}`}>
                                                            {date.label}
                                                        </div>
                                                    </div>
                                                </motion.button>
                                            ))}
                                        </div>
                                    </motion.div>

                                    {/* Selección de hora - Solo aparece cuando se selecciona una fecha */}
                                    <AnimatePresence>
                                        {formData.selectedDate && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 8, height: 0 }}
                                                animate={{ opacity: 1, y: 0, height: 'auto' }}
                                                exit={{ opacity: 0, y: -8, height: 0 }}
                                                transition={{ duration: 0.2, delay: 0.1 }}
                                                className="overflow-hidden"
                                            >
                                                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                                                    Selecciona un horario *
                                                </label>
                                                <div className="grid grid-cols-3 gap-2">
                                                    {availableTimeSlots.map((time, index) => (
                                                        <motion.button
                                                            key={time.id}
                                                            type="button"
                                                            onClick={() => time.available && setFormData(prev => ({ ...prev, selectedTime: time.id }))}
                                                            disabled={!time.available}
                                                            className={`p-3 rounded-xl border-2 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/20 relative overflow-hidden group ${formData.selectedTime === time.id
                                                                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 shadow-md'
                                                                : time.available
                                                                    ? 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
                                                                    : 'border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 opacity-50 cursor-not-allowed'
                                                                }`}
                                                            whileHover={time.available ? { scale: 1.01, y: -1 } : {}}
                                                            whileTap={time.available ? { scale: 0.99 } : {}}
                                                            initial={{ opacity: 0, x: -15 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ duration: 0.2, delay: 0.15 + index * 0.02 }}
                                                        >
                                                            <div className="text-center">
                                                                <div className={`font-medium text-sm ${formData.selectedTime === time.id ? 'text-blue-700 dark:text-blue-300' : time.available ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                                                                    {time.label}
                                                                </div>
                                                            </div>
                                                        </motion.button>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Notas adicionales */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.2, delay: 0.2 }}
                                    >
                                        <label htmlFor="notes" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                            Notas adicionales (opcional)
                                        </label>
                                        <motion.textarea
                                            id="notes"
                                            value={formData.notes}
                                            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                                            className="w-full rounded-xl px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all resize-none"
                                            placeholder="Comentarios especiales, preguntas específicas..."
                                            rows={3}
                                            disabled={isLoading}
                                            whileFocus={{ scale: 1.01 }}
                                            whileHover={{ scale: 1.005 }}
                                        />
                                    </motion.div>

                                    {/* Error */}
                                    <AnimatePresence>
                                        {error && (
                                            <motion.div
                                                className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30"
                                                initial={{ opacity: 0, y: -10, scale: 0.95, x: -20 }}
                                                animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
                                                exit={{ opacity: 0, y: -10, scale: 0.95, x: 20 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <AlertCircle className="w-4 h-4 text-red-500" />
                                                    <p className="text-sm text-red-700 dark:text-red-400 font-medium">{error}</p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Botones */}
                                    <motion.div
                                        className="flex gap-3"
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.2, delay: 0.25 }}
                                    >
                                        <motion.button
                                            type="button"
                                            onClick={handlePreviousStep}
                                            className="flex-1 rounded-xl px-4 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                            whileHover={{ scale: 1.02, y: -2 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <ChevronLeft className="w-4 h-4 inline mr-2" />
                                            Atrás
                                        </motion.button>
                                        <motion.button
                                            type="button"
                                            onClick={handleNextStep}
                                            disabled={!formData.selectedDate || !formData.selectedTime}
                                            className="flex-1 rounded-xl px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                                            whileHover={{ scale: 1.02, y: -2 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <motion.div
                                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                                                animate={{
                                                    x: ['-100%', '100%']
                                                }}
                                                transition={{
                                                    duration: 2,
                                                    repeat: Infinity,
                                                    ease: "linear"
                                                }}
                                            />
                                            <span className="relative z-10 flex items-center justify-center gap-2">
                                                Continuar
                                                <ChevronRight className="w-4 h-4" />
                                            </span>
                                        </motion.button>
                                    </motion.div>
                                </motion.div>
                            ) : (
                                // Paso 3: Confirmación
                                <motion.form
                                    key="confirmation"
                                    onSubmit={handleSubmit}
                                    className="space-y-4"
                                    initial={{ opacity: 0, x: 15 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -15 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {/* Resumen de la visita */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: 0.1 }}
                                        className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800"
                                    >
                                        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                                            <MapPin className="w-4 h-4" />
                                            Resumen de la visita
                                        </h3>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-blue-700 dark:text-blue-300">Propiedad:</span>
                                                <span className="text-blue-900 dark:text-blue-100 font-medium">{buildingName}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-blue-700 dark:text-blue-300">Fecha:</span>
                                                <span className="text-blue-900 dark:text-blue-100 font-medium">
                                                    {formData.selectedDate && new Date(formData.selectedDate).toLocaleDateString('es-CL', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-blue-700 dark:text-blue-300">Hora:</span>
                                                <span className="text-blue-900 dark:text-blue-100 font-medium">{formData.selectedTime}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-blue-700 dark:text-blue-300">Nombre:</span>
                                                <span className="text-blue-900 dark:text-blue-100 font-medium">{formData.name}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-blue-700 dark:text-blue-300">Email:</span>
                                                <span className="text-blue-900 dark:text-blue-100 font-medium">{formData.email}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-blue-700 dark:text-blue-300">Teléfono:</span>
                                                <span className="text-blue-900 dark:text-blue-100 font-medium">{formData.phone}</span>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Información importante */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: 0.2 }}
                                        className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800"
                                    >
                                        <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2 flex items-center gap-2">
                                            <Clock className="w-4 h-4" />
                                            Información importante
                                        </h4>
                                        <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                                            <li>• Llega 5 minutos antes de la hora agendada</li>
                                            <li>• Trae tu cédula de identidad</li>
                                            <li>• Te enviaremos un email de confirmación</li>
                                            <li>• Puedes cancelar hasta 24 horas antes</li>
                                        </ul>
                                    </motion.div>

                                    {/* Error */}
                                    <AnimatePresence>
                                        {error && (
                                            <motion.div
                                                className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30"
                                                initial={{ opacity: 0, y: -10, scale: 0.95, x: -20 }}
                                                animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
                                                exit={{ opacity: 0, y: -10, scale: 0.95, x: 20 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <AlertCircle className="w-4 h-4 text-red-500" />
                                                    <p className="text-sm text-red-700 dark:text-red-400 font-medium">{error}</p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Botones */}
                                    <motion.div
                                        className="flex gap-3"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: 0.3 }}
                                    >
                                        <motion.button
                                            type="button"
                                            onClick={handlePreviousStep}
                                            className="flex-1 rounded-xl px-4 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                            whileHover={{ scale: 1.02, y: -2 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <ChevronLeft className="w-4 h-4 inline mr-2" />
                                            Atrás
                                        </motion.button>
                                        <motion.button
                                            type="submit"
                                            disabled={isLoading}
                                            className="flex-1 rounded-xl px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                                            whileHover={{ scale: 1.02, y: -2 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <motion.div
                                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                                                animate={{
                                                    x: ['-100%', '100%']
                                                }}
                                                transition={{
                                                    duration: 2,
                                                    repeat: Infinity,
                                                    ease: "linear"
                                                }}
                                            />
                                            <span className="relative z-10 flex items-center justify-center gap-2">
                                                {isLoading ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        Agendando...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Calendar className="w-4 h-4" />
                                                        Confirmar visita
                                                    </>
                                                )}
                                            </span>
                                        </motion.button>
                                    </motion.div>

                                    {/* Texto de confianza */}
                                    <motion.p
                                        className="text-center text-xs text-gray-500 dark:text-gray-400"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.4, delay: 0.4 }}
                                    >
                                        Sin compromiso • Cancelación gratuita hasta 24h antes
                                    </motion.p>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </MotionWrapper>
        </div>
    );
}
