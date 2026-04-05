/// <reference types="astro/client" />

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
  readonly STORYBLOK_TOKEN: string;
  readonly STORYBLOK_SPACE_ID: string;
  readonly PUBLIC_STORYBLOK_TOKEN: string;
}
