import type { EChartsCoreOption } from 'echarts/core';

/** Validated with the palette checks: distinct under color vision deficiency, contrast >= 3:1 on white. */
export const SERIES_COLORS = { fund: '#2d5fc4', btc: '#e0761a', neutral: '#6b7280', positive: '#1a7f5a' } as const;

export type RangeKey = '1Y' | '3Y' | '5Y' | 'ALL';

export interface TimePoint {
  time: number;
  value: number;
}

export interface TimeSeries {
  name: string;
  color: string;
  points: TimePoint[];
  area?: boolean;
  step?: boolean;
}

export interface TimeChartConfig {
  series: TimeSeries[];
  format: (value: number) => string;
  range?: RangeKey;
  log?: boolean;
  /** Extra lines of the tooltip for a moment in time. */
  details?: (time: number) => string[];
}

const YEARS: Record<Exclude<RangeKey, 'ALL'>, number> = { '1Y': 1, '3Y': 3, '5Y': 5 };
const AXIS_COLOR = '#9ca3af';
const GRID_COLOR = '#f0f1f3';

export function compactNumber(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) {
    return `${+(value / 1_000_000).toFixed(1)}M`;
  }
  if (abs >= 10_000) {
    return `${+(value / 1_000).toFixed(0)}k`;
  }
  if (abs >= 1_000) {
    return `${+(value / 1_000).toFixed(1)}k`;
  }
  if (abs >= 10 || abs === 0) {
    return `${+value.toFixed(0)}`;
  }
  return `${+value.toPrecision(2)}`;
}

function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

/** Start of the visible window for a range, the newest data stays at the right edge. */
export function rangeStart(series: TimeSeries[], range: RangeKey | undefined): number | undefined {
  if (!range || range === 'ALL') {
    return undefined;
  }
  const last = Math.max(...series.flatMap((x) => x.points.map((p) => p.time)));
  if (!Number.isFinite(last)) {
    return undefined;
  }
  const start = new Date(last);
  start.setUTCFullYear(start.getUTCFullYear() - YEARS[range]);
  return start.getTime();
}

/** One y-scale, thin lines, a crosshair tooltip and a zoom slider, built to stay fast with many years of data. */
export function timeChartOption(config: TimeChartConfig): EChartsCoreOption {
  const { series, format, log, range, details } = config;
  const totalPoints = series.reduce((sum, x) => sum + x.points.length, 0);
  const start = rangeStart(series, range);

  return {
    animation: totalPoints < 1500,
    textStyle: { fontFamily: 'inherit' },
    color: series.map((x) => x.color),
    legend: series.length > 1 ? { top: 0, left: 0, icon: 'roundRect', itemWidth: 14, itemHeight: 3, textStyle: { color: '#4b5563' } } : undefined,
    grid: { top: series.length > 1 ? 32 : 12, left: 8, right: 16, bottom: 52, containLabel: true },
    tooltip: {
      trigger: 'axis',
      confine: true,
      axisPointer: { type: 'line', lineStyle: { color: AXIS_COLOR } },
      formatter: (params: { axisValue: number; seriesName: string; marker: string; value: [number, number] }[]) => {
        const list = Array.isArray(params) ? params : [params];
        const time = Number(list[0]?.value?.[0] ?? list[0]?.axisValue);
        const date = new Date(time).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
        const rows = list.map(
          (x) => `<div>${x.marker}${escapeHtml(x.seriesName)} <strong style="float:right;margin-left:16px">${escapeHtml(format(x.value[1]))}</strong></div>`,
        );
        const extra = (details?.(time) ?? []).map((line) => `<div style="color:#6b7280">${escapeHtml(line)}</div>`);
        return `<div style="font-weight:500;margin-bottom:4px">${date}</div>${rows.join('')}${extra.join('')}`;
      },
    },
    xAxis: {
      type: 'time',
      axisLine: { lineStyle: { color: AXIS_COLOR } },
      axisTick: { show: false },
      axisLabel: { color: '#6b7280', hideOverlap: true },
      splitLine: { show: false },
    },
    yAxis: {
      type: log ? 'log' : 'value',
      scale: true,
      axisLabel: { color: '#6b7280', formatter: compactNumber },
      splitLine: { lineStyle: { color: GRID_COLOR } },
    },
    dataZoom: [
      { type: 'inside', startValue: start, filterMode: 'none' },
      { type: 'slider', startValue: start, height: 22, bottom: 8, showDetail: false, brushSelect: false, filterMode: 'none', borderColor: GRID_COLOR },
    ],
    series: series.map((x) => ({
      name: x.name,
      type: 'line',
      showSymbol: false,
      sampling: 'lttb',
      connectNulls: true,
      step: x.step ? 'end' : undefined,
      lineStyle: { width: 2, color: x.color },
      itemStyle: { color: x.color },
      areaStyle: x.area ? { color: x.color, opacity: 0.08 } : undefined,
      emphasis: { disabled: true },
      data: (log ? x.points.filter((p) => p.value > 0) : x.points).map((p) => [p.time, p.value]),
    })),
  };
}

export function toPoints<T>(items: T[] | undefined, time: (item: T) => string | undefined, value: (item: T) => number | undefined): TimePoint[] {
  return (items ?? [])
    .map((item) => ({ time: new Date(time(item) ?? '').getTime(), value: value(item) ?? NaN }))
    .filter((p) => Number.isFinite(p.time) && Number.isFinite(p.value))
    .sort((a, b) => a.time - b.time);
}
