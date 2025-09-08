"use client";
import React, { useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { BuildingCard } from "../BuildingCard";
import { BuildingCardV2 } from "../ui/BuildingCardV2";
import { BuildingCardSkeleton } from "../ui/BuildingCardSkeleton";
import { useVirtualGrid } from "../../hooks/useVirtualGrid";
import { type BuildingSummary } from "../../hooks/useFetchBuildings";
import { CARD_V2 } from "@lib/flags";
import { Building } from "@types";

interface VirtualResultsGridProps {
  items: BuildingSummary[];
  isLoading: boolean;
  error?: Error | null;
  onResultsChange?: (count: number) => void;
  className?: string;
}

// Adapter function (reutilizada de ResultsGrid)
function adaptBuildingSummaryToBuilding(buildingSummary: BuildingSummary): Building {
  const syntheticUnits = buildingSummary.typologySummary?.map((typology, index) => ({
    id: `${buildingSummary.id}-unit-${index}`,
    tipologia: typology.key,
    price: typology.minPrice || buildingSummary.precioDesde,
    m2: typology.minM2 || 40,
    estacionamiento: false,
    bodega: false,
    disponible: true
  })) || [];

  return {
    id: buildingSummary.id,
    slug: buildingSummary.slug,
    name: buildingSummary.name,
    comuna: buildingSummary.comuna,
    address: buildingSummary.address,
    coverImage: buildingSummary.coverImage ?? buildingSummary.gallery?.[0] ?? "/images/nunoa-cover.jpg",
    gallery: buildingSummary.gallery,
    units: syntheticUnits,
    amenities: [],
    badges: buildingSummary.badges || []
  };
}

// Componente individual de celda para react-window
interface GridCellProps {
  columnIndex: number;
  rowIndex: number;
  style: React.CSSProperties;
  data: {
    items: BuildingSummary[];
    getItemIndex: (rowIndex: number, columnIndex: number) => number;
    getItemData: (itemIndex: number) => BuildingSummary | undefined;
    dimensions: unknown;
  };
}

const GridCell = React.memo<GridCellProps>(({ columnIndex, rowIndex, style, data }) => {
  const { getItemIndex, getItemData } = data;
  const itemIndex = getItemIndex(rowIndex, columnIndex);
  const building = getItemData(itemIndex);

  // Si no hay building en esta posición, renderizar espacio vacío
  if (!building) {
    return <div style={style} />;
  }

  // Ajustar style para incluir gap
  const cellStyle: React.CSSProperties = {
    ...style,
    padding: '0 12px 24px 0', // gap-6 = 24px, dividido entre top-left y bottom-right
    boxSizing: 'border-box'
  };

  return (
    <div style={cellStyle}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: itemIndex * 0.05 }} // Stagger animation
        className="h-full"
      >
        {CARD_V2 ? (
          <BuildingCardV2
            building={adaptBuildingSummaryToBuilding(building)}
            priority={itemIndex === 0}
            showBadge={true}
            className="h-full"
          />
        ) : (
          <BuildingCard
            building={building}
            priority={itemIndex === 0}
          />
        )}
      </motion.div>
    </div>
  );
});

GridCell.displayName = 'GridCell';

export function VirtualResultsGrid({
  items = [],
  isLoading,
  error,
  onResultsChange,
  className = ""
}: VirtualResultsGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Configurar virtual grid
  const {
    dimensions,
    FixedSizeGrid,
    gridProps,
    getItemIndex,
    getItemData,
    isVirtualizationActive
  } = useVirtualGrid({
    items,
    containerRef,
    overscan: 2, // Renderizar 2 filas/columnas extra fuera del viewport
    enableVirtualization: true
  });

  // Notificar cambios en el conteo de resultados
  React.useEffect(() => {
    if (onResultsChange && !isLoading) {
      onResultsChange(items.length);
    }
  }, [items.length, isLoading, onResultsChange]);

  // Datos para pasar a las celdas
  const itemData = useMemo(() => ({
    items,
    getItemIndex,
    getItemData,
    dimensions
  }), [items, getItemIndex, getItemData, dimensions]);

  // Estados de carga y error
  if (isLoading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 ${className}`}>
        {Array.from({ length: 8 }).map((_, idx) => (
          <BuildingCardSkeleton key={`skeleton-${idx}`} />
        ))}
      </div>
    );
  }

  if (error) {
    throw error; // Dejar que el error boundary lo maneje
  }

  // Estado vacío
  if (items.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-[var(--subtext)] mb-2">No se encontraron propiedades</div>
        <div className="text-sm text-[var(--subtext)]">
          Intenta ajustar tus filtros de búsqueda
        </div>
      </div>
    );
  }

  // Fallback: Si virtualización no está activa o no está disponible, usar grid normal
  if (!isVirtualizationActive || !FixedSizeGrid) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 ${className}`}>
        {items.map((building: BuildingSummary, idx: number) => (
          <motion.div
            key={building.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
          >
            {CARD_V2 ? (
              <BuildingCardV2
                building={adaptBuildingSummaryToBuilding(building)}
                priority={idx === 0}
                showBadge={true}
              />
            ) : (
              <BuildingCard
                building={building}
                priority={idx === 0}
              />
            )}
          </motion.div>
        ))}
      </div>
    );
  }

  // Grid virtualizado
  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {FixedSizeGrid && (
        <div>
          {(FixedSizeGrid as any)(
            {
              ...gridProps,
              itemData,
              children: GridCell
            }
          )}
        </div>
      )}
    </div>
  );
}

// Componente wrapper que mantiene compatibilidad con la API actual
interface VirtualResultsWrapperProps {
  filters: unknown;
  sort: string;
  onResultsChange: (count: number) => void;
  useFetchBuildings: (params: unknown) => {
    data: BuildingSummary[];
    isLoading: boolean;
    isFetching: boolean;
    error: Error | null;
  };
}

export function VirtualResultsWrapper({
  filters,
  sort,
  onResultsChange,
  useFetchBuildings
}: VirtualResultsWrapperProps) {
  const { data: buildings = [], isLoading, isFetching, error } = useFetchBuildings({
    filters,
    sort
  });

  return (
    <VirtualResultsGrid
      items={buildings}
      isLoading={isLoading || isFetching}
      error={error}
      onResultsChange={onResultsChange}
    />
  );
}

export default VirtualResultsGrid;
