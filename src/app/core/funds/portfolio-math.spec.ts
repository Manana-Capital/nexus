import { describe, expect, it } from 'vitest';
import { PortfolioBalanceTick } from '../api/model';
import { averageBtcPrice, btcOnly, btcRatio, mergeFundTicks, profitPercent, sortExchanges } from './portfolio-math';

const tick = (date: string, valueUsd: number, depositedUsd = 0): PortfolioBalanceTick => ({
  timestamp: `${date}T00:00:00Z`,
  valueUsd,
  depositedUsd,
});

describe('mergeFundTicks', () => {
  it('sums funds day by day', () => {
    const merged = mergeFundTicks([[tick('2026-01-01', 10)], [tick('2026-01-01', 5)]]);
    expect(merged.map((x) => x.valueUsd)).toEqual([15]);
  });

  it('returns dates in ascending order whatever order funds deliver them in', () => {
    const merged = mergeFundTicks([
      [tick('2026-01-03', 3), tick('2026-01-02', 2)],
      [tick('2026-01-01', 1)],
    ]);
    expect(merged.map((x) => x.timestamp?.slice(0, 10))).toEqual(['2026-01-01', '2026-01-02', '2026-01-03']);
  });

  it('keeps the last known value of a fund that misses a snapshot', () => {
    const merged = mergeFundTicks([
      [tick('2026-01-01', 100), tick('2026-01-03', 110)],
      [tick('2026-01-01', 50), tick('2026-01-02', 60), tick('2026-01-03', 70)],
    ]);
    expect(merged.map((x) => x.valueUsd)).toEqual([150, 160, 180]);
  });

  it('keeps a fund that stopped being updated in the total', () => {
    const merged = mergeFundTicks([
      [tick('2026-01-01', 100)],
      [tick('2026-01-01', 50), tick('2026-02-01', 60)],
    ]);
    expect(merged.at(-1)?.valueUsd).toBe(160);
  });

  it('counts a fund only from its first day', () => {
    const merged = mergeFundTicks([
      [tick('2026-01-01', 100), tick('2026-01-02', 100)],
      [tick('2026-01-02', 50)],
    ]);
    expect(merged.map((x) => x.valueUsd)).toEqual([100, 150]);
  });

  it('handles many years without getting slow', () => {
    const days = Array.from({ length: 3650 }, (_, i) => new Date(Date.UTC(2016, 0, 1 + i)).toISOString().slice(0, 10));
    const funds = [0, 1, 2, 3, 4].map(() => days.map((d) => tick(d, 1)));
    const started = performance.now();
    const merged = mergeFundTicks(funds);
    expect(merged).toHaveLength(3650);
    expect(merged[0].valueUsd).toBe(5);
    expect(performance.now() - started).toBeLessThan(500);
  });

  it('is empty without funds', () => {
    expect(mergeFundTicks([])).toEqual([]);
    expect(mergeFundTicks([[]])).toEqual([]);
  });
});

describe('portfolio numbers', () => {
  it('computes profit including withdrawals', () => {
    expect(profitPercent(50, 100, 100)).toBe(50);
  });

  it('has no profit without deposits instead of dividing by zero', () => {
    expect(profitPercent(50, 0, 0)).toBe(0);
  });

  it('average price ignores nothing and survives no transactions', () => {
    const tx = [
      { amountUsd: 100, amountBtc: 1 },
      { amountUsd: 300, amountBtc: 1 },
    ];
    expect(averageBtcPrice(tx, 'amountUsd', 'amountBtc')).toBe(200);
    expect(averageBtcPrice([], 'amountUsd' as never, 'amountBtc' as never)).toBe(0);
    expect(averageBtcPrice(undefined, 'amountUsd' as never, 'amountBtc' as never)).toBe(0);
  });

  it('recognizes every name of bitcoin', () => {
    expect(btcOnly([{ currency: 'BTC', amount: 1 }, { currency: 'XXBT', amount: 2 }, { currency: 'xbt', amount: 3 }, { currency: 'USD', amount: 9 }])).toBe(6);
  });

  it('expresses the BTC ratio in percent', () => {
    expect(btcRatio(1, 4)).toBe(25);
    expect(btcRatio(1, 0)).toBe(0);
  });

  it('sorts exchanges without touching the input', () => {
    const input = [{ balances: [{}, {}] }, { balances: [{}] }];
    const sorted = sortExchanges(input);
    expect(sorted[0].balances).toHaveLength(1);
    expect(input[0].balances).toHaveLength(2);
  });
});
