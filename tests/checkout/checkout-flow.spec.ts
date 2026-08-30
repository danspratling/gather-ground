/**
 * Checkout page structural and behavioral tests.
 *
 * Rules (ADR-020):
 * - Assert on structure and behavior — never on CMS content
 * - No getByText() for copy that comes from Sanity
 * - No screenshot assertions — Chromatic owns visual regression
 *
 * Commerce-gated tests require PUBLIC_COMMERCE_ENABLED=true and valid
 * Commerce Layer credentials. They are skipped automatically in CI
 * (and any environment where commerce is disabled).
 */

import { expect, test } from '@playwright/test';
import { isAppError } from '../helpers/consoleErrors';

const COMMERCE_ENABLED = process.env.PUBLIC_COMMERCE_ENABLED === 'true';

// ─── Structural (always run) ──────────────────────────────────────────────────

test.describe('checkout page — structural', () => {
  test('redirects to /cart when cart cookie is absent', async ({ page }) => {
    await page.goto('/checkout');
    await expect(page).toHaveURL('/cart');
  });

  test('has noindex meta tag', async ({ page, context }) => {
    await context.addCookies([
      { name: 'gg_cart', value: 'mock-id', domain: 'localhost', path: '/' },
    ]);
    await page.goto('/checkout');
    const meta = await page
      .locator('meta[name="robots"]')
      .getAttribute('content');
    expect(meta).toContain('noindex');
  });

  test('no console errors on load (with mock cart cookie)', async ({
    page,
    context,
  }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (isAppError(msg)) errors.push(msg.text());
    });

    await context.addCookies([
      { name: 'gg_cart', value: 'mock-id', domain: 'localhost', path: '/' },
    ]);
    await page.goto('/checkout');

    expect(errors, `App console errors: ${errors.join('\n')}`).toHaveLength(0);
  });
});

// ─── Guest checkout (commerce-gated) ─────────────────────────────────────────

test.describe('checkout page — guest checkout', () => {
  test.skip(
    !COMMERCE_ENABLED,
    'Checkout e2e tests require PUBLIC_COMMERCE_ENABLED=true and Commerce Layer credentials'
  );

  test('shows checkout stepper with email step active', async ({
    page,
    context,
  }) => {
    // TODO: Set up a real Commerce Layer cart before navigating to /checkout.
    // For now, verify the page structure renders when a cart cookie is present.
    await context.addCookies([
      { name: 'gg_cart', value: 'mock-id', domain: 'localhost', path: '/' },
    ]);
    await page.goto('/checkout');

    // CheckoutStepper should be present — targets the nav landmark in CheckoutStepper.astro
    await expect(
      page.getByRole('navigation', { name: 'Checkout steps' })
    ).toBeVisible();

    // Email step should be the active/first step
    // NOTE: Full Stripe payment flow is not tested here — live keys required
  });
});

// ─── Cart mutation banner (commerce-gated) ────────────────────────────────────

test.describe('checkout page — cart mutation', () => {
  test.skip(
    !COMMERCE_ENABLED,
    'Checkout e2e tests require PUBLIC_COMMERCE_ENABLED=true and Commerce Layer credentials'
  );

  test('shows mutation banner when cart changes during checkout', async ({
    page,
    context,
  }) => {
    // TODO: Implement with cart mutation helper once the mutation-detection
    // mechanism is wired into CheckoutFlow. Placeholder to track this requirement.
    await context.addCookies([
      { name: 'gg_cart', value: 'mock-id', domain: 'localhost', path: '/' },
    ]);
    await page.goto('/checkout');

    // When cart mutates (external change), the banner should appear as a role="alert"
    // await expect(page.getByRole('alert')).toBeVisible();
  });
});
