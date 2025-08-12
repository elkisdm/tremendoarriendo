import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FlagToggle } from '@components/admin/FlagToggle';

// Mock fetch
global.fetch = jest.fn();

// Mock analytics
jest.mock('@lib/analytics', () => ({
  track: jest.fn()
}));

describe('FlagToggle', () => {
  const defaultProps = {
    flag: 'comingSoon' as const,
    label: 'Coming Soon',
    description: 'Controla si el sitio está en modo coming soon',
    initialValue: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with correct initial state', () => {
    render(<FlagToggle {...defaultProps} />);

    expect(screen.getByText('Coming Soon')).toBeInTheDocument();
    expect(screen.getByText('Controla si el sitio está en modo coming soon')).toBeInTheDocument();
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });

  it('shows override badge when overridden', () => {
    render(
      <FlagToggle 
        {...defaultProps} 
        overridden={true}
        expiresAt="2025-08-12T05:00:00.000Z"
      />
    );

    expect(screen.getByText('Override')).toBeInTheDocument();
    expect(screen.getByText(/Expira en/)).toBeInTheDocument();
  });

  it('handles successful toggle', async () => {
    const mockFetch = fetch as jest.MockedFunction<typeof fetch>;
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, message: 'Flag overrideado exitosamente' })
    } as Response);

    render(<FlagToggle {...defaultProps} />);

    const toggle = screen.getByRole('switch');
    fireEvent.click(toggle);

    await waitFor(() => {
      expect(screen.getByText('Flag overrideado exitosamente')).toBeInTheDocument();
    });

    expect(mockFetch).toHaveBeenCalledWith('/api/flags/override', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        flag: 'comingSoon',
        value: false,
        duration: 1800
      })
    });
  });

  it('handles toggle error', async () => {
    const mockFetch = fetch as jest.MockedFunction<typeof fetch>;
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: false, error: 'Error de validación' })
    } as Response);

    render(<FlagToggle {...defaultProps} />);

    const toggle = screen.getByRole('switch');
    fireEvent.click(toggle);

    await waitFor(() => {
      expect(screen.getByText('Error de validación')).toBeInTheDocument();
    });
  });

  it('handles network error', async () => {
    const mockFetch = fetch as jest.MockedFunction<typeof fetch>;
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    render(<FlagToggle {...defaultProps} />);

    const toggle = screen.getByRole('switch');
    fireEvent.click(toggle);

    await waitFor(() => {
      expect(screen.getByText('Error de conexión')).toBeInTheDocument();
    });
  });

  it('is accessible with proper ARIA attributes', () => {
    render(<FlagToggle {...defaultProps} />);

    const toggle = screen.getByRole('switch');
    expect(toggle).toHaveAttribute('aria-label', 'Toggle Coming Soon flag');
    expect(screen.getByText('Controla si el sitio está en modo coming soon')).toBeInTheDocument();
  });

  it('shows loading state during toggle', async () => {
    const mockFetch = fetch as jest.MockedFunction<typeof fetch>;
    let resolveFetch: (value: any) => void;
    const fetchPromise = new Promise((resolve) => {
      resolveFetch = resolve;
    });
    mockFetch.mockReturnValueOnce(fetchPromise as any);

    render(<FlagToggle {...defaultProps} />);

    const toggle = screen.getByRole('switch');
    fireEvent.click(toggle);

    // Should be disabled during loading
    expect(toggle).toHaveClass('opacity-50');
    expect(toggle).toBeDisabled();

    // Resolve the fetch
    resolveFetch!({
      ok: true,
      json: async () => ({ success: true, message: 'Success' })
    });

    await waitFor(() => {
      expect(toggle).not.toHaveClass('opacity-50');
    });
  });

  it('updates state when props change', () => {
    const { rerender } = render(<FlagToggle {...defaultProps} />);

    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');

    rerender(<FlagToggle {...defaultProps} initialValue={false} />);

    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
  });
});
