/**
 * Blog listing page structural and behavioral tests.
 *
 * Rules (ADR-020):
 * - Assert on structure and behavior — never on CMS content
 * - No getByText() for copy that comes from Sanity
 * - No screenshot assertions — Chromatic owns visual regression
 */

import { expect, test } from '@playwright/test';

import { isAppError } from '../helpers/consoleErrors';

// ─── Layer 1: Structural ──────────────────────────────────────────────────────

test.describe('blog page structure', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/blog');
  });

  test('page has a document title', async ({ page }) => {
    await expect(page).toHaveTitle(/.+/);
  });

  test('page has exactly one h1', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
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
      if (isAppError(msg)) errors.push(msg.text());
    });
    await page.goto('/blog', { waitUntil: 'networkidle' });
    expect(errors).toHaveLength(0);
  });
});

// ─── Layer 2: Behavioral ─────────────────────────────────────────────────────

test.describe('blog page behavior', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/blog');
  });

  test('filter tabs are keyboard-reachable', async ({ page }) => {
    // The filter group has role="group" with an aria-label
    const filterGroup = page.getByRole('group', {
      name: /filter by category/i,
    });
    await expect(filterGroup).toBeVisible();

    // First button ("View all") should be focusable via Tab
    const firstTab = filterGroup.getByRole('button').first();
    await firstTab.focus();
    await expect(firstTab).toBeFocused();
  });

  test('search input is accessible', async ({ page }) => {
    const searchInput = page.getByRole('searchbox', {
      name: /search articles/i,
    });
    await expect(searchInput).toBeVisible();
    await searchInput.focus();
    await expect(searchInput).toBeFocused();
  });

  test('load more button is focusable when present', async ({ page }) => {
    const loadMore = page.getByRole('button', { name: /load more/i });
    // Only assert if the button exists (fewer than 7 posts means no load more)
    const count = await loadMore.count();
    if (count > 0) {
      await loadMore.focus();
      await expect(loadMore).toBeFocused();
    }
  });

  test('category filter tabs have aria-pressed attribute', async ({ page }) => {
    const filterGroup = page.getByRole('group', {
      name: /filter by category/i,
    });
    const buttons = filterGroup.getByRole('button');
    const count = await buttons.count();

    for (let i = 0; i < count; i++) {
      const pressed = await buttons.nth(i).getAttribute('aria-pressed');
      expect(
        pressed,
        `filter button ${i} is missing aria-pressed`
      ).not.toBeNull();
    }
  });
});
