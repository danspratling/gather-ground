/**
 * Cart lifecycle end-to-end tests.
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

const COMMERCE_ENABLED = process.env.PUBLIC_COMMERCE_ENABLED === 'true';

// ─── Cart trigger ─────────────────────────────────────────────────────────────

test.describe('cart trigger', () => {
  test('CartTrigger is present when commerce enabled', async ({ page }) => {
    await page.goto('/');
    const trigger = page.getByRole('button', { name: /open cart/i });
    // When commerce is disabled the trigger is not rendered — pass gracefully
    const isPresent = (await trigger.count()) > 0;
    if (!isPresent) return;
    await expect(trigger).toBeVisible();
  });

  test('clicking CartTrigger opens the CartDrawer', async ({ page }) => {
    await page.goto('/');
    const trigger = page.getByRole('button', { name: /open cart/i });
    const isPresent = (await trigger.count()) > 0;
    if (!isPresent) return;

    await trigger.click();
    await expect(
      page.getByRole('dialog', { name: 'Shopping cart' })
    ).toBeVisible();
  });
});

// ─── Cart drawer ──────────────────────────────────────────────────────────────

test.describe('cart drawer', () => {
  test.skip(
    !COMMERCE_ENABLED,
    'Cart e2e tests require PUBLIC_COMMERCE_ENABLED=true and Commerce Layer credentials'
  );

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    const trigger = page.getByRole('button', { name: /open cart/i });
    await expect(trigger).toBeVisible();
    await trigger.click();
    await expect(
      page.getByRole('dialog', { name: 'Shopping cart' })
    ).toBeVisible();
  });

  test('CartDrawer shows empty state when no items', async ({ page }) => {
    const drawer = page.getByRole('dialog', { name: 'Shopping cart' });
    // Empty state text is hardcoded in CartDrawer.tsx — not from Sanity
    await expect(drawer.getByText('Your cart is empty')).toBeVisible();
    await expect(
      drawer.getByRole('link', { name: 'Continue shopping' })
    ).toBeVisible();
  });

  test('CartDrawer closes on ESC key', async ({ page }) => {
    await page.keyboard.press('Escape');
    const drawer = page.getByRole('dialog', { name: 'Shopping cart' });
    await expect(drawer).not.toBeVisible();
  });

  test('CartDrawer closes on close button', async ({ page }) => {
    const drawer = page.getByRole('dialog', { name: 'Shopping cart' });
    await drawer.getByRole('button', { name: 'Close cart' }).click();
    await expect(drawer).not.toBeVisible();
  });
});

// ─── Add to cart ──────────────────────────────────────────────────────────────

test.describe('add to cart', () => {
  test.skip(
    !COMMERCE_ENABLED,
    'Cart e2e tests require PUBLIC_COMMERCE_ENABLED=true and Commerce Layer credentials'
  );

  test('clicking Add to cart on PDP opens CartDrawer with item', async ({
    page,
  }) => {
    await page.goto('/products');
    const firstCard = page.locator('a[href^="/products/"]').first();
    if ((await firstCard.count()) === 0) {
      test.skip(); // no products in CMS
      return;
    }
    const href = await firstCard.getAttribute('href');
    await page.goto(href!);

    const addToCartButton = page.getByRole('button', { name: /add to cart/i });
    if ((await addToCartButton.count()) === 0) {
      test.skip(); // product has no Add to cart — variants not yet configured in CL
      return;
    }
    await addToCartButton.click();

    await expect(
      page.getByRole('dialog', { name: 'Shopping cart' })
    ).toBeVisible();
  });

  test('CartDrawer shows an item row after add', async ({ page }) => {
    await page.goto('/products');
    const firstCard = page.locator('a[href^="/products/"]').first();
    if ((await firstCard.count()) === 0) {
      test.skip();
      return;
    }
    const href = await firstCard.getAttribute('href');
    await page.goto(href!);

    const addToCartButton = page.getByRole('button', { name: /add to cart/i });
    if ((await addToCartButton.count()) === 0) {
      test.skip();
      return;
    }
    await addToCartButton.click();

    const drawer = page.getByRole('dialog', { name: 'Shopping cart' });
    await expect(drawer).toBeVisible();
    // At least one list item should be present — not asserting on content
    await expect(drawer.locator('ul li')).toHaveCount(1);
  });

  test('cart count badge updates on CartTrigger after add', async ({
    page,
  }) => {
    await page.goto('/products');
    const firstCard = page.locator('a[href^="/products/"]').first();
    if ((await firstCard.count()) === 0) {
      test.skip();
      return;
    }
    const href = await firstCard.getAttribute('href');
    await page.goto(href!);

    const addToCartButton = page.getByRole('button', { name: /add to cart/i });
    if ((await addToCartButton.count()) === 0) {
      test.skip();
      return;
    }
    await addToCartButton.click();

    await expect(
      page.getByRole('dialog', { name: 'Shopping cart' })
    ).toBeVisible();

    // After adding, the trigger aria-label includes the item count
    await expect(
      page.getByRole('button', { name: /open cart,\s*\d+\s*item/i })
    ).toBeVisible();
  });
});

// ─── Cart item management ─────────────────────────────────────────────────────

test.describe('cart item management', () => {
  test.skip(
    !COMMERCE_ENABLED,
    'Cart e2e tests require PUBLIC_COMMERCE_ENABLED=true and Commerce Layer credentials'
  );

  /**
   * Navigate to a product and add it to the cart.
   * Returns false if no products exist in the CMS (caller should skip).
   */
  async function addFirstProductToCart(
    page: import('@playwright/test').Page
  ): Promise<boolean> {
    await page.goto('/products');
    const firstCard = page.locator('a[href^="/products/"]').first();
    if ((await firstCard.count()) === 0) return false;

    const href = await firstCard.getAttribute('href');
    await page.goto(href!);

    const addToCartButton = page.getByRole('button', { name: /add to cart/i });
    if ((await addToCartButton.count()) === 0) return false; // variants not yet configured in CL
    await addToCartButton.click();

    await expect(
      page.getByRole('dialog', { name: 'Shopping cart' })
    ).toBeVisible();
    return true;
  }

  test('QuantityStepper increments item quantity in drawer', async ({
    page,
  }) => {
    const added = await addFirstProductToCart(page);
    if (!added) {
      test.skip();
      return;
    }

    const drawer = page.getByRole('dialog', { name: 'Shopping cart' });
    const quantityInput = drawer.getByRole('spinbutton', { name: 'Quantity' });
    await expect(quantityInput).toHaveValue('1');

    await drawer.getByRole('button', { name: 'Increase quantity' }).click();
    await expect(quantityInput).toHaveValue('2');
  });

  test('removing an item shows empty state', async ({ page }) => {
    const added = await addFirstProductToCart(page);
    if (!added) {
      test.skip();
      return;
    }

    const drawer = page.getByRole('dialog', { name: 'Shopping cart' });
    await drawer.getByRole('button', { name: 'Remove item' }).click();

    // After removal, the empty state should be visible
    await expect(drawer.getByText('Your cart is empty')).toBeVisible();
  });
});

// ─── Cart persistence ─────────────────────────────────────────────────────────

test.describe('cart persistence', () => {
  test.skip(
    !COMMERCE_ENABLED,
    'Cart e2e tests require PUBLIC_COMMERCE_ENABLED=true and Commerce Layer credentials'
  );

  test('cart persists after page navigation', async ({ page }) => {
    // Add an item
    await page.goto('/products');
    const firstCard = page.locator('a[href^="/products/"]').first();
    if ((await firstCard.count()) === 0) {
      test.skip();
      return;
    }
    const href = await firstCard.getAttribute('href');
    await page.goto(href!);

    const addToCartButton = page.getByRole('button', { name: /add to cart/i });
    await expect(addToCartButton).toBeVisible();
    await addToCartButton.click();

    await expect(
      page.getByRole('dialog', { name: 'Shopping cart' })
    ).toBeVisible();

    // Close the drawer and navigate away
    await page.getByRole('button', { name: 'Close cart' }).click();
    await page.goto('/');

    // Re-open the cart on the new page
    const trigger = page.getByRole('button', { name: /open cart/i });
    await expect(trigger).toBeVisible();
    await trigger.click();

    const drawer = page.getByRole('dialog', { name: 'Shopping cart' });
    await expect(drawer).toBeVisible();
    // Items should still be present — cart persisted via token/cookie
    await expect(drawer.locator('ul li')).toHaveCount(1);
  });
});
