/**
 * Tests for SearchInput component
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import { SearchInput } from '../../components/filters/SearchInput';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => React.createElement('div', props, children),
  },
  AnimatePresence: ({ children }: any) => children,
}));

describe('SearchInput', () => {
  const defaultProps = {
    value: '',
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('basic functionality', () => {
    it('should render with placeholder', () => {
      render(<SearchInput {...defaultProps} placeholder="Test placeholder" />);
      
      expect(screen.getByPlaceholderText('Test placeholder')).toBeInTheDocument();
    });

    it('should display current value', () => {
      render(<SearchInput {...defaultProps} value="test search" />);
      
      const input = screen.getByRole('searchbox');
      expect(input).toHaveValue('test search');
    });

    it('should call onChange when typing', async () => {
      const onChange = jest.fn();
      render(<SearchInput {...defaultProps} onChange={onChange} debounceMs={0} />);
      
      const input = screen.getByRole('searchbox');
      fireEvent.change(input, { target: { value: 'new search' } });
      
      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith('new search');
      });
    });

    it('should show loading state', () => {
      render(<SearchInput {...defaultProps} isLoading={true} />);
      
      // Should show loading spinner instead of search icon  
      expect(document.querySelector('.animate-spin')).toBeInTheDocument();
    });

    it('should be disabled when disabled prop is true', () => {
      render(<SearchInput {...defaultProps} disabled={true} />);
      
      const input = screen.getByRole('searchbox');
      expect(input).toBeDisabled();
    });
  });

  describe('clear functionality', () => {
    it('should show clear button when there is a value', () => {
      render(<SearchInput {...defaultProps} value="search text" />);
      
      expect(screen.getByLabelText('Limpiar búsqueda')).toBeInTheDocument();
    });

    it('should not show clear button when value is empty', () => {
      render(<SearchInput {...defaultProps} value="" />);
      
      expect(screen.queryByLabelText('Limpiar búsqueda')).not.toBeInTheDocument();
    });

    it('should clear value when clear button is clicked', () => {
      const onChange = jest.fn();
      render(<SearchInput {...defaultProps} value="search text" onChange={onChange} />);
      
      const clearButton = screen.getByLabelText('Limpiar búsqueda');
      fireEvent.click(clearButton);
      
      expect(onChange).toHaveBeenCalledWith('');
    });
  });

  describe('suggestions', () => {
    const suggestions = ['Las Condes', 'Ñuñoa', 'Providencia', 'Santiago'];

    it('should show suggestions when focused', async () => {
      render(
        <SearchInput 
          {...defaultProps} 
          value="Las" 
          suggestions={suggestions} 
        />
      );
      
      const input = screen.getByRole('searchbox');
      fireEvent.focus(input);
      
      await waitFor(() => {
        expect(screen.getByText('Las Condes')).toBeInTheDocument();
      });
    });

    it('should filter suggestions based on input value', async () => {
      render(
        <SearchInput 
          {...defaultProps} 
          value="Las" 
          suggestions={suggestions} 
        />
      );
      
      const input = screen.getByRole('searchbox');
      fireEvent.focus(input);
      
      await waitFor(() => {
        expect(screen.getByText('Las Condes')).toBeInTheDocument();
        expect(screen.queryByText('Ñuñoa')).not.toBeInTheDocument();
      });
    });

    it('should call onSuggestionSelect when suggestion is clicked', async () => {
      const onSuggestionSelect = jest.fn();
      render(
        <SearchInput 
          {...defaultProps} 
          value="Las" 
          suggestions={suggestions}
          onSuggestionSelect={onSuggestionSelect}
        />
      );
      
      const input = screen.getByRole('searchbox');
      fireEvent.focus(input);
      
      await waitFor(() => {
        const suggestion = screen.getByText('Las Condes');
        fireEvent.click(suggestion);
        
        expect(onSuggestionSelect).toHaveBeenCalledWith('Las Condes');
      });
    });

    it('should hide suggestions when input loses focus', async () => {
      render(
        <SearchInput 
          {...defaultProps} 
          value="Las" 
          suggestions={suggestions} 
        />
      );
      
      const input = screen.getByRole('searchbox');
      fireEvent.focus(input);
      
      await waitFor(() => {
        expect(screen.getByText('Las Condes')).toBeInTheDocument();
      });
      
      fireEvent.blur(input);
      
      await waitFor(() => {
        expect(screen.queryByText('Las Condes')).not.toBeInTheDocument();
      }, { timeout: 200 });
    });

    it('should limit number of suggestions shown', async () => {
      const manySuggestions = Array.from({ length: 10 }, (_, i) => `Suggestion ${i + 1}`);
      
      render(
        <SearchInput 
          {...defaultProps} 
          value="Suggestion" 
          suggestions={manySuggestions}
          maxSuggestions={3}
        />
      );
      
      const input = screen.getByRole('searchbox');
      fireEvent.focus(input);
      
      await waitFor(() => {
        expect(screen.getByText('Suggestion 1')).toBeInTheDocument();
        expect(screen.getByText('Suggestion 2')).toBeInTheDocument();
        expect(screen.getByText('Suggestion 3')).toBeInTheDocument();
        expect(screen.queryByText('Suggestion 4')).not.toBeInTheDocument();
      });
    });
  });

  describe('keyboard navigation', () => {
    const suggestions = ['Las Condes', 'Ñuñoa', 'Providencia'];

    it('should navigate suggestions with arrow keys', async () => {
      render(
        <SearchInput 
          {...defaultProps} 
          value="Las" 
          suggestions={suggestions} 
        />
      );
      
      const input = screen.getByRole('searchbox');
      fireEvent.focus(input);
      
      await waitFor(() => {
        expect(screen.getByText('Las Condes')).toBeInTheDocument();
      });
      
      // Navigate down
      fireEvent.keyDown(input, { key: 'ArrowDown' });
      
      // First suggestion should be active (highlighted)
      const firstSuggestion = screen.getByText('Las Condes').closest('button');
      expect(firstSuggestion).toHaveAttribute('aria-selected', 'true');
    });

    it('should select suggestion with Enter key', async () => {
      const onChange = jest.fn();
      const onSuggestionSelect = jest.fn();
      
      render(
        <SearchInput 
          {...defaultProps} 
          value="Las" 
          suggestions={suggestions}
          onChange={onChange}
          onSuggestionSelect={onSuggestionSelect}
        />
      );
      
      const input = screen.getByRole('searchbox');
      fireEvent.focus(input);
      
      await waitFor(() => {
        expect(screen.getByText('Las Condes')).toBeInTheDocument();
      });
      
      // Navigate to first suggestion and select
      fireEvent.keyDown(input, { key: 'ArrowDown' });
      fireEvent.keyDown(input, { key: 'Enter' });
      
      expect(onChange).toHaveBeenCalledWith('Las Condes');
      expect(onSuggestionSelect).toHaveBeenCalledWith('Las Condes');
    });

    it('should close suggestions with Escape key', async () => {
      render(
        <SearchInput 
          {...defaultProps} 
          value="Las" 
          suggestions={suggestions} 
        />
      );
      
      const input = screen.getByRole('searchbox');
      fireEvent.focus(input);
      
      await waitFor(() => {
        expect(screen.getByText('Las Condes')).toBeInTheDocument();
      });
      
      fireEvent.keyDown(input, { key: 'Escape' });
      
      await waitFor(() => {
        expect(screen.queryByText('Las Condes')).not.toBeInTheDocument();
      });
    });
  });

  describe('accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<SearchInput {...defaultProps} />);
      
      const input = screen.getByRole('searchbox');
      expect(input).toHaveAttribute('aria-expanded', 'false');
      expect(input).toHaveAttribute('aria-haspopup', 'listbox');
    });

    it('should update ARIA attributes when suggestions are shown', async () => {
      render(
        <SearchInput 
          {...defaultProps} 
          value="Las" 
          suggestions={['Las Condes']} 
        />
      );
      
      const input = screen.getByRole('searchbox');
      fireEvent.focus(input);
      
      await waitFor(() => {
        expect(input).toHaveAttribute('aria-expanded', 'true');
      });
    });

    it('should have proper role attributes on suggestions', async () => {
      render(
        <SearchInput 
          {...defaultProps} 
          value="Las" 
          suggestions={['Las Condes', 'Las Flores']} 
        />
      );
      
      const input = screen.getByRole('searchbox');
      fireEvent.focus(input);
      
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
        expect(screen.getAllByRole('option')).toHaveLength(2);
      });
    });
  });

  describe('debouncing', () => {
    jest.useFakeTimers();

    afterEach(() => {
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
    });

    it('should debounce onChange calls', () => {
      const onChange = jest.fn();
      render(<SearchInput {...defaultProps} onChange={onChange} debounceMs={300} />);
      
      const input = screen.getByRole('searchbox');
      
      // Type multiple characters quickly
      fireEvent.change(input, { target: { value: 'a' } });
      fireEvent.change(input, { target: { value: 'ab' } });
      fireEvent.change(input, { target: { value: 'abc' } });
      
      // Should not have called onChange yet
      expect(onChange).not.toHaveBeenCalled();
      
      // Fast-forward time
      jest.advanceTimersByTime(300);
      
      // Should have called onChange once with final value
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith('abc');
    });
  });
});
