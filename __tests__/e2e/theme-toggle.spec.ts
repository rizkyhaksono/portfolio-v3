import { test, expect } from '@playwright/test';

test.describe('Theme', () => {
  test.use({ colorScheme: 'light', viewport: { width: 1280, height: 800 } });

  test('head toggle flips paper and night print and remembers it', async ({ page }) => {
    await page.goto('/');
    const html = page.locator('html');
    const toggle = page.getByRole('banner').getByRole('button', { name: 'Night theme' });

    await expect(html).not.toHaveClass(/\bdark\b/);
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');

    await toggle.click();
    await expect(html).toHaveClass(/\bdark\b/);
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');

    await page.reload();
    await expect(html).toHaveClass(/\bdark\b/);
    expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe('dark');

    await page.getByRole('banner').getByRole('button', { name: 'Night theme' }).click();
    await expect(html).not.toHaveClass(/\bdark\b/);
  });

  test('menu offers Paper, Night and System', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await page.getByRole('button', { name: 'Menu' }).click();
    const sheet = page.getByRole('dialog', { name: 'Menu' });
    const html = page.locator('html');

    await expect(sheet.getByRole('radio', { name: 'Paper' })).toBeChecked();
    await sheet.getByRole('radio', { name: 'Night' }).click();
    await expect(html).toHaveClass(/\bdark\b/);
    await sheet.getByRole('radio', { name: 'Paper' }).click();
    await expect(html).not.toHaveClass(/\bdark\b/);
  });

  test.describe('on a system that prefers dark', () => {
    test.use({ colorScheme: 'dark' });

    test('a first visit still opens in paper, and System stays one tap away', async ({ page }) => {
      await page.goto('/');
      const html = page.locator('html');
      await expect(html).not.toHaveClass(/\bdark\b/);
      await expect(page.getByRole('banner').getByRole('button', { name: 'Night theme' })).toHaveAttribute('aria-pressed', 'false');
      expect(await page.evaluate(() => localStorage.getItem('theme'))).toBeNull();

      await page.setViewportSize({ width: 375, height: 812 });
      await page.getByRole('button', { name: 'Menu' }).click();
      await page.getByRole('dialog', { name: 'Menu' }).getByRole('radio', { name: 'System' }).click();
      await expect(html).toHaveClass(/\bdark\b/);
    });
  });
});
