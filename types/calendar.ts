export interface TimeRange {
  start: Date;
  end: Date;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
}

export interface AvailabilitySlot {
  start: Date;
  end: Date;
  available: boolean;
}

export interface CalendarConfig {
  visibleHours: {
    start: string;
    end: string;
  };
  slotDuration: number;
  timezone: string;
}
