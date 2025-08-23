export type Uuid = string & { _brand: 'uuid' };

export type IsoDateTime = string & { _brand: 'isoDateTime' };
export type IsoDate = string & { _brand: 'isoDate' };

export type CalendarSource =
  | { kind: 'google'; calendarId: string }
  | { kind: 'ics'; url: string }
  | { kind: 'internal'; name?: string };

export type CalendarEvent = {
  id: Uuid | string;
  title: string;
  start: IsoDateTime;
  end: IsoDateTime;
  location?: string;
  description?: string;
  busy: boolean;
  source?: CalendarSource;
};

export type TimeRange = {
  start: string; // HH:mm (local)
  end: string;   // HH:mm (local)
};

export type AvailabilitySlot = {
  start: IsoDateTime;
  end: IsoDateTime;
  available: boolean;
  reason?: 'blocked_external' | 'blocked_internal' | 'open';
  source?: CalendarSource;
};

export type NormalizedCalendar = {
  date: IsoDate;
  slots: AvailabilitySlot[];
};

export type MobileSchedulerProps = {
  date: string; // YYYY-MM-DD (local)
  events?: CalendarEvent[];
  visibleHours?: TimeRange;
  className?: string;
  /**
   * Texto de cabecera (p.ej., nombre de propiedad o contexto)
   */
  headerTitle?: string;
};