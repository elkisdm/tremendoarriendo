"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import ArriendaSinComisionBuildingCard from "./ArriendaSinComisionBuildingCard";
import type { BuildingSummary } from "@/hooks/useFetchBuildings";

interface LazyBuildingsGridProps {
  initialBuildings: BuildingSummary[];
  hasMore: boolean;
  total: number;
}

export function LazyBuildingsGrid({ initialBuildings, hasMore, total }: LazyBuildingsGridProps) {
  const [buildings, setBuildings] = useState<BuildingSummary[]>(initialBuildings);
  const [loading, setLoading] = useState(false);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    try {
      // Simular carga de más edificios (en este caso no hay más)
      await new Promise(resolve => setTimeout(resolve, 1000));
      setBuildings(prev => [...prev]);
    } catch (error) {
      console.error("Error loading more buildings:", error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore]);

  // Si solo hay un edificio, centrarlo
  if (total === 1) {
    return (
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ArriendaSinComisionBuildingCard building={buildings[0]} />
        </motion.div>
        
        {/* Mensaje especial para un solo edificio */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-2xl border border-blue-200 dark:border-blue-800"
        >
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
            🎯 Edificio Destacado
          </h3>
          <p className="text-blue-700 dark:text-blue-300 text-sm">
            Este es nuestro edificio más popular con las mejores promociones. 
            ¡No te pierdas esta oportunidad única!
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Grid de edificios */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {buildings.map((building, index) => (
          <motion.div
            key={building.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <ArriendaSinComisionBuildingCard building={building} />
          </motion.div>
        ))}
      </motion.div>

      {/* Botón de cargar más */}
      {hasMore && (
        <div className="text-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Cargando...
              </>
            ) : (
              <>
                Cargar más edificios
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </>
            )}
          </button>
        </div>
      )}

      {/* Mensaje cuando no hay más edificios */}
      {!hasMore && total > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <p className="text-muted-foreground">
            Has visto todos los {total} edificios disponibles
          </p>
        </motion.div>
      )}
    </div>
  );
}

