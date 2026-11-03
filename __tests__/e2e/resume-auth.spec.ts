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

  test("ai page opens on the document reader with the chat tab hidden", async ({ page }) => {
    await page.goto("/ai");
    await expect(page.getByRole("tab", { name: "Document reader" })).toHaveAttribute("aria-selected", "true");
    await expect(page.getByRole("tab", { name: "Chat", exact: true })).toHaveCount(0);
  });
});
