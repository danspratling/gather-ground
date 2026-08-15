/**
 * Lighthouse audit script — replaces @lhci/cli.
 *
 * Runs all pages sequentially using the lighthouse Node API + chrome-launcher.
 * Intended for CI (against astro preview with @astrojs/node) and local developer feedback.
 *
 * Usage:
 *   node scripts/lighthouse.mjs                    # local preview server on :4321
 *   BASE_URL=https://preview.vercel.app node …     # external URL (skips is-crawlable globally)
 *
 * Dynamic routes (/blog/[slug], /products/[slug]) are resolved by querying
 * the Sanity production dataset for a representative published document.
 */

import lighthouse, { desktopConfig } from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import { createClient } from '@sanity/client';

const BASE_URL = (process.env.BASE_URL || 'http://localhost:4321').replace(
  /\/$/,
  ''
);
const isRemote = Boolean(process.env.BASE_URL);

// ---------------------------------------------------------------------------
// Resolve dynamic slugs from Sanity
// ---------------------------------------------------------------------------
const sanity = createClient({
  projectId: process.env.SANITY_PROJECT_ID || 'mrz1ftls',
  dataset: process.env.SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_READ_TOKEN,
});

const [blogSlug, productSlug] = await Promise.all([
  sanity
    .fetch('*[_type == "post" && defined(slug.current)][0].slug.current')
    .catch(() => null),
  sanity
    .fetch('*[_type == "product" && defined(slug.current)][0].slug.current')
    .catch(() => null),
]);

if (blogSlug) console.log(`  resolved blog slug: ${blogSlug}`);
if (productSlug) console.log(`  resolved product slug: ${productSlug}`);

// ---------------------------------------------------------------------------
// Pages to audit
// ---------------------------------------------------------------------------
// skipAudits: per-page audits to skip IN ADDITION to the global set.
// Account pages intentionally use <meta name="robots" content="noindex">, so
// is-crawlable will always fail — skip it per-page rather than globally.
const PAGES = [
  // Core marketing pages
  { path: '/', name: 'home' },
  { path: '/blog', name: 'blog' },
  { path: '/products', name: 'products' },
  { path: '/privacy', name: 'privacy' },
  { path: '/terms', name: 'terms' },

  // Dynamic routes — skipped if Sanity returned no published document
  ...(blogSlug ? [{ path: `/blog/${blogSlug}`, name: 'blog-post' }] : []),
  ...(productSlug
    ? [{ path: `/products/${productSlug}`, name: 'product-detail' }]
    : []),

  // Account pages: noindex by design — skip is-crawlable so the SEO score
  // reflects real issues rather than the intentional robots tag.
  {
    path: '/account/login',
    name: 'account-login',
    skipAudits: ['is-crawlable'],
  },
  {
    path: '/account/register',
    name: 'account-register',
    skipAudits: ['is-crawlable'],
  },
  {
    path: '/account/forgot-password',
    name: 'account-forgot-password',
    skipAudits: ['is-crawlable'],
  },
];

// ---------------------------------------------------------------------------
// Thresholds
// ---------------------------------------------------------------------------
const THRESHOLDS = {
  performance: 0.9,
  accessibility: 0.9,
  'best-practices': 0.95,
  seo: 0.9,
};

// Audits skipped for every page when running against a remote/CDN URL
const GLOBAL_SKIP_AUDITS = isRemote ? ['is-crawlable'] : [];

const CHROME_FLAGS = [
  '--headless=new',
  '--no-sandbox',
  '--disable-dev-shm-usage',
];

// ---------------------------------------------------------------------------
// Audit runner
// ---------------------------------------------------------------------------
async function auditPage(
  { path, name, skipAudits: pageSkipAudits = [] },
  retries = 2
) {
  const url = `${BASE_URL}${path}`;
  const chrome = await chromeLauncher.launch({ chromeFlags: CHROME_FLAGS });

  try {
    const flags = {
      port: chrome.port,
      logLevel: 'error',
      output: 'json',
      onlyCategories: Object.keys(THRESHOLDS),
      skipAudits: [...GLOBAL_SKIP_AUDITS, ...pageSkipAudits],
    };

    const runnerResult = await lighthouse(url, flags, desktopConfig);
    return { name, url, lhr: runnerResult.lhr };
  } catch (err) {
    try {
      await chrome.kill();
    } catch {
      /* already killed */
    }
    if (retries > 0) {
      console.warn(`  retrying ${name} after error: ${err.message}`);
      return auditPage({ path, name, skipAudits: pageSkipAudits }, retries - 1);
    }
    throw err;
  } finally {
    try {
      await chrome.kill();
    } catch {
      /* already killed */
    }
  }
}

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------
console.log(`Auditing ${PAGES.length} pages sequentially against ${BASE_URL}…
`);

const results = [];
for (const page of PAGES) {
  try {
    results.push({ status: 'fulfilled', value: await auditPage(page) });
  } catch (err) {
    results.push({ status: 'rejected', reason: err });
  }
}
let passed = true;

for (const result of results) {
  if (result.status === 'rejected') {
    console.error(`FAIL  (error) — ${result.reason?.message ?? result.reason}`);
    passed = false;
    continue;
  }

  const { name, url, lhr } = result.value;
  const categories = lhr.categories;
  const lines = [];

  for (const [key, threshold] of Object.entries(THRESHOLDS)) {
    const cat = categories[key];
    if (!cat) continue;
    const score = cat.score ?? 0;
    const ok = score >= threshold;
    if (!ok) passed = false;
    lines.push(
      `  ${ok ? '✓' : '✗'} ${cat.title}: ${Math.round(score * 100)} (min ${Math.round(threshold * 100)})`
    );
  }

  const pagePass = lines.every((l) => l.includes('✓'));
  console.log(`${pagePass ? 'PASS' : 'FAIL'}  ${name} — ${url}`);
  console.log(lines.join('\n'));
  console.log('');
}

if (!passed) {
  console.error('One or more Lighthouse checks failed.');
  process.exit(1);
}

console.log('All Lighthouse checks passed.');
