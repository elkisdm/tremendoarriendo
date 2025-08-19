"use client";

import { useState, useRef, useEffect } from 'react';
import { track } from '@lib/analytics';
import MotionWrapper from '@/components/ui/MotionWrapper';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ContactMethod = 'whatsapp' | 'call' | 'email';

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    contactMethod: 'whatsapp' as ContactMethod
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const modalRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

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

  const validateForm = () => {
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

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setIsLoading(true);
    
    // Trackear submit
    track('contact_form_submit', { 
      source: 'how-it-works',
      contactMethod: formData.contactMethod 
    });

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          contactMethod: formData.contactMethod,
          source: 'how-it-works'
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        setIsSuccess(true);
        track('contact_form_submitted', { 
          source: 'how-it-works',
          contactMethod: formData.contactMethod 
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
      setError(err instanceof Error ? err.message : 'Error al enviar el formulario');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setError('');
    setFormData({
      name: '',
      email: '',
      phone: '',
      contactMethod: 'whatsapp'
    });
  };

  const contactMethods = [
    {
      id: 'whatsapp' as ContactMethod,
      label: 'WhatsApp',
      description: 'Te escribimos por WhatsApp',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
        </svg>
      ),
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      id: 'call' as ContactMethod,
      label: 'Llamada',
      description: 'Te llamamos directamente',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
        </svg>
      ),
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      id: 'email' as ContactMethod,
      label: 'Email',
      description: 'Te enviamos un email',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
        </svg>
      ),
      color: 'bg-purple-500 hover:bg-purple-600'
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      {/* Modal */}
      <MotionWrapper direction="up" delay={0.1}>
        <div 
          ref={modalRef}
          className="relative w-full max-w-md bg-card rounded-2xl shadow-2xl ring-1 ring-border/20 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">¡Quiero ser contactado!</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-white/20"
                aria-label="Cerrar modal"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="mt-2 text-sm text-white/90">
              Déjanos tus datos y te contactaremos por el método que prefieras
            </p>
          </div>

          {/* Content */}
          <div className="p-6">
            {isSuccess ? (
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                    <svg 
                      className="w-6 h-6 text-green-500" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M5 13l4 4L19 7" 
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    ¡Perfecto! Te contactaremos pronto
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Hemos recibido tu información y nos pondremos en contacto contigo por {formData.contactMethod === 'whatsapp' ? 'WhatsApp' : formData.contactMethod === 'call' ? 'teléfono' : 'email'}.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex-1 rounded-xl px-4 py-2 bg-muted hover:bg-muted/80 text-foreground font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    Enviar otro
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 rounded-xl px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Método de contacto */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    ¿Cómo prefieres que te contactemos?
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {contactMethods.map((method) => (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, contactMethod: method.id }))}
                        className={`relative p-3 rounded-xl border-2 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                          formData.contactMethod === method.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="flex flex-col items-center space-y-1">
                          <div className={`p-2 rounded-lg text-white ${method.color}`}>
                            {method.icon}
                          </div>
                          <span className="text-xs font-medium text-foreground">
                            {method.label}
                          </span>
                        </div>
                        {formData.contactMethod === method.id && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                            <svg className="w-2.5 h-2.5 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Nombre */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Nombre completo *
                  </label>
                  <input
                    ref={nameInputRef}
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full rounded-xl px-4 py-3 bg-background border border-border text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors"
                    placeholder="Tu nombre completo"
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full rounded-xl px-4 py-3 bg-background border border-border text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors"
                    placeholder="tu@email.com"
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* Teléfono */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                    Teléfono *
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full rounded-xl px-4 py-3 bg-background border border-border text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors"
                    placeholder="+56912345678"
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* Error */}
                {error && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </div>
                )}

                {/* Botón Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-xl px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium transition-all focus:outline-none focus:ring-2 focus:ring-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none active:scale-[0.98]"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Enviando...</span>
                    </div>
                  ) : (
                    'Enviar información'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </MotionWrapper>
    </div>
  );
}
