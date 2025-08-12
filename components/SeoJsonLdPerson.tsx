import { safeJsonLd } from "@lib/seo/jsonld";

interface SeoJsonLdPersonProps {
  name: string;
  url: string;
  areaServed?: string;
  sameAs?: string[];
  jobTitle?: string;
}

/**
 * Componente RSC que emite JSON-LD Person schema
 * Para uso en páginas de bio/perfil de agentes inmobiliarios
 */
export default function SeoJsonLdPerson({
  name,
  url,
  areaServed = "Santiago, CL",
  sameAs = [],
  jobTitle = "Real Estate Agent",
}: SeoJsonLdPersonProps) {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    url,
    jobTitle,
    areaServed: {
      "@type": "Place",
      name: areaServed,
    },
    ...(sameAs.length > 0 && { sameAs }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: safeJsonLd(personSchema),
      }}
    />
  );
}
