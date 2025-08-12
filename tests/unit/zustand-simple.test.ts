import { create } from 'zustand';

// Test simple de zustand sin setupTests
interface TestState {
  count: number;
  increment: () => void;
}

const useTestStore = create<TestState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));

describe('Zustand Simple Test', () => {
  it('should work with zustand', () => {
    // Test that the store is created
    expect(useTestStore).toBeDefined();
    expect(typeof useTestStore).toBe('function');
    
    // Test that we can access the store directly
    const store = useTestStore.getState();
    expect(store).toBeDefined();
    expect(store.count).toBe(0);
    expect(typeof store.increment).toBe('function');
    
    // Test that we can modify state
    store.increment();
    const newState = useTestStore.getState();
    expect(newState.count).toBe(1);
  });
});
