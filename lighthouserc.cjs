/**
 * Lighthouse CI config.
 *
 * In CI we audit the deployed Vercel preview URL (real production build,
 * CDN, real network) by setting `LHCI_BASE_URL` in the workflow. Locally
 * `npm run lhci` falls back to the local dev server, which gives directional
 * feedback while developing but should not be relied on for absolute scores.
 */
const baseUrl = (process.env.LHCI_BASE_URL || 'http://localhost:4321').replace(
  /\/$/,
  ''
);
const isRemote = Boolean(process.env.LHCI_BASE_URL);

module.exports = {
  ci: {
    collect: {
      // Only start the dev server when auditing locally. When LHCI_BASE_URL
      // is set (CI), we point at an already-deployed URL and skip the server.
      ...(isRemote
        ? {}
        : {
            startServerCommand: 'npm run dev -- --port 4321 --host localhost',
            startServerReadyPattern: 'localhost',
          }),
      url: [`${baseUrl}/`, `${baseUrl}/blog`],
      numberOfRuns: 3,
      settings: {
        chromeFlags: '--headless=new --no-sandbox',
        preset: 'desktop',
        // Vercel adds `x-robots-tag: noindex` to every preview deployment
        // so they don't appear in search results. That's the correct
        // behaviour for previews but it drops the `is-crawlable` audit to
        // 0, which pulls the SEO category score down to 0.69. Production
        // (gatherground.co.uk) does not send this header, so skip just
        // this individual audit when auditing the preview rather than
        // weakening the overall SEO threshold.
        ...(isRemote ? { skipAudits: ['is-crawlable'] } : {}),
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.95 }],
        'categories:seo': ['error', { minScore: 1 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
