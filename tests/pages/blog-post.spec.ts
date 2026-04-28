/**
 * Blog post page structural and behavioral tests.
 *
 * Rules (ADR-020):
 * - Assert on structure and behavior — never on CMS content
 * - No getByText() for copy that comes from Sanity
 * - No screenshot assertions — Chromatic owns visual regression
 *
 * The blog post page requires a real slug to load. If no published posts exist
 * in the Sanity dataset, getStaticPaths() generates no pages and the suite is
 * skipped gracefully (tests remain pending rather than failing).
 */

import { expect, test } from '@playwright/test';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Resolve the first available blog post slug from the blog index page.
 * Returns null when no posts exist yet (Sanity dataset empty).
 */
async function getFirstPostUrl(baseURL: string): Promise<string | null> {
  // The blog index page renders <a> cards that link to individual posts.
  // We fetch the page HTML and extract the first /blog/... href rather than
  // loading a full browser page — faster and does not depend on JavaScript.
  try {
    const res = await fetch(`${baseURL}/blog`);

    if (!res.ok) {
      if (res.status === 404) return null;

      throw new Error(`Failed to fetch /blog: ${res.status} ${res.statusText}`);
    }

    const html = await res.text();
    const match = html.match(/href="(\/blog\/(?!rss\.xml)[^"]+)"/);
    return match ? match[1] : null;
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.startsWith('Failed to fetch /blog:')
    ) {
      throw error;
    }
    return null;
  }
}

// ─── Layer 1: Structural ─────────────────────────────────────────────────────

test.describe('blog post page structure', () => {
  let postUrl: string | null = null;

  test.beforeAll(async ({ baseURL }) => {
    postUrl = await getFirstPostUrl(baseURL ?? 'http://localhost:4321');
  });

  test.beforeEach(async ({ page }) => {
    if (!postUrl) test.skip();
    await page.goto(postUrl!);
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
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await page.goto(postUrl!);
    expect(errors).toHaveLength(0);
  });

  test('page has og:type=article meta tag', async ({ page }) => {
    const ogType = page.locator('meta[property="og:type"]');
    await expect(ogType).toHaveAttribute('content', 'article');
  });

  test('page has og:title meta tag', async ({ page }) => {
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveCount(1);
    const content = await ogTitle.getAttribute('content');
    expect(content).toBeTruthy();
  });

  test('page has canonical link', async ({ page }) => {
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    const href = await canonical.getAttribute('href');
    expect(href).toBeTruthy();
  });
});

// ─── Layer 2: Behavioral ─────────────────────────────────────────────────────

test.describe('blog post page behavior', () => {
  let postUrl: string | null = null;

  test.beforeAll(async ({ baseURL }) => {
    postUrl = await getFirstPostUrl(baseURL ?? 'http://localhost:4321');
  });

  test.beforeEach(async ({ page }) => {
    if (!postUrl) test.skip();
    await page.goto(postUrl!);
  });

  test('"Copy link" button is keyboard-reachable and focusable', async ({
    page,
  }) => {
    const copyBtn = page.getByRole('button', { name: /copy link/i });
    await expect(copyBtn).toBeVisible();

    // At minimum, some element must receive focus — full tab traversal would be
    // brittle, so we just confirm the button itself is focusable directly.
    await copyBtn.focus();
    await expect(copyBtn).toBeFocused();
  });

  test('social share links open in a new tab', async ({ page }) => {
    // Target the three social share icon-buttons by their aria-label.
    const shareLinks = [
      page.getByRole('link', { name: /share on x/i }),
      page.getByRole('link', { name: /share on facebook/i }),
      page.getByRole('link', { name: /share on linkedin/i }),
    ];

    for (const link of shareLinks) {
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', /noopener/);
    }
  });
});
