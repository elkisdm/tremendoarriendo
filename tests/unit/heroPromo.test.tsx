import { render, screen } from '@testing-library/react';
import { HeroPromo } from '../../components/marketing/HeroPromo';

// Mock lucide-react para evitar problemas en tests
jest.mock('lucide-react', () => ({
  BadgePercent: ({ className, ...props }: any) => (
    <svg className={className} {...props} data-testid="badge-percent" />
  ),
}));

// Mock framer-motion para evitar problemas en tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
  MotionConfig: ({ children }: any) => <div>{children}</div>,
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

describe('HeroPromo', () => {
  beforeEach(() => {
    // Mock document.getElementById para el scroll
    document.getElementById = jest.fn().mockReturnValue({
      scrollIntoView: jest.fn(),
    });
  });

  it('renderiza el título principal', () => {
    render(<HeroPromo />);
    expect(screen.getByText('Arriendo 0% comisión')).toBeInTheDocument();
  });

  it('renderiza el subtítulo', () => {
    render(<HeroPromo />);
    expect(screen.getByText('Encuentra tu próximo hogar sin pagar comisión de corretaje')).toBeInTheDocument();
  });

  it('renderiza el botón CTA', () => {
    render(<HeroPromo />);
    expect(screen.getByRole('button', { name: /explorar edificios/i })).toBeInTheDocument();
  });

  it('renderiza el badge "Sin letra chica"', () => {
    render(<HeroPromo />);
    // Usar getAllByText para verificar que hay al menos un elemento con el texto
    const elements = screen.getAllByText('Sin letra chica');
    expect(elements.length).toBeGreaterThan(0);
  });

  it('renderiza el icon grid con 4 elementos', () => {
    render(<HeroPromo />);
    expect(screen.getByText('Sin comisión')).toBeInTheDocument();
    expect(screen.getByText('Agenda fácil')).toBeInTheDocument();
    expect(screen.getByText('Precios claros')).toBeInTheDocument();
    // Verificar que hay al menos un elemento con "Sin letra chica" en el grid
    const elements = screen.getAllByText('Sin letra chica');
    expect(elements.length).toBeGreaterThan(0);
  });

  it('tiene las clases CSS correctas para efectos visuales', () => {
    render(<HeroPromo />);
    
    // Verificar que el contenedor principal tiene las clases para overflow y posicionamiento
    const section = screen.getByText('Arriendo 0% comisión').closest('section');
    expect(section).toHaveClass('relative', 'overflow-hidden');
    
    // Verificar que el título tiene las clases de gradiente y sombra
    const title = screen.getByText('Arriendo 0% comisión');
    expect(title).toHaveClass('bg-gradient-to-r', 'from-brand-violet', 'to-brand-aqua', 'text-transparent', 'bg-clip-text');
    
    // Verificar que el subtítulo tiene mejor contraste
    const subtitle = screen.getByText('Encuentra tu próximo hogar sin pagar comisión de corretaje');
    expect(subtitle).toHaveClass('text-neutral-100');
  });

  it('maneja el click del botón CTA correctamente', () => {
    render(<HeroPromo />);
    const button = screen.getByRole('button', { name: /explorar edificios/i });
    
    button.click();
    
    expect(document.getElementById).toHaveBeenCalledWith('listado');
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

    render(<HeroPromo />);
    
    // El componente debería renderizar correctamente incluso con motion reducido
    expect(screen.getByText('Arriendo 0% comisión')).toBeInTheDocument();
  });
});
