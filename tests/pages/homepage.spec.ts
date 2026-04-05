/**
 * Homepage structural and behavioral tests.
 *
 * Rules (ADR-020):
 * - Assert on structure and behavior — never on CMS content
 * - No getByText() for copy that comes from Storyblok
 * - No screenshot assertions — Chromatic owns visual regression
 */

import { expect, test } from '@playwright/test';

// ─── Layer 1: Structural ──────────────────────────────────────────────────────

test.describe('homepage structure', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
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
    await expect(page.getByRole('navigation')).toBeVisible();
  });

  test('all images have non-empty alt attributes', async ({ page }) => {
    const images = page.locator('img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      // alt="" is valid for decorative images; null means the attribute is missing entirely
      expect(
        alt,
        `img at index ${i} is missing an alt attribute`
      ).not.toBeNull();
    }
  });

  test('navigation links have valid href attributes', async ({ page }) => {
    const navLinks = page.getByRole('navigation').getByRole('link');
    const count = await navLinks.count();

    expect(
      count,
      'navigation should contain at least one link'
    ).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const href = await navLinks.nth(i).getAttribute('href');
      expect(href, `nav link at index ${i} is missing an href`).toBeTruthy();
    }
  });

  test('no console errors on load', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto('/');
    expect(errors).toHaveLength(0);
  });
});

// ─── Layer 2: Behavioral ─────────────────────────────────────────────────────
//
// Add behavioral tests here as interactive sections are built.
// Examples:
//   - mobile nav opens/closes
//   - FAQ accordion expands/collapses
//   - newsletter form validates on empty submit
//
// Each test should target roles/labels, not copy text.
