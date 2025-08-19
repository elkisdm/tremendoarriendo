"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ImageGallery } from "@components/gallery/ImageGallery";
import { AmenityList } from "@components/ui/AmenityList";
import { PromotionBadge } from "@components/ui/PromotionBadge";

// Función local para obtener el badge principal
function getPrimaryBadge(badges?: Array<{ label: string; tag?: string; type: string }>) {
  if (!badges || badges.length === 0) return null;
  return badges[0]; // Retornar el primer badge como principal
}

// Interfaz para datos del CSV
interface CSVUnit {
  op: string;
  unidad: string;
  tipologia: string;
  precio: number;
  m2: number;
  orientacion: string;
  estacionamiento: number;
  bodega: number;
  gc: number;
  aceptaMascotas: boolean;
  estado: string;
  especial: boolean;
  tremendaPromo: boolean;
  descuento: number;
  mesesDescuento: number;
  linkListing: string;
}

interface BuildingForArriendaSinComision {
  id: string;
  slug: string;
  name: string;
  comuna: string;
  address: string;
  coverImage: string;
  gallery: string[];
  precioDesde: number;
  precioHasta: number;
  precioPromedio: number;
  hasAvailability: boolean;
  totalUnidades: number;
  unidadesDisponibles: number;
  badges: Array<{ label: string; tag?: string; type: string }>;
  amenities: string[];
  tipologias: string[];
  unidades: CSVUnit[];
  selectedTypology?: string | null;
}

interface ArriendaSinComisionBuildingDetailProps {
  building: BuildingForArriendaSinComision;
}

export default function ArriendaSinComisionBuildingDetail({ building }: ArriendaSinComisionBuildingDetailProps) {
  const [selectedTypology, setSelectedTypology] = useState<string | null>(
    building.selectedTypology || null
  );
  
  const primaryBadge = getPrimaryBadge(building.badges);
  
  // Usar datos del CSV para unidades disponibles
  const availableUnits = building.unidades.filter(unit => 
    !unit.estado || unit.estado.toLowerCase() === 'disponible'
  );
  
  // Agrupar unidades por tipología usando datos del CSV
  const typologyGroups = availableUnits.reduce((acc, unit) => {
    const key = unit.tipologia;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(unit);
    return acc;
  }, {} as Record<string, typeof availableUnits>);
  
  // Obtener tipologías disponibles
  const availableTypologies = Object.keys(typologyGroups);
  
  // Obtener unidades de la tipología seleccionada
  const selectedUnits = selectedTypology ? typologyGroups[selectedTypology] || [] : [];
  
  // Obtener la unidad más económica de la tipología seleccionada usando datos del CSV
  const cheapestUnit = selectedUnits.length > 0 
    ? selectedUnits.reduce((min, unit) => unit.precio < min.precio ? unit : min)
    : null;

  const formatPrice = (price: number): string => {
    if (price >= 1_000_000) {
      const millions = price / 1_000_000;
      return `$${millions.toFixed(0)}M`;
    }
    return `$${price.toLocaleString('es-CL')}`;
  };

  const formatTypologyLabel = (tipology: string): string => {
    const mapping: Record<string, string> = {
      'Studio': 'Studio',
      '1D1B': '1 Dormitorio, 1 Baño',
      '2D1B': '2 Dormitorios, 1 Baño',
      '2D2B': '2 Dormitorios, 2 Baños',
      '3D2B': '3 Dormitorios, 2 Baños',
    };
    return mapping[tipology] || tipology;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link 
            href="/arrienda-sin-comision"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Volver a edificios
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Información del edificio */}
          <div className="flex-1">
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{building.name}</h1>
                <p className="text-lg text-muted-foreground mb-2">{building.comuna}</p>
                <p className="text-sm text-muted-foreground">{building.address}</p>
              </div>
              {primaryBadge && (
                <PromotionBadge
                  label={primaryBadge.label}
                  tag={primaryBadge.tag}
                />
              )}
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-card rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{formatPrice(building.precioDesde)}</div>
                <div className="text-sm text-muted-foreground">Desde</div>
              </div>
              <div className="bg-card rounded-lg p-4 text-center">
                <div className="text-2xl font-bold">{building.unidadesDisponibles}</div>
                <div className="text-sm text-muted-foreground">Disponibles</div>
              </div>
              <div className="bg-card rounded-lg p-4 text-center">
                <div className="text-2xl font-bold">{building.totalUnidades}</div>
                <div className="text-sm text-muted-foreground">Total</div>
              </div>
              <div className="bg-card rounded-lg p-4 text-center">
                <div className="text-2xl font-bold">{building.tipologias.length}</div>
                <div className="text-sm text-muted-foreground">Tipologías</div>
              </div>
            </div>

            {/* Amenities */}
            {building.amenities && building.amenities.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Amenities</h3>
                <AmenityList items={building.amenities} />
              </div>
            )}
          </div>

          {/* Imagen de portada */}
          <div className="lg:w-96">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <Image
                src={building.coverImage}
                alt={`Portada ${building.name}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 384px"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Galería de imágenes */}
      {building.gallery && building.gallery.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Galería</h3>
          <ImageGallery images={building.gallery} />
        </div>
      )}

      {/* Selector de tipología */}
      {availableTypologies.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Seleccionar Tipología</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableTypologies.map((typology) => {
              const units = typologyGroups[typology];
              const minPrice = Math.min(...units.map(u => u.precio));
              const isSelected = selectedTypology === typology;
              
              return (
                <button
                  key={typology}
                  onClick={() => setSelectedTypology(typology)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'border-green-500 bg-green-50 dark:bg-green-950'
                      : 'border-border hover:border-green-300'
                  }`}
                >
                  <div className="text-left">
                    <h4 className="font-semibold mb-1">{formatTypologyLabel(typology)}</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      {units.length} unidad{units.length !== 1 ? 'es' : ''} disponible{units.length !== 1 ? 's' : ''}
                    </p>
                    <p className="text-lg font-bold text-green-600">{formatPrice(minPrice)}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Unidad seleccionada */}
      {cheapestUnit && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">
            Unidad más económica - {formatTypologyLabel(selectedTypology!)}
          </h3>
          <div className="bg-card rounded-2xl p-6 border border-border">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Departamento {cheapestUnit.unidad}</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="text-muted-foreground">Precio:</span> {formatPrice(cheapestUnit.precio)}</p>
                  <p><span className="text-muted-foreground">m²:</span> {cheapestUnit.m2}</p>
                  <p><span className="text-muted-foreground">Orientación:</span> {cheapestUnit.orientacion}</p>
                  <p><span className="text-muted-foreground">Estacionamiento:</span> {cheapestUnit.estacionamiento}</p>
                  <p><span className="text-muted-foreground">Bodega:</span> {cheapestUnit.bodega}</p>
                  <p><span className="text-muted-foreground">Gastos comunes:</span> {formatPrice(cheapestUnit.gc)}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Promociones</h4>
                <div className="space-y-2">
                  {cheapestUnit.especial && (
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      Oferta Especial
                    </span>
                  )}
                  {cheapestUnit.tremendaPromo && (
                    <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                      Tremenda Promo
                    </span>
                  )}
                  {cheapestUnit.descuento > 0 && (
                    <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      {cheapestUnit.descuento}% Descuento
                    </span>
                  )}
                  {cheapestUnit.aceptaMascotas && (
                    <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                      Pet Friendly
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col justify-end">
                <Link
                  href={cheapestUnit.linkListing || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Ver detalles
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lista de todas las unidades de la tipología */}
      {selectedUnits.length > 1 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">
            Todas las unidades - {formatTypologyLabel(selectedTypology!)}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedUnits.map((unit) => (
              <div key={unit.op} className="bg-card rounded-lg p-4 border border-border">
                <h4 className="font-semibold mb-2">Departamento {unit.unidad}</h4>
                <div className="space-y-1 text-sm">
                  <p><span className="text-muted-foreground">Precio:</span> {formatPrice(unit.precio)}</p>
                  <p><span className="text-muted-foreground">m²:</span> {unit.m2}</p>
                  <p><span className="text-muted-foreground">Orientación:</span> {unit.orientacion}</p>
                  {unit.descuento > 0 && (
                    <p className="text-green-600 font-semibold">{unit.descuento}% Descuento</p>
                  )}
                </div>
                <Link
                  href={unit.linkListing || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-green-700 transition-colors mt-3 w-full"
                >
                  Ver detalles
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
