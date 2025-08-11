import { CheckCircle } from "lucide-react";

interface PromoBadgeProps {
  className?: string;
}

export function PromoBadge({ className = "" }: PromoBadgeProps) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 backdrop-blur border border-white/10 bg-white/5 text-white/90 ${className}`}
      role="status"
      aria-label="Promoción sin letra chica"
    >
      <CheckCircle className="w-4 h-4 text-brand-aqua flex-shrink-0" />
      <span className="text-sm font-medium">Sin letra chica</span>
    </div>
  );
}
