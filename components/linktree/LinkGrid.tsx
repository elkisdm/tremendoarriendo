import { clx } from "@lib/utils";
import { ExternalLink, Phone, MessageSquare, Calendar, Building2 } from "lucide-react";

interface LinkItem {
  label: string;
  href: string;
  aria: string;
  external?: boolean;
  icon?: "whatsapp" | "phone" | "calendar" | "catalog" | "external";
}

interface LinkGridProps {
  items: LinkItem[];
  className?: string;
}

export function LinkGrid({ items, className }: LinkGridProps) {
  const getIcon = (icon?: string) => {
    switch (icon) {
      case "whatsapp":
        return <MessageSquare className="w-4 h-4" aria-hidden="true" />;
      case "phone":
        return <Phone className="w-4 h-4" aria-hidden="true" />;
      case "calendar":
        return <Calendar className="w-4 h-4" aria-hidden="true" />;
      case "catalog":
        return <Building2 className="w-4 h-4" aria-hidden="true" />;
      case "external":
        return <ExternalLink className="w-4 h-4" aria-hidden="true" />;
      default:
        return null;
    }
  };

  const isWhatsApp = (item: LinkItem) => 
    item.href.includes("wa.me") || item.href.includes("whatsapp.com");

  return (
    <div className={clx("grid grid-cols-1 gap-3", className)}>
      {items.map((item, index) => {
        const isPrimary = isWhatsApp(item);
        const isExternal = item.external || item.href.startsWith("http");
        
        return (
          <a
            key={index}
            href={item.href}
            aria-label={item.aria}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            data-analytics={`linktree_click:${item.label}`}
            className={clx(
              "group relative inline-flex items-center justify-center gap-3 rounded-2xl px-5 py-4 text-sm font-semibold transition-all",
              "min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]",
              isPrimary
                ? "text-white shadow-[0_10px_30px_rgba(109,74,255,.35)] bg-[radial-gradient(120%_120%_at_30%_10%,#8B6CFF_0%,#6D4AFF_40%,#5233D3_100%)] ring-1 ring-[var(--ring)] hover:brightness-110 active:scale-[.98]"
                : "text-[var(--text)] bg-white/5 ring-1 ring-white/10 hover:bg-white/[.08] hover:ring-white/20 active:scale-[.98]"
            )}
          >
            {getIcon(item.icon)}
            <span>{item.label}</span>
            {isExternal && <ExternalLink className="w-3 h-3 opacity-60" aria-hidden="true" />}
          </a>
        );
      })}
    </div>
  );
}
