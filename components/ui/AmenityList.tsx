import { 
  Waves, 
  Dumbbell, 
  UtensilsCrossed, 
  Wifi, 
  Car, 
  Shield, 
  Trees, 
  Baby, 
  Sparkles,
  Users,
  Shirt,
  Bike
} from "lucide-react";
import type { InternalAmenityKey } from "@lib/adapters/constants";

// Map internal amenity keys to appropriate icons
const amenityIconMap: Record<InternalAmenityKey, React.ComponentType<{ className?: string }>> = {
  "piscina": Waves,
  "gimnasio": Dumbbell,
  "quinchos": UtensilsCrossed,
  "cowork": Wifi,
  "estacionamiento": Car,
  "conserjeria": Shield,
  "seguridad": Shield,
  "areas_verdes": Trees,
  "juegos_infantiles": Baby,
  "sala_eventos": Users,
  "sala_multiuso": Users,
  "lavanderia": Shirt,
  "bicicleteros": Bike,
};

// Display labels for internal keys
const amenityDisplayLabels: Record<InternalAmenityKey, string> = {
  "piscina": "Piscina",
  "gimnasio": "Gimnasio", 
  "quinchos": "Quinchos",
  "cowork": "Cowork",
  "estacionamiento": "Estacionamiento",
  "conserjeria": "Conserjería",
  "seguridad": "Seguridad",
  "areas_verdes": "Áreas verdes",
  "juegos_infantiles": "Juegos infantiles",
  "sala_eventos": "Sala de eventos",
  "sala_multiuso": "Sala multiuso",
  "lavanderia": "Lavandería",
  "bicicleteros": "Bicicleteros",
};

function getAmenityIcon(amenity: string): React.ComponentType<{ className?: string }> {
  // Try to match as internal key first
  const IconComponent = amenityIconMap[amenity as InternalAmenityKey];
  return IconComponent || Sparkles;
}

function getAmenityLabel(amenity: string): string {
  // Try to get display label for internal key, otherwise use the amenity string as-is
  return amenityDisplayLabels[amenity as InternalAmenityKey] || amenity;
}

export function AmenityList({ items }: { items?: string[] }) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-3">
      {items.map((amenity) => {
        const IconComponent = getAmenityIcon(amenity);
        const displayLabel = getAmenityLabel(amenity);
        return (
          <div
            key={amenity}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm bg-white/5 ring-1 ring-white/10 transition-colors hover:bg-white/10"
          >
            <IconComponent className="w-4 h-4 text-[var(--ring)]" aria-hidden="true" />
            <span>{displayLabel}</span>
          </div>
        );
      })}
    </div>
  );
}
