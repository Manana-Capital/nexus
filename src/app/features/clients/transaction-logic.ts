import { DepositDto, FundClient, TransferSharesDto, WithdrawalDto } from '../../core/api/model';

export type TransactionType = 'deposit' | 'withdrawal' | 'transfer';
export type TransactionDto = DepositDto & WithdrawalDto & TransferSharesDto;

export const TRANSACTION_NAMES: Record<TransactionType, string> = { deposit: 'Deposit', withdrawal: 'Withdraw', transfer: 'Transfer' };

/** What the operator entered, kept apart from the amounts the server fills in during preview. */
export interface TransactionDraft {
  targetFundId: number | null;
  clientId: number | null;
  fromClientId: number | null;
  toClientId: number | null;
  created: Date | null;
  shares: number | null;
  amountUsd: number | null;
  amountBtc: number | null;
  note: string | null;
}

type Amounts = Pick<TransactionDraft, 'shares' | 'amountUsd' | 'amountBtc'>;

export function toTransactionType(value: string | undefined): TransactionType {
  return value === 'withdrawal' || value === 'transfer' ? value : 'deposit';
}

/** Keeps the current fund while it still exists, otherwise the first one returned. Fund ids carry no meaning. */
export function defaultFundId(funds: readonly { id?: number }[], current?: number | null): number | null {
  const ids = funds.map((x) => x.id).filter((x): x is number => x !== undefined && x !== null);
  return current !== undefined && current !== null && ids.includes(current) ? current : (ids[0] ?? null);
}

export function defaultClientId(clients: readonly FundClient[], preferred: number | null | undefined): number | null {
  return clients.some((x) => x.fundClientId === preferred) ? (preferred as number) : null;
}

/**
 * The input the server computes everything else from. The order mirrors ClientsFacade.FillAmounts on the backend:
 * shares win over BTC, BTC over USD.
 */
export function amountSource(amounts: Amounts): 'shares' | 'amountBtc' | 'amountUsd' | null {
  if ((amounts.shares ?? 0) > 0) {
    return 'shares';
  }
  if ((amounts.amountBtc ?? 0) > 0) {
    return 'amountBtc';
  }
  return (amounts.amountUsd ?? 0) > 0 ? 'amountUsd' : null;
}

export function amountHint(amounts: Amounts): string {
  const source = amountSource(amounts);
  if (!source) {
    return 'Enter shares, BTC or USD, the rest is computed from the share price at the date.';
  }
  const inputs = [
    { key: 'shares', label: 'shares', value: amounts.shares },
    { key: 'amountBtc', label: 'BTC', value: amounts.amountBtc },
    { key: 'amountUsd', label: 'USD', value: amounts.amountUsd },
  ];
  const used = inputs.find((x) => x.key === source)?.label;
  const ignored = inputs.filter((x) => x.key !== source && (x.value ?? 0) > 0).map((x) => x.label);
  return `Computed from ${used}.${ignored.length ? ` The entered ${ignored.join(' and ')} will be ignored.` : ''}`;
}

export function draftToDto(type: TransactionType, draft: TransactionDraft): TransactionDto {
  const common: TransactionDto = {
    targetFundId: draft.targetFundId ?? undefined,
    created: draft.created?.toISOString(),
    // a cleared number input gives null, which the backend can't read as a number
    shares: draft.shares ?? 0,
    amountUsd: draft.amountUsd ?? 0,
    amountBtc: draft.amountBtc ?? 0,
    note: draft.note || undefined,
    preview: true,
  };
  return type === 'transfer'
    ? { ...common, fromClientId: draft.fromClientId ?? undefined, toClientId: draft.toClientId ?? undefined }
    : { ...common, clientId: draft.clientId ?? undefined };
}

/** Commits exactly what the server returned for the preview. */
export function commitDto(preview: TransactionDto): TransactionDto {
  return { ...preview, preview: false };
}
