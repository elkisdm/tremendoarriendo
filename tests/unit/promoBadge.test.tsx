import { render, screen } from '@testing-library/react';
import { PromoBadge } from '../../components/marketing/PromoBadge';

// Mock lucide-react para evitar problemas en tests
jest.mock('lucide-react', () => ({
  CheckCircle: ({ className, ...props }: any) => (
    <svg className={className} {...props} data-testid="check-circle" />
  ),
}));

describe('PromoBadge', () => {
  it('renderiza el badge con el texto correcto', () => {
    render(<PromoBadge />);
    expect(screen.getByText('Sin letra chica')).toBeInTheDocument();
  });

  it('renderiza el icono CheckCircle', () => {
    render(<PromoBadge />);
    expect(screen.getByTestId('check-circle')).toBeInTheDocument();
  });

  it('tiene los atributos de accesibilidad correctos', () => {
    render(<PromoBadge />);
    const badge = screen.getByText('Sin letra chica').closest('div');
    expect(badge).toHaveAttribute('role', 'status');
    expect(badge).toHaveAttribute('aria-label', 'Promoción sin letra chica');
  });

  it('tiene las clases CSS correctas', () => {
    render(<PromoBadge />);
    const badge = screen.getByText('Sin letra chica').closest('div');
    expect(badge).toHaveClass(
      'inline-flex',
      'items-center',
      'gap-2',
      'rounded-2xl',
      'px-4',
      'py-2',
      'backdrop-blur',
      'border',
      'border-white/10',
      'bg-white/5',
      'text-white/90'
    );
  });

  it('acepta className adicional', () => {
    render(<PromoBadge className="custom-class" />);
    const badge = screen.getByText('Sin letra chica').closest('div');
    expect(badge).toHaveClass('custom-class');
  });

  it('el icono tiene las clases correctas', () => {
    render(<PromoBadge />);
    const icon = screen.getByTestId('check-circle');
    expect(icon).toHaveClass('w-4', 'h-4', 'text-brand-aqua', 'flex-shrink-0');
  });
});
