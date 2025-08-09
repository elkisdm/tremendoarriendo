"use client";
import { useEffect, useState } from "react";
import { MapPin, Phone } from "lucide-react";
import { PromotionBadge } from "@components/ui/PromotionBadge";
import { AmenityList } from "@components/ui/AmenityList";
import { PrimaryButton } from "@components/ui/PrimaryButton";
import { ImageGallery } from "@components/gallery/ImageGallery";
import { CostTable } from "@components/cost/CostTable";
import { RelatedList } from "@components/lists/RelatedList";
import { BookingForm } from "@components/forms/BookingForm";
import { currency } from "@lib/utils";
import { track } from "@lib/analytics";
import { getBuildingBySlug, getRelatedBuildings } from "@lib/data";
import type { Building, Unit } from "@schemas/models";
import Link from "next/link";

export default function PropertyPage({ params }: { params: { id: string } }){
  const [loading, setLoading] = useState(true);
  const [building, setBuilding] = useState<(Building & { precioDesde: number | null }) | null>(null);
  const [rel, setRel] = useState<(Building & { precioDesde: number | null })[]>([]);
  const [unit, setUnit] = useState<Unit | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const data = await getBuildingBySlug(params.id);
      if (!mounted) return;
      setBuilding(data);
      setUnit(data?.units.find((u) => u.disponible) ?? data?.units[0] ?? null);
      const r = data ? await getRelatedBuildings(data.slug) : [];
      if (!mounted) return;
      setRel(r);
      setLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    })();
    return () => { mounted = false; };
  }, [params.id]);

  if (loading){
    return (
      <div className="container mx-auto px-4 md:px-6 py-6">
        <Link href="/" className="text-sm text-[var(--subtext)] hover:text-white">← Volver</Link>
        <div className="animate-pulse mt-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-72 rounded-2xl bg-white/5 ring-1 ring-white/10 lg:col-span-2"/>
          <div className="h-72 rounded-2xl bg-white/5 ring-1 ring-white/10"/>
          <div className="h-48 rounded-2xl bg-white/5 ring-1 ring-white/10 lg:col-span-3"/>
        </div>
      </div>
    );
  }

  return (
    <main id="main-content" role="main" className="container mx-auto px-4 md:px-6 py-6">
      <Link href="/" className="text-sm text-[var(--subtext)] hover:text-white">← Volver</Link>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div>
              <PromotionBadge />
              <h2 className="text-2xl md:text-3xl font-bold mt-2">{building?.name}</h2>
              <div className="text-[13px] text-[var(--subtext)] flex items-center gap-1"><MapPin className="w-3.5 h-3.5" aria-hidden/> {building?.comuna} · {building?.address}</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{unit ? currency(unit.price) : ""}</div>
              <div className="text-[12px] text-[var(--subtext)]">/ mes</div>
            </div>
          </div>

          {building && <ImageGallery images={building.gallery} />}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4">
              <h4 className="font-semibold mb-2">Descripción</h4>
              <p className="text-[var(--subtext)] text-sm">Unidades modernas con terminaciones de alto estándar, excelentes conexiones y amenities de primer nivel.</p>
              {building && (
                <div className="mt-3"><AmenityList items={building.amenities} /></div>
              )}
            </div>
            <CostTable unit={unit} />
          </div>

          <div className="mt-2">
            <h4 className="font-semibold mb-3">También te puede interesar</h4>
            {rel.length ? (<RelatedList buildings={rel} />) : (<div className="text-[var(--subtext)] text-sm">No hay propiedades relacionadas.</div>)}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4">
            <div className="flex items-center justify-between">
              <div className="font-semibold">Selecciona unidad</div>
            </div>
            <div className="mt-3 grid grid-cols-1 gap-2">
              {building?.units.map((u:any) => (
                <button key={u.id} onClick={() => setUnit(u)} className={`text-left rounded-xl p-3 ring-1 ${unit?.id === u.id ? "bg-[var(--soft)] ring-[var(--ring)]" : "bg-white/5 ring-white/10 hover:bg-white/[.08]"}`}>
                  <div className="font-medium">{u.tipologia} · {u.m2} m²</div>
                  <div className="text-[13px] text-[var(--subtext)]">{currency(u.price)} / mes</div>
                </button>
              ))}
            </div>
          </div>
          {building && (
            <BookingForm
              buildingId={building.id}
              buildingName={building.name}
              defaultUnitId={unit?.id || building.units[0]?.id}
            />
          )}
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-4 z-40 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="rounded-2xl bg-[var(--soft)]/90 ring-1 ring-white/10 p-3 backdrop-blur flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="text-sm text-[var(--subtext)] truncate">Arrienda con 0% de comisión</div>
              <div className="font-semibold truncate">{building ? building.name : ""} — {unit ? unit.tipologia : ""} · {unit ? unit.m2 : ""} m²</div>
            </div>
            <a
              target="_blank"
              href="https://wa.me/56993481594?text=Hola%20Elkis%2C%20quiero%20reservar"
              onClick={() => track("cta_whatsapp_click", { context: "property_fab", property_id: building?.id })}
              className="group relative inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(109,74,255,.35)] bg-[radial-gradient(120%_120%_at_30%_10%,#8B6CFF_0%,#6D4AFF_40%,#5233D3_100%)] ring-1 ring-[var(--ring)] hover:brightness-110 active:scale-[.98]"
            >
              Hablar por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
