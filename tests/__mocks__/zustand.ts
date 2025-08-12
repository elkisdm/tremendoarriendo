// Mock mejorado de zustand para desarrollo
import { useState, useCallback } from 'react';

// Mock del store
const createMockStore = () => {
  const initialState = {
    buildings: [],
    filteredBuildings: [],
    loading: false,
    error: null,
    filters: {},
    sort: 'price-asc' as const,
    page: 1,
    pageSize: 12,
    totalPages: 1,
  };

  let state = { ...initialState };

  const setState = (newState: any) => {
    state = { ...state, ...newState };
  };

  const getState = () => state;

  return {
    setState,
    getState,
    reset: () => {
      state = { ...initialState };
    },
  };
};

const mockStore = createMockStore();

// Mock de create
export const create = () => {
  return (fn: any) => {
    const store = fn(
      (newState: any) => mockStore.setState(newState),
      () => mockStore.getState()
    );
    
    return () => store;
  };
};

// Mock de devtools
export const devtools = (fn: any) => fn;

// Mock de useStore hook
export const useBuildingsStore = () => {
  const [state, setState] = useState(mockStore.getState());

  const setBuildings = useCallback((buildings: any[]) => {
    mockStore.setState({ buildings, filteredBuildings: buildings });
    setState(mockStore.getState());
  }, []);

  const setFilteredBuildings = useCallback((filteredBuildings: any[]) => {
    mockStore.setState({ filteredBuildings });
    setState(mockStore.getState());
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    mockStore.setState({ loading });
    setState(mockStore.getState());
  }, []);

  const setError = useCallback((error: string | null) => {
    mockStore.setState({ error });
    setState(mockStore.getState());
  }, []);

  const setFilters = useCallback((newFilters: any) => {
    const currentFilters = mockStore.getState().filters;
    const filters = { ...currentFilters, ...newFilters };
    mockStore.setState({ filters });
    setState(mockStore.getState());
  }, []);

  const setSort = useCallback((sort: string) => {
    mockStore.setState({ sort });
    setState(mockStore.getState());
  }, []);

  const clearFilters = useCallback(() => {
    mockStore.setState({ filters: {} });
    setState(mockStore.getState());
  }, []);

  const setPage = useCallback((page: number) => {
    mockStore.setState({ page });
    setState(mockStore.getState());
  }, []);

  const setPageSize = useCallback((pageSize: number) => {
    mockStore.setState({ pageSize });
    setState(mockStore.getState());
  }, []);

  const reset = useCallback(() => {
    mockStore.reset();
    setState(mockStore.getState());
  }, []);

  return {
    ...state,
    setBuildings,
    setFilteredBuildings,
    setLoading,
    setError,
    setFilters,
    setSort,
    clearFilters,
    setPage,
    setPageSize,
    reset,
  };
};
