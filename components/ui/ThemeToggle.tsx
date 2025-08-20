"use client";

import { useTheme } from "@/lib/theme-context";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { theme, toggleTheme, isHydrated } = useTheme();

  // No renderizar hasta que esté hidratado para evitar hydration mismatch
  if (!isHydrated) {
    return (
      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
    );
  }

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center transition-colors duration-200 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
      whileTap={{ scale: 0.95 }}
      aria-label={`Cambiar a tema ${theme === 'light' ? 'oscuro' : 'claro'}`}
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'light' ? 0 : 180 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        {theme === 'light' ? (
          <Sun className="w-5 h-5 text-yellow-500" />
        ) : (
          <Moon className="w-5 h-5 text-blue-400" />
        )}
      </motion.div>
      
      {/* Indicador de estado */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-transparent"
        initial={false}
        animate={{
          borderColor: theme === 'light' ? 'transparent' : 'rgba(59, 130, 246, 0.3)',
        }}
        transition={{ duration: 0.2 }}
      />
    </motion.button>
  );
}
