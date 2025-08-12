import { Instagram, Linkedin, MessageCircle } from "lucide-react";

type Testimonial = {
  id: string;
  quote: string;
  author: string;
  role?: string;
};

type SocialLink = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

type SocialProofProps = {
  testimonials?: Testimonial[];
  socials?: SocialLink[];
};

// Default testimonials (sin datos sensibles)
const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: "testimonial-1",
    quote: "Excelente servicio, encontré mi departamento ideal sin comisiones ocultas. El proceso fue transparente y rápido.",
    author: "Cliente satisfecho",
    role: "Arrendatario"
  },
  {
    id: "testimonial-2", 
    quote: "La plataforma es muy fácil de usar. Pude comparar opciones y agendar visitas sin complicaciones.",
    author: "Usuario verificado",
    role: "Inquilino"
  },
  {
    id: "testimonial-3",
    quote: "Ahorré tiempo y dinero. El equipo fue muy profesional y me ayudó en todo el proceso.",
    author: "Cliente frecuente",
    role: "Arrendatario"
  }
];

// Default social links
const DEFAULT_SOCIALS: SocialLink[] = [
  {
    label: "Instagram",
    href: "https://instagram.com/hommie.cl",
    icon: Instagram
  },
  {
    label: "LinkedIn", 
    href: "https://linkedin.com/company/hommie-cl",
    icon: Linkedin
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/56912345678",
    icon: MessageCircle
  }
];

export function SocialProof({ 
  testimonials = DEFAULT_TESTIMONIALS, 
  socials = DEFAULT_SOCIALS 
}: SocialProofProps) {
  return (
    <section className="space-y-8">
      {/* Testimonials */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-center">
          Lo que dicen nuestros clientes
        </h2>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <figure 
              key={testimonial.id}
              className="rounded-2xl bg-[var(--soft)]/90 ring-1 ring-white/10 p-6 transition-all hover:ring-[var(--ring)]/60"
            >
              <blockquote className="mb-4">
                <p className="text-[var(--text)] leading-relaxed">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
              </blockquote>
              <figcaption className="text-sm">
                <div className="font-medium text-[var(--text)]">
                  {testimonial.author}
                </div>
                {testimonial.role && (
                  <div className="text-[var(--subtext)]">
                    {testimonial.role}
                  </div>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      {/* Social Links */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-center">
          Síguenos en redes sociales
        </h3>
        
        <div className="flex justify-center gap-4">
          {socials.map((social) => {
            const Icon = social.icon;
            return (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Síguenos en ${social.label}`}
                className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[var(--soft)]/90 ring-1 ring-white/10 text-[var(--text)] transition-all hover:ring-[var(--ring)]/60 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
              >
                <Icon className="w-5 h-5" aria-hidden />
                <span className="sr-only">{social.label}</span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
