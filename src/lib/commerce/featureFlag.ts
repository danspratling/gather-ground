import type { APIContext } from 'astro';

export const isCommerceEnabled = (): boolean =>
  import.meta.env.PUBLIC_COMMERCE_ENABLED === 'true';

export const requireCommerceEnabled = (_astro: APIContext): Response | null => {
  if (!isCommerceEnabled()) {
    return new Response(null, { status: 404 });
  }

  return null;
};

export const commerceFieldHidden = () => () => !isCommerceEnabled();

export default null;
