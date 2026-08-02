/**
 * Account page structural and behavioral tests.
 *
 * Rules (ADR-020):
 * - Assert on structure and behavior — never on CMS content
 * - No getByText() for copy that comes from Sanity
 * - No screenshot assertions — Chromatic owns visual regression
 */

import { expect, test } from '@playwright/test';

test.describe('account page — unauthenticated', () => {
  test('is not accessible when not signed in', async ({ page }) => {
    const response = await page.goto('/account');
    // Commerce enabled + no session → middleware redirects to /account/login
    // Commerce disabled → middleware rewrites to 404 (URL stays at /account)
    const redirectedToLogin = page.url().includes('/account/login');
    const commerceOff = response?.status() === 404;
    expect(redirectedToLogin || commerceOff).toBe(true);
  });
});

test.describe('addresses page — unauthenticated', () => {
  test('is not accessible when not signed in', async ({ page }) => {
    const response = await page.goto('/account/addresses');
    const redirectedToLogin = page.url().includes('/account/login');
    const commerceOff = response?.status() === 404;
    expect(redirectedToLogin || commerceOff).toBe(true);
  });
});
