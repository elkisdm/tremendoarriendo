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
  Shirt
} from "lucide-react";

// Map amenities to appropriate icons
const amenityIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "Piscina": Waves,
  "Gimnasio": Dumbbell,
  "Quinchos": UtensilsCrossed,
  "Quincho": UtensilsCrossed,
  "Cowork": Wifi,
  "Estacionamiento": Car,
  "Estacionamientos": Car,
  "Conserjería": Shield,
  "Conserjería 24/7": Shield,
  "Seguridad": Shield,
  "Áreas verdes": Trees,
  "Areas verdes": Trees,
  "Juegos infantiles": Baby,
  "Sala de eventos": Users,
  "Sala multiuso": Users,
  "Lavandería": Shirt,
  "Bicicleteros": Car,
};

function getAmenityIcon(amenity: string) {
  const IconComponent = amenityIconMap[amenity] || Sparkles;
  return IconComponent;
}

export function AmenityList({ items }: { items?: string[] }) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-3">
      {items.map((amenity) => {
        const IconComponent = getAmenityIcon(amenity);
        return (
          <div
            key={amenity}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm bg-white/5 ring-1 ring-white/10 transition-colors hover:bg-white/10"
          >
            <IconComponent className="w-4 h-4 text-[var(--ring)]" aria-hidden="true" />
            <span>{amenity}</span>
          </div>
        );
      })}
    </div>
  );
}
