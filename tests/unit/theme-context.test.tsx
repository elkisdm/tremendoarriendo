import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider, useTheme } from '@lib/theme-context';

// Componente de prueba que usa el hook useTheme
function TestComponent() {
  const { theme, toggleTheme, setTheme } = useTheme();
  
  return (
    <div>
      <div data-testid="current-theme">{theme}</div>
      <button onClick={toggleTheme} data-testid="toggle-theme">
        Toggle Theme
      </button>
      <button onClick={() => setTheme('light')} data-testid="set-light">
        Set Light
      </button>
      <button onClick={() => setTheme('dark')} data-testid="set-dark">
        Set Dark
      </button>
    </div>
  );
}

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('ThemeContext', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.clear.mockClear();
  });

  it('provides default dark theme', async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
    });
  });

  it('toggles theme when toggle button is clicked', async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const toggleButton = screen.getByTestId('toggle-theme');
    
    await waitFor(() => {
      expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
    });
    
    fireEvent.click(toggleButton);
    await waitFor(() => {
      expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
    });
    
    fireEvent.click(toggleButton);
    await waitFor(() => {
      expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
    });
  });

  it('sets theme to light when set light button is clicked', async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const setLightButton = screen.getByTestId('set-light');
    
    fireEvent.click(setLightButton);
    await waitFor(() => {
      expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
    });
  });

  it('sets theme to dark when set dark button is clicked', async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const setDarkButton = screen.getByTestId('set-dark');
    
    fireEvent.click(setDarkButton);
    await waitFor(() => {
      expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
    });
  });

  it('saves theme to localStorage when theme changes', async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const toggleButton = screen.getByTestId('toggle-theme');
    
    fireEvent.click(toggleButton);
    
    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'light');
    });
  });

  it('loads theme from localStorage on mount', async () => {
    localStorageMock.getItem.mockReturnValue('light');
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
    });
    expect(localStorageMock.getItem).toHaveBeenCalledWith('theme');
  });

  it('throws error when useTheme is used outside ThemeProvider', () => {
    // Suprimir el error de console.error para este test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useTheme must be used within a ThemeProvider');
    
    consoleSpy.mockRestore();
  });
});
