'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  isHydrated: boolean; // Para prevenir parpadeo
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Función para obtener la preferencia del sistema
function getSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// Función para obtener el tema inicial de forma segura
function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  
  try {
    // 1. Intentar obtener preferencia guardada
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      return savedTheme;
    }
    
    // 2. Usar preferencia del sistema
    return getSystemTheme();
  } catch (error) {
    // 3. Fallback a dark si hay error
    console.warn('Error getting initial theme, falling back to dark:', error);
    return 'dark';
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark'); // Default temporal
  const [isHydrated, setIsHydrated] = useState(false); // Para prevenir parpadeo

  useEffect(() => {
    // Inicializar tema de forma segura
    const initialTheme = getInitialTheme();
    setThemeState(initialTheme);
    setIsHydrated(true);

    // Listener para cambios en la preferencia del sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      // Solo actualizar si el usuario no tiene una preferencia guardada
      try {
        const savedTheme = localStorage.getItem('theme') as Theme;
        if (!savedTheme || (savedTheme !== 'light' && savedTheme !== 'dark')) {
          const newSystemTheme: Theme = e.matches ? 'dark' : 'light';
          setThemeState(newSystemTheme);
        }
      } catch (error) {
        // Si no hay localStorage, seguir la preferencia del sistema
        const newSystemTheme: Theme = e.matches ? 'dark' : 'light';
        setThemeState(newSystemTheme);
      }
    };

    // Agregar listener para cambios del sistema
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemThemeChange);
    } else {
      // Fallback para navegadores más antiguos
      mediaQuery.addListener(handleSystemThemeChange);
    }

    // Cleanup
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleSystemThemeChange);
      } else {
        // Fallback para navegadores más antiguos
        mediaQuery.removeListener(handleSystemThemeChange);
      }
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) return; // No aplicar cambios hasta que esté hidratado
    
    try {
      const root = window.document.documentElement;
      
      // Aplicar tema con transición suave
      if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      
      // Guardar en localStorage
      localStorage.setItem('theme', theme);
    } catch (error) {
      // localStorage or document not available (e.g., in tests)
      console.warn('Could not update theme:', error);
    }
  }, [theme, isHydrated]);

  const toggleTheme = () => {
    setThemeState(prev => prev === 'light' ? 'dark' : 'light');
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, isHydrated }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
