import { BadgePercent } from "lucide-react";

export function PromotionBadge({ label = "0% Comisión", tag = "Promo" }: { label?: string; tag?: string }){
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-[var(--soft)]/90 ring-1 ring-white/10 px-3 py-1 text-xs text-white">
      <BadgePercent className="w-4 h-4" aria-hidden />
      <span className="font-medium">{label}</span>
      <span className="text-[10px] text-[var(--subtext)]">{tag}</span>
    </div>
  );
}
