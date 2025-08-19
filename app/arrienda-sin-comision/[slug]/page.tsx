import { notFound } from "next/navigation";
import { HOME_AMENGUAL_EXTENDED } from "@/lib/arrienda-sin-comision-mocks";
import ArriendaSinComisionBuildingDetail from "@/components/marketing/ArriendaSinComisionBuildingDetail";

interface BuildingDetailPageProps {
  params: {
    slug: string;
  };
}

export default function BuildingDetailPage({ params }: BuildingDetailPageProps) {
  const { slug } = params;

  // Solo mostrar Home Amengual
  if (slug !== "home-amengual") {
    notFound();
  }

  return <ArriendaSinComisionBuildingDetail building={HOME_AMENGUAL_EXTENDED} />;
}
