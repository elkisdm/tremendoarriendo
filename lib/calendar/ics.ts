export interface ICSEvent {
  uid: string;
  summary: string;
  start: Date;
  end: Date;
  description?: string;
}

export async function fetchIcsEvents(icsUrl: string): Promise<ICSEvent[]> {
  try {
    const response = await fetch(icsUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch ICS file: ${response.status}`);
    }

    const icsContent = await response.text();
    return parseICSContent(icsContent);
  } catch (error) {
    console.error('Error fetching ICS events:', error);
    return [];
  }
}

function parseICSContent(icsContent: string): ICSEvent[] {
  const events: ICSEvent[] = [];
  const lines = icsContent.split('\n');
  
  let currentEvent: Partial<ICSEvent> = {};
  let inEvent = false;

  for (const line of lines) {
    const trimmedLine = line.trim();
    
    if (trimmedLine === 'BEGIN:VEVENT') {
      inEvent = true;
      currentEvent = {};
    } else if (trimmedLine === 'END:VEVENT') {
      if (inEvent && currentEvent.uid && currentEvent.summary && currentEvent.start && currentEvent.end) {
        events.push(currentEvent as ICSEvent);
      }
      inEvent = false;
      currentEvent = {};
    } else if (inEvent) {
      const [key, value] = trimmedLine.split(':', 2);
      
      switch (key) {
        case 'UID':
          currentEvent.uid = value;
          break;
        case 'SUMMARY':
          currentEvent.summary = value;
          break;
        case 'DESCRIPTION':
          currentEvent.description = value;
          break;
        case 'DTSTART':
          currentEvent.start = parseICSDate(value);
          break;
        case 'DTEND':
          currentEvent.end = parseICSDate(value);
          break;
      }
    }
  }

  return events;
}

function parseICSDate(dateString: string): Date {
  // Handle different ICS date formats
  if (dateString.includes('T')) {
    // DateTime format: 20231201T120000Z
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    const hour = dateString.substring(9, 11);
    const minute = dateString.substring(11, 13);
    const second = dateString.substring(13, 15);
    
    return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}Z`);
  } else {
    // Date format: 20231201
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    
    return new Date(`${year}-${month}-${day}`);
  }
}

export function convertICSEventsToCalendarEvents(
  icsEvents: ICSEvent[]
): Array<{
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
}> {
  return icsEvents.map(event => ({
    id: event.uid,
    title: event.summary,
    start: event.start,
    end: event.end,
    description: event.description,
  }));
}
