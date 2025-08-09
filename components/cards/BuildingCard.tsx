"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Bed, Bath, Maximize2, MapPin, Heart } from "lucide-react";
import { PromotionBadge } from "@components/ui/PromotionBadge";
import { AmenityList } from "@components/ui/AmenityList";
import { currency, clx } from "@lib/utils";
import type { Building } from "@schemas/models";
import { track } from "@lib/analytics";

type CardBuilding = Building & { slug?: string; promo?: { label: string; tag?: string }; cover?: string; minPrice?: number; precioDesde?: number | null };

export function BuildingCard({ building }: { building: CardBuilding }){
  const minPrice = building.minPrice ?? building.precioDesde ?? Math.min(...building.units.map((u) => u.price));
  const imageSrc = building.cover ?? building.gallery?.[0] ?? "/images/nunoa-cover.jpg";
  const href = `/propiedad/${building.slug ?? building.id}`;
  const handleClick = () => {
    track("property_view", {
      property_id: building.id,
      property_name: building.name,
    });
  };
  return (
    <motion.div layout whileHover={{ y: -4 }} className="group rounded-2xl bg-[var(--soft)]/90 ring-1 ring-white/10 overflow-hidden hover:ring-[var(--ring)]/60 transition-all">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img src={imageSrc} alt={`Portada ${building.name}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        <div className="absolute top-3 left-3">
          <PromotionBadge label={building.promo?.label} tag={building.promo?.tag} />
        </div>
        <button className="absolute top-3 right-3 inline-flex items-center justify-center w-9 h-9 rounded-full bg-black/40 ring-1 ring-white/20 backdrop-blur hover:bg-black/60" aria-label="Marcar como favorito" aria-pressed="false">
          <Heart className="w-4 h-4" aria-hidden />
        </button>
      </div>
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-white font-semibold leading-tight truncate" title={building.name}>{building.name}</h3>
            <div className="text-[13px] text-[var(--subtext)] flex items-center gap-1 truncate"><MapPin className="w-3.5 h-3.5" aria-hidden /> {building.comuna} · {building.address}</div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-white font-bold">{currency(minPrice)}</div>
            <div className="text-[12px] text-[var(--subtext)]">Desde / mes</div>
          </div>
        </div>
        <AmenityList items={building.amenities?.slice(0, 3)} />
        <div className="flex items-center justify-between pt-1">
          <div className="hidden sm:flex items-center gap-3 text-[12px] text-[var(--subtext)]">
            <span className="inline-flex items-center gap-1"><Bed className="w-4 h-4" aria-hidden/>Varías tipologías</span>
            <span className="inline-flex items-center gap-1"><Bath className="w-4 h-4" aria-hidden/>1-2 baños</span>
            <span className="inline-flex items-center gap-1"><Maximize2 className="w-4 h-4" aria-hidden/>28–55 m²</span>
          </div>
          <Link href={href} className="inline-flex" onClick={handleClick}>
            <button className="group relative inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(109,74,255,.35)] bg-[radial-gradient(120%_120%_at_30%_10%,#8B6CFF_0%,#6D4AFF_40%,#5233D3_100%)] ring-1 ring-[var(--ring)] hover:brightness-110 active:scale-[.98]">
              Ver detalles
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
