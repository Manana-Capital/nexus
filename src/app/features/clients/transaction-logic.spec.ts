import { describe, expect, it } from 'vitest';
import { amountHint, amountSource, commitDto, defaultClientId, defaultFundId, draftToDto, toTransactionType, TransactionDraft } from './transaction-logic';

const draft = (change: Partial<TransactionDraft> = {}): TransactionDraft => ({
  targetFundId: 7,
  clientId: 3,
  fromClientId: 4,
  toClientId: 5,
  created: new Date('2026-03-01T10:00:00Z'),
  shares: 0,
  amountUsd: 0,
  amountBtc: 0,
  note: '',
  ...change,
});

describe('defaultFundId', () => {
  it('takes the first fund returned when there is no fund 1', () => {
    expect(defaultFundId([{ id: 7 }, { id: 3 }])).toBe(7);
  });

  it('does not prefer fund 1 over the order of the API', () => {
    expect(defaultFundId([{ id: 2 }, { id: 1 }])).toBe(2);
  });

  it('is null for an empty list', () => {
    expect(defaultFundId([])).toBeNull();
  });

  it('keeps the current fund while it exists, moves on when it is gone', () => {
    expect(defaultFundId([{ id: 7 }, { id: 3 }], 3)).toBe(3);
    expect(defaultFundId([{ id: 7 }], 3)).toBe(7);
    expect(defaultFundId([], 3)).toBeNull();
  });

  it('handles fund id 0 and funds without an id', () => {
    expect(defaultFundId([{}, { id: 0 }])).toBe(0);
    expect(defaultFundId([{ id: 0 }, { id: 2 }], 0)).toBe(0);
    expect(defaultFundId([{}])).toBeNull();
  });
});

describe('defaultClientId', () => {
  it('uses the preferred client only when it is on the list', () => {
    expect(defaultClientId([{ fundClientId: 5 }], 5)).toBe(5);
    expect(defaultClientId([{ fundClientId: 5 }], 9)).toBeNull();
    expect(defaultClientId([{ fundClientId: 5 }], undefined)).toBeNull();
    expect(defaultClientId([], 5)).toBeNull();
  });
});

describe('toTransactionType', () => {
  it('falls back to deposit for anything unknown', () => {
    expect(toTransactionType('withdrawal')).toBe('withdrawal');
    expect(toTransactionType('transfer')).toBe('transfer');
    expect(toTransactionType('deposit')).toBe('deposit');
    expect(toTransactionType('drop-table')).toBe('deposit');
    expect(toTransactionType(undefined)).toBe('deposit');
  });
});

describe('amountSource', () => {
  it('follows the order of the backend: shares, BTC, USD', () => {
    expect(amountSource({ shares: 1, amountBtc: 2, amountUsd: 3 })).toBe('shares');
    expect(amountSource({ shares: 0, amountBtc: 2, amountUsd: 3 })).toBe('amountBtc');
    expect(amountSource({ shares: 0, amountBtc: 0, amountUsd: 3 })).toBe('amountUsd');
  });

  it('is null when nothing usable was entered', () => {
    expect(amountSource({ shares: 0, amountBtc: 0, amountUsd: 0 })).toBeNull();
    expect(amountSource({ shares: null, amountBtc: null, amountUsd: null })).toBeNull();
    expect(amountSource({ shares: -1, amountBtc: 0, amountUsd: 0 })).toBeNull();
  });
});

describe('amountHint', () => {
  it('asks for an amount when there is none', () => {
    expect(amountHint({ shares: 0, amountBtc: 0, amountUsd: 0 })).toContain('Enter shares, BTC or USD');
  });

  it('names the input used', () => {
    expect(amountHint({ shares: 0, amountBtc: 0, amountUsd: 100 })).toBe('Computed from USD.');
  });

  it('warns about inputs which have no effect', () => {
    expect(amountHint({ shares: 5, amountBtc: 1, amountUsd: 100 })).toBe('Computed from shares. The entered BTC and USD will be ignored.');
    expect(amountHint({ shares: 0, amountBtc: 1, amountUsd: 100 })).toBe('Computed from BTC. The entered USD will be ignored.');
  });
});

describe('draftToDto', () => {
  it('sends the selected fund, never an assumed one', () => {
    expect(draftToDto('deposit', draft()).targetFundId).toBe(7);
  });

  it('sends the client fields of the transaction type only', () => {
    const deposit = draftToDto('withdrawal', draft());
    expect(deposit.clientId).toBe(3);
    expect(deposit.fromClientId).toBeUndefined();
    const transfer = draftToDto('transfer', draft());
    expect(transfer.clientId).toBeUndefined();
    expect([transfer.fromClientId, transfer.toClientId]).toEqual([4, 5]);
  });

  it('turns cleared inputs into zero, the backend needs numbers', () => {
    const dto = draftToDto('deposit', draft({ shares: null, amountUsd: null, amountBtc: 0.5 }));
    expect([dto.shares, dto.amountUsd, dto.amountBtc]).toEqual([0, 0, 0.5]);
  });

  it('always asks for a preview and sends the date as ISO', () => {
    const dto = draftToDto('deposit', draft());
    expect(dto.preview).toBe(true);
    expect(dto.created).toBe('2026-03-01T10:00:00.000Z');
  });
});

describe('commitDto', () => {
  it('keeps the previewed numbers and leaves the preview untouched', () => {
    const preview = { targetFundId: 7, shares: 2.5, amountUsd: 100, amountBtc: 0.01, amountCzk: 2300, preview: true };
    expect(commitDto(preview)).toEqual({ ...preview, preview: false });
    expect(preview.preview).toBe(true);
  });
});
