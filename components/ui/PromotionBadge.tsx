import { BadgePercent } from "lucide-react";

type PromotionBadgeProps = {
  label?: string;
  tag?: string;
  variant?: 'default' | 'hero';
};

export function PromotionBadge({ 
  label = "0% Comisión", 
  tag, 
  variant = 'default' 
}: PromotionBadgeProps) {
  const baseClasses = "inline-flex items-center gap-2 font-semibold backdrop-blur";
  
  const variantClasses = {
    default: "rounded-full px-3 py-1 text-xs bg-white/5 ring-1 ring-white/10",
    hero: "rounded-2xl px-4 py-2 text-sm md:text-base bg-gradient-to-r from-brand-violet/30 to-brand-aqua/30 ring-1 ring-brand-violet/20 text-white"
  };

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]}`} 
      aria-label={`${label}${tag ? ` - ${tag}` : ""}`}
      role="status"
    >
      <BadgePercent className="w-4 h-4" aria-hidden />
      <span>{label}</span>
      {tag && <span className={`text-[11px] ${variant === 'hero' ? 'text-white/80' : 'text-[var(--subtext)]'}`}>{tag}</span>}
    </div>
  );
}
