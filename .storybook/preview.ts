import type { Preview } from '@storybook/react';
import '../src/styles/global.css';

// astro-island uses IntersectionObserver for client:visible hydration.
// The observer callback fires a dynamic import() with the bare @/ alias path,
// which the browser cannot resolve. Unlike client:load (which astro-island
// wraps in try/catch), client:visible leaves rejected imports as unhandled
// promise rejections. This causes Vitest to exit with code 1 even when all
// tests pass. Calling preventDefault() marks them as handled so Vitest
// (and Playwright) do not treat them as test failures.
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const msg =
      typeof event.reason?.message === 'string' ? event.reason.message : '';
    if (msg.includes("Failed to resolve module specifier '@/")) {
      event.preventDefault();
    }
  });
}

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'white',
      values: [
        { name: 'white', value: '#ffffff' },
        { name: 'off-white (site)', value: '#fffff8' },
        { name: 'dark', value: '#171717' },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      source: {
        /**
         * Transform the story source into a copyable component usage snippet.
         *
         * @storybook-astro/framework falls back to showing the story object
         * (args, play fn, etc.) as the code block — not the component call.
         * This transform generates JSX-style component usage from the story
         * args so the snippet is copy-pasteable.
         */
        transform: (
          _src: string,
          storyContext: {
            title: string;
            args?: Record<string, unknown>;
          }
        ) => {
          const name = storyContext.title.split('/').pop() ?? 'Component';
          const args = storyContext.args ?? {};

          const props = Object.entries(args)
            .filter(([, v]) => v !== undefined && v !== null && v !== false)
            .map(([k, v]) => {
              if (v === true) return k;
              if (typeof v === 'string') return `${k}="${v}"`;
              return `${k}={${JSON.stringify(v)}}`;
            })
            .join('\n  ');

          return props ? `<${name}\n  ${props}\n/>` : `<${name} />`;
        },
      },
    },
  },
};

export default preview;
