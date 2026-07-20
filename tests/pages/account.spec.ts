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
  test('redirects to login when not signed in', async ({ page }) => {
    await page.goto('/account');
    expect(page.url()).toContain('/account/login');
  });
});
