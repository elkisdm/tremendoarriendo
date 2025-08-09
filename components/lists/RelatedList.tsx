import { BuildingCard } from "@components/BuildingCard";
import type { Building } from "@schemas/models";

type RelatedListProps = {
  buildings: (Building & { precioDesde: number | null })[];
};

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
          building={building} 
          showBadge={true}
        />
      ))}
    </div>
  );
}
