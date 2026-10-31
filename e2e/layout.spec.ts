import { expect, test } from '@playwright/test';
import { FundSpec, manyFunds, mockApi, pageOverflow } from './fixtures';

const SHOTS = process.env.E2E_SHOTS;
const viewports = [
  { name: 'phone', width: 375, height: 800 },
  { name: 'tablet', width: 820, height: 1000 },
  { name: 'laptop', width: 1366, height: 800 },
  { name: 'wide', width: 2200, height: 1100 },
];

async function shot(page: import('@playwright/test').Page, name: string) {
  if (SHOTS) {
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${SHOTS}/${name}.png`, fullPage: false });
  }
}

const pages = [
  { name: 'dashboard', url: '/#/dashboard', ready: 'Fund performance' },
  { name: 'statistics', url: '/#/statistics', ready: 'Statistics' },
  { name: 'funds', url: '/#/private/funds/overview', ready: 'Funds' },
  { name: 'portfolio', url: '/#/private/portfolio', ready: 'Hello, Test' },
];

for (const viewport of viewports) {
  test.describe(viewport.name, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    for (const target of pages) {
      test(`${target.name} never scrolls sideways with many funds and years`, async ({ page }) => {
        await mockApi(page);
        await page.goto(target.url);
        await expect(page.getByRole('heading', { name: target.ready, exact: true })).toBeVisible();
        await page.waitForLoadState('networkidle');
        expect(await pageOverflow(page)).toBeLessThanOrEqual(0);
        await shot(page, `${viewport.name}-${target.name}`);
      });
    }
  });
}

test.describe('dashboard with several funds', () => {
  test.use({ viewport: { width: 1366, height: 900 } });

  test('selects the first available fund when there is no fund 1', async ({ page }) => {
    await mockApi(page);
    await page.goto('/#/dashboard');
    await expect(page.getByRole('heading', { name: /Alpha Long Running.*vs Bitcoin/ })).toBeVisible();
    await expect(page.getByRole('tab', { selected: true })).toContainText('Alpha');
  });

  test('every fund is offered and each can be selected', async ({ page }) => {
    await mockApi(page);
    await page.goto('/#/dashboard');
    await expect(page.getByRole('tab')).toHaveCount(manyFunds.length);
    await page.getByRole('tab', { name: /Gamma/ }).click();
    await expect(page.getByRole('heading', { name: 'Gamma vs Bitcoin' })).toBeVisible();
    await expect(page).toHaveURL(/fund=13/);
  });

  test('selected fund survives a reload', async ({ page }) => {
    await mockApi(page);
    await page.goto('/#/dashboard?fund=14');
    await expect(page.getByRole('heading', { name: 'Delta vs Bitcoin' })).toBeVisible();
    await page.reload();
    await expect(page.getByRole('heading', { name: 'Delta vs Bitcoin' })).toBeVisible();
  });

  test('unknown fund in the address falls back instead of showing nothing', async ({ page }) => {
    await mockApi(page);
    await page.goto('/#/dashboard?fund=999');
    await expect(page.getByRole('heading', { name: /Alpha.*vs Bitcoin/ })).toBeVisible();
  });

  test('a single fund works', async ({ page }) => {
    const one: FundSpec[] = [{ id: 42, name: 'Only', years: 1 }];
    await mockApi(page, one);
    await page.goto('/#/dashboard');
    await expect(page.getByRole('heading', { name: 'Only vs Bitcoin' })).toBeVisible();
  });

  test('no funds at all explains itself', async ({ page }) => {
    await mockApi(page, []);
    await page.goto('/#/dashboard');
    await expect(page.getByText('There are no funds to display.')).toBeVisible();
  });

  test('stale fund is flagged', async ({ page }) => {
    await mockApi(page);
    await page.goto('/#/dashboard');
    await expect(page.getByRole('tab', { name: /Beta/ })).toContainText('No update for 38 days');
  });

  test('all years fit one table, newest first', async ({ page }) => {
    await mockApi(page);
    await page.goto('/#/dashboard');
    const rows = page.locator('table.matrix tbody tr');
    await expect(rows).toHaveCount(12);
    await expect(rows.first().locator('th')).toHaveText(String(new Date().getUTCFullYear()));
    await page.getByText('vs Bitcoin', { exact: true }).click();
    await expect(rows).toHaveCount(12);
  });

  test('twelve years of data render quickly', async ({ page }) => {
    await mockApi(page);
    const started = Date.now();
    await page.goto('/#/dashboard');
    await expect(page.locator('nx-chart canvas')).toBeVisible();
    expect(Date.now() - started).toBeLessThan(4000);
    await page.getByRole('tab', { name: /Gamma/ }).click();
    await expect(page.getByRole('heading', { name: 'Gamma vs Bitcoin' })).toBeVisible();
  });
});

test.describe('funds overview', () => {
  test.use({ viewport: { width: 1366, height: 900 } });

  test('shows connectors that stopped updating', async ({ page }) => {
    await mockApi(page);
    await page.goto('/#/private/funds/overview');
    await expect(page.getByRole('heading', { name: /1 connector\(s\) not updating/ })).toBeVisible();
    await expect(page.getByText('Exchange answered 403')).toBeVisible();
  });

  test('selecting a fund and a connector shows its history', async ({ page }) => {
    await mockApi(page);
    await page.goto('/#/private/funds/overview');
    await page.getByRole('tab', { name: /Gamma/ }).click();
    await expect(page.getByRole('tab', { selected: true })).toContainText('Gamma');
    await page.getByRole('button', { name: /Binance/ }).first().click();
    await expect(page.getByRole('heading', { name: 'Balance history' })).toBeVisible();
    await expect(page.locator('nx-chart canvas')).toBeVisible();
    await shot(page, 'laptop-funds-history');
  });
});

test.describe('portfolio with several funds', () => {
  test.use({ viewport: { width: 1366, height: 900 } });

  test('shows the total and a tab per fund', async ({ page }) => {
    await mockApi(page);
    await page.goto('/#/private/portfolio');
    await expect(page.getByRole('heading', { name: 'All funds' }).first()).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Gamma' })).toBeAttached();
    await page.getByRole('tab', { name: 'Beta' }).click();
    await expect(page.getByRole('heading', { name: 'Transactions' })).toBeVisible();
  });

  test('switching currency is remembered', async ({ page }) => {
    await mockApi(page);
    await page.goto('/#/private/portfolio');
    await page.locator('label', { hasText: 'BTC' }).click();
    await page.reload();
    await expect(page.getByRole('radio', { name: 'BTC' })).toBeChecked();
  });

  test('a single fund has no pointless total', async ({ page }) => {
    await mockApi(page, [{ id: 42, name: 'Only', years: 1 }]);
    await page.goto('/#/private/portfolio');
    await expect(page.getByRole('heading', { name: 'Hello, Test' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'All funds' })).toHaveCount(0);
  });
});
