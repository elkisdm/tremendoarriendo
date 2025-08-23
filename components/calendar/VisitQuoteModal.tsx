"use client";

import { useState } from 'react';
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
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Cotizar unidad"
      description={`Genera una cotización para ${building.name}`}
      initialFocusRef={{ current: initialFocus }}
    >
      <div className="p-2">
        <PropertyQuotationPanel building={building} selectedUnit={unit} initialStartDate={initialStartDate} />
        <div className="mt-4 flex justify-end">
          <button ref={setInitialFocus as any} onClick={onClose} className="rounded-xl px-4 py-2 text-sm border border-[var(--ring)]/20">Cerrar</button>
        </div>
      </div>
    </Modal>
  );
}