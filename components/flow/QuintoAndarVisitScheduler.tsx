'use client';

import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    Bell,
    MessageCircle,
    Calendar as CalendarIcon,
    BarChart3,
    Smartphone,
    Download
} from 'lucide-react';
import { useVisitScheduler } from '../../hooks/useVisitScheduler';
import { DaySlot, TimeSlot, ContactData } from '../../types/visit';

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
    const [step, setStep] = useState<'selection' | 'contact' | 'premium' | 'success'>('selection');
    const [contactData, setContactData] = useState<ContactData>({
        name: '',
        email: '',
        rut: '',
        phone: ''
    });
    const [fieldValidation, setFieldValidation] = useState<FieldValidation>({
        name: { isValid: false, message: '' },
        email: { isValid: false, message: '' },
        rut: { isValid: false, message: '' },
        phone: { isValid: false, message: '' }
    });
    const [isFormValid, setIsFormValid] = useState(false);
    // Usar el tema de la página en lugar de detectar el modo oscuro del sistema
    const isDarkMode = false; // Se heredará del tema de la página
    const [showConfetti, setShowConfetti] = useState(false);

    // Estados para calificación de arriendo
    const [rentalQualification, setRentalQualification] = useState({
        needsToMoveIn30Days: null as boolean | null,
        hasGuarantor: null as boolean | null,
        hasSufficientIncome: null as boolean | null,
        rentalPurpose: 'residencial' as 'residencial' | 'inversión'
    });

    // Estado para controlar qué pregunta está visible
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    // Estado para controlar qué campo del formulario está visible
    const [currentFieldIndex, setCurrentFieldIndex] = useState(0);

    // Configuración de preguntas de calificación
    const qualificationQuestions = [
        {
            key: 'needsToMoveIn30Days',
            title: '¿Necesitas mudarte en los próximos 30 días?',
            options: ['Sí', 'No']
        },
        {
            key: 'hasGuarantor',
            title: '¿Tienes aval o garantía?',
            options: ['Sí', 'No']
        },
        {
            key: 'hasSufficientIncome',
            title: '¿Tienes ingresos suficientes para el arriendo?',
            options: ['Sí', 'No']
        }
    ];

    // Configuración de campos del formulario
    const formFields = [
        {
            key: 'name',
            title: '¿Cuál es tu nombre completo?',
            type: 'text',
            placeholder: 'Tu nombre completo',
            validation: (value: string) => value.length >= 2
        },
        {
            key: 'email',
            title: '¿Cuál es tu email?',
            type: 'email',
            placeholder: 'tu@email.com',
            validation: (value: string) => value.includes('@') && value.includes('.')
        },
        {
            key: 'rut',
            title: '¿Cuál es tu RUT?',
            type: 'text',
            placeholder: '12.345.678-9',
            validation: (value: string) => value.length >= 8
        },
        {
            key: 'phone',
            title: '¿Cuál es tu teléfono?',
            type: 'tel',
            placeholder: '+56 9 1234 5678',
            validation: (value: string) => value.length >= 8
        }
    ];


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
        clearError
    } = useVisitScheduler({ listingId });


    // Cargar disponibilidad al abrir
    useEffect(() => {
        if (isOpen) {
            const startDate = new Date();
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + 5); // Solo 5 días como permite la API
            fetchAvailability(startDate, endDate);
        }
    }, [isOpen, fetchAvailability]);

    // Debug: Log available days when they change
    useEffect(() => {
        console.log('📅 Available days updated:', availableDays);
    }, [availableDays]);

    // Validación en tiempo real
    useEffect(() => {
        const validateForm = () => {
            const newValidation: FieldValidation = {
                name: {
                    isValid: contactData.name.length >= 2,
                    message: contactData.name.length > 0 && contactData.name.length < 2 ? 'Nombre muy corto' : ''
                },
                email: {
                    isValid: contactData.email ? contactData.email.includes('@') && contactData.email.includes('.') : false,
                    message: contactData.email && !contactData.email.includes('@') ? 'Email inválido' : ''
                },
                rut: {
                    isValid: contactData.rut.length >= 8,
                    message: contactData.rut.length > 0 && contactData.rut.length < 8 ? 'RUT muy corto' : ''
                },
                phone: {
                    isValid: contactData.phone.length >= 8,
                    message: contactData.phone.length > 0 && contactData.phone.length < 8 ? 'Teléfono muy corto' : ''
                }
            };

            setFieldValidation(newValidation);
            setIsFormValid(
                newValidation.name.isValid &&
                newValidation.email.isValid &&
                newValidation.rut.isValid &&
                newValidation.phone.isValid
            );
        };

        validateForm();
    }, [contactData]);


    // Manejar selección de fecha
    const handleDateSelect = (day: DaySlot) => {
        console.log('🗓️ Date selected:', { day, available: day.available });
        if (!day.available) {
            console.log('❌ Day not available, ignoring selection');
            return;
        }
        selectDateTime(day.date, '');
        clearError();
    };

    // Manejar selección de hora
    const handleTimeSelect = (timeSlot: TimeSlot) => {
        if (!timeSlot.available) return;
        selectDateTime(selectedDate!, timeSlot.time);
        clearError();
    };

    // Manejar respuesta de calificación
    const handleQualificationAnswer = (questionKey: string, answer: boolean | string) => {
        console.log('📝 Answering question:', { questionKey, answer, currentQuestionIndex });

        setRentalQualification(prev => ({
            ...prev,
            [questionKey]: answer
        }));

        // Avanzar a la siguiente pregunta después de un pequeño delay
        setTimeout(() => {
            if (currentQuestionIndex < qualificationQuestions.length - 1) {
                setCurrentQuestionIndex(prev => {
                    const newIndex = prev + 1;
                    console.log('➡️ Moving to next question:', newIndex);
                    return newIndex;
                });
            } else {
                console.log('✅ All questions completed');
            }
        }, 300);
    };

    // Manejar respuesta de campo del formulario
    const handleFieldAnswer = (fieldKey: string, value: string) => {
        console.log('📝 Answering field:', { fieldKey, value, currentFieldIndex });

        setContactData(prev => ({
            ...prev,
            [fieldKey]: value
        }));

        // Avanzar a la siguiente pregunta inmediatamente
        if (currentFieldIndex < formFields.length - 1) {
            setCurrentFieldIndex(prev => {
                const newIndex = prev + 1;
                console.log('➡️ Moving to next field:', newIndex);
                return newIndex;
            });
        } else {
            console.log('✅ All fields completed');
        }
    };

    // Verificar si se puede continuar del paso de selección
    const canContinue = selectedDate && selectedTime &&
        rentalQualification.needsToMoveIn30Days !== null &&
        rentalQualification.hasGuarantor !== null &&
        rentalQualification.hasSufficientIncome !== null;

    // Verificar si se puede continuar del formulario de contacto
    const canContinueForm = formFields.every(field => {
        const value = contactData[field.key as keyof ContactData];
        return value && field.validation(value);
    });

    // Debug: Log para verificar el estado
    useEffect(() => {
        console.log('🔍 Debug canContinue:', {
            selectedDate,
            selectedTime,
            needsToMoveIn30Days: rentalQualification.needsToMoveIn30Days,
            hasGuarantor: rentalQualification.hasGuarantor,
            hasSufficientIncome: rentalQualification.hasSufficientIncome,
            canContinue
        });
    }, [selectedDate, selectedTime, rentalQualification, canContinue]);

    // Continuar al formulario
    const handleContinue = () => {
        if (canContinue) {
            setCurrentFieldIndex(0); // Resetear índice del formulario
            setStep('contact');
        }
    };


    // Continuar al éxito
    const handleContinueToSuccess = async () => {
        // Simular envío de datos
        const result = await createVisit({
            name: contactData.name,
            phone: contactData.phone,
            email: contactData.email
        });

        if (result) {
            setStep('success');
            setShowConfetti(true);
            onSuccess?.(result);
        }
    };

    // Regresar al paso anterior
    const handleBack = () => {
        if (step === 'contact') {
            setCurrentFieldIndex(0); // Resetear índice del formulario
            setStep('selection');
        } else if (step === 'success') {
            setStep('contact');
        }
    };

    // Manejar envío del formulario
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid) return;

        const result = await createVisit({
            name: contactData.name,
            phone: contactData.phone,
            email: contactData.email
        });

        if (result) {
            setShowConfetti(true);
            setStep('success');
            onSuccess?.(result);
        }
    };

    // Generar evento de calendario
    const generateCalendarEvent = useCallback(() => {
        if (!selectedDate || !selectedTime) return;

        const startDate = new Date(`${selectedDate}T${selectedTime}:00-03:00`);
        const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hora después

        const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Visita: ${propertyName}&dates=${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=Visita programada para ${propertyName} en ${propertyAddress}`;
        window.open(googleCalendarUrl, '_blank');
    }, [selectedDate, selectedTime, propertyName, propertyAddress]);

    // Manejar cierre
    const handleClose = () => {
        setStep('selection');
        setShowConfetti(false);
        onClose();
    };

    // Información del paso actual
    const getStepInfo = (step: string) => {
        switch (step) {
            case 'selection':
                return { number: 1, title: 'Selecciona fecha y hora', description: 'Elige el mejor momento para tu visita' };
            case 'contact':
                return { number: 2, title: 'Datos de contacto', description: 'Completa tu información para el arriendo' };
            case 'success':
                return { number: 3, title: '¡Visita confirmada!', description: 'Todo listo para tu visita' };
            default:
                return { number: 1, title: 'Agendar visita', description: 'Programa tu visita' };
        }
    };

    const stepInfo = getStepInfo(step);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={handleClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="relative w-full max-w-md h-[95vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <button
                                onClick={handleClose}
                                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                aria-label="Cerrar"
                            >
                                <X className="w-5 h-5 text-gray-500 dark:text-gray-300" />
                            </button>
                        </div>

                        {/* Título principal */}
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                            ¿Cuándo quieres visitar esta propiedad?
                        </h1>

                        {/* Card de propiedad */}
                        <div className="flex gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                            {propertyImage && (
                                <img
                                    src={propertyImage}
                                    alt={propertyName}
                                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                                />
                            )}
                            <div className="flex-1 min-w-0">
                                <div className="text-lg font-bold text-gray-900 dark:text-white">
                                    $450.000 arriendo
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    $50.000 gastos comunes
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    {propertyAddress}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    150 m² · 3 dormitorios · 1 estacionamiento
                                </div>
                            </div>
                        </div>

                        {/* Progress bar - solo mostrar en pasos posteriores */}
                        {step !== 'selection' && (
                            <>
                                <div className="flex items-center gap-2 mb-2">
                                    {[1, 2, 3].map((stepNumber) => (
                                        <div
                                            key={stepNumber}
                                            className={`flex-1 h-2 rounded-full ${stepNumber <= stepInfo.number
                                                ? 'bg-blue-600'
                                                : 'bg-gray-200 dark:bg-gray-700'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <div className="flex items-center justify-between">
                                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                                        {stepInfo.title}
                                    </h3>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {stepInfo.number}/3
                                    </span>
                                </div>
                                <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">
                                    {stepInfo.description}
                                </p>
                            </>
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col overflow-hidden">
                        {/* Step 1: Selección de fecha y hora */}
                        {step === 'selection' && (
                            <div className="flex-1 flex flex-col overflow-hidden">
                                <div className="flex-1 p-4 overflow-y-auto">
                                    {/* Selección de fecha */}
                                    <div className="mb-6">
                                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                            Elige un día
                                        </h4>
                                        <div className="flex gap-3 overflow-x-auto pb-2">
                                            {availableDays.map((day, index) => (
                                                <button
                                                    key={day.id}
                                                    onClick={() => handleDateSelect(day)}
                                                    disabled={!day.available}
                                                    className={`flex-shrink-0 w-16 h-16 rounded-full text-center transition-colors ${selectedDate === day.date
                                                        ? 'bg-blue-500 text-white'
                                                        : day.available
                                                            ? 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700'
                                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-500'
                                                        }`}
                                                >
                                                    <div className="text-xs font-medium">{day.day}</div>
                                                    <div className="text-lg font-bold">{day.number}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Selección de hora */}
                                    {selectedDate && (
                                        <div className="mb-6">
                                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                                Elige un horario
                                            </h4>
                                            <div className="flex gap-3 overflow-x-auto pb-2">
                                                {availableSlots.map((timeSlot) => (
                                                    <button
                                                        key={timeSlot.id}
                                                        onClick={() => handleTimeSelect(timeSlot)}
                                                        disabled={!timeSlot.available}
                                                        className={`flex-shrink-0 px-4 py-3 rounded-xl text-center transition-colors min-w-[80px] ${selectedTime === timeSlot.time
                                                            ? 'bg-blue-500 text-white'
                                                            : timeSlot.available
                                                                ? 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700'
                                                                : 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-500'
                                                            }`}
                                                    >
                                                        {timeSlot.time}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Preguntas de calificación progresivas */}
                                    {selectedDate && selectedTime && (
                                        <div className="mb-6">
                                            {/* Indicador de progreso */}
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                                    Pregunta {currentQuestionIndex + 1} de {qualificationQuestions.length}
                                                </span>
                                                <div className="flex gap-1">
                                                    {qualificationQuestions.map((_, index) => (
                                                        <div
                                                            key={index}
                                                            className={`w-2 h-2 rounded-full transition-colors ${index <= currentQuestionIndex
                                                                ? 'bg-blue-500'
                                                                : 'bg-gray-300 dark:bg-gray-600'
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Pregunta actual */}
                                            <AnimatePresence mode="wait">
                                                <motion.div
                                                    key={currentQuestionIndex}
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: -20 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                                        {qualificationQuestions[currentQuestionIndex].title}
                                                    </h4>
                                                    <div className="flex gap-3">
                                                        {qualificationQuestions[currentQuestionIndex].options.map((option, optionIndex) => {
                                                            const questionKey = qualificationQuestions[currentQuestionIndex].key;
                                                            const currentValue = rentalQualification[questionKey as keyof typeof rentalQualification];
                                                            const isSelected = currentValue === (option === 'Sí' ? true : false);

                                                            return (
                                                                <button
                                                                    key={optionIndex}
                                                                    onClick={() => {
                                                                        const answer = option === 'Sí' ? true : false;
                                                                        handleQualificationAnswer(questionKey, answer);
                                                                    }}
                                                                    className={`flex-1 py-3 px-4 rounded-xl text-center transition-colors font-medium ${isSelected
                                                                        ? 'bg-blue-500 text-white'
                                                                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700'
                                                                        }`}
                                                                >
                                                                    {option}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </motion.div>
                                            </AnimatePresence>
                                        </div>
                                    )}
                                </div>

                                {/* Botón continuar - fijo en la parte inferior */}
                                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                                    <button
                                        onClick={handleContinue}
                                        disabled={!canContinue}
                                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-2xl transition-colors text-lg touch-manipulation disabled:cursor-not-allowed active:scale-95 shadow-lg"
                                    >
                                        {canContinue ? 'Continuar →' : 'Completa todas las opciones'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Formulario de contacto secuencial */}
                        {step === 'contact' && (
                            <div className="flex-1 flex flex-col overflow-hidden">
                                <div className="flex-1 p-4 overflow-y-auto">
                                    {/* Indicador de progreso */}
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            Campo {currentFieldIndex + 1} de {formFields.length}
                                        </span>
                                        <div className="flex gap-1">
                                            {formFields.map((_, index) => (
                                                <div
                                                    key={index}
                                                    className={`w-2 h-2 rounded-full transition-colors ${index <= currentFieldIndex
                                                        ? 'bg-blue-500'
                                                        : 'bg-gray-300 dark:bg-gray-600'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Campo actual */}
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={currentFieldIndex}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                                {formFields[currentFieldIndex].title}
                                            </h4>
                                            <div className="relative">
                                                <input
                                                    type={formFields[currentFieldIndex].type}
                                                    value={contactData[formFields[currentFieldIndex].key as keyof ContactData] || ''}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        setContactData(prev => ({ ...prev, [formFields[currentFieldIndex].key]: value }));
                                                    }}
                                                    onKeyPress={(e) => {
                                                        if (e.key === 'Enter') {
                                                            const currentField = formFields[currentFieldIndex];
                                                            const value = contactData[currentField.key as keyof ContactData];
                                                            if (value && currentField.validation(value)) {
                                                                handleFieldAnswer(currentField.key, value);
                                                            }
                                                        }
                                                    }}
                                                    className="w-full p-4 pr-16 rounded-xl border-2 border-gray-300 bg-white text-gray-900 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white transition-colors text-lg"
                                                    placeholder={formFields[currentFieldIndex].placeholder}
                                                    autoFocus
                                                />
                                                {/* Botón de flecha */}
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const currentField = formFields[currentFieldIndex];
                                                        const value = contactData[currentField.key as keyof ContactData];
                                                        if (value && currentField.validation(value)) {
                                                            handleFieldAnswer(currentField.key, value);
                                                        }
                                                    }}
                                                    disabled={!contactData[formFields[currentFieldIndex].key as keyof ContactData] || !formFields[currentFieldIndex].validation(contactData[formFields[currentFieldIndex].key as keyof ContactData] || '')}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white transition-colors"
                                                >
                                                    <ChevronRight className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    </AnimatePresence>
                                </div>

                                {/* Botones de navegación - fijos en la parte inferior */}
                                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 space-y-3">
                                    <button
                                        type="button"
                                        onClick={handleBack}
                                        className="w-full py-3 px-6 rounded-xl font-semibold transition-colors bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                                    >
                                        ← Atrás
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleContinueToSuccess}
                                        disabled={!canContinueForm || isLoading}
                                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-2xl transition-colors text-lg touch-manipulation disabled:cursor-not-allowed active:scale-95 shadow-lg flex items-center justify-center gap-2"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Procesando...
                                            </>
                                        ) : (
                                            canContinueForm ? 'Continuar →' : 'Completa todos los campos'
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Éxito */}
                        {step === 'success' && (
                            <div className="flex-1 flex flex-col overflow-hidden">
                                <div className="flex-1 p-4 overflow-y-auto flex flex-col items-center justify-center text-center">
                                    {/* Confeti animado */}
                                    {showConfetti && (
                                        <div className="absolute inset-0 pointer-events-none">
                                            {[...Array(20)].map((_, i) => (
                                                <motion.div
                                                    key={i}
                                                    className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                                                    initial={{
                                                        x: Math.random() * window.innerWidth,
                                                        y: -10,
                                                        rotate: 0
                                                    }}
                                                    animate={{
                                                        y: window.innerHeight + 10,
                                                        rotate: 360
                                                    }}
                                                    transition={{
                                                        duration: 1.5 + Math.random() * 0.5,
                                                        delay: Math.random() * 0.2,
                                                        ease: "easeOut"
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    )}

                                    <motion.div
                                        initial={{ scale: 0.98 }}
                                        animate={{ scale: 1 }}
                                        transition={{ duration: 0.2 }}
                                        className="mb-6"
                                    >
                                        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                                    </motion.div>

                                    <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                                        ¡Visita confirmada!
                                    </h3>
                                    <p className="text-base mb-6 text-gray-600 dark:text-gray-400">
                                        Tu visita ha sido programada exitosamente. Te contactaremos pronto con los detalles.
                                    </p>

                                    <div className="p-4 rounded-xl mb-6 w-full bg-gray-100 dark:bg-gray-800">
                                        <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">
                                            Detalles de la visita:
                                        </h4>
                                        <div className="space-y-1 text-sm">
                                            <p className="text-gray-600 dark:text-gray-300">
                                                <strong>Fecha:</strong> {selectedDate}
                                            </p>
                                            <p className="text-gray-600 dark:text-gray-300">
                                                <strong>Hora:</strong> {selectedTime}
                                            </p>
                                            <p className="text-gray-600 dark:text-gray-300">
                                                <strong>Propiedad:</strong> {propertyName}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Botón de calendario */}
                                    <div className="mb-6">
                                        <button
                                            onClick={generateCalendarEvent}
                                            className="w-full flex items-center justify-center gap-3 py-3 px-6 rounded-xl border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors font-semibold"
                                        >
                                            <CalendarIcon className="w-5 h-5" />
                                            Añadir al calendario
                                        </button>
                                    </div>
                                </div>

                                {/* Botón cerrar - fijo en la parte inferior */}
                                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                                    <button
                                        onClick={handleClose}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-2xl transition-colors text-lg touch-manipulation active:scale-95 shadow-lg"
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Error message */}
                    {error && (
                        <div className="p-4 border-t border-gray-200 bg-red-50 dark:border-gray-700 dark:bg-red-900/20">
                            <div className="flex items-center gap-2 text-red-600">
                                <AlertCircle className="w-5 h-5" />
                                <span className="text-sm">{error}</span>
                            </div>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

