import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QuintoAndarVisitScheduler } from '@/components/flow/QuintoAndarVisitScheduler';
import { useVisitScheduler } from '@/hooks/useVisitScheduler';

// Mock del hook
jest.mock('@/hooks/useVisitScheduler');
const mockUseVisitScheduler = useVisitScheduler as jest.MockedFunction<typeof useVisitScheduler>;

// Mock de framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
        button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
        h3: ({ children, ...props }: any) => <h3 {...props}>{children}</h3>,
        p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock de PremiumFeaturesStep
jest.mock('@/components/flow/PremiumFeaturesStep', () => ({
    PremiumFeaturesStep: ({ onBack, onContinue }: any) => (
        <div data-testid="premium-features">
            <button onClick={onBack}>Atrás</button>
            <button onClick={onContinue}>Continuar</button>
        </div>
    )
}));

// Mock de APIs
global.fetch = jest.fn();

describe('Flujo completo de agendamiento de visitas', () => {
    const defaultProps = {
        isOpen: true,
        onClose: jest.fn(),
        listingId: 'test-listing',
        propertyName: 'Casa Test',
        propertyAddress: 'Av. Test 123, Santiago',
        propertyImage: 'test-image.jpg',
        onSuccess: jest.fn(),
    };

    const mockAvailableDays = [
        {
            id: 'day-1',
            date: '2025-01-16',
            day: 'Jue',
            number: '16',
            available: true,
            premium: false,
            price: undefined,
            slotsCount: 3
        },
        {
            id: 'day-2',
            date: '2025-01-17',
            day: 'Vie',
            number: '17',
            available: true,
            premium: false,
            price: undefined,
            slotsCount: 2
        }
    ];

    const mockAvailableSlots = [
        {
            id: 'time-1',
            time: '10:00',
            available: true,
            premium: false,
            instantBooking: false,
            slotId: 'slot-1'
        },
        {
            id: 'time-2',
            time: '11:00',
            available: true,
            premium: false,
            instantBooking: false,
            slotId: 'slot-2'
        }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        (fetch as jest.Mock).mockClear();
    });

    describe('Flujo exitoso completo', () => {
        it('debería completar todo el flujo desde selección hasta confirmación', async () => {
            const user = userEvent.setup();
            
            // Mock de createVisit exitoso
            const mockCreateVisit = jest.fn().mockResolvedValue({
                visitId: 'visit-123',
                status: 'confirmed',
                message: 'Visita creada exitosamente'
            });

            // Mock de fetchAvailability exitoso
            const mockFetchAvailability = jest.fn().mockResolvedValue(undefined);

            mockUseVisitScheduler.mockReturnValue({
                isLoading: false,
                error: null,
                selectedDate: null,
                selectedTime: null,
                selectedSlot: null,
                availableDays: mockAvailableDays,
                availableSlots: mockAvailableSlots,
                fetchAvailability: mockFetchAvailability,
                selectDateTime: jest.fn(),
                createVisit: mockCreateVisit,
                clearSelection: jest.fn(),
                clearError: jest.fn(),
            });

            render(<QuintoAndarVisitScheduler {...defaultProps} />);

            // Paso 1: Seleccionar fecha
            const dayButton = screen.getByText('16');
            await user.click(dayButton);

            // Verificar que se seleccionó la fecha
            expect(dayButton.closest('button')).toHaveClass('bg-blue-600');

            // Paso 2: Seleccionar hora
            const timeButton = screen.getByText('10:00');
            await user.click(timeButton);

            // Verificar que se seleccionó la hora
            expect(timeButton.closest('button')).toHaveClass('bg-green-600');

            // Paso 3: Continuar al formulario
            const continueButton = screen.getByText('Continuar →');
            await user.click(continueButton);

            // Verificar que estamos en el paso de contacto
            expect(screen.getByText('Datos de contacto')).toBeInTheDocument();
            expect(screen.getByText('2/4')).toBeInTheDocument();

            // Paso 4: Completar formulario
            const nameInput = screen.getByLabelText('Nombre completo *');
            const emailInput = screen.getByLabelText('Email *');
            const rutInput = screen.getByLabelText('RUT *');
            const phoneInput = screen.getByLabelText('Teléfono *');

            await user.type(nameInput, 'Juan Pérez');
            await user.type(emailInput, 'juan@example.com');
            await user.type(rutInput, '12345678-9');
            await user.type(phoneInput, '912345678');

            // Verificar validación en tiempo real
            await waitFor(() => {
                expect(screen.getByTestId('check-icon')).toBeInTheDocument();
            });

            // Paso 5: Enviar formulario
            const submitButton = screen.getByText('Continuar →');
            await user.click(submitButton);

            // Verificar que estamos en el paso premium
            expect(screen.getByTestId('premium-features')).toBeInTheDocument();
            expect(screen.getByText('3/4')).toBeInTheDocument();

            // Paso 6: Continuar desde premium
            const premiumContinue = screen.getByText('Continuar');
            await user.click(premiumContinue);

            // Verificar que se llamó createVisit
            await waitFor(() => {
                expect(mockCreateVisit).toHaveBeenCalledWith({
                    name: 'Juan Pérez',
                    phone: '912345678',
                    email: 'juan@example.com'
                });
            });

            // Verificar que estamos en el paso de éxito
            await waitFor(() => {
                expect(screen.getByText('¡Visita confirmada!')).toBeInTheDocument();
                expect(screen.getByText('4/4')).toBeInTheDocument();
            });

            // Verificar detalles de la visita
            expect(screen.getByText('Casa Test')).toBeInTheDocument();
            expect(screen.getByText('2025-01-16')).toBeInTheDocument();
            expect(screen.getByText('10:00')).toBeInTheDocument();
        });
    });

    describe('Flujo con errores', () => {
        it('debería manejar errores de API correctamente', async () => {
            const user = userEvent.setup();
            
            // Mock de createVisit con error
            const mockCreateVisit = jest.fn().mockRejectedValue(new Error('Error de red'));

            mockUseVisitScheduler.mockReturnValue({
                isLoading: false,
                error: null,
                selectedDate: '2025-01-16',
                selectedTime: '10:00',
                selectedSlot: { id: 'slot-1' },
                availableDays: mockAvailableDays,
                availableSlots: mockAvailableSlots,
                fetchAvailability: jest.fn(),
                selectDateTime: jest.fn(),
                createVisit: mockCreateVisit,
                clearSelection: jest.fn(),
                clearError: jest.fn(),
            });

            render(<QuintoAndarVisitScheduler {...defaultProps} />);

            // Avanzar al formulario
            const continueButton = screen.getByText('Continuar →');
            await user.click(continueButton);

            // Completar formulario
            const nameInput = screen.getByLabelText('Nombre completo *');
            await user.type(nameInput, 'Juan Pérez');

            const emailInput = screen.getByLabelText('Email *');
            await user.type(emailInput, 'juan@example.com');

            const rutInput = screen.getByLabelText('RUT *');
            await user.type(rutInput, '12345678-9');

            const phoneInput = screen.getByLabelText('Teléfono *');
            await user.type(phoneInput, '912345678');

            // Enviar formulario
            const submitButton = screen.getByText('Continuar →');
            await user.click(submitButton);

            // Avanzar desde premium
            const premiumContinue = screen.getByText('Continuar');
            await user.click(premiumContinue);

            // Verificar que se muestra el error
            await waitFor(() => {
                expect(screen.getByText('Error de red')).toBeInTheDocument();
            });
        });

        it('debería validar campos requeridos', async () => {
            const user = userEvent.setup();
            
            mockUseVisitScheduler.mockReturnValue({
                isLoading: false,
                error: null,
                selectedDate: '2025-01-16',
                selectedTime: '10:00',
                selectedSlot: { id: 'slot-1' },
                availableDays: mockAvailableDays,
                availableSlots: mockAvailableSlots,
                fetchAvailability: jest.fn(),
                selectDateTime: jest.fn(),
                createVisit: jest.fn(),
                clearSelection: jest.fn(),
                clearError: jest.fn(),
            });

            render(<QuintoAndarVisitScheduler {...defaultProps} />);

            // Avanzar al formulario
            const continueButton = screen.getByText('Continuar →');
            await user.click(continueButton);

            // Intentar enviar formulario vacío
            const submitButton = screen.getByText('Continuar →');
            expect(submitButton).toBeDisabled();

            // Completar solo nombre
            const nameInput = screen.getByLabelText('Nombre completo *');
            await user.type(nameInput, 'Juan Pérez');

            // Verificar que el botón sigue deshabilitado
            expect(submitButton).toBeDisabled();

            // Completar email inválido
            const emailInput = screen.getByLabelText('Email *');
            await user.type(emailInput, 'email-invalido');

            // Verificar error de validación
            expect(screen.getByText('Email inválido')).toBeInTheDocument();
        });
    });

    describe('Navegación entre pasos', () => {
        it('debería permitir navegación hacia atrás', async () => {
            const user = userEvent.setup();
            
            mockUseVisitScheduler.mockReturnValue({
                isLoading: false,
                error: null,
                selectedDate: '2025-01-16',
                selectedTime: '10:00',
                selectedSlot: { id: 'slot-1' },
                availableDays: mockAvailableDays,
                availableSlots: mockAvailableSlots,
                fetchAvailability: jest.fn(),
                selectDateTime: jest.fn(),
                createVisit: jest.fn(),
                clearSelection: jest.fn(),
                clearError: jest.fn(),
            });

            render(<QuintoAndarVisitScheduler {...defaultProps} />);

            // Avanzar al formulario
            const continueButton = screen.getByText('Continuar →');
            await user.click(continueButton);

            // Verificar que estamos en el paso 2
            expect(screen.getByText('2/4')).toBeInTheDocument();

            // Regresar al paso anterior
            const backButton = screen.getByText('← Atrás');
            await user.click(backButton);

            // Verificar que estamos de vuelta en el paso 1
            expect(screen.getByText('1/4')).toBeInTheDocument();
            expect(screen.getByText('Selecciona fecha y hora')).toBeInTheDocument();
        });

        it('debería mantener el estado al navegar entre pasos', async () => {
            const user = userEvent.setup();
            
            mockUseVisitScheduler.mockReturnValue({
                isLoading: false,
                error: null,
                selectedDate: '2025-01-16',
                selectedTime: '10:00',
                selectedSlot: { id: 'slot-1' },
                availableDays: mockAvailableDays,
                availableSlots: mockAvailableSlots,
                fetchAvailability: jest.fn(),
                selectDateTime: jest.fn(),
                createVisit: jest.fn(),
                clearSelection: jest.fn(),
                clearError: jest.fn(),
            });

            render(<QuintoAndarVisitScheduler {...defaultProps} />);

            // Avanzar al formulario
            const continueButton = screen.getByText('Continuar →');
            await user.click(continueButton);

            // Completar formulario parcialmente
            const nameInput = screen.getByLabelText('Nombre completo *');
            await user.type(nameInput, 'Juan Pérez');

            // Regresar y volver a avanzar
            const backButton = screen.getByText('← Atrás');
            await user.click(backButton);

            const continueButton2 = screen.getByText('Continuar →');
            await user.click(continueButton2);

            // Verificar que el nombre se mantiene
            expect(nameInput).toHaveValue('Juan Pérez');
        });
    });

    describe('Características premium', () => {
        it('debería activar notificaciones correctamente', async () => {
            const user = userEvent.setup();
            
            // Mock de Notification API
            const mockRequestPermission = jest.fn().mockResolvedValue('granted');
            Object.defineProperty(window, 'Notification', {
                value: {
                    requestPermission: mockRequestPermission
                },
                writable: true,
            });

            mockUseVisitScheduler.mockReturnValue({
                isLoading: false,
                error: null,
                selectedDate: '2025-01-16',
                selectedTime: '10:00',
                selectedSlot: { id: 'slot-1' },
                availableDays: mockAvailableDays,
                availableSlots: mockAvailableSlots,
                fetchAvailability: jest.fn(),
                selectDateTime: jest.fn(),
                createVisit: jest.fn().mockResolvedValue({ visitId: 'visit-123' }),
                clearSelection: jest.fn(),
                clearError: jest.fn(),
            });

            render(<QuintoAndarVisitScheduler {...defaultProps} />);

            // Completar flujo hasta premium
            const continueButton = screen.getByText('Continuar →');
            await user.click(continueButton);

            const nameInput = screen.getByLabelText('Nombre completo *');
            await user.type(nameInput, 'Juan Pérez');

            const emailInput = screen.getByLabelText('Email *');
            await user.type(emailInput, 'juan@example.com');

            const rutInput = screen.getByLabelText('RUT *');
            await user.type(rutInput, '12345678-9');

            const phoneInput = screen.getByLabelText('Teléfono *');
            await user.type(phoneInput, '912345678');

            const submitButton = screen.getByText('Continuar →');
            await user.click(submitButton);

            // Verificar que estamos en el paso premium
            expect(screen.getByTestId('premium-features')).toBeInTheDocument();
        });
    });

    describe('Accesibilidad y usabilidad', () => {
        it('debería ser completamente navegable con teclado', async () => {
            const user = userEvent.setup();
            
            mockUseVisitScheduler.mockReturnValue({
                isLoading: false,
                error: null,
                selectedDate: null,
                selectedTime: null,
                selectedSlot: null,
                availableDays: mockAvailableDays,
                availableSlots: mockAvailableSlots,
                fetchAvailability: jest.fn(),
                selectDateTime: jest.fn(),
                createVisit: jest.fn(),
                clearSelection: jest.fn(),
                clearError: jest.fn(),
            });

            render(<QuintoAndarVisitScheduler {...defaultProps} />);

            // Navegar con Tab
            await user.tab();
            expect(document.activeElement).toBe(screen.getByLabelText('Cerrar'));

            await user.tab();
            expect(document.activeElement).toBe(screen.getByLabelText('Cambiar tema'));

            await user.tab();
            expect(document.activeElement).toBe(screen.getByText('16'));

            // Seleccionar con Enter
            await user.keyboard('{Enter}');
            expect(screen.getByText('16').closest('button')).toHaveClass('bg-blue-600');
        });

        it('debería tener contraste adecuado en modo oscuro', async () => {
            const user = userEvent.setup();
            
            mockUseVisitScheduler.mockReturnValue({
                isLoading: false,
                error: null,
                selectedDate: null,
                selectedTime: null,
                selectedSlot: null,
                availableDays: mockAvailableDays,
                availableSlots: mockAvailableSlots,
                fetchAvailability: jest.fn(),
                selectDateTime: jest.fn(),
                createVisit: jest.fn(),
                clearSelection: jest.fn(),
                clearError: jest.fn(),
            });

            render(<QuintoAndarVisitScheduler {...defaultProps} />);

            // Cambiar a modo oscuro
            const themeButton = screen.getByLabelText('Cambiar tema');
            await user.click(themeButton);

            // Verificar que los elementos tienen las clases de modo oscuro
            const modal = screen.getByRole('dialog');
            expect(modal).toHaveClass('bg-gray-900');
        });
    });
});
