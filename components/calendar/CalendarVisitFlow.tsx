"use client";

import { useState, useMemo, useEffect } from 'react';
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
  slots?: AvailabilitySlot[]; // opcional si se inyectan; si no, se hace fetch
  className?: string;
};

export default function CalendarVisitFlow({ building, unit, date, slots: initialSlots, className }: CalendarVisitFlowProps){
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<AvailabilitySlot | null>(null);
  const [slots, setSlots] = useState<AvailabilitySlot[]>(initialSlots ?? []);
  const [loading, setLoading] = useState(!initialSlots);
  const [error, setError] = useState<string | null>(null);

  const unitLabel = useMemo(() => `${unit?.id} · ${unit?.tipologia ?? ''}`.trim(), [unit]);

  useEffect(() => {
    let cancelled = false;
    async function load(){
      if (initialSlots) return;
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('/api/calendar/availability', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ date, visibleHours: { start: '09:00', end: '18:00' } })
        });
        if (!res.ok) throw new Error(String(res.status));
        const data = await res.json();
        if (!cancelled) setSlots(data.slots ?? []);
      } catch {
        if (!cancelled) setError('No se pudo cargar la disponibilidad');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [date, initialSlots]);

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
      {error && <p className="px-4 text-sm text-red-600" role="alert">{error}</p>}
      {loading ? (
        <div className="px-4 py-3 text-sm text-zinc-500" aria-live="polite">Cargando horarios…</div>
      ) : (
        <SlotPicker slots={slots} onSelect={handleSelect} />
      )}
      <VisitQuoteModal building={building} unit={unit} open={open} onClose={() => setOpen(false)} />
    </div>
  );
}