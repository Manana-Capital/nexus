import { describe, expect, it } from 'vitest';
import { buildPerformanceMatrix, cellBackground } from './performance-matrix';

const years = [
  {
    year: 2024,
    yearChange: 10,
    yearChangeBtc: 20,
    btcOutperform: -10,
    months: [{ gathered: '2024-03-01T00:00:00Z', change: 1, changeBtc: 2, btcOutperform: -1 }],
  },
  { year: 2025, yearChange: 5, yearChangeBtc: 4, btcOutperform: 1, months: [{ gathered: '2025-12-15T00:00:00Z', change: 7, changeBtc: 8, btcOutperform: -1 }] },
];

describe('buildPerformanceMatrix', () => {
  it('puts the newest year first with all 12 months', () => {
    const rows = buildPerformanceMatrix(years, 'fund');
    expect(rows.map((x) => x.year)).toEqual([2025, 2024]);
    expect(rows[0].months).toHaveLength(12);
  });

  it('places values under their month and leaves gaps empty', () => {
    const rows = buildPerformanceMatrix(years, 'fund');
    expect(rows[1].months[2]).toBe(1);
    expect(rows[1].months[3]).toBeNull();
    expect(rows[0].months[11]).toBe(7);
  });

  it('switches the source of values by mode', () => {
    expect(buildPerformanceMatrix(years, 'btc')[1].total).toBe(20);
    expect(buildPerformanceMatrix(years, 'outperform')[1].months[2]).toBe(-1);
  });

  it('accepts a fund with no history', () => {
    expect(buildPerformanceMatrix(undefined, 'fund')).toEqual([]);
  });

  it('does not reorder the original data', () => {
    buildPerformanceMatrix(years, 'fund');
    expect(years[0].year).toBe(2024);
  });
});

describe('cellBackground', () => {
  it('keeps zero and empty cells neutral', () => {
    expect(cellBackground(0)).toBe('transparent');
    expect(cellBackground(null)).toBe('transparent');
  });

  it('uses different hues for gains and losses', () => {
    expect(cellBackground(5)).not.toEqual(cellBackground(-5));
  });

  it('caps the strength for huge moves', () => {
    expect(cellBackground(900)).toEqual(cellBackground(30));
  });
});
