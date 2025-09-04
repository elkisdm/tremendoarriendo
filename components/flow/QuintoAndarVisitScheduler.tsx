'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import {
    Calendar,
    Clock,
    User,
    Phone,
    Mail,
    CheckCircle,
    AlertCircle,
    Loader2,
    X,
    ChevronLeft,
    ChevronRight,
    ArrowLeft,
    Check,
    AlertTriangle,
    Sun,
    Moon
} from 'lucide-react';
import { useVisitScheduler } from '@/hooks/useVisitScheduler';
import { DaySlot, TimeSlot, ContactData } from '@/types/visit';

interface QuintoAndarVisitSchedulerProps {
    isOpen: boolean;
    onClose: () => void;
    listingId: string;
    propertyName: string;
    propertyAddress: string;
    propertyImage?: string;
    onSuccess?: (visitData: any) => void;
}

interface FieldValidation {
    name: { isValid: boolean; message: string };
    email: { isValid: boolean; message: string };
    rut: { isValid: boolean; message: string };
    phone: { isValid: boolean; message: string };
}

export function QuintoAndarVisitScheduler({
    isOpen,
    onClose,
    listingId,
    propertyName,
    propertyAddress,
    propertyImage,
    onSuccess
}: QuintoAndarVisitSchedulerProps) {
    const [step, setStep] = useState<'selection' | 'contact' | 'success'>('selection');
    const [contactData, setContactData] = useState<ContactData>({
        name: '',
        rut: '',
        phone: '',
        email: ''
    });
    const [fieldValidation, setFieldValidation] = useState<FieldValidation>({
        name: { isValid: false, message: '' },
        email: { isValid: false, message: '' },
        rut: { isValid: false, message: '' },
        phone: { isValid: false, message: '' }
    });
    const [isFormValid, setIsFormValid] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    // Refs para gestos
    const containerRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const opacity = useTransform(x, [-100, 0, 100], [0.5, 1, 0.5]);

    const {
        isLoading,
        error,
        selectedDate,
        selectedTime,
        availableDays,
        availableSlots,
        fetchAvailability,
        selectDateTime,
        createVisit,
        clearSelection,
        clearError
    } = useVisitScheduler({ listingId });

    // Detectar modo oscuro del sistema
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setIsDarkMode(mediaQuery.matches);

        const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
        mediaQuery.addEventListener('change', handleChange);

        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    // Cargar disponibilidad al abrir
    useEffect(() => {
        if (isOpen) {
            const startDate = new Date();
            startDate.setDate(startDate.getDate() + 1);

            const endDate = new Date();
            endDate.setDate(endDate.getDate() + 5);

            fetchAvailability(startDate, endDate);
        }
    }, [isOpen, fetchAvailability]);

    // Validar campos en tiempo real
    useEffect(() => {
        const validateForm = () => {
            const nameValid = contactData.name.trim().length >= 2;
            const emailValid = contactData.email ? contactData.email.includes('@') && contactData.email.includes('.') : false;
            const rutValid = contactData.rut.trim().length >= 8;
            const phoneValid = contactData.phone.trim().length >= 9;

            setFieldValidation({
                name: {
                    isValid: nameValid,
                    message: nameValid ? '' : 'El nombre debe tener al menos 2 caracteres'
                },
                email: {
                    isValid: emailValid,
                    message: emailValid ? '' : 'Ingresa un email válido'
                },
                rut: {
                    isValid: rutValid,
                    message: rutValid ? '' : 'El RUT debe tener al menos 8 caracteres'
                },
                phone: {
                    isValid: phoneValid,
                    message: phoneValid ? '' : 'El teléfono debe tener al menos 9 dígitos'
                }
            });

            setIsFormValid(nameValid && emailValid && rutValid && phoneValid);
        };

        validateForm();
    }, [contactData]);

    // Feedback háptico
    const triggerHapticFeedback = useCallback((type: 'light' | 'medium' | 'heavy' = 'light') => {
        if ('vibrate' in navigator) {
            switch (type) {
                case 'light':
                    navigator.vibrate(50);
                    break;
                case 'medium':
                    navigator.vibrate(100);
                    break;
                case 'heavy':
                    navigator.vibrate(200);
                    break;
            }
        }
    }, []);

    // Manejar gestos de navegación
    const handleDragEnd = useCallback((event: any, info: PanInfo) => {
        const threshold = 100;

        if (info.offset.x > threshold && step !== 'selection') {
            // Swipe derecha - ir atrás
            triggerHapticFeedback('medium');
            setStep(step === 'contact' ? 'selection' : 'contact');
        } else if (info.offset.x < -threshold && step !== 'success' && selectedDate && selectedTime) {
            // Swipe izquierda - ir adelante
            triggerHapticFeedback('medium');
            if (step === 'selection') {
                setStep('contact');
            }
        }

        x.set(0);
    }, [step, selectedDate, selectedTime, x, triggerHapticFeedback]);

    // Manejar selección de fecha
    const handleDateSelect = (day: DaySlot) => {
        if (!day.available) return;

        triggerHapticFeedback('light');
        selectDateTime(day.date, '');
        clearError();
    };

    // Manejar selección de hora
    const handleTimeSelect = (timeSlot: TimeSlot) => {
        if (!timeSlot.available) return;

        triggerHapticFeedback('light');
        selectDateTime(selectedDate!, timeSlot.time);
        clearError();
    };

    // Verificar si se puede continuar
    const canContinue = selectedDate && selectedTime;

    // Continuar al formulario
    const handleContinue = () => {
        if (canContinue) {
            triggerHapticFeedback('medium');
            setStep('contact');
        }
    };

    // Regresar al paso anterior
    const handleBack = () => {
        if (step === 'contact') {
            triggerHapticFeedback('medium');
            setStep('selection');
        }
    };

    // Manejar envío del formulario
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isFormValid) {
            return;
        }

        const result = await createVisit({
            name: contactData.name,
            phone: contactData.phone,
            email: contactData.email
        });

        if (result) {
            triggerHapticFeedback('heavy');
            setShowConfetti(true);
            setStep('success');
            onSuccess?.(result);

            // Ocultar confeti después de 3 segundos
            setTimeout(() => setShowConfetti(false), 3000);
        }
    };

    // Resetear al cerrar
    const handleClose = () => {
        setStep('selection');
        clearSelection();
        clearError();
        setContactData({ name: '', rut: '', phone: '', email: '' });
        setFieldValidation({
            name: { isValid: false, message: '' },
            email: { isValid: false, message: '' },
            rut: { isValid: false, message: '' },
            phone: { isValid: false, message: '' }
        });
        setIsFormValid(false);
        setShowConfetti(false);
        onClose();
    };

    // Obtener información del paso actual
    const getStepInfo = () => {
        switch (step) {
            case 'selection':
                return { number: 1, title: 'Fecha y Hora', description: 'Selecciona cuándo quieres visitar' };
            case 'contact':
                return { number: 2, title: 'Contacto', description: 'Completa tus datos' };
            case 'success':
                return { number: 3, title: 'Confirmación', description: 'Visita agendada' };
            default:
                return { number: 1, title: 'Fecha y Hora', description: 'Selecciona cuándo quieres visitar' };
        }
    };

    // Obtener fecha actual para comparar
    const today = new Date().toISOString().split('T')[0];

    if (!isOpen) return null;

    const stepInfo = getStepInfo();

    return (
        <div className={`fixed inset-0 z-50 ${isDarkMode ? 'dark' : ''}`}>
            <div className={`w-full h-full ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
                {/* Header con indicador de progreso */}
                <div className={`sticky top-0 z-10 ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-100'} border-b`}>
                    {/* Barra de progreso */}
                    <div className="px-4 py-3">
                        <div className="flex items-center justify-between mb-3">
                            <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                Paso {stepInfo.number} de 3
                            </span>
                            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{stepInfo.title}</span>
                        </div>
                        <div className={`w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2`}>
                            <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                                style={{ width: `${(stepInfo.number / 3) * 100}%` }}
                            />
                        </div>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-2 text-center`}>{stepInfo.description}</p>
                    </div>

                    {/* Header principal */}
                    <div className={`flex items-center justify-between p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                        <div className="flex items-center gap-3">
                            {/* Botón atrás solo en pasos 2 y 3 */}
                            {step !== 'selection' && (
                                <button
                                    onClick={handleBack}
                                    className={`p-3 ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} rounded-2xl transition-colors touch-manipulation active:scale-95`}
                                    aria-label="Volver al paso anterior"
                                >
                                    <ArrowLeft className={`w-5 h-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`} />
                                </button>
                            )}

                            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-white" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} truncate`}>Agendar Visita</h2>
                                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} truncate`}>{propertyName}</p>
                            </div>
                        </div>

                        {/* Toggle modo oscuro */}
                        <button
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className={`p-3 ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} rounded-2xl transition-colors touch-manipulation active:scale-95 mr-2`}
                            aria-label="Cambiar modo oscuro"
                        >
                            {isDarkMode ? (
                                <Sun className="w-5 h-5 text-yellow-400" />
                            ) : (
                                <Moon className="w-5 h-5 text-gray-500" />
                            )}
                        </button>

                        <button
                            onClick={handleClose}
                            className={`p-3 ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} rounded-2xl transition-colors touch-manipulation active:scale-95`}
                            aria-label="Cerrar modal"
                        >
                            <X className={`w-5 h-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`} />
                        </button>
                    </div>
                </div>

                {/* Content con gestos */}
                <motion.div
                    ref={containerRef}
                    className="flex-1 p-4 overflow-y-auto"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={handleDragEnd}
                    style={{ x, opacity }}
                    dragElastic={0.1}
                >
                    <AnimatePresence mode="wait">
                        {/* Step 1: Selección de fecha y hora */}
                        {step === 'selection' && (
                            <motion.div
                                key="selection"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                className="h-full flex flex-col"
                            >
                                {/* Instrucciones */}
                                <div className="text-center mb-6">
                                    <motion.h3
                                        className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}
                                        initial={{ scale: 0.9 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        Selecciona fecha y hora
                                    </motion.h3>
                                    <motion.p
                                        className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} px-4`}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        Elige el día y horario que prefieras para tu visita
                                    </motion.p>
                                </div>

                                {/* Selección de fecha - Grid responsivo */}
                                <div className="mb-6">
                                    <h4 className={`text-base font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4 flex items-center gap-2`}>
                                        <Calendar className="w-5 h-5 text-blue-600" />
                                        Fecha
                                    </h4>

                                    {isLoading ? (
                                        <div className="flex items-center justify-center py-8">
                                            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-5 gap-3">
                                            {availableDays.map((day, index) => (
                                                <motion.button
                                                    key={day.id}
                                                    onClick={() => handleDateSelect(day)}
                                                    disabled={!day.available}
                                                    className={`
                                                        relative flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all
                                                        min-h-[88px] touch-manipulation active:scale-95
                                                        ${day.available
                                                            ? selectedDate === day.date
                                                                ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-lg ring-2 ring-blue-200'
                                                                : `${isDarkMode ? 'border-gray-600 hover:border-blue-400 hover:bg-blue-900/20' : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50'}`
                                                            : `${isDarkMode ? 'border-gray-700 bg-gray-800 text-gray-500' : 'border-gray-200 bg-gray-50 text-gray-400'} cursor-not-allowed`
                                                        }
                                                    `}
                                                    aria-label={`Seleccionar ${day.day} ${day.number}`}
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: index * 0.05, duration: 0.3 }}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <div className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{day.day}</div>
                                                    <div className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{day.number}</div>
                                                    {day.date === today && (
                                                        <div className="text-xs text-blue-600 font-medium">Hoy</div>
                                                    )}
                                                    {selectedDate === day.date && (
                                                        <motion.div
                                                            className="absolute top-2 right-2 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center"
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                        >
                                                            <Check className="w-2.5 h-2.5 text-white" />
                                                        </motion.div>
                                                    )}
                                                </motion.button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Selección de hora - Grid responsivo */}
                                {selectedDate && (
                                    <motion.div
                                        className="mb-6"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <h4 className={`text-base font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4 flex items-center gap-2`}>
                                            <Clock className="w-5 h-5 text-green-600" />
                                            Hora
                                        </h4>

                                        <div className="grid grid-cols-3 gap-3">
                                            {availableSlots.map((timeSlot, index) => (
                                                <motion.button
                                                    key={timeSlot.id}
                                                    onClick={() => handleTimeSelect(timeSlot)}
                                                    disabled={!timeSlot.available}
                                                    className={`
                                                        relative p-4 rounded-2xl border-2 transition-all text-center touch-manipulation
                                                        min-h-[72px] flex items-center justify-center active:scale-95
                                                        ${timeSlot.available
                                                            ? selectedTime === timeSlot.time
                                                                ? 'border-green-600 bg-green-50 text-green-700 shadow-lg ring-2 ring-green-200'
                                                                : `${isDarkMode ? 'border-gray-600 hover:border-green-400 hover:bg-green-900/20' : 'border-gray-200 hover:border-green-400 hover:bg-green-50'}`
                                                            : `${isDarkMode ? 'border-gray-700 bg-gray-800 text-gray-500' : 'border-gray-200 bg-gray-50 text-gray-400'} cursor-not-allowed`
                                                        }
                                                    `}
                                                    aria-label={`Seleccionar hora ${timeSlot.time}`}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.1, duration: 0.3 }}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <span className={`text-base font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{timeSlot.time}</span>
                                                    {selectedTime === timeSlot.time && (
                                                        <motion.div
                                                            className="absolute top-2 right-2 w-4 h-4 bg-green-600 rounded-full flex items-center justify-center"
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                        >
                                                            <Check className="w-2.5 h-2.5 text-white" />
                                                        </motion.div>
                                                    )}
                                                </motion.button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {/* Botón continuar */}
                                <motion.div
                                    className="mt-auto pt-4"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <button
                                        onClick={handleContinue}
                                        disabled={!canContinue}
                                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-2xl transition-colors text-lg touch-manipulation disabled:cursor-not-allowed active:scale-95 shadow-lg"
                                    >
                                        Continuar →
                                    </button>
                                </motion.div>
                            </motion.div>
                        )}

                        {/* Step 2: Formulario de contacto */}
                        {step === 'contact' && (
                            <motion.div
                                key="contact"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                className="h-full flex flex-col"
                            >
                                {/* Header del paso */}
                                <div className="text-center mb-6">
                                    <motion.h3
                                        className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}
                                        initial={{ scale: 0.9 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        Información de contacto
                                    </motion.h3>
                                    <motion.p
                                        className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        Completa tus datos para confirmar la visita
                                    </motion.p>
                                </div>

                                {/* Formulario */}
                                <form onSubmit={handleSubmit} className="flex-1 flex flex-col space-y-5">
                                    {[
                                        { key: 'name', label: 'Nombre completo *', placeholder: 'Tu nombre completo', type: 'text' },
                                        { key: 'email', label: 'Correo electrónico *', placeholder: 'tu@email.com', type: 'email' },
                                        { key: 'rut', label: 'RUT *', placeholder: '12.345.678-9', type: 'text' },
                                        { key: 'phone', label: 'Celular *', placeholder: '+56 9 1234 5678', type: 'tel' }
                                    ].map((field, index) => (
                                        <motion.div
                                            key={field.key}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1, duration: 0.3 }}
                                        >
                                            <label htmlFor={field.key} className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                                                {field.label}
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={field.type}
                                                    id={field.key}
                                                    value={contactData[field.key as keyof ContactData] || ''}
                                                    onChange={(e) => setContactData(prev => ({ ...prev, [field.key]: e.target.value }))}
                                                    className={`
                                                        w-full px-4 py-4 border rounded-2xl text-base transition-all
                                                        ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}
                                                        ${fieldValidation[field.key as keyof FieldValidation].isValid
                                                            ? 'border-green-300 bg-green-50 focus:border-green-500 focus:ring-green-200'
                                                            : contactData[field.key as keyof ContactData]
                                                                ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200'
                                                                : `${isDarkMode ? 'border-gray-600 focus:border-blue-500 focus:ring-blue-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'}`
                                                        }
                                                        focus:ring-2 focus:ring-opacity-20
                                                    `}
                                                    placeholder={field.placeholder}
                                                    required
                                                    aria-required="true"
                                                />
                                                {fieldValidation[field.key as keyof FieldValidation].isValid && (
                                                    <motion.div
                                                        className="absolute right-3 top-1/2 -translate-y-1/2"
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                    >
                                                        <Check className="w-5 h-5 text-green-600" />
                                                    </motion.div>
                                                )}
                                            </div>
                                            {fieldValidation[field.key as keyof FieldValidation].message && (
                                                <motion.p
                                                    className="text-sm text-red-600 mt-1 flex items-center gap-1"
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                >
                                                    <AlertTriangle className="w-4 h-4" />
                                                    {fieldValidation[field.key as keyof FieldValidation].message}
                                                </motion.p>
                                            )}
                                        </motion.div>
                                    ))}

                                    {/* Botones de navegación */}
                                    <motion.div
                                        className="flex gap-3 mt-6"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6 }}
                                    >
                                        <button
                                            type="button"
                                            onClick={handleBack}
                                            className={`flex-1 px-6 py-4 border ${isDarkMode ? 'border-gray-600 text-gray-200 hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} font-medium rounded-2xl transition-colors active:scale-95`}
                                        >
                                            ← Atrás
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={!isFormValid || isLoading}
                                            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-4 px-6 rounded-2xl transition-colors active:scale-95 shadow-lg"
                                        >
                                            {isLoading ? (
                                                <div className="flex items-center justify-center gap-2">
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    Confirmando...
                                                </div>
                                            ) : (
                                                'Confirmar Visita'
                                            )}
                                        </button>
                                    </motion.div>
                                </form>
                            </motion.div>
                        )}

                        {/* Step 3: Éxito */}
                        {step === 'success' && (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className="h-full flex flex-col items-center justify-center text-center px-4"
                            >
                                {/* Confeti animado */}
                                {showConfetti && (
                                    <div className="absolute inset-0 pointer-events-none">
                                        {[...Array(20)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-red-500 rounded-full"
                                                initial={{
                                                    x: Math.random() * window.innerWidth,
                                                    y: -20,
                                                    rotate: 0
                                                }}
                                                animate={{
                                                    y: window.innerHeight + 20,
                                                    rotate: 360,
                                                    opacity: [1, 1, 0]
                                                }}
                                                transition={{
                                                    duration: 3 + Math.random() * 2,
                                                    delay: Math.random() * 0.5,
                                                    ease: "easeIn"
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}

                                <motion.div
                                    className={`w-20 h-20 ${isDarkMode ? 'bg-green-900' : 'bg-green-100'} rounded-full flex items-center justify-center mb-6`}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: "spring", stiffness: 500, damping: 30 }}
                                >
                                    <CheckCircle className="w-10 h-10 text-green-600" />
                                </motion.div>
                                <motion.h3
                                    className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-3`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    ¡Visita confirmada!
                                </motion.h3>
                                <motion.p
                                    className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-8 max-w-md`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                >
                                    Tu visita ha sido programada exitosamente. Te hemos enviado una confirmación por WhatsApp con todos los detalles.
                                </motion.p>
                                <motion.button
                                    onClick={handleClose}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-2xl transition-colors text-lg touch-manipulation active:scale-95 shadow-lg"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Cerrar
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
}
