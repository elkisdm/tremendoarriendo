import { track } from '@lib/analytics';

describe('analytics', () => {
  const mockGtag = jest.fn();

  beforeEach(() => {
    mockGtag.mockClear();
    delete (window as any).gtag;
  });

  describe('track', () => {
    it('calls gtag when window is available and gtag exists', () => {
      (window as any).gtag = mockGtag;
      
      track('test_event', { property: 'value' });
      
      expect(mockGtag).toHaveBeenCalledWith('event', 'test_event', { property: 'value' });
    });

    it('calls gtag with empty object when no params provided', () => {
      (window as any).gtag = mockGtag;
      
      track('test_event');
      
      expect(mockGtag).toHaveBeenCalledWith('event', 'test_event', {});
    });

    it('does not call gtag when gtag is not available', () => {
      (window as any).gtag = undefined;
      
      track('test_event', { property: 'value' });
      
      expect(mockGtag).not.toHaveBeenCalled();
    });

    it('handles server-side rendering gracefully', () => {
      // Simulate server environment by mocking window as undefined
      const originalWindow = global.window;
      // @ts-expect-error testing server environment
      delete global.window;
      
      expect(() => track('test_event')).not.toThrow();
      
      global.window = originalWindow;
    });

    it('handles different parameter types', () => {
      (window as any).gtag = mockGtag;
      
      const params = {
        string: 'value',
        number: 42,
        boolean: true,
        array: [1, 2, 3],
        object: { nested: 'value' }
      };
      
      track('complex_event', params);
      
      expect(mockGtag).toHaveBeenCalledWith('event', 'complex_event', params);
    });
  });
});
