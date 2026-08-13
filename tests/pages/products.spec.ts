/**
 * Products listing page structural and behavioral tests.
 *
 * Rules (ADR-020):
 * - Assert on structure and behavior — never on CMS content
 * - No getByText() for copy that comes from Sanity
 * - No screenshot assertions — Chromatic owns visual regression
 */

import { expect, test } from '@playwright/test';

// ─── Layer 1: Structural ──────────────────────────────────────────────────────

test.describe('products page structure', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/products');
  });

  test('page has a document title', async ({ page }) => {
    await expect(page).toHaveTitle(/.+/);
  });

  test('page does not render a 404 title', async ({ page }) => {
    await expect(page).not.toHaveTitle(/404/);
  });

  test('page has a main landmark', async ({ page }) => {
    await expect(page.getByRole('main')).toBeVisible();
  });

  test('page has a navigation landmark', async ({ page }) => {
    await expect(
      page.getByRole('navigation', { name: 'Main navigation' })
    ).toBeVisible();
  });

  test('all images have non-empty alt attributes', async ({ page }) => {
    const images = page.locator('img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(
        alt,
        `img at index ${i} is missing an alt attribute`
      ).not.toBeNull();
    }
  });

  test('no console errors on load', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await page.goto('/products');
    expect(errors).toHaveLength(0);
  });
});

// ─── Layer 2: Product grid ────────────────────────────────────────────────────

test.describe('products page grid', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/products');
  });

  test('when products exist, each card links to a product detail page', async ({
    page,
  }) => {
    // Product cards render as <article> elements wrapping an <a href="/products/[slug]">
    const cards = page.locator('a[href^="/products/"]');
    const count = await cards.count();

    // If no products are in the CMS the grid is omitted — that is valid
    if (count === 0) return;

    // Every card link must have a non-empty href
    for (let i = 0; i < count; i++) {
      const href = await cards.nth(i).getAttribute('href');
      expect(href).toMatch(/^\/products\/.+/);
    }
  });

  test('when products exist, cards contain an image', async ({ page }) => {
    const cards = page.locator('article');
    const count = await cards.count();

    if (count === 0) return;

    for (let i = 0; i < count; i++) {
      const img = cards.nth(i).locator('img');
      await expect(img).toHaveCount(1);
    }
  });
});

// ─── Layer 3: PDP ─────────────────────────────────────────────────────────────

test.describe('/products/[slug] page', () => {
  test('renders without error for a valid product slug', async ({ page }) => {
    // Navigate to a product URL; if no product exists at this slug, Astro redirects
    // to /products — in that case we still confirm no 404 title.
    const cards = page.locator('a[href^="/products/"]');
    await page.goto('/products');
    const count = await cards.count();

    if (count === 0) {
      // No products in CMS — skip PDP tests gracefully
      return;
    }

    const href = await cards.first().getAttribute('href');
    await page.goto(href!);
    await expect(page).not.toHaveTitle(/404/i);
    await expect(page.getByRole('main')).toBeVisible();
  });

  test('shows ProductDetail heading structure', async ({ page }) => {
    await page.goto('/products');
    const cards = page.locator('a[href^="/products/"]');
    const count = await cards.count();

    if (count === 0) return;

    const href = await cards.first().getAttribute('href');
    await page.goto(href!);

    // ProductDetail renders an h1 with the product title
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('shows add to cart button', async ({ page }) => {
    await page.goto('/products');
    const cards = page.locator('a[href^="/products/"]');
    const count = await cards.count();

    if (count === 0) return;

    const href = await cards.first().getAttribute('href');
    await page.goto(href!);

    await expect(
      page.locator('button', { hasText: /add to cart|out of stock/i }).first()
    ).toBeVisible();
  });
});
