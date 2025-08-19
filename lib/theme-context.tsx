'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  isHydrated: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Solo ejecutar en el cliente después de la hidratación
    try {
      const savedTheme = localStorage.getItem('theme') as Theme;
      if (savedTheme === 'dark' || savedTheme === 'light') {
        setThemeState(savedTheme);
      } else {
        // Si no hay tema guardado, usar el que ya está aplicado en el DOM
        const html = document.documentElement;
        if (html.classList.contains('dark')) {
          setThemeState('dark');
        } else {
          setThemeState('light');
        }
      }
    } catch (error) {
      console.warn('Error reading theme from localStorage:', error);
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    
    const root = window.document.documentElement;
    
    // Solo aplicar la clase si es diferente a la actual para evitar conflictos
    if (!root.classList.contains(theme)) {
      // Remover todas las clases de tema existentes
      root.classList.remove('dark', 'light');
      
      // Aplicar la clase del tema actual
      root.classList.add(theme);
    }
    
    try {
      localStorage.setItem('theme', theme);
    } catch (error) {
      console.warn('Error saving theme to localStorage:', error);
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
