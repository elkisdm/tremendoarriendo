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

export function buildAvailability(
  events: CalendarEvent[],
  timeRange: TimeRange,
  slotDuration: number = 30 // minutes
): AvailabilitySlot[] {
  const slots: AvailabilitySlot[] = [];
  const start = new Date(timeRange.start);
  const end = new Date(timeRange.end);

  // Generate time slots
  for (let current = new Date(start); current < end; current.setMinutes(current.getMinutes() + slotDuration)) {
    const slotStart = new Date(current);
    const slotEnd = new Date(current.getTime() + slotDuration * 60 * 1000);

    // Check if slot conflicts with any event
    const hasConflict = events.some(event => {
      return (
        (slotStart >= event.start && slotStart < event.end) ||
        (slotEnd > event.start && slotEnd <= event.end) ||
        (slotStart <= event.start && slotEnd >= event.end)
      );
    });

    slots.push({
      start: slotStart,
      end: slotEnd,
      available: !hasConflict,
    });
  }

  return slots;
}

export function getAvailableSlots(slots: AvailabilitySlot[]): AvailabilitySlot[] {
  return slots.filter(slot => slot.available);
}

export function getBusySlots(slots: AvailabilitySlot[]): AvailabilitySlot[] {
  return slots.filter(slot => !slot.available);
}
