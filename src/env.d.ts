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
  readonly COMMERCE_PROVIDER?: 'commercelayer' | 'shopify';
  readonly SANITY_PROJECT_ID: string;
  readonly SANITY_DATASET: string;
  readonly SANITY_API_READ_TOKEN: string;
  readonly SANITY_API_WRITE_TOKEN: string;
  readonly SANITY_WEBHOOK_SECRET: string;
  readonly PUBLIC_SANITY_VISUAL_EDITING_ENABLED: string;
  readonly COMMERCELAYER_ORGANIZATION: string;
  readonly COMMERCELAYER_INTEGRATION_CLIENT_ID: string;
  readonly COMMERCELAYER_INTEGRATION_CLIENT_SECRET: string;
  readonly COMMERCELAYER_SALES_CHANNEL_CLIENT_ID: string;
  readonly COMMERCELAYER_WEBHOOK_SECRET: string;
  readonly COMMERCELAYER_MARKET_ID: string;
  readonly COMMERCELAYER_SHIPPING_CATEGORY_ID: string;
  readonly SESSION_SECRET: string;
  readonly PUBLIC_STRIPE_PUBLISHABLE_KEY: string;
}

declare namespace App {
  interface Locals {
    session: import('@/lib/commerce/session').SessionData | null;
    customer: import('@/lib/commerce/types').Customer | null;
  }
}
