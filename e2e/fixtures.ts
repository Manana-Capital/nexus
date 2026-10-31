import { Page, Route } from '@playwright/test';

const DAY = 86_400_000;

export interface FundSpec {
  id: number;
  name: string;
  years: number;
  /** Days since the newest snapshot, to simulate a fund that stopped updating. */
  staleDays?: number;
}

function days(years: number, staleDays = 0): string[] {
  const now = Date.now() - staleDays * DAY;
  return Array.from({ length: years * 365 }, (_, i) => new Date(now - (years * 365 - 1 - i) * DAY).toISOString().slice(0, 10) + 'T00:00:00Z');
}

export function fund({ id, name, years, staleDays }: FundSpec) {
  const dates = days(years, staleDays);
  const ticks = dates.map((gathered, i) => ({ gathered, price: 100 + i * 0.3 + 30 * Math.sin(i / 40) }));
  const btcTicks = dates.map((timestamp, i) => ({ timestamp, pricePerShare: 100 * Math.exp(i / 900) + 40 * Math.sin(i / 25), close: 5000 + i * 20, volume: 1000 }));
  const firstYear = new Date().getUTCFullYear() - years + 1;
  const performanceYears = Array.from({ length: years }, (_, y) => ({
    year: firstYear + y,
    yearChange: 12.5 - y,
    yearChangeBtc: 40 - y * 9,
    btcOutperform: -27 + y * 8,
    months: Array.from({ length: 12 }, (_, m) => ({
      gathered: `${firstYear + y}-${String(m + 1).padStart(2, '0')}-15T00:00:00Z`,
      change: Math.sin(m + y) * 8,
      changeBtc: Math.cos(m + y) * 22,
      btcOutperform: Math.sin(m) * 15,
    })),
  }));
  return {
    id,
    key: name.toLowerCase().replace(/\s/g, '-'),
    displayName: name,
    description: `${name} description`,
    isPublic: true,
    performance: { bigBang: 321.5, currentYear: 12.34, currentMonth: -1.23, currentWeek: 0.5, today: staleDays ? 0 : 0.12 },
    pricePerShare: { priceUsd: 321, priceBtc: 0.004, priceCzk: 7000 },
    ticks,
    btcTicks,
    performanceYears,
  };
}

/** Eight funds, none with id 1, one stale, with a very long name, 12 years of data: the shape that used to break the UI. */
export const manyFunds: FundSpec[] = [
  { id: 11, name: 'Alpha Long Running Progressive Mañana Capital Fund', years: 12 },
  { id: 12, name: 'Beta', years: 9, staleDays: 38 },
  { id: 13, name: 'Gamma', years: 7 },
  { id: 14, name: 'Delta', years: 5 },
  { id: 15, name: 'Epsilon', years: 3 },
  { id: 16, name: 'Zeta', years: 2 },
  { id: 17, name: 'Eta', years: 1 },
  { id: 18, name: 'Theta', years: 1 },
];

function balanceTicks(years: number, base: number) {
  return days(years).reverse().map((timestamp, i) => ({
    timestamp,
    shares: 100,
    valueUsd: base + (years * 365 - i) * 3,
    valueBtc: 0.5,
    valueCzk: (base + (years * 365 - i) * 3) * 23,
    depositedUsd: base,
    depositedBtc: 0.4,
    depositedCzk: base * 23,
  }));
}

export function portfolioFund(spec: FundSpec) {
  const ticks = balanceTicks(spec.years, 1000 * spec.id);
  return {
    fund: { id: spec.id, displayName: spec.name },
    shares: 100,
    assetsUsd: 5000,
    assetsBtc: 0.5,
    assetsCzk: 115000,
    profitUsd: 1000,
    profitBtc: 0.1,
    profitCzk: 23000,
    deposits: Array.from({ length: 30 }, (_, i) => ({ created: `20${10 + (i % 15)}-03-0${(i % 9) + 1}T10:00:00Z`, shares: 1, amountUsd: 500, amountBtc: 0.05, amountCzk: 11000, note: 'A deposit with a rather long note that must not widen the page in any way at all' })),
    withdrawals: [{ created: '2024-06-01T10:00:00Z', shares: 1, amountUsd: 100, amountBtc: 0.01, amountCzk: 2300 }],
    balanceTicks: ticks,
    profitTicks: ticks.map((x) => ({ ...x, valueUsd: x.valueUsd - 500 })),
  };
}

export function portfolio(specs: FundSpec[]) {
  return {
    client: { id: 5, firstName: 'Test', lastName: 'Client', email: 'test@example.invalid', roles: ['Client'] },
    accountAgeDays: 2000,
    totalFunds: specs.length,
    activeFunds: specs.length,
    totalAssetsUsd: 40000,
    totalAssetsBtc: 4,
    totalAssetsCzk: 920000,
    totalProfitUsd: 8000,
    totalProfitBtc: 0.8,
    totalProfitCzk: 184000,
    lastLoginInfo: { timestamp: '2026-10-30T10:00:00Z', provider: 'password' },
    activeFundsInfo: specs.map(portfolioFund),
  };
}

export function fundBalances(specs: FundSpec[]) {
  return specs.map((spec) => ({
    fund: { id: spec.id, displayName: spec.name },
    gathered: '2026-10-31T16:00:00Z',
    amountUsd: 123456.78 * spec.id,
    amountBtc: 1.5,
    amountCzk: 2800000 * spec.id,
    amountUsdDiff: 1200,
    amountBtcDiff: -0.01,
    amountCzkDiff: 24000,
    shares: 9000,
    balances: [1, 2, 3].map((n) => ({
      connectorId: spec.id * 100 + n,
      exchangeName: ['Bitfinex', 'Binance', 'Blockchain'][n - 1],
      exchangeDisplayName: 'A connector with quite a long descriptive name',
      amountUsd: 40000,
      amountBtc: 0.5,
      amountCzk: 900000,
      shares: 3000,
      balances: Array.from({ length: n * 12 }, (_, i) => ({ currency: i === 0 ? 'BTC' : `AST${i}`, amount: 0.25 + i })),
    })),
  }));
}

export const statuses = [
  { fundId: 11, fundName: 'Alpha', connectorId: 1101, exchangeName: 'Bitfinex', displayName: 'Lending', lastSuccess: '2026-10-31T16:00:00Z', lastAttempt: '2026-10-31T16:00:00Z', consecutiveFailures: 0, isHealthy: true },
  { fundId: 11, fundName: 'Alpha', connectorId: 1102, exchangeName: 'Binance', displayName: 'Bot', lastSuccess: '2026-09-23T03:00:00Z', lastAttempt: '2026-10-31T16:00:00Z', lastError: 'Exchange answered 403', consecutiveFailures: 912, isHealthy: false },
];

function json(route: Route, body: unknown, status = 200) {
  return route.fulfill({ status, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(body) });
}

export async function mockApi(page: Page, specs: FundSpec[] = manyFunds): Promise<void> {
  await page.route('**/.well-known/**', (route) => route.abort());
  await page.route('**/api/**', (route) => {
    const path = new URL(route.request().url()).pathname;
    if (path.endsWith('/api/funds/complex')) return json(route, specs.map(fund));
    if (path.endsWith('/api/prices')) return json(route, { hasPrice: true, btcUsd: 77123, btcCzk: 1690000 });
    if (path.endsWith('/api/statistics')) return json(route, { tradedFrom: '2018-01-01T00:00:00Z', tradedTo: '2026-10-01T00:00:00Z', activeBots: 5, tradedTransactionsCount: 9163002, tradedAmountBtc: 12345, tradedAmountUsd: 123456789, activeExchanges: ['Bitfinex', 'Kraken', 'Binance'] });
    if (path.endsWith('/api/portfolio')) return json(route, portfolio(specs));
    if (path.endsWith('/api/funds/balances')) return json(route, fundBalances(specs));
    if (path.endsWith('/api/funds/connectors/status')) return json(route, statuses);
    if (/\/api\/funds\/balances\/\d+$/.test(path)) return json(route, days(10).map((gathered, i) => ({ gathered, amountUsd: 1000 + i, amountBtc: 0.5, amountCzk: 23000 + i })));
    return json(route, []);
  });
}

/** True when the page itself scrolls sideways; scrolling inside a table wrapper is fine. */
export function pageOverflow(page: Page): Promise<number> {
  return page.evaluate(() => {
    const scroller = document.querySelector('main.content') as HTMLElement | null;
    const inner = scroller ? scroller.scrollWidth - scroller.clientWidth : 0;
    const outer = document.documentElement.scrollWidth - document.documentElement.clientWidth;
    return Math.max(inner, outer);
  });
}
