import { describe, expect, it } from 'vitest';
import { formatCurrency } from './currency.service';

describe('formatCurrency', () => {
  it('formats each currency', () => {
    expect(formatCurrency(1234.5, 'USD')).toBe('$1,235');
    expect(formatCurrency(1234.5, 'CZK')).toBe('1,235 Kč');
    expect(formatCurrency(1.23456789, 'BTC')).toBe('1.2346 ₿');
    expect(formatCurrency(1.23456789, 'BTC', true)).toBe('1.234568 ₿');
    expect(formatCurrency(null, 'USD')).toBe('$0');
  });
});
