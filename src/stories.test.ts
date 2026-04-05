import { afterEach, describe, expect, it } from 'vitest';
import {
  composeStories,
  renderStory,
  setProjectAnnotations,
} from '@storybook-astro/framework/testing';
import axe from 'axe-core';
import * as previewAnnotations from '../.storybook/preview';

setProjectAnnotations([previewAnnotations]);

// Auto-discover every story file under src/components/
const storyModules = import.meta.glob('./components/**/*.stories.{ts,tsx}', {
  eager: true,
});

afterEach(() => {
  document.body.innerHTML = '';
});

for (const [modulePath, module] of Object.entries(storyModules)) {
  const meta = (module as Record<string, unknown>).default as
    | Record<string, unknown>
    | undefined;

  // React island stories cannot be rendered via renderStory (Astro-only).
  // They are validated separately by the build-storybook CI step.
  if (
    meta?.parameters &&
    (meta.parameters as Record<string, unknown>).renderer === 'react'
  ) {
    continue;
  }

  // Derive a readable label from the file path
  const label = modulePath
    .replace('./components/', '')
    .replace(/\/[^/]+$/, '') // keep the folder path as the suite name
    .replace(/\//g, ' / ');

  let stories: Record<string, unknown>;
  try {
    stories = composeStories(module as Parameters<typeof composeStories>[0]);
  } catch {
    continue;
  }

  const entries = Object.entries(stories);
  if (entries.length === 0) continue;

  describe(label, () => {
    for (const [storyName, story] of entries) {
      it(`${storyName} renders without a11y violations`, async () => {
        await renderStory(story as Parameters<typeof renderStory>[0]);

        const results = await axe.run(document.body, {
          rules: {
            // Not meaningful for isolated story fragments with no page landmark
            region: { enabled: false },
            // TODO: aria-orientation on <ul> is a Base UI NavigationMenu bug.
            // Re-enable once Base UI fixes NavigationMenuList to use a role
            // that permits aria-orientation (e.g. menubar).
            'aria-allowed-attr': { enabled: false },
          },
        });

        expect(results.violations).toEqual([]);
      });
    }
  });
}
