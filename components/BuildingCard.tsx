"use client";
import Image from "next/image";
import Link from "next/link";
import { PromotionBadge } from "@components/PromotionBadge";
import { formatPrice } from "@lib/utils";
import type { Building } from "@schemas/models";
import { track } from "@lib/analytics";

type CardProps = {
  building: Building & { precioDesde: number | null };
  priority?: boolean;
  showBadge?: boolean;
};

const DEFAULT_BLUR =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTYnIGhlaWdodD0nMTAnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+PHJlY3Qgd2lkdGg9JzE2JyBoZWlnaHQ9JzEwJyBmaWxsPSIjMjIyMjIyIi8+PC9zdmc+";

export function BuildingCard({ building, priority = false, showBadge = true }: CardProps) {
  const cover = building.gallery?.[1] ?? building.gallery?.[0] ?? "/images/nunoa-cover.jpg";
  const href = `/propiedad/${building.slug}`;
  const handleClick = () => {
    track("property_view", {
      property_id: building.id,
      property_name: building.name,
    });
  };
  const precioDesde = building.precioDesde ?? Math.min(...building.units.map((u) => u.price));

  return (
    <Link
      href={href}
      onClick={handleClick}
      aria-label={`Ver propiedad ${building.name} en ${building.comuna}`}
      className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] rounded-2xl"
    >
      <article className="rounded-2xl bg-[var(--soft)]/90 ring-1 ring-white/10 overflow-hidden transition-all group-hover:ring-[var(--ring)]/60">
        <div className="relative aspect-[16/10]">
          <Image
            src={cover}
            alt={`Portada ${building.name}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1536px) 25vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            placeholder="blur"
            blurDataURL={DEFAULT_BLUR}
            priority={priority}
          />
          {showBadge && (
            <div className="absolute top-3 left-3">
              <PromotionBadge />
            </div>
          )}
        </div>
        <div className="p-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-semibold leading-tight truncate" title={building.name}>
              {building.name}
            </h3>
            <p className="text-[13px] text-[var(--subtext)] truncate">{building.comuna}</p>
          </div>
          <div className="text-right shrink-0">
            <div className="font-bold">{formatPrice(precioDesde)}</div>
            <div className="text-[12px] text-[var(--subtext)]">Desde</div>
          </div>
        </div>
      </article>
    </Link>
  );
}


