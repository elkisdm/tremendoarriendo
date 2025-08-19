"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { BuildingSummary } from "@/hooks/useFetchBuildings";

interface ArriendaSinComisionBuildingCardProps {
  building: BuildingSummary;
  priority?: boolean;
}

export default function ArriendaSinComisionBuildingCard({ building, priority = false }: ArriendaSinComisionBuildingCardProps) {
  const [selectedTypology, setSelectedTypology] = useState<string | null>(null);
  const [showTypologySelector, setShowTypologySelector] = useState(false);
  
  const cover = building.coverImage ?? building.gallery?.[0] ?? "/images/nunoa-cover.jpg";
  
  const formatPrice = (price: number): string => {
    if (price >= 1_000_000) {
      const millions = price / 1_000_000;
      return `$${millions.toFixed(0)}M`;
    }
    return `$${price.toLocaleString('es-CL')}`;
  };

  const handleTypologySelect = (typology: string) => {
    setSelectedTypology(typology);
    setShowTypologySelector(false);
    // Navegar a la página de detalle con la tipología seleccionada
    const href = `/arrienda-sin-comision/${building.slug}?tipologia=${typology}`;
    window.location.href = href;
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Si hay múltiples tipologías, mostrar selector en lugar de navegar directamente
    if (building.typologySummary && building.typologySummary.length > 1) {
      e.preventDefault();
      setShowTypologySelector(true);
    }
  };

  return (
    <div className="relative">
      <div
        onClick={handleCardClick}
        className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-2xl cursor-pointer"
      >
        <article className="rounded-2xl bg-card/90 ring-1 ring-border overflow-hidden transition-all group-hover:ring-green-500/60">
          <div className="relative aspect-[16/10]">
            <Image
              src={cover}
              alt={`Portada ${building.name}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1536px) 25vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              priority={priority}
            />
            {building.badges && building.badges.length > 0 && (
              <div className="absolute top-3 left-3">
                <div className="inline-flex items-center gap-1 rounded-full bg-green-500/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                  <span className="flex h-1.5 w-1.5 items-center justify-center">
                    <span className="absolute h-1.5 w-1.5 animate-ping rounded-full bg-white opacity-75" />
                    <span className="relative h-1 w-1 rounded-full bg-white" />
                  </span>
                  {building.badges[0].label}
                </div>
              </div>
            )}
            
            {/* Indicador de múltiples tipologías */}
            {building.typologySummary && building.typologySummary.length > 1 && (
              <div className="absolute top-3 right-3">
                <div className="inline-flex items-center gap-1 rounded-full bg-blue-500/90 px-2 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                  <span className="text-xs">📋</span>
                  <span>{building.typologySummary.length} tipos</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="p-4">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold leading-tight truncate" title={building.name}>
                  {building.name}
                </h3>
                <p className="text-sm text-muted-foreground truncate">{building.comuna}</p>
              </div>
              <div className="text-right shrink-0">
                {building.hasAvailability ? (
                  <>
                    <div className="font-bold text-green-500">{formatPrice(building.precioDesde)}</div>
                    <div className="text-xs text-muted-foreground">Desde</div>
                  </>
                ) : (
                  <>
                    <div className="text-sm text-muted-foreground">Sin disponibilidad</div>
                  </>
                )}
              </div>
            </div>
            
            {/* Tipologías disponibles */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {building.typologySummary?.slice(0, 3).map((typology) => (
                <span
                  key={typology.key}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-muted text-muted-foreground"
                >
                  {typology.label}
                </span>
              ))}
              {building.typologySummary && building.typologySummary.length > 3 && (
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-muted text-muted-foreground">
                  +{building.typologySummary.length - 3} más
                </span>
              )}
            </div>
            
            {/* Botón de acción */}
            <div className="flex gap-2">
              {building.typologySummary && building.typologySummary.length > 1 ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowTypologySelector(true);
                  }}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors"
                >
                  Seleccionar tipología
                </button>
              ) : (
                <Link
                  href={`/arrienda-sin-comision/${building.slug}`}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors text-center"
                >
                  Ver detalles
                </Link>
              )}
            </div>
          </div>
        </article>
      </div>
      
      {/* Modal selector de tipología */}
      {showTypologySelector && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Selecciona una tipología</h3>
              <button
                onClick={() => setShowTypologySelector(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-3">
              {building.typologySummary?.map((typology) => (
                <button
                  key={typology.key}
                  onClick={() => handleTypologySelect(typology.key)}
                  className="w-full text-left p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{typology.label}</div>
                      <div className="text-sm text-gray-500">
                        {typology.count} {typology.count === 1 ? 'unidad' : 'unidades'} disponible{typology.count === 1 ? '' : 's'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-500">
                        {formatPrice(typology.minPrice)}
                      </div>
                      <div className="text-xs text-gray-500">Desde</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowTypologySelector(false)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <Link
                href={`/arrienda-sin-comision/${building.slug}`}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg text-center transition-colors"
              >
                Ver todas
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

