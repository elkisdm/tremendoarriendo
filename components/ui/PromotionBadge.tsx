import { BadgePercent } from "lucide-react";

export function PromotionBadge({ label = "0% Comisión", tag }: { label?: string; tag?: string }){
  return (
    <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold bg-white/5 ring-1 ring-white/10 backdrop-blur" aria-label={`${label}${tag ? ` - ${tag}` : ""}`}>
      <BadgePercent className="w-4 h-4" aria-hidden />
      <span>{label}</span>
      {tag && <span className="text-[11px] text-[var(--subtext)]">{tag}</span>}
    </div>
  );
}
