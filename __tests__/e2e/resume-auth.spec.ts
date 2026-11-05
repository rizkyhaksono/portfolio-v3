import { test, expect } from "@playwright/test";

test.describe("Auth & public pages", () => {
  test("/resume redirects to Google Drive", async ({ page }) => {
    await page.goto("/resume");
    await expect(page).toHaveURL(/drive\.google\.com/);
  });

  test("password reset pages are hidden behind /auth", async ({ page }) => {
    for (const path of ["/auth/forgot-password", "/auth/reset-password?token=x"]) {
      await page.goto(path);
      await expect(page).toHaveURL(/\/auth$/);
    }
    await expect(page.getByRole("link", { name: /forgot password/i })).toHaveCount(0);
  });

  test("blog feed includes posts written here", async ({ page }) => {
    await page.goto("/blog");
    await expect(page.locator('main a[href^="/blog/onsite/"]').first()).toBeVisible();
  });

  test("Etan AI is hidden: /ai goes home and nothing links to it", async ({ page }) => {
    await page.goto("/ai?tab=hirefit");
    expect(new URL(page.url()).pathname).toBe('/');
    await expect(page.locator('a[href^="/ai"]')).toHaveCount(0);
  });
});
