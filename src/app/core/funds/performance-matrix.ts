import { FundPerformanceYear } from '../api/model';

export type MatrixMode = 'fund' | 'btc' | 'outperform';

export interface MatrixRow {
  year: number;
  months: (number | null)[];
  total: number | null;
}

/** Years as rows and months as columns, newest year first. Months without data stay empty. */
export function buildPerformanceMatrix(years: FundPerformanceYear[] | undefined, mode: MatrixMode): MatrixRow[] {
  const read = (x: { change?: number; changeBtc?: number; btcOutperform?: number }) =>
    (mode === 'fund' ? x.change : mode === 'btc' ? x.changeBtc : x.btcOutperform) ?? null;

  return [...(years ?? [])]
    .sort((a, b) => (b.year ?? 0) - (a.year ?? 0))
    .map((year) => {
      const months: (number | null)[] = new Array(12).fill(null);
      for (const month of year.months ?? []) {
        const index = new Date(month.gathered ?? '').getUTCMonth();
        if (index >= 0) {
          months[index] = read(month);
        }
      }
      const total = (mode === 'fund' ? year.yearChange : mode === 'btc' ? year.yearChangeBtc : year.btcOutperform) ?? null;
      return { year: year.year ?? 0, months, total };
    });
}

const POSITIVE = '26, 127, 90';
const NEGATIVE = '200, 68, 63';
const STRONGEST_AT = 30;

/** Diverging background of a percentage: two hues around a neutral zero, the number stays in the text color. */
export function cellBackground(value: number | null): string {
  if (value === null || value === 0 || Number.isNaN(value)) {
    return 'transparent';
  }
  const strength = Math.min(Math.abs(value), STRONGEST_AT) / STRONGEST_AT;
  return `rgba(${value > 0 ? POSITIVE : NEGATIVE}, ${(0.06 + strength * 0.34).toFixed(3)})`;
}
