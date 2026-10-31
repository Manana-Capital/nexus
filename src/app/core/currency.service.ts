import { Injectable, signal } from '@angular/core';

export type Currency = 'USD' | 'CZK' | 'BTC';

const STORAGE_KEY = 'nexus.currency';

/** The currency portfolio values are displayed in, remembered per browser. */
@Injectable({ providedIn: 'root' })
export class CurrencyService {
  readonly selected = signal<Currency>(load());

  select(currency: Currency): void {
    this.selected.set(currency);
    try {
      localStorage.setItem(STORAGE_KEY, currency);
    } catch {
      // storage can be blocked, the choice just won't be remembered
    }
  }

  sign(): string {
    return { CZK: 'Kč', BTC: '₿', USD: '$' }[this.selected()];
  }

  /** Whole units for large amounts, BTC needs decimals. */
  format(value: number | null | undefined, detail = false): string {
    return formatCurrency(value, this.selected(), detail);
  }

  /** Picks the field of the selected currency, e.g. pick(tick, 'value') reads valueUsd. */
  pick<T extends object>(item: T | null | undefined, prefix: string): number {
    const suffix = { USD: 'Usd', CZK: 'Czk', BTC: 'Btc' }[this.selected()];
    const value = (item as Record<string, unknown> | null | undefined)?.[prefix + suffix];
    return typeof value === 'number' ? value : 0;
  }
}

export function formatCurrency(value: number | null | undefined, currency: Currency, detail = false): string {
  const safe = value ?? 0;
  const digits = currency === 'BTC' ? (detail ? 6 : 4) : detail ? 2 : 0;
  const number = safe.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits });
  return currency === 'USD' ? `$${number}` : currency === 'BTC' ? `${number} ₿` : `${number} Kč`;
}

function load(): Currency {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'CZK' || stored === 'BTC' ? stored : 'USD';
  } catch {
    return 'USD';
  }
}
