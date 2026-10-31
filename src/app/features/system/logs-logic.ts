import { NxLogEvent } from '../../core/api/model';

export type LogLevelGroup = 'error' | 'warning' | 'information' | 'debug' | 'verbose';

export const LOG_LEVEL_OPTIONS: { label: string; value: LogLevelGroup }[] = [
  { label: 'Errors', value: 'error' },
  { label: 'Warnings', value: 'warning' },
  { label: 'Information', value: 'information' },
  { label: 'Debug', value: 'debug' },
  { label: 'Verbose', value: 'verbose' },
];

// order of the Serilog enum on the backend
const BY_NUMBER: LogLevelGroup[] = ['verbose', 'debug', 'information', 'warning', 'error', 'error'];
const BY_NAME: Record<string, LogLevelGroup> = {
  verbose: 'verbose',
  debug: 'debug',
  info: 'information',
  information: 'information',
  warn: 'warning',
  warning: 'warning',
  error: 'error',
  fatal: 'error',
};

/** The API sends the level as a camelCase name, although the generated model describes it as a number. */
export function logLevelGroup(event: NxLogEvent): LogLevelGroup | null {
  const level = String(event.level ?? event.levelString ?? '').toLowerCase();
  return BY_NAME[level] ?? (level === '' ? null : BY_NUMBER[Number(level)]) ?? null;
}

/** Nothing selected means all logs. */
export function filterLogs(logs: readonly NxLogEvent[], selected: readonly string[]): NxLogEvent[] {
  if (!selected.length) {
    return [...logs];
  }
  return logs.filter((x) => {
    const group = logLevelGroup(x);
    return group !== null && selected.includes(group);
  });
}

export function lastPage(total: number, pageSize: number): number {
  return Math.max(1, Math.ceil(total / pageSize));
}

export function pageOf<T>(items: readonly T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}
