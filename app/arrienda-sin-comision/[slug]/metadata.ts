import type { Metadata } from "next";
import { getAllBuildings } from "@lib/data";

interface MetadataProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
  const { slug } = await params;
  
  // Obtener información del edificio
  const buildings = await getAllBuildings();
  const building = buildings.find(b => b.slug === slug);
  
  if (!building) {
    return {
      title: "Edificio no encontrado | Arrienda Sin Comisión",
      description: "El edificio que buscas no está disponible.",
    };
  }
  
  const title = `${building.name} - 0% Comisión | Arrienda Sin Comisión`;
  const description = `Arrienda en ${building.name} ubicado en ${building.comuna} con 0% de comisión. ${building.amenities.slice(0, 3).join(", ")}.`;
  
  return {
    title,
    description,
    keywords: [
      building.name,
      building.comuna,
      "arriendo sin comisión",
      "0% comisión",
      "departamentos",
      ...building.amenities.slice(0, 5)
    ],
    openGraph: {
      title,
      description,
      type: "website",
      url: `/arrienda-sin-comision/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

