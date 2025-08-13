import { theme } from '@lib/theme';

describe('theme', () => {
  it('has correct brand colors', () => {
    expect(theme.brand.primary).toBe('#6D4AFF');
    expect(theme.brand.secondary).toBe('#00E6B3');
    expect(theme.brand.accent).toBe('#FF8A00');
    expect(theme.brand.bg).toBe('#0B0B10');
    expect(theme.brand.surface).toBe('#12121A');
    expect(theme.brand.soft).toBe('#1A1A24');
    expect(theme.brand.text).toBe('#F5F7FA');
    expect(theme.brand.subtext).toBe('#B7C0CE');
    expect(theme.brand.ring).toBe('#A28BFF');
  });

  it('has correct radii values', () => {
    expect(theme.radii.card).toBe('1.25rem');
    expect(theme.radii.pill).toBe('999px');
  });

  it('theme object structure is correct', () => {
    expect(theme).toHaveProperty('brand');
    expect(theme).toHaveProperty('radii');
    expect(Object.keys(theme.brand)).toHaveLength(9);
    expect(Object.keys(theme.radii)).toHaveLength(2);
  });
});
