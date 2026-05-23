import { test, expect } from "@playwright/test";

test.describe("Auth & public pages", () => {
  test("/resume redirects to Google Drive", async ({ page }) => {
    await page.goto("/resume");
    await expect(page).toHaveURL(/drive\.google\.com/);
  });

  test("forgot password page loads", async ({ page }) => {
    await page.goto("/auth/forgot-password");
    await expect(page.getByRole("heading", { name: /forgot password/i })).toBeVisible();
    await expect(page.getByPlaceholder("you@example.com")).toBeVisible();
  });

  test("blog page has onsite tab", async ({ page }) => {
    await page.goto("/blog");
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("tab", { name: /written here/i })).toBeVisible();
  });

  test("ai page requires auth redirect or content", async ({ page }) => {
    await page.goto("/ai");
    await page.waitForLoadState("networkidle");
    const loginPrompt = page.getByText(/authentication required|log in/i);
    const chatInput = page.getByPlaceholder(/ask etan/i);
    await expect(loginPrompt.or(chatInput)).toBeVisible();
  });
});
