import type { Preview } from '@storybook/react';
import '../src/styles/global.css';

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
