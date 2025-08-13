/**
 * Tests for FilterChips component
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FilterChips, SingleChip, ChipsContainer } from '../../components/filters/FilterChips';
import type { FilterChip } from '../../hooks/useAdvancedFilters';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => React.createElement('div', props, children),
    button: ({ children, ...props }: any) => React.createElement('button', props, children),
  },
  AnimatePresence: ({ children }: any) => children,
}));

describe('FilterChips', () => {
  const mockChips: FilterChip[] = [
    {
      id: 'comuna',
      label: 'Comuna',
      value: 'Las Condes',
      onRemove: jest.fn(),
    },
    {
      id: 'tipologia',
      label: 'Tipología',
      value: '2D2B',
      onRemove: jest.fn(),
    },
    {
      id: 'price',
      label: 'Precio',
      value: '$300.000 - $500.000',
      onRemove: jest.fn(),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('basic rendering', () => {
    it('should render all chips', () => {
      render(<FilterChips chips={mockChips} />);
      
      expect(screen.getByText('Comuna')).toBeInTheDocument();
      expect(screen.getByText('Las Condes')).toBeInTheDocument();
      expect(screen.getByText('Tipología')).toBeInTheDocument();
      expect(screen.getByText('2D2B')).toBeInTheDocument();
      expect(screen.getByText('Precio')).toBeInTheDocument();
      expect(screen.getByText('$300.000 - $500.000')).toBeInTheDocument();
    });

    it('should not render when no chips', () => {
      const { container } = render(<FilterChips chips={[]} />);
      expect(container.firstChild).toBeNull();
    });

    it('should render clear all button when multiple chips', () => {
      render(<FilterChips chips={mockChips} showClearAll={true} />);
      
      expect(screen.getByText('Limpiar todo')).toBeInTheDocument();
    });

    it('should not render clear all button when disabled', () => {
      render(<FilterChips chips={mockChips} showClearAll={false} />);
      
      expect(screen.queryByText('Limpiar todo')).not.toBeInTheDocument();
    });

    it('should not render clear all button with single chip', () => {
      render(<FilterChips chips={[mockChips[0]]} showClearAll={true} />);
      
      expect(screen.queryByText('Limpiar todo')).not.toBeInTheDocument();
    });
  });

  describe('chip removal', () => {
    it('should call onRemove when chip remove button is clicked', () => {
      const onRemove = jest.fn();
      const chips: FilterChip[] = [
        {
          id: 'test',
          label: 'Test',
          value: 'Test Value',
          onRemove,
        },
      ];

      render(<FilterChips chips={chips} />);
      
      const removeButton = screen.getByLabelText('Remover filtro Test: Test Value');
      fireEvent.click(removeButton);
      
      expect(onRemove).toHaveBeenCalledTimes(1);
    });

    it('should call onClearAll when clear all button is clicked', () => {
      const onClearAll = jest.fn();
      render(<FilterChips chips={mockChips} onClearAll={onClearAll} />);
      
      const clearAllButton = screen.getByText('Limpiar todo');
      fireEvent.click(clearAllButton);
      
      expect(onClearAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('chip visibility limits', () => {
    const manyChips: FilterChip[] = Array.from({ length: 10 }, (_, index) => ({
      id: `chip-${index}`,
      label: `Label ${index}`,
      value: `Value ${index}`,
      onRemove: jest.fn(),
    }));

    it('should show only maxVisible chips', () => {
      render(<FilterChips chips={manyChips} maxVisible={3} />);
      
      // Should show first 3 chips
      expect(screen.getByText('Label 0')).toBeInTheDocument();
      expect(screen.getByText('Label 1')).toBeInTheDocument();
      expect(screen.getByText('Label 2')).toBeInTheDocument();
      
      // Should not show remaining chips
      expect(screen.queryByText('Label 3')).not.toBeInTheDocument();
      expect(screen.queryByText('Label 4')).not.toBeInTheDocument();
    });

    it('should show hidden count indicator', () => {
      render(<FilterChips chips={manyChips} maxVisible={3} />);
      
      expect(screen.getByText('+7 más')).toBeInTheDocument();
    });

    it('should not show hidden count when all chips are visible', () => {
      render(<FilterChips chips={mockChips} maxVisible={5} />);
      
      expect(screen.queryByText(/\+\d+ más/)).not.toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have proper aria-label for remove buttons', () => {
      render(<FilterChips chips={[mockChips[0]]} />);
      
      expect(screen.getByLabelText('Remover filtro Comuna: Las Condes')).toBeInTheDocument();
    });

    it('should be keyboard accessible', () => {
      render(<FilterChips chips={[mockChips[0]]} />);
      
      const removeButton = screen.getByLabelText('Remover filtro Comuna: Las Condes');
      expect(removeButton).toBeVisible();
      expect(removeButton.tagName).toBe('BUTTON');
    });
  });
});

describe('SingleChip', () => {
  const defaultProps = {
    label: 'Test Label',
    value: 'Test Value',
    onRemove: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render label and value', () => {
    render(<SingleChip {...defaultProps} />);
    
    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByText('Test Value')).toBeInTheDocument();
  });

  it('should call onRemove when remove button is clicked', () => {
    const onRemove = jest.fn();
    render(<SingleChip {...defaultProps} onRemove={onRemove} />);
    
    const removeButton = screen.getByLabelText('Remover filtro Test Label: Test Value');
    fireEvent.click(removeButton);
    
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('should apply variant styles', () => {
    const { rerender } = render(<SingleChip {...defaultProps} variant="primary" />);
    
    // Test that component renders without error
    expect(screen.getByText('Test Label')).toBeInTheDocument();
    
    // Test other variants
    rerender(<SingleChip {...defaultProps} variant="secondary" />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
    
    rerender(<SingleChip {...defaultProps} variant="default" />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(<SingleChip {...defaultProps} className="custom-class" />);
    
    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });

  it('should handle long text values', () => {
    const longValue = 'This is a very long value that should be truncated when displayed in the chip component';
    render(<SingleChip {...defaultProps} value={longValue} />);
    
    expect(screen.getByText(longValue)).toBeInTheDocument();
  });
});

describe('ChipsContainer', () => {
  it('should render children', () => {
    render(
      <ChipsContainer>
        <div>Child 1</div>
        <div>Child 2</div>
      </ChipsContainer>
    );
    
    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <ChipsContainer className="custom-container">
        <div>Child</div>
      </ChipsContainer>
    );
    
    expect(container.querySelector('.custom-container')).toBeInTheDocument();
  });

  it('should handle empty children', () => {
    const { container } = render(<ChipsContainer>{null}</ChipsContainer>);
    
    expect(container.firstChild).toBeInTheDocument();
  });
});

describe('FilterChips integration', () => {
  it('should handle rapid chip removals', () => {
    const chips: FilterChip[] = [
      { id: '1', label: 'Chip 1', value: 'Value 1', onRemove: jest.fn() },
      { id: '2', label: 'Chip 2', value: 'Value 2', onRemove: jest.fn() },
      { id: '3', label: 'Chip 3', value: 'Value 3', onRemove: jest.fn() },
    ];

    render(<FilterChips chips={chips} />);
    
    // Click multiple remove buttons quickly
    const removeButtons = screen.getAllByLabelText(/Remover filtro/);
    removeButtons.forEach(button => fireEvent.click(button));
    
    // Should have called all onRemove functions
    chips.forEach(chip => {
      expect(chip.onRemove).toHaveBeenCalledTimes(1);
    });
  });

  it('should work with empty chip arrays and updates', () => {
    const testChips: FilterChip[] = [
      {
        id: 'comuna',
        label: 'Comuna',
        value: 'Las Condes',
        onRemove: jest.fn(),
      },
    ];

    const { rerender } = render(<FilterChips chips={[]} />);
    
    // Should render nothing initially
    expect(document.body.textContent).not.toContain('Limpiar todo');
    
    // Add chips
    rerender(<FilterChips chips={testChips} />);
    expect(screen.getByText('Comuna')).toBeInTheDocument();
    
    // Remove chips
    rerender(<FilterChips chips={[]} />);
    expect(screen.queryByText('Comuna')).not.toBeInTheDocument();
  });
});
