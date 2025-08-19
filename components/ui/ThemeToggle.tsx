'use client';

import { useTheme } from '@lib/theme-context';
import { Sun, Moon } from 'lucide-react';
import { clx } from '@lib/utils';

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme, isHydrated } = useTheme();

  // Prevenir renderizado hasta que esté hidratado para evitar parpadeo
  if (!isHydrated) {
    return (
      <button
        className={clx(
          "relative inline-flex items-center justify-center w-10 h-10 rounded-2xl",
          "bg-surface border border-soft/50",
          "text-subtext transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-bg",
          "motion-reduce:transition-none",
          "opacity-50 cursor-not-allowed",
          className
        )}
        disabled
        aria-label="Cargando tema..."
        title="Cargando tema..."
      >
        <div className="relative w-5 h-5">
          <div className="absolute inset-0 w-5 h-5 animate-pulse bg-current rounded-full opacity-30" />
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={clx(
        "relative inline-flex items-center justify-center w-10 h-10 rounded-2xl",
        "bg-surface border border-soft/50 hover:bg-soft/50",
        "text-subtext hover:text-text transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-bg",
        "motion-reduce:transition-none",
        className
      )}
      aria-label={`Cambiar a tema ${theme === 'light' ? 'oscuro' : 'claro'}`}
      title={`Cambiar a tema ${theme === 'light' ? 'oscuro' : 'claro'}`}
    >
      <div className="relative w-5 h-5">
        <Sun 
          className={clx(
            "absolute inset-0 w-5 h-5 transition-all duration-300",
            theme === 'light' 
              ? "opacity-100 rotate-0 scale-100" 
              : "opacity-0 rotate-90 scale-75"
          )}
          aria-hidden="true"
        />
        <Moon 
          className={clx(
            "absolute inset-0 w-5 h-5 transition-all duration-300",
            theme === 'dark' 
              ? "opacity-100 rotate-0 scale-100" 
              : "opacity-0 -rotate-90 scale-75"
          )}
          aria-hidden="true"
        />
      </div>
    </button>
  );
}
