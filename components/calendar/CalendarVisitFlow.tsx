"use client";

import { useState, useMemo } from 'react';
import type { AvailabilitySlot } from '@/types/calendar';
import type { Building, Unit } from '@schemas/models';
import { clx } from '@lib/utils';
import SlotPicker from './SlotPicker';
import VisitPanel from './VisitPanel';
import VisitQuoteModal from './VisitQuoteModal';

export type CalendarVisitFlowProps = {
  building: Building;
  unit: Unit;
  date: string; // YYYY-MM-DD
  slots: AvailabilitySlot[]; // por ahora se inyectan desde arriba
  className?: string;
};

export default function CalendarVisitFlow({ building, unit, date, slots, className }: CalendarVisitFlowProps){
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<AvailabilitySlot | null>(null);

  const unitLabel = useMemo(() => `${unit?.id} · ${unit?.tipologia ?? ''}`.trim(), [unit]);

  function handleSelect(slot: AvailabilitySlot){
    setSelected(slot);
    setOpen(true);
  }

  return (
    <div className={clx('space-y-4', className)}>
      <VisitPanel
        propertyTitle={building.name}
        unitLabel={unitLabel}
        address={building.address as any}
        visitDate={date}
        visitHour={selected ? new Date(selected.start).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) : undefined}
        onQuoteHref="#"
      />
      <SlotPicker slots={slots} onSelect={handleSelect} />
      <VisitQuoteModal building={building} unit={unit} open={open} onClose={() => setOpen(false)} />
    </div>
  );
}