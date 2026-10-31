import { describe, expect, it } from 'vitest';
import { NxLogEvent } from '../../core/api/model';
import { filterLogs, lastPage, logLevelGroup, pageOf } from './logs-logic';

const log = (level: string): NxLogEvent => ({ level: level as NxLogEvent['level'] });

describe('logLevelGroup', () => {
  it('reads the camelCase names the API sends', () => {
    expect(logLevelGroup(log('error'))).toBe('error');
    expect(logLevelGroup(log('warning'))).toBe('warning');
    expect(logLevelGroup(log('information'))).toBe('information');
  });

  it('counts fatal as an error and accepts short names', () => {
    expect(logLevelGroup(log('fatal'))).toBe('error');
    expect(logLevelGroup(log('warn'))).toBe('warning');
    expect(logLevelGroup(log('info'))).toBe('information');
  });

  it('also reads the numbers of the generated model', () => {
    expect(logLevelGroup(log('0'))).toBe('verbose');
    expect(logLevelGroup(log('5'))).toBe('error');
  });

  it('falls back to the level text, unknown stays unknown', () => {
    expect(logLevelGroup({ levelString: 'Warning' })).toBe('warning');
    expect(logLevelGroup({})).toBeNull();
    expect(logLevelGroup(log('nonsense'))).toBeNull();
  });
});

describe('filterLogs', () => {
  const logs = [log('error'), log('fatal'), log('debug'), {}];

  it('shows everything without a selection', () => {
    expect(filterLogs(logs, [])).toHaveLength(4);
  });

  it('keeps the selected groups only', () => {
    expect(filterLogs(logs, ['error'])).toHaveLength(2);
    expect(filterLogs(logs, ['debug', 'error'])).toHaveLength(3);
    expect(filterLogs(logs, ['warning'])).toEqual([]);
  });
});

describe('paging', () => {
  it('slices the requested page', () => {
    expect(pageOf([1, 2, 3, 4, 5], 2, 2)).toEqual([3, 4]);
    expect(pageOf([1, 2, 3, 4, 5], 3, 2)).toEqual([5]);
  });

  it('always has a page, even without data', () => {
    expect(lastPage(0, 20)).toBe(1);
    expect(lastPage(20, 20)).toBe(1);
    expect(lastPage(21, 20)).toBe(2);
  });
});
