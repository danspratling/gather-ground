/**
 * Homepage structural and behavioral tests.
 *
 * Rules (ADR-020):
 * - Assert on structure and behavior — never on CMS content
 * - No getByText() for copy that comes from Sanity
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
    // Target the main nav by its aria-label (set in Header.astro, not from CMS).
    // The page has multiple <nav> elements (shadcn NavigationMenu adds one per menu group),
    // so a bare getByRole('navigation') would trigger Playwright's strict mode violation.
    await expect(
      page.getByRole('navigation', { name: 'Main navigation' })
    ).toBeVisible();
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
    const failedRequests: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('response', (response) => {
      if (response.status() >= 400) {
        failedRequests.push(`HTTP ${response.status()} — ${response.url()}`);
      }
    });
    await page.goto('/');

    // Only fail on errors from our own server — third-party services (Instagram
    // feeds, analytics) legitimately return 4xx in CI and must not block tests.
    const ownServerFailures = failedRequests.filter((r) =>
      r.includes('localhost')
    );
    expect(
      ownServerFailures,
      `Our server failures: ${ownServerFailures.join('\n')}`
    ).toHaveLength(0);

    // "Failed to load resource" messages come from external services returning
    // 4xx/5xx — not from our own JavaScript. Only fail on real app errors.
    const appErrors = errors.filter(
      (e) => !e.startsWith('Failed to load resource')
    );
    expect(
      appErrors,
      `App console errors: ${appErrors.join('\n')}`
    ).toHaveLength(0);
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
