// Mock para el módulo analytics
export const track = jest.fn((event: string, properties?: Record<string, any>) => {
  // Mock implementation - no hace nada en testing
  console.log(`[MOCK ANALYTICS] Track: ${event}`, properties);
});

export default {
  track
};
