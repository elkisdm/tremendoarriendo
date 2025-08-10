import { currency } from "@lib/utils";
import type { Unit } from "@schemas/models";

export function CostTable({ unit, promoLabel = "0% Comisión" }: { unit: Unit; promoLabel?: string }) {
  // Check if parking or storage options are available as additional services
  const hasOptionalParking = unit.parkingOptions && unit.parkingOptions.length > 0;
  const hasOptionalStorage = unit.storageOptions && unit.storageOptions.length > 0;
  const hasOptionalServices = hasOptionalParking || hasOptionalStorage;

  return (
    <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4">
      <h4 className="font-semibold mb-3">Detalle de costos</h4>
      <div className="grid grid-cols-2 gap-y-2 text-sm">
        <span className="text-[var(--subtext)]">Canon de arriendo</span> 
        <span className="text-right font-medium">{currency(unit.price)}</span>
        
        <span className="text-[var(--subtext)]">Gastos comunes aprox.</span> 
        <span className="text-right font-medium">{currency(Math.round(unit.price * 0.18))}</span>
        
        <span className="text-[var(--subtext)]">Comisión de corretaje</span> 
        <span className="text-right font-medium text-emerald-400">{promoLabel}</span>
        
        {hasOptionalServices && (
          <>
            <span className="text-[var(--subtext)]">Estacionamiento/Bodega (opcional)</span>
            <span className="text-right font-medium text-[var(--subtext)]">Consultar</span>
          </>
        )}
        
        <span className="text-[var(--subtext)]">Garantía</span> 
        <span className="text-right font-medium">{currency(Math.round(unit.price))}</span>
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
        <span className="text-[var(--subtext)]">Total estimado de entrada</span>
        <span className="font-bold">{currency(Math.round(unit.price * 2.18))}</span>
      </div>
    </div>
  );
}
