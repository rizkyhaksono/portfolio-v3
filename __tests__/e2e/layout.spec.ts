import { test, expect } from '@playwright/test';

// Every visitor pattern once: ledger, article, plates, cabinet, correspondence, board, figures, auth, not found.
const ROUTES = [
  '/',
  '/blog',
  '/project',
  '/certificates',
  '/changelog',
  '/stats',
  '/tools',
  '/tools?tab=wpm',
  '/tools?tab=downloader',
  '/tools?tab=web3-crypto',
  '/ai',
  '/chat',
  '/tracker',
  '/roadmap',
  '/legal/privacy',
  '/auth',
  '/admin/auth/login',
  '/this-page-does-not-exist',
];

test.describe('phone layout', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  for (const route of ROUTES) {
    test(`${route} fits 375px and breaks no content policy`, async ({ page }) => {
      // Network failures of outside services are not the page's fault; a blocked resource or a crash is.
      const problems: string[] = [];
      page.on('console', (message) => {
        if (message.type() === 'error' && /Content Security Policy/i.test(message.text())) problems.push(message.text());
      });
      page.on('pageerror', (error) => problems.push(String(error)));

      await page.goto(route);
      await page.waitForLoadState('networkidle').catch(() => {});

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, 'pixels of horizontal scroll').toBeLessThanOrEqual(0);
      expect(problems).toEqual([]);
    });
  }
});
