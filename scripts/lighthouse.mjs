/**
 * Lighthouse audit script — replaces @lhci/cli.
 *
 * Runs all pages in parallel using the lighthouse Node API + chrome-launcher.
 * Intended for CI (against astro dev) and local developer feedback.
 *
 * Usage:
 *   node scripts/lighthouse.mjs                    # local dev server on :4321
 *   BASE_URL=https://preview.vercel.app node …     # external URL (skips is-crawlable)
 */

import lighthouse, { desktopConfig } from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

const BASE_URL = (process.env.BASE_URL || 'http://localhost:4321').replace(
  /\/$/,
  ''
);
const isRemote = Boolean(process.env.BASE_URL);

const PAGES = [
  { path: '/', name: 'home' },
  { path: '/blog', name: 'blog' },
  { path: '/products', name: 'products' },
  { path: '/account/login', name: 'account-login' },
];

const THRESHOLDS = {
  performance: 0.9,
  accessibility: 0.9,
  'best-practices': 0.95,
  seo: 1,
};

const CHROME_FLAGS = [
  '--headless=new',
  '--no-sandbox',
  '--disable-dev-shm-usage',
];

async function auditPage({ path, name }) {
  const url = `${BASE_URL}${path}`;
  const chrome = await chromeLauncher.launch({ chromeFlags: CHROME_FLAGS });

  try {
    const flags = {
      port: chrome.port,
      logLevel: 'error',
      output: 'json',
      onlyCategories: Object.keys(THRESHOLDS),
      skipAudits: isRemote ? ['is-crawlable'] : [],
    };

    const runnerResult = await lighthouse(url, flags, desktopConfig);
    return { name, url, lhr: runnerResult.lhr };
  } finally {
    await chrome.kill();
  }
}

console.log(
  `Auditing ${PAGES.length} pages in parallel against ${BASE_URL}…\n`
);

const results = await Promise.allSettled(PAGES.map(auditPage));
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
