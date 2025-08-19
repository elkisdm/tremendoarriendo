import { notFound } from "next/navigation";
import { getSupabaseProcessor } from "@/lib/supabase-data-processor";
import Image from "next/image";
import Link from "next/link";

interface UnitPageProps {
  params: {
    op: string;
  };
}

export default async function UnitPage({ params }: UnitPageProps) {
  try {
    const processor = await getSupabaseProcessor();
    const unit = await processor.getUnitByOP(params.op);

    if (!unit) {
      console.log(`❌ Unidad no encontrada: ${params.op}`);
      notFound();
    }

    console.log(`✅ Unidad encontrada: ${unit.unidad} del condominio ${unit.condominio}`);

    const formatPrice = (price: number): string => {
      if (price >= 1_000_000) {
        const millions = price / 1_000_000;
        return `$${millions.toFixed(0)}M`;
      }
      return `$${price.toLocaleString('es-CL')}`;
    };

    const formatTypologyLabel = (tipology: string): string => {
      const mapping: Record<string, string> = {
        'Studio': 'Studio',
        '1D1B': '1 Dormitorio, 1 Baño',
        '2D1B': '2 Dormitorios, 1 Baño',
        '2D2B': '2 Dormitorios, 2 Baños',
        '3D2B': '3 Dormitorios, 2 Baños',
      };
      return mapping[tipology] || tipology;
    };

    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link 
              href="/arrienda-sin-comision"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Volver a edificios
            </Link>
          </div>

          <h1 className="text-3xl font-bold mb-2">
            Departamento {unit.unidad}
          </h1>
          <p className="text-lg text-muted-foreground mb-2">{unit.condominio}</p>
          <p className="text-sm text-muted-foreground">{unit.direccion}, {unit.comuna}</p>
        </div>

        {/* Imagen de portada */}
        <div className="mb-8">
          <div className="relative aspect-[16/10] rounded-2xl overflow-hidden">
            <Image
              src="/images/default-cover.jpg"
              alt={`Departamento ${unit.unidad}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        </div>

        {/* Información principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Detalles de la unidad */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Detalles de la unidad</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Precio:</span>
                  <span className="font-bold text-green-600 text-xl">{formatPrice(unit.arriendo_total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tipología:</span>
                  <span className="font-semibold">{formatTypologyLabel(unit.tipologia)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Área:</span>
                  <span>{unit.m2_depto} m²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Orientación:</span>
                  <span>{unit.orientacion}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estacionamiento:</span>
                  <span>{unit.estacionamiento > 0 ? `${unit.estacionamiento} estacionamiento(s)` : 'No incluye'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bodega:</span>
                  <span>{unit.bodega > 0 ? `${unit.bodega} bodega(s)` : 'No incluye'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gastos comunes:</span>
                  <span>{formatPrice(unit.gc_total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estado:</span>
                  <span className={`font-semibold ${
                    !unit.estado || unit.estado.toLowerCase() === 'disponible' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {unit.estado || 'Disponible'}
                  </span>
                </div>
              </div>
            </div>

            {/* Promociones */}
            {(unit.especial || unit.tremenda_promo || unit.descuento > 0) && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Promociones</h3>
                <div className="space-y-2">
                  {unit.especial && (
                    <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                      🎯 Oferta Especial
                    </span>
                  )}
                  {unit.tremenda_promo && (
                    <span className="inline-block bg-red-100 text-red-800 text-sm px-3 py-1 rounded-full">
                      🔥 Tremenda Promo
                    </span>
                  )}
                  {unit.descuento > 0 && (
                    <span className="inline-block bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                      💰 {unit.descuento}% Descuento
                      {unit.meses_descuento > 0 && ` por ${unit.meses_descuento} meses`}
                    </span>
                  )}
                  {unit.acepta_mascotas && (
                    <span className="inline-block bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full">
                      🐕 Pet Friendly
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Información del condominio */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Información del condominio</h2>
              <div className="space-y-3">
                <div>
                  <span className="text-muted-foreground">Nombre:</span>
                  <p className="font-semibold">{unit.condominio}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Dirección:</span>
                  <p>{unit.direccion}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Comuna:</span>
                  <p>{unit.comuna}</p>
                </div>
              </div>
            </div>

            {/* Amenities del condominio */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Amenities</h3>
              <div className="grid grid-cols-2 gap-2">
                {unit.acepta_mascotas && (
                  <span className="text-sm">🐕 Pet Friendly</span>
                )}
                {unit.estacionamiento > 0 && (
                  <span className="text-sm">🚗 Estacionamiento</span>
                )}
                {unit.bodega > 0 && (
                  <span className="text-sm">📦 Bodega</span>
                )}
                <span className="text-sm">🔒 Seguridad 24/7</span>
                <span className="text-sm">🏊‍♂️ Piscina</span>
                <span className="text-sm">🏋️‍♂️ Gimnasio</span>
                <span className="text-sm">🌳 Áreas verdes</span>
                <span className="text-sm">🅿️ Estacionamiento visitantes</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center space-y-4">
          <Link
            href={unit.link_listing || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors text-lg"
          >
            Ver en AssetPlan
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>
          
          <p className="text-sm text-muted-foreground">
            OP: {unit.op} | Unidad: {unit.unidad}
          </p>
        </div>
      </div>
    );
  } catch (error) {
    console.error('❌ Error cargando datos de la unidad:', error);
    notFound();
  }
}
