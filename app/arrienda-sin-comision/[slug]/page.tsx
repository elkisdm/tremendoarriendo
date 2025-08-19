import { notFound } from "next/navigation";
import ArriendaSinComisionBuildingDetail from "@/components/marketing/ArriendaSinComisionBuildingDetail";
import { getSupabaseProcessor } from "@/lib/supabase-data-processor";

interface ArriendaSinComisionBuildingPageProps {
  params: {
    slug: string;
  };
  searchParams: {
    typology?: string;
  };
}

export default async function ArriendaSinComisionBuildingPage({
  params,
  searchParams,
}: ArriendaSinComisionBuildingPageProps) {
  try {
    const processor = await getSupabaseProcessor();
    const condominio = await processor.getCondominioBySlug(params.slug);

    if (!condominio) {
      console.log(`❌ Condominio no encontrado: ${params.slug}`);
      notFound();
    }

    console.log(`✅ Condominio encontrado: ${condominio.nombre} con ${condominio.unidades.length} unidades`);

    // Convertir CondominioData al formato esperado por el componente
    const buildingData = {
      id: condominio.id,
      slug: condominio.id,
      name: condominio.nombre,
      comuna: condominio.comuna,
      address: condominio.direccion,
      coverImage: condominio.amenities.includes('Pet Friendly') ? '/images/pet-friendly-cover.jpg' : '/images/default-cover.jpg',
      gallery: [
        '/images/building-1.jpg',
        '/images/building-2.jpg',
        '/images/building-3.jpg',
      ],
      precioDesde: condominio.precioDesde,
      precioHasta: condominio.precioHasta,
      precioPromedio: condominio.precioPromedio,
      hasAvailability: condominio.unidadesDisponibles > 0,
      totalUnidades: condominio.totalUnidades,
      unidadesDisponibles: condominio.unidadesDisponibles,
      badges: condominio.promociones.map(promo => ({
        type: 'promotion',
        label: promo,
        description: promo,
      })),
      amenities: condominio.amenities,
      tipologias: condominio.tipologias,
      unidades: condominio.unidades.map(unit => ({
        op: unit.op,
        unidad: unit.unidad,
        tipologia: unit.tipologia,
        precio: unit.arriendo_total,
        m2: unit.m2_depto,
        orientacion: unit.orientacion,
        estacionamiento: unit.estacionamiento,
        bodega: unit.bodega,
        gc: unit.gc_total,
        aceptaMascotas: unit.acepta_mascotas,
        estado: unit.estado,
        especial: unit.especial,
        tremendaPromo: unit.tremenda_promo,
        descuento: unit.descuento,
        mesesDescuento: unit.meses_descuento,
        linkListing: unit.link_listing,
      })),
      selectedTypology: searchParams.typology || null,
    };

    return <ArriendaSinComisionBuildingDetail building={buildingData} />;
  } catch (error) {
    console.error('❌ Error cargando datos del condominio:', error);
    notFound();
  }
}
