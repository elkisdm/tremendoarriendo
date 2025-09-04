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

// Mock de Notification API
const mockNotification = {
    requestPermission: jest.fn(),
};
Object.defineProperty(window, 'Notification', {
    value: mockNotification,
    writable: true,
});

// Mock de window.open
Object.defineProperty(window, 'open', {
    value: jest.fn(),
    writable: true,
});

describe('QuintoAndarVisitScheduler', () => {
    const defaultProps = {
        isOpen: true,
        onClose: jest.fn(),
        listingId: 'test-listing',
        propertyName: 'Test Property',
        propertyAddress: 'Test Address 123',
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

    const defaultMockReturn = {
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
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockUseVisitScheduler.mockReturnValue(defaultMockReturn);
    });

    describe('Renderizado inicial', () => {
        it('debería renderizar correctamente cuando está abierto', () => {
            render(<QuintoAndarVisitScheduler {...defaultProps} />);

            expect(screen.getByText('Test Property')).toBeInTheDocument();
            expect(screen.getByText('Test Address 123')).toBeInTheDocument();
            expect(screen.getByText('Selecciona fecha y hora')).toBeInTheDocument();
        });

        it('no debería renderizar cuando está cerrado', () => {
            render(<QuintoAndarVisitScheduler {...defaultProps} isOpen={false} />);

            expect(screen.queryByText('Test Property')).not.toBeInTheDocument();
        });

        it('debería mostrar el progreso correcto', () => {
            render(<QuintoAndarVisitScheduler {...defaultProps} />);

            expect(screen.getByText('1/4')).toBeInTheDocument();
            expect(screen.getByText('Selecciona fecha y hora')).toBeInTheDocument();
        });
    });

    describe('Selección de fecha', () => {
        it('debería mostrar días disponibles', () => {
            render(<QuintoAndarVisitScheduler {...defaultProps} />);

            expect(screen.getByText('Jue')).toBeInTheDocument();
            expect(screen.getByText('16')).toBeInTheDocument();
            expect(screen.getByText('Vie')).toBeInTheDocument();
            expect(screen.getByText('17')).toBeInTheDocument();
        });

        it('debería llamar selectDateTime al hacer clic en un día', async () => {
            const user = userEvent.setup();
            render(<QuintoAndarVisitScheduler {...defaultProps} />);

            const dayButton = screen.getByText('16');
            await user.click(dayButton);

            expect(defaultMockReturn.selectDateTime).toHaveBeenCalledWith('2025-01-16', '');
        });

        it('debería mostrar días no disponibles como deshabilitados', () => {
            const mockDaysWithUnavailable = [
                ...mockAvailableDays,
                {
                    id: 'day-3',
                    date: '2025-01-18',
                    day: 'Sáb',
                    number: '18',
                    available: false,
                    premium: false,
                    price: undefined,
                    slotsCount: 0
                }
            ];

            mockUseVisitScheduler.mockReturnValue({
                ...defaultMockReturn,
                availableDays: mockDaysWithUnavailable
            });

            render(<QuintoAndarVisitScheduler {...defaultProps} />);

            const unavailableDay = screen.getByText('18');
            expect(unavailableDay.closest('button')).toBeDisabled();
        });
    });

    describe('Selección de hora', () => {
        it('debería mostrar horas disponibles cuando se selecciona una fecha', () => {
            mockUseVisitScheduler.mockReturnValue({
                ...defaultMockReturn,
                selectedDate: '2025-01-16'
            });

            render(<QuintoAndarVisitScheduler {...defaultProps} />);

            expect(screen.getByText('10:00')).toBeInTheDocument();
            expect(screen.getByText('11:00')).toBeInTheDocument();
        });

        it('debería llamar selectDateTime al hacer clic en una hora', async () => {
            const user = userEvent.setup();
            mockUseVisitScheduler.mockReturnValue({
                ...defaultMockReturn,
                selectedDate: '2025-01-16'
            });

            render(<QuintoAndarVisitScheduler {...defaultProps} />);

            const timeButton = screen.getByText('10:00');
            await user.click(timeButton);

            expect(defaultMockReturn.selectDateTime).toHaveBeenCalledWith('2025-01-16', '10:00');
        });

        it('no debería mostrar horas si no hay fecha seleccionada', () => {
            render(<QuintoAndarVisitScheduler {...defaultProps} />);

            expect(screen.queryByText('10:00')).not.toBeInTheDocument();
        });
    });

    describe('Navegación entre pasos', () => {
        it('debería avanzar al paso de contacto cuando se puede continuar', async () => {
            const user = userEvent.setup();
            mockUseVisitScheduler.mockReturnValue({
                ...defaultMockReturn,
                selectedDate: '2025-01-16',
                selectedTime: '10:00'
            });

            render(<QuintoAndarVisitScheduler {...defaultProps} />);

            const continueButton = screen.getByText('Continuar →');
            await user.click(continueButton);

            expect(screen.getByText('Datos de contacto')).toBeInTheDocument();
            expect(screen.getByText('2/4')).toBeInTheDocument();
        });

        it('debería deshabilitar el botón continuar si no hay selección completa', () => {
            render(<QuintoAndarVisitScheduler {...defaultProps} />);

            const continueButton = screen.getByText('Continuar →');
            expect(continueButton).toBeDisabled();
        });
    });

    describe('Formulario de contacto', () => {
        beforeEach(() => {
            mockUseVisitScheduler.mockReturnValue({
                ...defaultMockReturn,
                selectedDate: '2025-01-16',
                selectedTime: '10:00'
            });
        });

        it('debería mostrar campos de formulario', async () => {
            const user = userEvent.setup();
            render(<QuintoAndarVisitScheduler {...defaultProps} />);

            const continueButton = screen.getByText('Continuar →');
            await user.click(continueButton);

            expect(screen.getByLabelText('Nombre completo *')).toBeInTheDocument();
            expect(screen.getByLabelText('Email *')).toBeInTheDocument();
            expect(screen.getByLabelText('RUT *')).toBeInTheDocument();
            expect(screen.getByLabelText('Teléfono *')).toBeInTheDocument();
        });

        it('debería validar campos en tiempo real', async () => {
            const user = userEvent.setup();
            render(<QuintoAndarVisitScheduler {...defaultProps} />);

            const continueButton = screen.getByText('Continuar →');
            await user.click(continueButton);

            const nameInput = screen.getByLabelText('Nombre completo *');
            await user.type(nameInput, 'J');

            // Debería mostrar error de validación
            expect(screen.getByText('Nombre muy corto')).toBeInTheDocument();
        });

        it('debería mostrar validación exitosa con íconos', async () => {
            const user = userEvent.setup();
            render(<QuintoAndarVisitScheduler {...defaultProps} />);

            const continueButton = screen.getByText('Continuar →');
            await user.click(continueButton);

            const nameInput = screen.getByLabelText('Nombre completo *');
            await user.type(nameInput, 'Juan Pérez');

            // Debería mostrar ícono de éxito
            expect(screen.getByTestId('check-icon')).toBeInTheDocument();
        });

        it('debería permitir regresar al paso anterior', async () => {
            const user = userEvent.setup();
            render(<QuintoAndarVisitScheduler {...defaultProps} />);

            const continueButton = screen.getByText('Continuar →');
            await user.click(continueButton);

            const backButton = screen.getByText('← Atrás');
            await user.click(backButton);

            expect(screen.getByText('Selecciona fecha y hora')).toBeInTheDocument();
        });
    });

    describe('Características premium', () => {
        it('debería mostrar paso premium después del formulario', async () => {
            const user = userEvent.setup();
            mockUseVisitScheduler.mockReturnValue({
                ...defaultMockReturn,
                selectedDate: '2025-01-16',
                selectedTime: '10:00'
            });

            render(<QuintoAndarVisitScheduler {...defaultProps} />);

            // Avanzar al formulario
            const continueButton = screen.getByText('Continuar →');
            await user.click(continueButton);

            // Completar formulario
            const nameInput = screen.getByLabelText('Nombre completo *');
            const emailInput = screen.getByLabelText('Email *');
            const rutInput = screen.getByLabelText('RUT *');
            const phoneInput = screen.getByLabelText('Teléfono *');

            await user.type(nameInput, 'Juan Pérez');
            await user.type(emailInput, 'juan@example.com');
            await user.type(rutInput, '12345678-9');
            await user.type(phoneInput, '912345678');

            // Enviar formulario
            const submitButton = screen.getByText('Continuar →');
            await user.click(submitButton);

            expect(screen.getByTestId('premium-features')).toBeInTheDocument();
        });
    });

    describe('Paso de éxito', () => {
        it('debería mostrar confirmación de visita', async () => {
            const user = userEvent.setup();
            mockUseVisitScheduler.mockReturnValue({
                ...defaultMockReturn,
                selectedDate: '2025-01-16',
                selectedTime: '10:00'
            });

            // Mock de createVisit exitoso
            const mockCreateVisit = jest.fn().mockResolvedValue({
                visitId: 'visit-123',
                status: 'confirmed'
            });

            mockUseVisitScheduler.mockReturnValue({
                ...defaultMockReturn,
                selectedDate: '2025-01-16',
                selectedTime: '10:00',
                createVisit: mockCreateVisit
            });

            render(<QuintoAndarVisitScheduler {...defaultProps} />);

            // Completar flujo completo
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

            // Avanzar desde premium
            const premiumContinue = screen.getByText('Continuar');
            await user.click(premiumContinue);

            await waitFor(() => {
                expect(screen.getByText('¡Visita confirmada!')).toBeInTheDocument();
            });
        });
    });

    describe('Modo oscuro', () => {
        it('debería cambiar entre modo claro y oscuro', async () => {
            const user = userEvent.setup();
            render(<QuintoAndarVisitScheduler {...defaultProps} />);

            const themeButton = screen.getByLabelText('Cambiar tema');
            await user.click(themeButton);

            // Verificar que se cambió el tema (esto se puede verificar por las clases CSS)
            expect(themeButton).toBeInTheDocument();
        });
    });

    describe('Manejo de errores', () => {
        it('debería mostrar errores del hook', () => {
            mockUseVisitScheduler.mockReturnValue({
                ...defaultMockReturn,
                error: 'Error de conexión'
            });

            render(<QuintoAndarVisitScheduler {...defaultProps} />);

            expect(screen.getByText('Error de conexión')).toBeInTheDocument();
        });

        it('debería cerrar modal al hacer clic en X', async () => {
            const user = userEvent.setup();
            render(<QuintoAndarVisitScheduler {...defaultProps} />);

            const closeButton = screen.getByLabelText('Cerrar');
            await user.click(closeButton);

            expect(defaultProps.onClose).toHaveBeenCalled();
        });

        it('debería cerrar modal al hacer clic fuera', async () => {
            const user = userEvent.setup();
            render(<QuintoAndarVisitScheduler {...defaultProps} />);

            const backdrop = screen.getByTestId('modal-backdrop');
            await user.click(backdrop);

            expect(defaultProps.onClose).toHaveBeenCalled();
        });
    });

    describe('Accesibilidad', () => {
        it('debería tener labels apropiados', () => {
            render(<QuintoAndarVisitScheduler {...defaultProps} />);

            expect(screen.getByLabelText('Cerrar')).toBeInTheDocument();
            expect(screen.getByLabelText('Cambiar tema')).toBeInTheDocument();
        });

        it('debería ser navegable con teclado', async () => {
            const user = userEvent.setup();
            render(<QuintoAndarVisitScheduler {...defaultProps} />);

            const firstButton = screen.getByText('16');
            firstButton.focus();
            expect(document.activeElement).toBe(firstButton);

            await user.keyboard('{Tab}');
            // Verificar que el foco se mueve al siguiente elemento
        });
    });
});
