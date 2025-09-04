// Tipos compartidos para sistema de agendamiento de visitas
// Basado en patrones de QuintoAndar con RFC 3339 y idempotencia

export interface Listing {
  id: string;
  address: string;
  timezone: string; // IANA timezone (e.g., "America/Santiago")
  status: 'active' | 'inactive' | 'maintenance';
  agentId: string;
}

export interface Agent {
  id: string;
  name: string;
  phone: string;
  whatsappNumber: string;
  email: string;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  whatsappNumber: string;
  email?: string;
}

export interface VisitSlot {
  id: string;
  listingId: string;
  startTime: string; // RFC 3339 format
  endTime: string;   // RFC 3339 format
  status: 'open' | 'blocked' | 'reserved' | 'confirmed';
  source: 'owner' | 'system';
  createdAt: string;
}

export interface Visit {
  id: string;
  listingId: string;
  slotId: string;
  userId: string;
  status: 'pending' | 'confirmed' | 'canceled' | 'no_show' | 'completed';
  createdAt: string;
  idempotencyKey: string;
  agentId: string;
}

export interface WaitlistEntry {
  id: string;
  listingId: string;
  userId: string;
  preferredTimes: string[]; // RFC 3339 format
  status: 'waiting' | 'assigned' | 'expired';
  createdAt: string;
}

export interface Notification {
  id: string;
  visitId: string;
  channel: 'whatsapp' | 'email' | 'sms';
  templateId?: string;
  sentAt: string;
  status: 'pending' | 'sent' | 'delivered' | 'failed';
  retryCount: number;
}

export interface BlackoutWindow {
  id: string;
  listingId: string;
  startTime: string; // RFC 3339 format
  endTime: string;   // RFC 3339 format
  reason: string;
  createdAt: string;
}

// Tipos para API responses
export interface AvailabilityResponse {
  listingId: string;
  timezone: string;
  slots: VisitSlot[];
  nextAvailableDate?: string;
}

export interface CreateVisitRequest {
  listingId: string;
  slotId: string;
  userId: string;
  channel?: 'whatsapp' | 'web';
  idempotencyKey: string;
}

export interface CreateVisitResponse {
  visitId: string;
  status: 'confirmed' | 'pending';
  agent: Pick<Agent, 'name' | 'phone' | 'whatsappNumber'>;
  slot: Pick<VisitSlot, 'startTime' | 'endTime'>;
  confirmationMessage: string;
}

export interface UserVisitsResponse {
  upcoming: Visit[];
  past: Visit[];
  canceled: Visit[];
}

// Tipos para UI
export interface DaySlot {
  id: string;
  date: string; // YYYY-MM-DD
  day: string;  // Short day name
  number: string;
  available: boolean;
  premium?: boolean;
  price?: number;
  slotsCount: number;
}

export interface TimeSlot {
  id: string;
  time: string; // HH:MM
  available: boolean;
  premium?: boolean;
  instantBooking?: boolean;
  slotId?: string; // Reference to backend slot
}

export interface ContactData {
  name: string;
  rut: string;
  phone: string;
  email?: string;
  whatsappNumber?: string;
}

// Constantes
export const TIME_SLOTS_30MIN = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30'
];

export const OPERATIONAL_HOURS = {
  start: 9, // 9:00 AM
  end: 19   // 7:00 PM
};

// Utilidades para RFC 3339
export const formatRFC3339 = (date: Date, timezone: string = 'America/Santiago'): string => {
  return date.toLocaleString('sv-SE', { timeZone: timezone })
    .replace(' ', 'T')
    .replace(/\//g, '-')
    .slice(0, 19) + '-03:00'; // Chile timezone offset
};

export const parseRFC3339 = (rfc3339: string): Date => {
  return new Date(rfc3339);
};

export const isSlotAvailable = (slot: VisitSlot): boolean => {
  return slot.status === 'open' && new Date(slot.startTime) > new Date();
};

export const generateIdempotencyKey = (): string => {
  return `visit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
