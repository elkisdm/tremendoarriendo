import { notFound } from "next/navigation";
import { getBuildingBySlug, getRelatedBuildings } from "@lib/data";
import { PropertyClient } from "./PropertyClient";

type PropertyPageProps = {
  params: { slug: string };
};

export const revalidate = 3600;

export default async function PropertyPage({ params, searchParams }: PropertyPageProps & { searchParams?: { fail?: string } }) {
  // Simulate a failure to verify error.tsx boundary
  if (searchParams?.fail === "1") {
    throw new Error("Falló carga de propiedad (simulada)");
  }
  const building = await getBuildingBySlug(params.slug);
  
  if (!building) {
    notFound();
  }

  const relatedBuildings = await getRelatedBuildings(params.slug, 3);

  // Build JSON-LD (Schema.org) for this property
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "http://localhost:3000";
  const canonicalUrl = `${baseUrl}/property/${params.slug}`;
  const primaryImage =
    building.media?.images?.[0] ||
    building.coverImage ||
    building.gallery?.[0] ||
    "/images/lascondes-cover.jpg";
  const toAbsoluteUrl = (url: string) => (url.startsWith("http") ? url : `${baseUrl}${url}`);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ApartmentComplex",
    name: building.name,
    address: {
      "@type": "PostalAddress",
      addressLocality: building.comuna,
    },
    image: toAbsoluteUrl(primaryImage),
    url: canonicalUrl,
    offers: building.units.map((unit) => ({
      "@type": "Offer",
      price: unit.price,
      priceCurrency: "CLP",
      ...(unit.disponible ? { availability: "https://schema.org/InStock" } : {}),
    })),
  } as const;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <PropertyClient building={building} relatedBuildings={relatedBuildings} />
    </>
  );
}

export async function generateMetadata({ params }: PropertyPageProps) {
  const building = await getBuildingBySlug(params.slug);
  
  if (!building) {
    return {
      title: "Propiedad no encontrada",
    };
  }

  return {
    title: `${building.name} - 0% Comisión | Hommie`,
    description: `Arrienda ${building.name} en ${building.comuna} sin comisión de corretaje. ${building.amenities.join(", ")}.`,
    alternates: { canonical: `/property/${params.slug}` },
    openGraph: {
      title: `${building.name} - 0% Comisión`.
        replace(/\s+/g, " "),
      description: `Arrienda ${building.name} en ${building.comuna} sin comisión de corretaje.`,
      type: "website",
      images: [building.coverImage ?? building.gallery?.[0] ?? "/images/lascondes-cover.jpg"],
    },
    twitter: {
      card: "summary_large_image",
      title: `${building.name} - 0% Comisión`.
        replace(/\s+/g, " "),
      images: [building.coverImage ?? building.gallery?.[0] ?? "/images/lascondes-cover.jpg"],
    },
  };
}
