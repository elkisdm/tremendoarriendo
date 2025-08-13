"use client";

import { useState, useEffect } from 'react';
import { FlagToggle } from '@components/admin/FlagToggle';
// import { track } from '@lib/analytics';

interface FlagsStatus {
  comingSoon: {
    value: boolean;
    overridden: boolean;
    expiresAt?: string;
  };
}

export function FlagsAdminClient() {
  const [flagsStatus, setFlagsStatus] = useState<FlagsStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch flags status on mount
  useEffect(() => {
    fetchFlagsStatus();
  }, []);

  const fetchFlagsStatus = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/flags/override');
      const result = await response.json();

      if (result.success) {
        setFlagsStatus(result.flags);
      } else {
        setError('Error al cargar flags');
      }
    } catch {
      setError('Error de conexión');
      // console.error('Error fetching flags status');
    } finally {
      setLoading(false);
    }
  };

  // const _handleFlagChange = () => {
  //   // Refetch status after flag change
  //   fetchFlagsStatus();
    
  //   // Track admin action
  //   track('admin_flag_changed', {
  //     page: 'admin_flags',
  //     action: 'flag_toggle'
  //   });
  // };

  if (loading) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Feature Flags</h1>
          <p className="text-[var(--subtext)]">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Feature Flags</h1>
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchFlagsStatus}
            className="px-4 py-2 bg-brand-violet text-white rounded-lg hover:bg-brand-violet/90 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Feature Flags</h1>
        <p className="text-[var(--subtext)] mb-4">
          Controla el comportamiento del sitio en tiempo real
        </p>
        
        {/* Refresh button */}
        <button
          onClick={fetchFlagsStatus}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--soft)] text-[var(--text)] rounded-lg hover:bg-[var(--soft)]/80 transition-colors ring-1 ring-white/10"
          aria-label="Actualizar estado de flags"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Actualizar
        </button>
      </div>

      {/* Flags Grid */}
      <div className="space-y-6">
        {flagsStatus && (
          <FlagToggle
            flag="comingSoon"
            label="Coming Soon"
            description="Controla si el sitio está en modo coming soon. Cuando está activo, los usuarios son redirigidos a la página de coming soon."
            initialValue={flagsStatus.comingSoon.value}
            overridden={flagsStatus.comingSoon.overridden}
            expiresAt={flagsStatus.comingSoon.expiresAt}
          />
        )}

        {/* Placeholder for future flags */}
        <div className="rounded-2xl bg-[var(--soft)]/50 ring-1 ring-white/5 p-6 border-dashed border-white/10">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-[var(--text)] mb-2">
              Más flags próximamente
            </h3>
            <p className="text-sm text-[var(--subtext)]">
              Aquí aparecerán más opciones de configuración según se necesiten
            </p>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-12 p-6 rounded-2xl bg-[var(--soft)]/50 ring-1 ring-white/5">
        <h3 className="text-lg font-semibold text-[var(--text)] mb-3">
          Información importante
        </h3>
        <ul className="space-y-2 text-sm text-[var(--subtext)]">
          <li>• Los overrides tienen una duración máxima de 1 hora</li>
          <li>• Los cambios se aplican inmediatamente en todo el sitio</li>
          <li>• Los overrides expiran automáticamente</li>
          <li>• Esta página no está indexada por motores de búsqueda</li>
        </ul>
      </div>
    </div>
  );
}
