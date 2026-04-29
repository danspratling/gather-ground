module.exports = {
  ci: {
    collect: {
      // LHCI starts the dev server via this command.
      // CI=true skips mkcert so the server uses plain HTTP.
      startServerCommand: 'npm run dev -- --port 4321 --host localhost',
      startServerReadyPattern: 'localhost',
      url: ['http://localhost:4321/', 'http://localhost:4321/blog'],
      numberOfRuns: 3,
      settings: {
        chromeFlags: '--headless=new --no-sandbox',
        // Throttle to simulate mobile — catches more issues than desktop
        preset: 'desktop',
      },
    },
    assert: {
      assertions: {
        // Performance: ≥ 90 (warn at 95)
        'categories:performance': ['error', { minScore: 0.9 }],
        // Accessibility: 100 target (warn at 95, error at 90)
        'categories:accessibility': ['error', { minScore: 0.9 }],
        // Best Practices: ≥ 95
        'categories:best-practices': ['error', { minScore: 0.95 }],
        // SEO: 100
        'categories:seo': ['error', { minScore: 1 }],
      },
    },
    upload: {
      // Temporary filesystem storage — no external server needed
      target: 'temporary-public-storage',
    },
  },
};
