"use client";

import { useState, useEffect } from "react";
import MotionWrapper from "@/components/ui/MotionWrapper";

interface StatsData {
  totalBuildings: number;
  totalUnits: number;
  availableUnits: number;
  averagePrice: number;
  comunas: string[];
  tipologias: string[];
}

export default function ArriendaSinComisionStats() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/arrienda-sin-comision?limit=100');
        const data = await response.json();
        
        if (data.success && data.buildings) {
          const buildings = data.buildings;
          const totalBuildings = buildings.length;
          const totalUnits = buildings.reduce((sum: number, b: any) => 
            sum + (b.typologySummary?.reduce((s: number, t: any) => s + t.count, 0) || 0), 0
          );
          const availableUnits = buildings.reduce((sum: number, b: any) => 
            sum + (b.typologySummary?.reduce((s: number, t: any) => s + t.count, 0) || 0), 0
          );
          const averagePrice = buildings.reduce((sum: number, b: any) => sum + b.precioDesde, 0) / totalBuildings;
          const comunas = [...new Set(buildings.map((b: any) => b.comuna))];
          const tipologias = [...new Set(buildings.flatMap((b: any) => 
            b.typologySummary?.map((t: any) => t.key) || []
          ))];

          setStats({
            totalBuildings,
            totalUnits,
            availableUnits,
            averagePrice,
            comunas,
            tipologias
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatPrice = (price: number): string => {
    if (price >= 1_000_000) {
      const millions = price / 1_000_000;
      return `$${millions.toFixed(0)}M`;
    }
    return `$${price.toLocaleString('es-CL')}`;
  };

  if (loading) {
    return (
      <section className="px-6 py-12 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-card rounded-2xl p-6 animate-pulse">
                <div className="h-8 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!stats) return null;

  return (
    <section className="px-6 py-12 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <MotionWrapper direction="up" delay={0.1}>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Estadísticas del Mercado
            </h2>
            <p className="mt-2 text-muted-foreground">
              Datos actualizados de departamentos disponibles
            </p>
          </div>
        </MotionWrapper>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <MotionWrapper direction="up" delay={0.2}>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-2xl p-6 text-center ring-1 ring-green-200/50 dark:ring-green-800/50">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                {stats.totalBuildings}
              </div>
              <div className="text-sm text-muted-foreground">
                Edificios Disponibles
              </div>
            </div>
          </MotionWrapper>

          <MotionWrapper direction="up" delay={0.3}>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-2xl p-6 text-center ring-1 ring-blue-200/50 dark:ring-blue-800/50">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {stats.availableUnits}
              </div>
              <div className="text-sm text-muted-foreground">
                Unidades Disponibles
              </div>
            </div>
          </MotionWrapper>

          <MotionWrapper direction="up" delay={0.4}>
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 rounded-2xl p-6 text-center ring-1 ring-purple-200/50 dark:ring-purple-800/50">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                {formatPrice(stats.averagePrice)}
              </div>
              <div className="text-sm text-muted-foreground">
                Precio Promedio
              </div>
            </div>
          </MotionWrapper>

          <MotionWrapper direction="up" delay={0.5}>
            <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 rounded-2xl p-6 text-center ring-1 ring-orange-200/50 dark:ring-orange-800/50">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                {stats.comunas.length}
              </div>
              <div className="text-sm text-muted-foreground">
                Comunas Cubiertas
              </div>
            </div>
          </MotionWrapper>
        </div>

        {/* Información adicional */}
        <MotionWrapper direction="up" delay={0.6}>
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card rounded-2xl p-6 ring-1 ring-border">
              <h3 className="font-semibold mb-3">Comunas Disponibles</h3>
              <div className="flex flex-wrap gap-2">
                {stats.comunas.slice(0, 8).map((comuna) => (
                  <span
                    key={comuna}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground"
                  >
                    {comuna}
                  </span>
                ))}
                {stats.comunas.length > 8 && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                    +{stats.comunas.length - 8} más
                  </span>
                )}
              </div>
            </div>

            <div className="bg-card rounded-2xl p-6 ring-1 ring-border">
              <h3 className="font-semibold mb-3">Tipologías Disponibles</h3>
              <div className="flex flex-wrap gap-2">
                {stats.tipologias.map((tipologia) => (
                  <span
                    key={tipologia}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                  >
                    {tipologia}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </MotionWrapper>
      </div>
    </section>
  );
}
