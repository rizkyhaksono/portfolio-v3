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

  test('tablet head shows the short row and the menu, no search', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    const head = page.getByRole('navigation', { name: 'Sections' });
    for (const { label } of headLinks('md')) {
      await expect(head.getByRole('link', { name: label, exact: true })).toBeVisible();
    }
    await expect(head.getByRole('link', { name: 'Chat', exact: true })).toBeHidden();
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
      await expect(sheet.getByRole('link', { name: new RegExp(`^${label}`) })).toHaveAttribute('href', href);
    }

    await sheet.getByRole('link', { name: /^Certificates/ }).click();
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

  test('portrait sits in About, not the hero, on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    const portrait = { name: 'Portrait of Rizky Haksono', exact: true };
    await expect(page.locator('#about').getByRole('img', portrait)).toBeVisible();
    await expect(page.locator('.print-plate').getByRole('img', portrait)).toHaveCount(0);
  });

  test.describe('hero plate', () => {
    for (const viewport of [{ width: 1280, height: 800 }, { width: 375, height: 812 }]) {
      test(`prints the name over the Bromo plate at ${viewport.width}`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto('/');
        const hero = page.locator('section.print-plate');
        await expect(hero.getByRole('heading', { level: 1, name: 'Rizky Haksono' })).toBeInViewport({ ratio: 1 });
        await expect(hero.locator('img')).toBeVisible();
      });
    }
  });

  // The unscrolled sentence prints in the ghost colour (3.17:1 on Paper), which passes only as large text (24px+).
  test('lede sentence keeps the 24px large-text floor on a phone', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    const sentence = page.locator('.ws p', { has: page.locator('.ws__w') });
    const size = await sentence.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    expect(size).toBeGreaterThanOrEqual(24);
  });

  test('hero fills a short phone without sideways scroll, with the links just below', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1, name: 'Rizky Haksono' })).toBeInViewport({ ratio: 1 });
    await expect(page.locator('.ws').getByRole('link', { name: /^Résumé \(PDF\)/ })).toBeAttached();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375);
  });
});
