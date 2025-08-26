export interface GoogleCalendarEvent {
  id: string;
  summary: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  description?: string;
}

export interface GoogleCalendarResponse {
  items: GoogleCalendarEvent[];
}

export async function fetchGoogleBusy(
  calendarId: string,
  timeMin: string,
  timeMax: string,
  apiKey?: string
): Promise<GoogleCalendarEvent[]> {
  try {
    if (!apiKey) {
      console.warn('Google Calendar API key not provided');
      return [];
    }

    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`;
    const params = new URLSearchParams({
      timeMin,
      timeMax,
      singleEvents: 'true',
      orderBy: 'startTime',
      key: apiKey,
    });

    const response = await fetch(`${url}?${params}`);
    
    if (!response.ok) {
      throw new Error(`Google Calendar API error: ${response.status}`);
    }

    const data: GoogleCalendarResponse = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Error fetching Google Calendar events:', error);
    return [];
  }
}

export function convertGoogleEventsToCalendarEvents(
  googleEvents: GoogleCalendarEvent[]
): Array<{
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
}> {
  return googleEvents.map(event => ({
    id: event.id,
    title: event.summary,
    start: new Date(event.start.dateTime),
    end: new Date(event.end.dateTime),
    description: event.description,
  }));
}
