import { test, expect } from '@playwright/test';
import { NAV_SECTIONS } from '../../src/commons/constants/navigation-menu';
import { EMAIL } from '../../src/commons/constants/contact';

const VISITOR_ROUTES = ['/', '/project', '/blog', '/roadmap', '/tools', '/stats', '/chat', '/certificates', '/changelog', '/legal/privacy'];

test.describe('Navigation', () => {
  test('home loads with the site title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Rizky Haksono/);
  });

  for (const route of VISITOR_ROUTES) {
    test(`${route} opens with a breadcrumb that starts at home`, async ({ page }) => {
      await page.goto(route);
      const home = page.getByRole('banner').getByRole('navigation', { name: 'Breadcrumb' }).getByRole('link', { name: 'Rizky Haksono', exact: true });
      await expect(home).toBeVisible();
      await expect(home).toHaveAttribute('href', '/');
    });
  }

  test('sidebar lists every section at 1440 and marks the current one', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    const sidebar = page.getByRole('navigation', { name: 'Sections' });
    for (const { label } of NAV_SECTIONS) {
      await expect(sidebar.getByRole('link', { name: label, exact: true })).toBeVisible();
    }
    await expect(page.getByRole('button', { name: 'Menu' })).toBeHidden();

    await sidebar.getByRole('link', { name: 'Writing', exact: true }).click();
    await expect(page).toHaveURL(/\/blog$/);
    await expect(
      page.getByRole('navigation', { name: 'Sections' }).getByRole('link', { name: 'Writing', exact: true }),
    ).toHaveAttribute('aria-current', 'page');
    await expect(page.getByRole('navigation', { name: 'Breadcrumb' }).getByRole('link', { name: 'Writing' })).toBeVisible();
  });

  test('tablet hides the sidebar behind the menu, with no search', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await expect(page.getByRole('navigation', { name: 'Sections' })).toBeHidden();
    await expect(page.getByRole('banner').getByRole('button', { name: /Search/ })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Menu' })).toBeVisible();
  });

  test('menu reaches every section on a phone', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await expect(page.getByRole('navigation', { name: 'Sections' })).toBeHidden();

    await page.getByRole('button', { name: 'Menu' }).click();
    const sheet = page.getByRole('dialog', { name: 'Menu' });
    await expect(sheet).toBeVisible();
    for (const { href, label } of NAV_SECTIONS) {
      await expect(sheet.getByRole('link', { name: label, exact: true })).toHaveAttribute('href', href);
    }

    await sheet.getByRole('link', { name: 'Certificates', exact: true }).click();
    await expect(page).toHaveURL(/\/certificates$/);
    await expect(sheet).toBeHidden();
  });

  test('home has no horizontal scroll at 375', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test('home has no horizontal scroll at 320', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto('/');
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  });
});

test.describe('Home', () => {
  test('opens on the sky cover and lists projects as a gallery with a link to all of them', async ({ page }) => {
    await page.goto('/');
    const main = page.getByRole('main');
    await expect(main.getByRole('heading', { level: 1, name: 'Rizky Haksono' })).toBeAttached();
    await expect(main.getByRole('heading', { level: 2, name: 'Projects', exact: true })).toBeVisible();
    await expect(main.locator('a[href^="/project/"]').first()).toBeVisible();
    await expect(main.getByRole('link', { name: /^All \d+ projects$/ })).toHaveAttribute('href', '/project');
    await expect(main.getByRole('heading', { level: 2, name: 'Writing', exact: true })).toBeVisible();
  });

  test('shows the work experience section with its entries', async ({ page }) => {
    await page.goto('/');
    const work = page.getByRole('region', { name: 'Work experience' });
    await expect(work.getByRole('heading', { level: 2 })).toBeVisible();
    await expect(work.getByRole('row').nth(1)).toBeVisible();
  });
});

test.describe('Footer and cover', () => {
  test('the page ends on the address, and the cover keeps a hidden pause control at 1280', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    await expect(page.getByRole('contentinfo').getByRole('link', { name: EMAIL })).toHaveAttribute('href', `mailto:${EMAIL}`);
    // No visible button: sr-only (a 1x1 box) until keyboard focus, so keyboard and screen readers can stop the sky.
    const pause = page.getByRole('button', { name: 'Pause the sky' });
    await expect(pause).toBeAttached();
    expect((await pause.boundingBox())?.width).toBeLessThanOrEqual(1);
    await pause.focus();
    await expect.poll(async () => (await pause.boundingBox())?.width ?? 0).toBeGreaterThan(1);
  });

  test('drops the pause control below 640, where the cover stands still', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await expect(page.getByRole('contentinfo').getByRole('link', { name: EMAIL })).toBeVisible();
    // display:none takes it out of the accessibility tree, so look it up with hidden elements included.
    await expect(page.getByRole('button', { name: 'Pause the sky', includeHidden: true })).toHaveCSS('display', 'none');
  });
});
