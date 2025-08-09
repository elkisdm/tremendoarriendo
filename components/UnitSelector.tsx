"use client";
import { useState, useEffect } from "react";
import type { Unit } from "@schemas/models";
import { currency } from "@lib/utils";

type UnitSelectorProps = {
  units: Unit[];
  buildingId: string;
  defaultUnitId?: string;
  onUnitChange?: (unit: Unit) => void;
};

export function UnitSelector({ units, buildingId, defaultUnitId, onUnitChange }: UnitSelectorProps) {
  const [selectedUnitId, setSelectedUnitId] = useState(defaultUnitId || units[0]?.id);
  const selectedUnit = units.find(unit => unit.id === selectedUnitId);

  useEffect(() => {
    if (selectedUnit && onUnitChange) {
      onUnitChange(selectedUnit);
    }
  }, [selectedUnit, onUnitChange]);

  const handleUnitChange = (unitId: string) => {
    setSelectedUnitId(unitId);
    const unit = units.find(u => u.id === unitId);
    if (unit && onUnitChange) {
      onUnitChange(unit);
    }
  };

  if (!units || units.length === 0) {
    return (
      <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4">
        <p className="text-[var(--subtext)]">No hay unidades disponibles</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4">
      <div className="mb-4">
        <label htmlFor={`unit-selector-${buildingId}`} className="block text-sm font-medium mb-2">
          Unidad disponible
        </label>
        <select
          id={`unit-selector-${buildingId}`}
          value={selectedUnitId}
          onChange={(e) => handleUnitChange(e.target.value)}
          className="w-full px-3 py-2 bg-[var(--soft)]/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent text-[var(--text)]"
        >
          {units.map((unit) => (
            <option key={unit.id} value={unit.id}>
              {unit.tipologia} - {unit.m2}m² - {currency(unit.price)}
            </option>
          ))}
        </select>
      </div>

      {selectedUnit && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-[var(--subtext)]">Tipología:</span>
              <div className="font-medium">{selectedUnit.tipologia}</div>
            </div>
            <div>
              <span className="text-[var(--subtext)]">Superficie:</span>
              <div className="font-medium">{selectedUnit.m2} m²</div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-[var(--subtext)]">Estacionamiento:</span>
              <span className={selectedUnit.estacionamiento ? "text-emerald-400" : "text-[var(--subtext)]"}>
                {selectedUnit.estacionamiento ? "Incluido" : "No incluido"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[var(--subtext)]">Bodega:</span>
              <span className={selectedUnit.bodega ? "text-emerald-400" : "text-[var(--subtext)]"}>
                {selectedUnit.bodega ? "Incluida" : "No incluida"}
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">Precio mensual:</span>
              <span className="text-xl font-bold text-[var(--ring)]">{currency(selectedUnit.price)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
