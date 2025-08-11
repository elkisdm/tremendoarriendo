'use client';

import { useState, useRef, RefObject } from 'react';
import { track } from '@lib/analytics';

interface WaitlistFormProps {
  initialFocusRef?: RefObject<HTMLInputElement>;
}

export function WaitlistForm({ initialFocusRef }: WaitlistFormProps) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const formRef = useRef<HTMLFormElement>(null);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('El email es requerido');
      return;
    }

    if (!validateEmail(email)) {
      setError('Por favor ingresa un email válido');
      return;
    }

    setIsLoading(true);
    
    // Trackear submit
    track('waitlist_submit', { email, hasPhone: !!phone });

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          ...(phone.trim() && { phone: phone.trim() }),
        }),
      });

      if (!response.ok) {
        throw new Error('Error al enviar el formulario');
      }

      const data = await response.json();
      
      if (data.ok) {
        setIsSuccess(true);
        setEmail('');
        setPhone('');
        track('waitlist_success', { email });
      } else {
        throw new Error(data.error || 'Error desconocido');
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
    setEmail('');
    setPhone('');
  };

  if (isSuccess) {
    return (
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
            <svg 
              className="w-6 h-6 text-green-400" 
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
          <h3 className="text-lg font-medium text-white mb-2">
            ¡Listo! Te avisaremos cuando esté disponible
          </h3>
          <p className="text-sm text-white/80">
            Te enviaremos un email cuando lancemos la nueva experiencia de arriendo.
          </p>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="w-full rounded-2xl px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-medium transition-colors focus-visible:ring-4 focus-visible:ring-white/20 focus-visible:outline-none min-h-[44px] flex items-center justify-center"
        >
          Enviar otro email
        </button>
      </div>
    );
  }

  return (
    <form 
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      aria-describedby="wl-help"
      className="grid gap-3"
    >
      <p id="wl-help" className="sr-only">
        Formulario para unirse a la lista de espera. Ingresa tu email y opcionalmente tu teléfono.
      </p>

      {/* Campo Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
          Email *
        </label>
        <input
          ref={initialFocusRef}
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
          disabled={isLoading}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? "email-error" : undefined}
          className="w-full rounded-2xl px-4 py-3 bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-white/40 focus:ring-4 focus:ring-white/20 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="tu@email.com"
        />
        {error && (
          <p id="email-error" className="mt-1 text-sm text-red-400" role="alert">
            {error}
          </p>
        )}
      </div>

      {/* Campo Teléfono (opcional) */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-white mb-2">
          Teléfono (opcional)
        </label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          autoComplete="tel"
          disabled={isLoading}
          className="w-full rounded-2xl px-4 py-3 bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-white/40 focus:ring-4 focus:ring-white/20 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="+56912345678"
        />
      </div>

      {/* Botón Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-2xl px-5 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium transition-all focus-visible:ring-4 focus-visible:ring-white/20 focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none active:scale-[0.98] min-h-[44px] flex items-center justify-center"
      >
        {isLoading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Enviando...</span>
          </div>
        ) : (
          'Unirme a la lista de espera'
        )}
      </button>

      {/* Mensaje de estado */}
      <div aria-live="polite" className="sr-only">
        {isLoading && 'Enviando formulario...'}
        {error && `Error: ${error}`}
      </div>
    </form>
  );
}
