import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FlagsAdminClient } from '../../app/admin/flags/FlagsAdminClient';

// Mock fetch
global.fetch = jest.fn();

// Mock analytics
jest.mock('@lib/analytics', () => ({
  track: jest.fn()
}));

// Mock FlagToggle component to capture interactions
const mockFlagToggle = jest.fn();
jest.mock('@components/admin/FlagToggle', () => ({
  FlagToggle: (props: any) => {
    mockFlagToggle(props);
    return (
      <div data-testid="flag-toggle">
        <h3>{props.label}</h3>
        <p>{props.description}</p>
        <span data-testid="flag-value">{props.initialValue ? 'true' : 'false'}</span>
        <span data-testid="flag-overridden">{props.overridden ? 'true' : 'false'}</span>
        {props.expiresAt && <span data-testid="flag-expires">{props.expiresAt}</span>}
        <button 
          data-testid="toggle-button"
          onClick={() => {
            // Simulate API call
            const newValue = !props.initialValue;
            // Update the mock to reflect the change
            mockFlagToggle({
              ...props,
              initialValue: newValue,
              overridden: true,
              expiresAt: new Date(Date.now() + 1800000).toISOString() // 30 min from now
            });
          }}
        >
          Toggle
        </button>
      </div>
    );
  }
}));

describe('Flag System Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle complete flag override flow', async () => {
    const mockFetch = fetch as jest.MockedFunction<typeof fetch>;
    
    // Initial state: comingSoon = true, not overridden
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        flags: {
          comingSoon: {
            value: true,
            overridden: false
          }
        }
      })
    } as Response);

    render(<FlagsAdminClient />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Controla el comportamiento del sitio en tiempo real')).toBeInTheDocument();
    });

    // Verify initial state
    expect(screen.getByTestId('flag-value')).toHaveTextContent('true');
    expect(screen.getByTestId('flag-overridden')).toHaveTextContent('false');

    // Simulate toggle action
    const toggleButton = screen.getByTestId('toggle-button');
    fireEvent.click(toggleButton);

    // Verify the toggle was called with correct props
    expect(mockFlagToggle).toHaveBeenCalledWith(
      expect.objectContaining({
        flag: 'comingSoon',
        label: 'Coming Soon',
        initialValue: true,
        overridden: false
      })
    );
  });

  it('should handle API error and recovery', async () => {
    const mockFetch = fetch as jest.MockedFunction<typeof fetch>;
    
    // First call fails
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    render(<FlagsAdminClient />);

    // Should show error state
    await waitFor(() => {
      expect(screen.getByText('Error de conexión')).toBeInTheDocument();
    });

    // Second call succeeds
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        flags: {
          comingSoon: {
            value: false,
            overridden: true,
            expiresAt: '2025-08-12T05:00:00.000Z'
          }
        }
      })
    } as Response);

    // Click retry button
    const retryButton = screen.getByText('Reintentar');
    fireEvent.click(retryButton);

    // Should recover and show flags
    await waitFor(() => {
      expect(screen.getByText('Controla el comportamiento del sitio en tiempo real')).toBeInTheDocument();
    });

    expect(screen.getByTestId('flag-value')).toHaveTextContent('false');
    expect(screen.getByTestId('flag-overridden')).toHaveTextContent('true');
  });

  it('should refresh data when refresh button is clicked', async () => {
    const mockFetch = fetch as jest.MockedFunction<typeof fetch>;
    
    // Initial load
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        flags: {
          comingSoon: {
            value: true,
            overridden: false
          }
        }
      })
    } as Response);

    render(<FlagsAdminClient />);

    await waitFor(() => {
      expect(screen.getByText('Controla el comportamiento del sitio en tiempo real')).toBeInTheDocument();
    });

    // Refresh with new data
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        flags: {
          comingSoon: {
            value: false,
            overridden: true,
            expiresAt: '2025-08-12T05:00:00.000Z'
          }
        }
      })
    } as Response);

    const refreshButton = screen.getByText('Actualizar');
    fireEvent.click(refreshButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });

  it('should show all UI elements correctly', async () => {
    const mockFetch = fetch as jest.MockedFunction<typeof fetch>;
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        flags: {
          comingSoon: {
            value: true,
            overridden: false
          }
        }
      })
    } as Response);

    render(<FlagsAdminClient />);

    await waitFor(() => {
      expect(screen.getByText('Feature Flags')).toBeInTheDocument();
      expect(screen.getByText('Controla el comportamiento del sitio en tiempo real')).toBeInTheDocument();
      expect(screen.getByText('Actualizar')).toBeInTheDocument();
      expect(screen.getByText('Más flags próximamente')).toBeInTheDocument();
      expect(screen.getByText('Información importante')).toBeInTheDocument();
    });
  });

  it('should handle loading state correctly', () => {
    // Don't mock fetch to trigger loading state
    render(<FlagsAdminClient />);

    expect(screen.getByText('Feature Flags')).toBeInTheDocument();
    expect(screen.getByText('Cargando configuración...')).toBeInTheDocument();
  });
});
