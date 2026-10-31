import { expect, test } from '@playwright/test';
import { pageOverflow } from './fixtures';

const password = process.env.E2E_PASSWORD;
const SHOTS = process.env.E2E_SHOTS;

/** Against a running backend with real data: E2E_PASSWORD holds the password of the test logins. */
test.describe('with the real backend', () => {
  test.skip(!password, 'E2E_PASSWORD is not set');

  async function login(page: import('@playwright/test').Page, username: string) {
    await page.goto('/#/dashboard');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.locator('#Username').fill(username);
    await page.locator('#Password').fill(password!);
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByRole('heading', { name: 'Fund performance' })).toBeVisible({ timeout: 30_000 });
    await expect(page.getByRole('button', { name: 'Login' })).toHaveCount(0, { timeout: 15_000 });
  }

  test('public dashboard works without logging in', async ({ page }) => {
    const failures: string[] = [];
    page.on('pageerror', (e) => failures.push(e.message));
    await page.goto('/#/dashboard');
    await expect(page.getByRole('tab').first()).toBeVisible({ timeout: 30_000 });
    await expect(page.locator('nx-chart canvas')).toBeVisible();
    expect(failures).toEqual([]);
    if (SHOTS) await page.screenshot({ path: `${SHOTS}/real-dashboard-anon.png`, fullPage: true });
  });

  test('admin signs in, sees all sections and signs out', async ({ page }) => {
    const failures: string[] = [];
    page.on('pageerror', (e) => failures.push(e.message));
    await login(page, 'e2e-admin');
    if (SHOTS) await page.screenshot({ path: `${SHOTS}/real-dashboard-admin.png`, fullPage: true });

    await page.locator('nav').getByText('Funds', { exact: true }).click();
    await expect(page.getByRole('tab').first()).toBeVisible({ timeout: 30_000 });
    expect(await pageOverflow(page)).toBeLessThanOrEqual(0);
    if (SHOTS) await page.screenshot({ path: `${SHOTS}/real-funds.png`, fullPage: true });

    await page.locator('nav').getByText('My portfolio').click();
    await expect(page.getByRole('heading', { name: /Hello/ })).toBeVisible({ timeout: 30_000 });
    expect(await pageOverflow(page)).toBeLessThanOrEqual(0);
    if (SHOTS) await page.screenshot({ path: `${SHOTS}/real-portfolio.png`, fullPage: true });

    // stays signed in after a reload
    await page.reload();
    await expect(page.locator('nav').getByText('My portfolio')).toBeVisible({ timeout: 15_000 });

    expect(failures).toEqual([]);

    await page.locator('button.user').click();
    await page.getByText('Logout').click();
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible({ timeout: 15_000 });
  });

  test('client sees no company section', async ({ page }) => {
    await login(page, 'e2e-investor');
    await expect(page.locator('nav').getByText('My portfolio')).toBeVisible();
    await expect(page.locator('nav').getByText('Clients')).toHaveCount(0);
    await expect(page.locator('nav').getByText('Logs')).toHaveCount(0);
  });

  const adminPages = [
    { url: '/#/private/clients/overview', heading: 'Clients', shot: 'clients' },
    { url: '/#/private/funds/configuration', heading: 'Fund configuration', shot: 'funds-config' },
    { url: '/#/private/profile', heading: /.+/, shot: 'profile' },
    { url: '/#/private/system/logs', heading: 'Logs', shot: 'logs' },
  ];

  for (const width of [375, 1366]) {
    test(`admin pages load real data and fit at ${width}px`, async ({ page }) => {
      const failures: string[] = [];
      page.on('pageerror', (e) => failures.push(e.message));
      page.on('response', (r) => {
        if (r.url().includes('/api/') && r.status() >= 400) failures.push(`${r.status()} ${r.url()}`);
      });
      await page.setViewportSize({ width, height: 900 });
      await login(page, 'e2e-admin');
      for (const target of adminPages) {
        await page.goto(target.url);
        await expect(page.getByRole('heading', { name: target.heading, level: 1 })).toBeVisible({ timeout: 30_000 });
        await page.waitForLoadState('networkidle');
        expect(await pageOverflow(page)).toBeLessThanOrEqual(0);
        if (SHOTS) await page.screenshot({ path: `${SHOTS}/real-${target.shot}-${width}.png`, fullPage: true });
      }
      expect(failures).toEqual([]);
    });
  }

  test('fund configuration lists real funds with their connectors', async ({ page }) => {
    await login(page, 'e2e-admin');
    await page.goto('/#/private/funds/configuration');
    await expect(page.getByRole('heading', { name: 'Funds', exact: true })).toBeVisible({ timeout: 30_000 });
    await page.locator('tr.selectable').first().click();
    await expect(page.getByRole('heading', { name: /Connectors/ })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Edit connector' }).first()).toBeVisible({ timeout: 30_000 });
  });

  async function chooseFirst(page: import('@playwright/test').Page, control: string) {
    await page.locator(`nz-select[formControlName=${control}]`).click();
    await page.locator('nz-option-item').first().click();
  }

  async function record(page: import('@playwright/test').Page, type: string, name: string, usd: number) {
    await page.goto(`/#/private/clients/transaction/${type}`);
    await expect(page.getByRole('heading', { name, exact: true, level: 1 })).toBeVisible({ timeout: 30_000 });
    await chooseFirst(page, 'clientId');
    await page.locator('nz-input-number[formControlName=amountUsd] input').fill(String(usd));
    await page.locator('textarea[formControlName=note]').fill(`e2e ${type}`);
    await page.getByRole('button', { name: `Preview ${type}` }).click();

    // the backend computed the rest, nothing has been stored yet
    await expect(page.getByText(`${name} preview, check the amounts and continue`)).toBeVisible({ timeout: 30_000 });
    const amounts = await page.locator('dd strong').allTextContents();
    expect(Number(amounts[0].replaceAll(',', ''))).toBeGreaterThan(0);
    expect(Number(amounts[1].replaceAll(',', ''))).toBeCloseTo(usd, 0);
    if (SHOTS) await page.screenshot({ path: `${SHOTS}/real-${type}-preview.png`, fullPage: true });

    await page.getByRole('button', { name, exact: true }).click();
    await expect(page.getByText(`${name} completed`)).toBeVisible({ timeout: 30_000 });
  }

  test('deposit and withdrawal go through preview and get stored', async ({ page }) => {
    await login(page, 'e2e-admin');
    await record(page, 'deposit', 'Deposit', 1234);
    await record(page, 'withdrawal', 'Withdraw', 1234);
  });

  test('client gets no management actions on fund configuration', async ({ page }) => {
    await login(page, 'e2e-investor');
    await page.goto('/#/private/funds/configuration');
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('button', { name: 'New fund' })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Edit connector' })).toHaveCount(0);
  });

  test('wrong password stays on the login page', async ({ page }) => {
    await page.goto('/#/dashboard');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.locator('#Username').fill('e2e-admin');
    await page.locator('#Password').fill('definitely wrong');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByText('Invalid username or password')).toBeVisible();
  });
});
