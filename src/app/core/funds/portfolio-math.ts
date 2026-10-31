import { FundBalance, FundBalancePerExchange, FundTotalBalanceInfo, PortfolioBalanceTick, PortfolioFundInfo, PortfolioInfo } from '../api/model';

const BTC_NAMES = new Set(['btc', 'xbt', 'xxbt']);

function day(timestamp: string | undefined): string {
  return (timestamp ?? '').slice(0, 10);
}

const NUMERIC_FIELDS = ['shares', 'valueUsd', 'valueBtc', 'valueCzk', 'depositedUsd', 'depositedBtc', 'depositedCzk'] as const;

/**
 * Combines daily ticks of several funds into a portfolio total.
 * Funds don't all have a snapshot for every day and they start at different times, so each one contributes
 * its last known value until a newer one arrives; summing only the funds present on a day would make the
 * total collapse whenever one of them misses a snapshot.
 */
export function mergeFundTicks(funds: PortfolioBalanceTick[][]): PortfolioBalanceTick[] {
  const byFund = funds.map((ticks) => new Map(ticks.map((tick) => [day(tick.timestamp), tick])));
  const days = [...new Set(byFund.flatMap((ticks) => [...ticks.keys()]))].sort();

  const latest: (PortfolioBalanceTick | undefined)[] = funds.map(() => undefined);
  return days.map((date) => {
    byFund.forEach((ticks, index) => {
      latest[index] = ticks.get(date) ?? latest[index];
    });

    const total: PortfolioBalanceTick = { timestamp: `${date}T00:00:00Z` };
    for (const field of NUMERIC_FIELDS) {
      total[field] = latest.reduce((sum, tick) => sum + (tick?.[field] ?? 0), 0);
    }
    return total;
  });
}

function sum<T>(items: T[] | undefined, value: (item: T) => number | undefined): number {
  return (items ?? []).reduce((total, item) => total + (value(item) ?? 0), 0);
}

export function depositedOf(fund: PortfolioFundInfo, suffix: 'Usd' | 'Btc' | 'Czk'): number {
  return sum(fund.deposits, (x) => x[`amount${suffix}`]);
}

export function withdrawnOf(fund: PortfolioFundInfo, suffix: 'Usd' | 'Btc' | 'Czk'): number {
  return sum(fund.withdrawals, (x) => x[`amount${suffix}`]);
}

/** Total return on the deposited amount in percent, zero when there is nothing to compare to. */
export function profitPercent(balance: number, deposited: number, withdrawn: number): number {
  return deposited > 0 ? ((balance + withdrawn) / deposited - 1) * 100 : 0;
}

/** Average BTC price of a set of transactions, zero when they contain no BTC. */
export function averageBtcPrice<T extends object>(transactions: T[] | undefined, valueField: keyof T & string, btcField: keyof T & string): number {
  const btc = sum(transactions, (x) => x[btcField] as number | undefined);
  return btc > 0 ? sum(transactions, (x) => x[valueField] as number | undefined) / btc : 0;
}

export function portfolioFunds(info: PortfolioInfo | null | undefined): PortfolioFundInfo[] {
  return info?.activeFundsInfo ?? [];
}

export function btcOnly(balances: FundBalance[] | undefined): number {
  return sum(balances, (x) => (BTC_NAMES.has((x.currency ?? '').toLowerCase()) ? x.amount : 0));
}

export function btcOnlyOfFund(fund: FundTotalBalanceInfo): number {
  return sum(fund.balances, (x) => btcOnly(x.balances));
}

/** Share of the value held directly in BTC, in percent. */
export function btcRatio(btcHeld: number, totalBtc: number | undefined): number {
  return totalBtc && totalBtc > 0 ? (btcHeld / totalBtc) * 100 : 0;
}

/** Exchanges with most assets last, the single value ones read best first; never reorders the input. */
export function sortExchanges(balances: FundBalancePerExchange[] | undefined): FundBalancePerExchange[] {
  return [...(balances ?? [])].sort((a, b) => (a.balances?.length ?? 0) - (b.balances?.length ?? 0));
}
