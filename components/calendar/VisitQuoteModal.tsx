"use client";

import { useMemo, useState } from 'react';
import { Modal } from '@components/ui/Modal';
import { PropertyQuotationPanel } from '@components/quotation/PropertyQuotationPanel';
import type { Building, Unit } from '@schemas/models';

export type VisitQuoteModalProps = {
  building: Building;
  unit: Unit;
  open: boolean;
  onClose: () => void;
  initialStartDate?: string; // YYYY-MM-DD
};

export default function VisitQuoteModal({ building, unit, open, onClose, initialStartDate }: VisitQuoteModalProps){
  const [initialFocus, setInitialFocus] = useState<HTMLButtonElement | null>(null);
  const [selectedUnitId, setSelectedUnitId] = useState<string>(unit.id);
  const selectedUnit = useMemo(() => building.units.find(u => u.id === selectedUnitId) ?? unit, [building.units, selectedUnitId, unit]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Cotizar unidad"
      description={`Genera una cotización para ${building.name}`}
      initialFocusRef={{ current: initialFocus }}
    >
      <div className="p-2 space-y-3">
        <div className="flex items-center gap-2">
          <label htmlFor="unit-select" className="text-sm text-zinc-700 dark:text-zinc-200">Unidad</label>
          <select
            id="unit-select"
            className="min-w-0 flex-1 rounded-lg border border-[var(--ring)]/20 bg-white dark:bg-zinc-900 px-3 py-2 text-sm"
            value={selectedUnitId}
            onChange={(e) => setSelectedUnitId(e.target.value)}
          >
            {building.units.filter(u => u.disponible !== false).map(u => (
              <option key={u.id} value={u.id}>{u.id} · {u.tipologia} · {u.m2}m²</option>
            ))}
          </select>
        </div>
        <PropertyQuotationPanel building={building} selectedUnit={selectedUnit} initialStartDate={initialStartDate} />
        <div className="mt-2 flex justify-end">
          <button ref={setInitialFocus as any} onClick={onClose} className="rounded-xl px-4 py-2 text-sm border border-[var(--ring)]/20">Cerrar</button>
        </div>
      </div>
    </Modal>
  );
}