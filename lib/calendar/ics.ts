import { CalendarEvent } from "@/types/calendar";

export async function fetchIcsEvents(url: string): Promise<CalendarEvent[]> {
  if (process.env.NODE_ENV !== 'production') {
    return [];
  }
  if (!url) return [];
  // TODO: Implementar parser ICS real (ical.js / node-ical)
  return [];
}