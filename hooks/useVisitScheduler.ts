import { useState, useCallback, useMemo } from 'react';
import { 
  AvailabilityResponse, 
  CreateVisitRequest, 
  CreateVisitResponse,
  VisitSlot,
  DaySlot,
  TimeSlot,
  formatRFC3339,
  generateIdempotencyKey,
  TIME_SLOTS_30MIN
} from '@/types/visit';

interface UseVisitSchedulerProps {
  listingId: string;
  timezone?: string;
}

interface UseVisitSchedulerReturn {
  // Estado
  isLoading: boolean;
  error: string | null;
  selectedDate: string | null;
  selectedTime: string | null;
  selectedSlot: VisitSlot | null;
  
  // Datos
  availableDays: DaySlot[];
  availableSlots: TimeSlot[];
  
  // Acciones
  fetchAvailability: (startDate: Date, endDate: Date) => Promise<void>;
  selectDateTime: (date: string, time: string) => void;
  createVisit: (userData: { name: string; phone: string; email?: string }) => Promise<CreateVisitResponse | null>;
  clearSelection: () => void;
  clearError: () => void;
}

export function useVisitScheduler({ 
  listingId, 
  timezone = 'America/Santiago' 
}: UseVisitSchedulerProps): UseVisitSchedulerReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<VisitSlot | null>(null);
  const [availabilityData, setAvailabilityData] = useState<AvailabilityResponse | null>(null);

  // Generar días disponibles (próximos 5 días)
  const availableDays = useMemo((): DaySlot[] => {
    const days: DaySlot[] = [];
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    
    for (let i = 1; i <= 5; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      // Solo días laborales (lunes a viernes)
      const dayOfWeek = date.getDay();
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        const dateString = date.toISOString().split('T')[0];
        
        // Contar slots disponibles para este día
        const slotsForDay = availabilityData?.slots.filter(slot => 
          slot.startTime.startsWith(dateString)
        ) || [];
        
        days.push({
          id: `day-${i}`,
          date: dateString,
          day: dayNames[dayOfWeek],
          number: date.getDate().toString(),
          available: slotsForDay.length > 0,
          premium: false, // Por ahora sin premium
          price: undefined,
          slotsCount: slotsForDay.length
        });
      }
    }
    
    return days;
  }, [availabilityData]);

  // Generar slots de tiempo disponibles
  const availableSlots = useMemo((): TimeSlot[] => {
    if (!selectedDate || !availabilityData) return [];
    
    const slotsForDate = availabilityData.slots.filter(slot => 
      slot.startTime.startsWith(selectedDate)
    );
    
    return TIME_SLOTS_30MIN.map(time => {
      const matchingSlot = slotsForDate.find(slot => {
        const slotTime = new Date(slot.startTime).toLocaleTimeString('es-CL', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });
        return slotTime === time;
      });
      
      return {
        id: `time-${time}`,
        time,
        available: !!matchingSlot,
        premium: false,
        instantBooking: false,
        slotId: matchingSlot?.id
      };
    }).filter(slot => slot.available);
  }, [selectedDate, availabilityData]);

  // Obtener disponibilidad de la API
  const fetchAvailability = useCallback(async (startDate: Date, endDate: Date) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const startRFC3339 = formatRFC3339(startDate, timezone);
      const endRFC3339 = formatRFC3339(endDate, timezone);
      
      const response = await fetch(
        `/api/availability?listingId=${listingId}&start=${startRFC3339}&end=${endRFC3339}`
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al obtener disponibilidad');
      }
      
      const data: AvailabilityResponse = await response.json();
      setAvailabilityData(data);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error fetching availability:', err);
    } finally {
      setIsLoading(false);
    }
  }, [listingId, timezone]);

  // Seleccionar fecha y hora
  const selectDateTime = useCallback((date: string, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
    
    // Encontrar el slot correspondiente
    if (availabilityData) {
      const slot = availabilityData.slots.find(s => {
        const slotDate = s.startTime.split('T')[0];
        const slotTime = new Date(s.startTime).toLocaleTimeString('es-CL', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });
        return slotDate === date && slotTime === time;
      });
      
      setSelectedSlot(slot || null);
    }
    
    setError(null);
  }, [availabilityData]);

  // Crear visita con optimistic UI
  const createVisit = useCallback(async (userData: { name: string; phone: string; email?: string }) => {
    if (!selectedSlot || !selectedDate || !selectedTime) {
      setError('Debes seleccionar una fecha y hora');
      return null;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const idempotencyKey = generateIdempotencyKey();
      const visitData: CreateVisitRequest = {
        listingId,
        slotId: selectedSlot.id,
        userId: `user_${Date.now()}`, // Mock user ID
        channel: 'web',
        idempotencyKey
      };
      
      // Optimistic update: marcar slot como no disponible localmente
      if (availabilityData) {
        const updatedSlots = availabilityData.slots.map(slot =>
          slot.id === selectedSlot.id 
            ? { ...slot, status: 'reserved' as const }
            : slot
        );
        
        setAvailabilityData({
          ...availabilityData,
          slots: updatedSlots
        });
      }
      
      const response = await fetch('/api/visits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKey
        },
        body: JSON.stringify(visitData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        
        // Revertir optimistic update en caso de error
        if (availabilityData) {
          const revertedSlots = availabilityData.slots.map(slot =>
            slot.id === selectedSlot.id 
              ? { ...slot, status: 'open' as const }
              : slot
          );
          
          setAvailabilityData({
            ...availabilityData,
            slots: revertedSlots
          });
        }
        
        throw new Error(errorData.message || 'Error al crear la visita');
      }
      
      const result: CreateVisitResponse = await response.json();
      
      // Limpiar selección después de éxito
      clearSelection();
      
      return result;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error creating visit:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [listingId, selectedSlot, selectedDate, selectedTime, availabilityData]);

  // Limpiar selección
  const clearSelection = useCallback(() => {
    setSelectedDate(null);
    setSelectedTime(null);
    setSelectedSlot(null);
  }, []);

  // Limpiar error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // Estado
    isLoading,
    error,
    selectedDate,
    selectedTime,
    selectedSlot,
    
    // Datos
    availableDays,
    availableSlots,
    
    // Acciones
    fetchAvailability,
    selectDateTime,
    createVisit,
    clearSelection,
    clearError
  };
}
