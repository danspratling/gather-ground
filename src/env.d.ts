/// <reference types="astro/client" />
/// <reference types="@sanity/astro/module" />

// Ambient declarations for optional peer dependencies used by
// @storybook-astro/framework that we don't install (Preact, Solid, Svelte, Vue).
// These stubs satisfy TypeScript without pulling in unused packages.
declare module '@preact/preset-vite' {
  export interface PreactPluginOptions {
    include?: string | RegExp | Array<string | RegExp>;
    exclude?: string | RegExp | Array<string | RegExp>;
    [key: string]: unknown;
  }
}

declare module 'vite-plugin-solid' {
  export interface Options {
    include?: string | RegExp | Array<string | RegExp>;
    exclude?: string | RegExp | Array<string | RegExp>;
    [key: string]: unknown;
  }
  export default function solid(options?: Options): unknown;
}

declare module '@sveltejs/vite-plugin-svelte' {
  export interface PluginOptions {
    [key: string]: unknown;
  }
  export interface SvelteConfig {
    [key: string]: unknown;
  }
  export interface Options extends PluginOptions {}
  export function svelte(options?: PluginOptions): unknown;
}

declare module '@vitejs/plugin-vue' {
  export interface Options {
    include?: string | RegExp | Array<string | RegExp>;
    exclude?: string | RegExp | Array<string | RegExp>;
    [key: string]: unknown;
  }
  export default function vue(options?: Options): unknown;
}

declare module '@vitejs/plugin-vue-jsx' {
  export interface Options {
    include?: string | RegExp | Array<string | RegExp>;
    exclude?: string | RegExp | Array<string | RegExp>;
    [key: string]: unknown;
  }
  export default function vueJsx(options?: Options): unknown;
}

interface ImportMetaEnv {
  readonly PUBLIC_COMMERCE_ENABLED: 'true' | 'false';
  readonly SANITY_PROJECT_ID: string;
  readonly SANITY_DATASET: string;
  readonly SANITY_API_READ_TOKEN: string;
  readonly PUBLIC_SANITY_VISUAL_EDITING_ENABLED: string;
}
