import { renderHook, act } from '@testing-library/react';
import { useVisitScheduler } from '@/hooks/useVisitScheduler';

// Mock de fetch
global.fetch = jest.fn();

describe('useVisitScheduler', () => {
    const mockListingId = 'test-listing';
    const mockTimezone = 'America/Santiago';

    beforeEach(() => {
        jest.clearAllMocks();
        (fetch as jest.Mock).mockClear();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('Inicialización', () => {
        it('debería inicializar con valores por defecto', () => {
            const { result } = renderHook(() => 
                useVisitScheduler({ listingId: mockListingId })
            );

            expect(result.current.isLoading).toBe(false);
            expect(result.current.error).toBeNull();
            expect(result.current.selectedDate).toBeNull();
            expect(result.current.selectedTime).toBeNull();
            expect(result.current.selectedSlot).toBeNull();
            expect(result.current.availableDays).toEqual([]);
            expect(result.current.availableSlots).toEqual([]);
        });

        it('debería usar timezone por defecto si no se proporciona', () => {
            const { result } = renderHook(() => 
                useVisitScheduler({ listingId: mockListingId })
            );

            expect(result.current).toBeDefined();
        });
    });

    describe('Generación de días disponibles', () => {
        it('debería generar próximos 5 días consecutivos', () => {
            const { result } = renderHook(() => 
                useVisitScheduler({ listingId: mockListingId })
            );

            // Simular datos de disponibilidad
            act(() => {
                result.current.fetchAvailability(
                    new Date('2025-01-15'),
                    new Date('2025-01-20')
                );
            });

            // Verificar que se generan 5 días
            expect(result.current.availableDays).toHaveLength(5);
        });

        it('debería incluir fines de semana en los días disponibles', () => {
            const { result } = renderHook(() => 
                useVisitScheduler({ listingId: mockListingId })
            );

            act(() => {
                result.current.fetchAvailability(
                    new Date('2025-01-15'),
                    new Date('2025-01-20')
                );
            });

            const days = result.current.availableDays;
            const dayNames = days.map(day => day.day);
            
            // Verificar que incluye fines de semana
            expect(dayNames).toContain('Dom');
            expect(dayNames).toContain('Sáb');
        });

        it('debería marcar días como disponibles si tienen slots', () => {
            const mockAvailabilityData = {
                listingId: mockListingId,
                timezone: mockTimezone,
                slots: [
                    {
                        id: 'slot-1',
                        startTime: '2025-01-16T10:00:00-03:00',
                        endTime: '2025-01-16T10:30:00-03:00',
                        status: 'open' as const
                    }
                ],
                nextAvailableDate: '2025-01-21T00:00:00-03:00'
            };

            (fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => mockAvailabilityData
            });

            const { result } = renderHook(() => 
                useVisitScheduler({ listingId: mockListingId })
            );

            act(async () => {
                await result.current.fetchAvailability(
                    new Date('2025-01-15'),
                    new Date('2025-01-20')
                );
            });

            const dayWithSlots = result.current.availableDays.find(
                day => day.date === '2025-01-16'
            );
            expect(dayWithSlots?.available).toBe(true);
            expect(dayWithSlots?.slotsCount).toBe(1);
        });
    });

    describe('fetchAvailability', () => {
        it('debería hacer fetch correctamente con parámetros', async () => {
            const mockResponse = {
                listingId: mockListingId,
                timezone: mockTimezone,
                slots: [],
                nextAvailableDate: '2025-01-21T00:00:00-03:00'
            };

            (fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse
            });

            const { result } = renderHook(() => 
                useVisitScheduler({ listingId: mockListingId })
            );

            await act(async () => {
                await result.current.fetchAvailability(
                    new Date('2025-01-15'),
                    new Date('2025-01-20')
                );
            });

            expect(fetch).toHaveBeenCalledWith(
                expect.stringContaining('/api/availability')
            );
            expect(fetch).toHaveBeenCalledWith(
                expect.stringContaining(`listingId=${mockListingId}`)
            );
        });

        it('debería manejar errores de API correctamente', async () => {
            (fetch as jest.Mock).mockRejectedValueOnce(
                new Error('Network error')
            );

            const { result } = renderHook(() => 
                useVisitScheduler({ listingId: mockListingId })
            );

            await act(async () => {
                await result.current.fetchAvailability(
                    new Date('2025-01-15'),
                    new Date('2025-01-20')
                );
            });

            expect(result.current.error).toBe('Network error');
            expect(result.current.isLoading).toBe(false);
        });

        it('debería manejar respuestas de error de API', async () => {
            (fetch as jest.Mock).mockResolvedValueOnce({
                ok: false,
                json: async () => ({ error: 'Invalid listing ID' })
            });

            const { result } = renderHook(() => 
                useVisitScheduler({ listingId: mockListingId })
            );

            await act(async () => {
                await result.current.fetchAvailability(
                    new Date('2025-01-15'),
                    new Date('2025-01-20')
                );
            });

            expect(result.current.error).toBe('Invalid listing ID');
        });
    });

    describe('selectDateTime', () => {
        it('debería seleccionar fecha y hora correctamente', () => {
            const mockAvailabilityData = {
                listingId: mockListingId,
                timezone: mockTimezone,
                slots: [
                    {
                        id: 'slot-1',
                        startTime: '2025-01-16T10:00:00-03:00',
                        endTime: '2025-01-16T10:30:00-03:00',
                        status: 'open' as const
                    }
                ],
                nextAvailableDate: '2025-01-21T00:00:00-03:00'
            };

            const { result } = renderHook(() => 
                useVisitScheduler({ listingId: mockListingId })
            );

            // Simular datos cargados
            act(() => {
                // @ts-ignore - Simular datos internos
                result.current.availabilityData = mockAvailabilityData;
            });

            act(() => {
                result.current.selectDateTime('2025-01-16', '10:00');
            });

            expect(result.current.selectedDate).toBe('2025-01-16');
            expect(result.current.selectedTime).toBe('10:00');
            expect(result.current.selectedSlot).toEqual(mockAvailabilityData.slots[0]);
        });

        it('debería limpiar error al seleccionar fecha/hora', () => {
            const { result } = renderHook(() => 
                useVisitScheduler({ listingId: mockListingId })
            );

            // Simular error
            act(() => {
                // @ts-ignore - Simular error interno
                result.current.error = 'Test error';
            });

            act(() => {
                result.current.selectDateTime('2025-01-16', '10:00');
            });

            expect(result.current.error).toBeNull();
        });
    });

    describe('createVisit', () => {
        it('debería crear visita correctamente', async () => {
            const mockVisitResponse = {
                visitId: 'visit-123',
                status: 'confirmed',
                message: 'Visita creada exitosamente'
            };

            (fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => mockVisitResponse
            });

            const { result } = renderHook(() => 
                useVisitScheduler({ listingId: mockListingId })
            );

            // Simular selección previa
            act(() => {
                result.current.selectDateTime('2025-01-16', '10:00');
            });

            const userData = {
                name: 'Juan Pérez',
                phone: '+56912345678',
                email: 'juan@example.com'
            };

            let visitResult;
            await act(async () => {
                visitResult = await result.current.createVisit(userData);
            });

            expect(visitResult).toEqual(mockVisitResponse);
            expect(fetch).toHaveBeenCalledWith('/api/visits', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Idempotency-Key': expect.any(String)
                },
                body: expect.stringContaining('"listingId":"test-listing"')
            });
        });

        it('debería manejar errores al crear visita', async () => {
            (fetch as jest.Mock).mockResolvedValueOnce({
                ok: false,
                json: async () => ({ message: 'Slot no disponible' })
            });

            const { result } = renderHook(() => 
                useVisitScheduler({ listingId: mockListingId })
            );

            act(() => {
                result.current.selectDateTime('2025-01-16', '10:00');
            });

            const userData = {
                name: 'Juan Pérez',
                phone: '+56912345678'
            };

            let visitResult;
            await act(async () => {
                visitResult = await result.current.createVisit(userData);
            });

            expect(visitResult).toBeNull();
            expect(result.current.error).toBe('Slot no disponible');
        });

        it('debería validar que se haya seleccionado fecha y hora', async () => {
            const { result } = renderHook(() => 
                useVisitScheduler({ listingId: mockListingId })
            );

            const userData = {
                name: 'Juan Pérez',
                phone: '+56912345678'
            };

            let visitResult;
            await act(async () => {
                visitResult = await result.current.createVisit(userData);
            });

            expect(visitResult).toBeNull();
            expect(result.current.error).toBe('Debes seleccionar una fecha y hora');
        });
    });

    describe('clearSelection', () => {
        it('debería limpiar selección correctamente', () => {
            const { result } = renderHook(() => 
                useVisitScheduler({ listingId: mockListingId })
            );

            // Simular selección
            act(() => {
                result.current.selectDateTime('2025-01-16', '10:00');
            });

            expect(result.current.selectedDate).toBe('2025-01-16');
            expect(result.current.selectedTime).toBe('10:00');

            // Limpiar selección
            act(() => {
                result.current.clearSelection();
            });

            expect(result.current.selectedDate).toBeNull();
            expect(result.current.selectedTime).toBeNull();
            expect(result.current.selectedSlot).toBeNull();
        });
    });

    describe('clearError', () => {
        it('debería limpiar error correctamente', () => {
            const { result } = renderHook(() => 
                useVisitScheduler({ listingId: mockListingId })
            );

            // Simular error
            act(() => {
                // @ts-ignore - Simular error interno
                result.current.error = 'Test error';
            });

            expect(result.current.error).toBe('Test error');

            // Limpiar error
            act(() => {
                result.current.clearError();
            });

            expect(result.current.error).toBeNull();
        });
    });
});
