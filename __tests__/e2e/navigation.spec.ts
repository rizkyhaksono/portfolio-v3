import { test, expect } from '@playwright/test';
import { NAV_SECTIONS } from '../../src/commons/constants/navigation-menu';

const headLinks = (size: 'md' | 'lg') =>
  NAV_SECTIONS.filter((s) => s.head === 'md' || (size === 'lg' && s.head === 'lg'));

test.describe('Navigation', () => {
  test('home loads with the site title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Rizky Haksono/);
  });

  test('running head lists every section at 1440 and marks the current one', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    const head = page.getByRole('navigation', { name: 'Sections' });
    for (const { label } of headLinks('lg')) {
      await expect(head.getByRole('link', { name: label, exact: true })).toBeVisible();
    }
    await expect(page.getByRole('button', { name: 'Menu' })).toBeHidden();

    await head.getByRole('link', { name: 'Writing', exact: true }).click();
    await expect(page).toHaveURL(/\/blog$/);
    await expect(
      page.getByRole('navigation', { name: 'Sections' }).getByRole('link', { name: 'Writing', exact: true }),
    ).toHaveAttribute('aria-current', 'page');
  });

  test('tablet head shows the short row, search and the menu', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    const head = page.getByRole('navigation', { name: 'Sections' });
    for (const { label } of headLinks('md')) {
      await expect(head.getByRole('link', { name: label, exact: true })).toBeVisible();
    }
    await expect(head.getByRole('link', { name: 'Chat', exact: true })).toBeHidden();
    await expect(page.getByRole('banner').getByRole('button', { name: /Search/ })).toBeVisible();
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
      await expect(sheet.getByRole('link', { name: new RegExp(`^${label}`) })).toHaveAttribute('href', href);
    }

    await sheet.getByRole('link', { name: /^Credentials/ }).click();
    await expect(page).toHaveURL(/\/certificates$/);
    await expect(sheet).toBeHidden();
  });

  test('home has no horizontal scroll at 375', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test('home portrait sits in the stage on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    await expect(page.locator('.ws__stage').getByRole('img', { name: 'Rizky Haksono', exact: true })).toBeVisible();
  });

  test('home portrait sits in the first screen on a phone without overflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    const stage = page.locator('.ws__stage');
    await expect(stage.getByRole('img', { name: 'Rizky Haksono', exact: true })).toBeInViewport({ ratio: 1 });
    await expect(stage.getByRole('link', { name: /^Résumé \(PDF\)/ })).toBeInViewport({ ratio: 1 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375);
  });

  test('home hero fits the first screen of a short phone', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await expect(page.locator('.ws__stage').getByRole('link', { name: /^Résumé \(PDF\)/ })).toBeInViewport({ ratio: 1 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375);
  });
});
