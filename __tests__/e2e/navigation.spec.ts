import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should load the homepage successfully', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveTitle(/portfolio/i);
  });

  test('should display the navbar', async ({ page }) => {
    await page.goto('/');
    const navbar = page.locator('[class*="pointer-events-auto"]').first();
    await expect(navbar).toBeVisible();
  });

  test('should navigate to different sections on the home page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('localhost:3001');
  });

  test('should be responsive on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveTitle(/portfolio/i);
  });

  test('should be responsive on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveTitle(/portfolio/i);
  });
});
