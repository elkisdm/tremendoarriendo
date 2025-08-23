import { CalendarEvent } from "@/types/calendar";

export type GoogleFreeBusyInput = {
  calendarId: string;
  dateIso: string; // YYYY-MM-DD
};

export async function fetchGoogleBusy({ calendarId, dateIso }: GoogleFreeBusyInput): Promise<CalendarEvent[]> {
  if (process.env.NODE_ENV !== 'production') {
    // Mock en dev/test
    return [];
  }
  if (!process.env.GOOGLE_API_KEY && !process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    throw new Error("Google Calendar no está configurado en el entorno");
  }
  // TODO: Implementar llamada real a freebusy o events.list con Service Account
  return [];
}