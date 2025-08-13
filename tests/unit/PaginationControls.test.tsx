import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { 
  PaginationControls, 
  InfiniteScrollControls, 
  AutoInfiniteScroll,
  useInfiniteScrollObserver 
} from '../../components/lists/PaginationControls';

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
window.IntersectionObserver = mockIntersectionObserver;

describe('PaginationControls', () => {
  const mockPagination = {
    currentPage: 2,
    totalPages: 5,
    totalCount: 50,
    hasNextPage: true,
    hasPrevPage: true,
    limit: 10,
  };

  const mockHandlers = {
    onPageChange: jest.fn(),
    onNextPage: jest.fn(),
    onPrevPage: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Renderizado básico', () => {
    it('debe renderizar controles de paginación correctamente', () => {
      render(
        <PaginationControls
          pagination={mockPagination}
          {...mockHandlers}
        />
      );

      expect(screen.getByText((content, element) => {
        return element?.textContent === '11 - 20 de 50 resultados';
      })).toBeInTheDocument();
      expect(screen.getByLabelText('Página anterior')).toBeInTheDocument();
      expect(screen.getByLabelText('Página siguiente')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('no debe renderizar si solo hay una página', () => {
      const singlePagePagination = {
        ...mockPagination,
        totalPages: 1,
        currentPage: 1,
        hasNextPage: false,
        hasPrevPage: false,
      };

      const { container } = render(
        <PaginationControls
          pagination={singlePagePagination}
          {...mockHandlers}
        />
      );

      expect(container.firstChild).toBeNull();
    });

    it('debe mostrar los números de página correctos', () => {
      render(
        <PaginationControls
          pagination={mockPagination}
          {...mockHandlers}
        />
      );

      // Debe mostrar páginas alrededor de la actual
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('4')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
    });
  });

  describe('Interacciones', () => {
    it('debe llamar onPrevPage cuando se hace clic en anterior', () => {
      render(
        <PaginationControls
          pagination={mockPagination}
          {...mockHandlers}
        />
      );

      fireEvent.click(screen.getByLabelText('Página anterior'));
      expect(mockHandlers.onPrevPage).toHaveBeenCalledTimes(1);
    });

    it('debe llamar onNextPage cuando se hace clic en siguiente', () => {
      render(
        <PaginationControls
          pagination={mockPagination}
          {...mockHandlers}
        />
      );

      fireEvent.click(screen.getByLabelText('Página siguiente'));
      expect(mockHandlers.onNextPage).toHaveBeenCalledTimes(1);
    });

    it('debe llamar onPageChange con el número correcto', () => {
      render(
        <PaginationControls
          pagination={mockPagination}
          {...mockHandlers}
        />
      );

      fireEvent.click(screen.getByText('3'));
      expect(mockHandlers.onPageChange).toHaveBeenCalledWith(3);
    });

    it('debe deshabilitar botones cuando no hay páginas disponibles', () => {
      const firstPagePagination = {
        ...mockPagination,
        currentPage: 1,
        hasPrevPage: false,
      };

      render(
        <PaginationControls
          pagination={firstPagePagination}
          {...mockHandlers}
        />
      );

      expect(screen.getByLabelText('Página anterior')).toBeDisabled();
    });

    it('debe deshabilitar botones cuando está cargando', () => {
      render(
        <PaginationControls
          pagination={mockPagination}
          isLoading={true}
          {...mockHandlers}
        />
      );

      expect(screen.getByLabelText('Página anterior')).toBeDisabled();
      expect(screen.getByLabelText('Página siguiente')).toBeDisabled();
    });
  });

  describe('Accesibilidad', () => {
    it('debe tener los atributos ARIA correctos', () => {
      render(
        <PaginationControls
          pagination={mockPagination}
          {...mockHandlers}
        />
      );

      const nav = screen.getByRole('navigation');
      expect(nav).toHaveAttribute('aria-label', 'Paginación de resultados');

      const currentPageButton = screen.getByText('2');
      expect(currentPageButton).toHaveAttribute('aria-current', 'page');
    });

    it('debe tener labels descriptivos en los botones', () => {
      render(
        <PaginationControls
          pagination={mockPagination}
          {...mockHandlers}
        />
      );

      expect(screen.getByLabelText('Ir a página 3')).toBeInTheDocument();
      expect(screen.getByLabelText('Página anterior')).toBeInTheDocument();
      expect(screen.getByLabelText('Página siguiente')).toBeInTheDocument();
    });
  });

  describe('Variante compacta', () => {
    it('debe mostrar menos páginas en variante compacta', () => {
      const manyPagesPagination = {
        ...mockPagination,
        currentPage: 5,
        totalPages: 10,
      };

      render(
        <PaginationControls
          pagination={manyPagesPagination}
          variant="compact"
          {...mockHandlers}
        />
      );

      // En variante compacta debe mostrar menos páginas
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getAllByText('...').length).toBeGreaterThan(0);
      expect(screen.getByText('5')).toBeInTheDocument();
    });
  });
});

describe('InfiniteScrollControls', () => {
  const mockProps = {
    hasNextPage: true,
    isFetchingNextPage: false,
    onLoadMore: jest.fn(),
    totalCount: 100,
    loadedCount: 20,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe renderizar botón de cargar más', () => {
    render(<InfiniteScrollControls {...mockProps} />);

    expect(screen.getByText('Cargar más resultados')).toBeInTheDocument();
    expect(screen.getByText(/Mostrando 20 de 100 resultados/)).toBeInTheDocument();
  });

  it('debe mostrar estado de carga', () => {
    render(
      <InfiniteScrollControls 
        {...mockProps} 
        isFetchingNextPage={true} 
      />
    );

    expect(screen.getByText('Cargando...')).toBeInTheDocument();
    expect(screen.getByLabelText('Cargar más resultados')).toBeDisabled();
  });

  it('debe llamar onLoadMore cuando se hace clic', () => {
    render(<InfiniteScrollControls {...mockProps} />);

    fireEvent.click(screen.getByText('Cargar más resultados'));
    expect(mockProps.onLoadMore).toHaveBeenCalledTimes(1);
  });

  it('debe mostrar mensaje final cuando no hay más páginas', () => {
    render(
      <InfiniteScrollControls 
        {...mockProps} 
        hasNextPage={false}
        loadedCount={100}
      />
    );

    expect(screen.getByText('Has visto todos los 100 resultados')).toBeInTheDocument();
    expect(screen.queryByText('Cargar más resultados')).not.toBeInTheDocument();
  });
});

describe('AutoInfiniteScroll', () => {
  const mockProps = {
    hasNextPage: true,
    isFetchingNextPage: false,
    onLoadMore: jest.fn(),
    totalCount: 100,
    loadedCount: 20,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockIntersectionObserver.mockClear();
  });

  it('debe configurar IntersectionObserver', () => {
    render(<AutoInfiniteScroll {...mockProps} />);

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      {
        threshold: 0.1,
        rootMargin: '200px',
      }
    );
  });

  it('debe mostrar indicador de carga automática', () => {
    render(
      <AutoInfiniteScroll 
        {...mockProps} 
        isFetchingNextPage={true} 
      />
    );

    expect(screen.getByText('Cargando más resultados...')).toBeInTheDocument();
  });

  it('debe mostrar mensaje final', () => {
    render(
      <AutoInfiniteScroll 
        {...mockProps} 
        hasNextPage={false}
        loadedCount={100}
      />
    );

    expect(screen.getByText('Has visto todos los 100 resultados')).toBeInTheDocument();
  });
});

describe('useInfiniteScrollObserver', () => {
  const mockFetchNextPage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockIntersectionObserver.mockClear();
  });

  it('debe configurar observer correctamente', () => {
    const TestComponent = () => {
      const observerRef = useInfiniteScrollObserver(true, false, mockFetchNextPage);
      return <div ref={observerRef} data-testid="observer" />;
    };

    render(<TestComponent />);

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      {
        threshold: 0.1,
        rootMargin: '200px',
      }
    );
  });

  it('debe llamar fetchNextPage cuando el elemento es visible', () => {
    let intersectionCallback: ((entries: any[]) => void) | undefined;

    mockIntersectionObserver.mockImplementation((callback) => {
      intersectionCallback = callback;
      return {
        observe: jest.fn(),
        unobserve: jest.fn(),
        disconnect: jest.fn(),
      };
    });

    const TestComponent = () => {
      const observerRef = useInfiniteScrollObserver(true, false, mockFetchNextPage);
      return <div ref={observerRef} data-testid="observer" />;
    };

    render(<TestComponent />);

    // Simular intersección
    intersectionCallback?.([{ isIntersecting: true }]);

    expect(mockFetchNextPage).toHaveBeenCalledTimes(1);
  });

  it('no debe llamar fetchNextPage si no hay siguiente página', () => {
    let intersectionCallback: ((entries: any[]) => void) | undefined;

    mockIntersectionObserver.mockImplementation((callback) => {
      intersectionCallback = callback;
      return {
        observe: jest.fn(),
        unobserve: jest.fn(),
        disconnect: jest.fn(),
      };
    });

    const TestComponent = () => {
      const observerRef = useInfiniteScrollObserver(false, false, mockFetchNextPage);
      return <div ref={observerRef} data-testid="observer" />;
    };

    render(<TestComponent />);

    // Simular intersección
    intersectionCallback?.([{ isIntersecting: true }]);

    expect(mockFetchNextPage).not.toHaveBeenCalled();
  });
});
