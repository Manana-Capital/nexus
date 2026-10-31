import { describe, expect, it } from 'vitest';
import { compactNumber, rangeStart, timeChartOption, TimeSeries, toPoints } from './chart-options';

const series = (name: string, points: [string, number][]): TimeSeries => ({
  name,
  color: '#2d5fc4',
  points: points.map(([date, value]) => ({ time: Date.parse(date), value })),
});

type Option = { series: { data: number[][]; sampling: string; showSymbol: boolean }[]; legend?: unknown; yAxis: { type: string }; animation: boolean };

describe('timeChartOption', () => {
  it('keeps one y axis for several series', () => {
    const option = timeChartOption({ series: [series('a', []), series('b', [])], format: String }) as unknown as Option;
    expect(Array.isArray(option.yAxis)).toBe(false);
    expect(option.legend).toBeDefined();
  });

  it('has no legend box for a single series', () => {
    const option = timeChartOption({ series: [series('a', [])], format: String }) as unknown as Option;
    expect(option.legend).toBeUndefined();
  });

  it('samples large series and hides point markers', () => {
    const option = timeChartOption({ series: [series('a', [['2026-01-01', 1]])], format: String }) as unknown as Option;
    expect(option.series[0].sampling).toBe('lttb');
    expect(option.series[0].showSymbol).toBe(false);
  });

  it('turns animation off for many points', () => {
    const big: TimeSeries = { name: 'a', color: '#000', points: Array.from({ length: 5000 }, (_, i) => ({ time: i, value: i })) };
    expect((timeChartOption({ series: [big], format: String }) as unknown as Option).animation).toBe(false);
  });

  it('drops values a log scale can not show', () => {
    const option = timeChartOption({ series: [series('a', [['2026-01-01', 0], ['2026-01-02', 5]])], format: String, log: true }) as unknown as Option;
    expect(option.yAxis.type).toBe('log');
    expect(option.series[0].data).toHaveLength(1);
  });
});

describe('rangeStart', () => {
  const data = [series('a', [['2020-01-01', 1], ['2026-06-15', 2]])];

  it('counts back from the newest data', () => {
    expect(new Date(rangeStart(data, '1Y')!).toISOString().slice(0, 10)).toBe('2025-06-15');
  });

  it('shows everything for ALL and for no data', () => {
    expect(rangeStart(data, 'ALL')).toBeUndefined();
    expect(rangeStart([series('a', [])], '1Y')).toBeUndefined();
  });
});

describe('toPoints', () => {
  it('sorts by time and drops broken values', () => {
    const points = toPoints(
      [{ t: '2026-01-02', v: 2 }, { t: '2026-01-01', v: 1 }, { t: 'x', v: 3 }, { t: '2026-01-03', v: undefined }],
      (x) => x.t,
      (x) => x.v,
    );
    expect(points.map((x) => x.value)).toEqual([1, 2]);
  });
});

describe('compactNumber', () => {
  it.each([[0, '0'], [0.5, '0.5'], [12, '12'], [1500, '1.5k'], [25000, '25k'], [1250000, '1.3M'], [-3000, '-3k']])('%s -> %s', (value, text) => {
    expect(compactNumber(value)).toBe(text);
  });
});
