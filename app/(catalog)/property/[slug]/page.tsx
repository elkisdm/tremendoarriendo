import { notFound } from "next/navigation";
import { getBuildingBySlug, getRelatedBuildings } from "@lib/data";
import { PropertyClient } from "./PropertyClient";

type PropertyPageProps = {
  params: { slug: string };
};

export default async function PropertyPage({ params }: PropertyPageProps) {
  const building = await getBuildingBySlug(params.slug);
  
  if (!building) {
    notFound();
  }

  const relatedBuildings = await getRelatedBuildings(params.slug, 3);

  return <PropertyClient building={building} relatedBuildings={relatedBuildings} />;
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
  };
}
