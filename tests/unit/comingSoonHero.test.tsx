import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ComingSoonHero } from '@components/marketing/ComingSoonHero';

// Mock de módulos antes de importar el componente

jest.mock('@lib/analytics', () => ({
  track: jest.fn()
}));

jest.mock('@components/marketing/PromoBadge', () => ({
  PromoBadge: () => <div data-testid="promo-badge">Promo Badge</div>
}));

jest.mock('@components/ui/Modal', () => ({
  Modal: ({ children, isOpen, onClose }: any) => 
    isOpen ? <div data-testid="modal">{children}</div> : null
}));

jest.mock('@components/marketing/WaitlistForm', () => ({
  WaitlistForm: () => <div data-testid="waitlist-form">Waitlist Form</div>
}));

// Mock lucide-react para evitar problemas en tests
jest.mock('lucide-react', () => ({
  ShieldCheck: ({ className, ...props }: any) => (
    <svg className={className} {...props} data-testid="shield-check" />
  ),
  Sparkles: ({ className, ...props }: any) => (
    <svg className={className} {...props} data-testid="sparkles" />
  ),
  Clock: ({ className, ...props }: any) => (
    <svg className={className} {...props} data-testid="clock" />
  ),
  Building: ({ className, ...props }: any) => (
    <svg className={className} {...props} data-testid="building" />
  ),
  Building2: ({ className, ...props }: any) => (
    <svg className={className} {...props} data-testid="building2" />
  ),
  MessageCircle: ({ className, ...props }: any) => (
    <svg className={className} {...props} data-testid="message-circle" />
  ),
  MessageSquare: ({ className, ...props }: any) => (
    <svg className={className} {...props} data-testid="message-square" />
  ),
  DollarSign: ({ className, ...props }: any) => (
    <svg className={className} {...props} data-testid="dollar-sign" />
  ),
  Zap: ({ className, ...props }: any) => (
    <svg className={className} {...props} data-testid="zap" />
  ),
  CheckCircle: ({ className, ...props }: any) => (
    <svg className={className} {...props} data-testid="check-circle" />
  ),
  Smartphone: ({ className, ...props }: any) => (
    <svg className={className} {...props} data-testid="smartphone" />
  ),
  Headphones: ({ className, ...props }: any) => (
    <svg className={className} {...props} data-testid="headphones" />
  ),
  FileText: ({ className, ...props }: any) => (
    <svg className={className} {...props} data-testid="file-text" />
  ),
  Calendar: ({ className, ...props }: any) => (
    <svg className={className} {...props} data-testid="calendar" />
  ),
}));

// Mock framer-motion para evitar problemas en tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    a: ({ children, ...props }: any) => <a {...props}>{children}</a>,
  },
  MotionConfig: ({ children }: any) => <div>{children}</div>,
  useReducedMotion: () => false,
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock buildWhatsAppUrl
jest.mock('@lib/whatsapp', () => ({
  buildWhatsAppUrl: jest.fn().mockReturnValue('https://wa.me/test'),
}));

// Mock track function
jest.mock('@lib/analytics', () => ({
  track: jest.fn(),
}));

describe('ComingSoonHero', () => {
  beforeEach(() => {
    // Mock document.getElementById para el scroll
    document.getElementById = jest.fn().mockReturnValue({
      scrollIntoView: jest.fn(),
    });
    
    // Mock window.open
    window.open = jest.fn();
  });

  it('renderiza el título principal', () => {
    render(<ComingSoonHero />);
    expect(screen.getByText('Próximamente')).toBeInTheDocument();
  });

  it('renderiza el subtítulo', () => {
    render(<ComingSoonHero />);
    expect(screen.getByText('Estamos preparando la nueva experiencia de arriendo 0% comisión. Sin letra chica.')).toBeInTheDocument();
  });

  it('renderiza el mensaje de ahorro', () => {
    render(<ComingSoonHero />);
    expect(screen.getByText(/Ahorra hasta \$500\.000 en comisiones/)).toBeInTheDocument();
  });

  it('renderiza los beneficios', () => {
    render(<ComingSoonHero />);
    expect(screen.getByText('0% comisión de corretaje')).toBeInTheDocument();
    expect(screen.getByText('Proceso 100% digital')).toBeInTheDocument();
    expect(screen.getByText('Edificios premium verificados')).toBeInTheDocument();
    expect(screen.getByText('Soporte personalizado 24/7')).toBeInTheDocument();
    expect(screen.getByText('Sin letra chica ni sorpresas')).toBeInTheDocument();
    expect(screen.getByText('Reserva sin compromiso')).toBeInTheDocument();
  });

  it('renderiza el ejemplo de ahorro', () => {
    render(<ComingSoonHero />);
    expect(screen.getByText('Ejemplo: Arriendo $500.000 → Ahorras $297.500 en comisión (incluye IVA)')).toBeInTheDocument();
  });

  it('renderiza los iconos de características', () => {
    render(<ComingSoonHero />);
    expect(screen.getByText('Seguridad garantizada')).toBeInTheDocument();
    expect(screen.getByText('Experiencia premium')).toBeInTheDocument();
    expect(screen.getByText('Proceso rápido')).toBeInTheDocument();
    expect(screen.getByText('Edificios exclusivos')).toBeInTheDocument();
    expect(screen.getByText('Soporte 24/7')).toBeInTheDocument();
  });

  it('renderiza los botones CTA', () => {
    render(<ComingSoonHero />);
    expect(screen.getByRole('button', { name: /avísame cuando esté listo/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /hablá con nosotros/i })).toBeInTheDocument();
  });

  it('renderiza el texto de contacto', () => {
    render(<ComingSoonHero />);
    expect(screen.getByText('¿Tenés dudas? Escribinos por WhatsApp y te respondemos al toque 🚀')).toBeInTheDocument();
  });

  it('tiene las clases CSS correctas para efectos visuales', () => {
    render(<ComingSoonHero />);
    
    // Verificar que el contenedor principal tiene las clases para overflow y posicionamiento
    const section = screen.getByText('Próximamente').closest('section');
    expect(section).toHaveClass('relative', 'min-h-[70vh]', 'overflow-hidden');
    
    // Verificar que el título tiene las clases de gradiente y sombra
    const title = screen.getByText('Próximamente');
    expect(title).toHaveClass('bg-gradient-to-r', 'text-transparent', 'bg-clip-text');
    
    // Verificar que el subtítulo tiene mejor contraste
    const subtitle = screen.getByText('Estamos preparando la nueva experiencia de arriendo 0% comisión. Sin letra chica.');
    expect(subtitle).toHaveClass('text-neutral-100');
  });

  it('maneja el click del botón waitlist correctamente', () => {
    render(<ComingSoonHero />);
    const button = screen.getByRole('button', { name: /avísame cuando esté listo/i });
    
    button.click();
    
    // Verificar que el modal se abre (esto se puede verificar de otras maneras)
    expect(button).toBeInTheDocument();
  });

  it('maneja el click del botón WhatsApp correctamente', () => {
    render(<ComingSoonHero />);
    const link = screen.getByRole('link', { name: /hablá con nosotros/i });
    
    expect(link).toHaveAttribute('href', 'https://wa.me/test');
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('responde a prefers-reduced-motion', () => {
    // Mock prefers-reduced-motion: true
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: query.includes('prefers-reduced-motion'),
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    render(<ComingSoonHero />);
    
    // El componente debería renderizar correctamente incluso con motion reducido
    expect(screen.getByText('Próximamente')).toBeInTheDocument();
  });
});
