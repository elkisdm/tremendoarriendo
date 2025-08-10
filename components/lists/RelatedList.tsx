import { BuildingCard } from "@components/BuildingCard";
import type { Building } from "@schemas/models";
import type { BuildingSummary } from "@hooks/useFetchBuildings";

type RelatedListProps = {
  buildings: (Building & { precioDesde: number | null })[];
};

// Convert Building to BuildingSummary for card compatibility
function toBuildingSummary(building: Building & { precioDesde: number | null }): BuildingSummary {
  const availableUnits = building.units.filter((u) => u.disponible);
  const hasAvailability = availableUnits.length > 0;
  
  return {
    id: building.id,
    slug: building.slug,
    name: building.name,
    comuna: building.comuna,
    address: building.address,
    gallery: building.gallery,
    coverImage: building.coverImage,
    badges: building.badges,
    serviceLevel: building.serviceLevel,
    precioDesde: building.precioDesde || 0,
    precioRango: building.precioRango,
    hasAvailability,
    typologySummary: building.typologySummary,
  };
}

export function RelatedList({ buildings }: RelatedListProps) {
  if (!buildings || buildings.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-[var(--subtext)]">No hay propiedades relacionadas disponibles.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {buildings.map((building) => (
        <BuildingCard 
          key={building.id} 
          building={toBuildingSummary(building)} 
          showBadge={true}
        />
      ))}
    </div>
  );
}
