import type { AstroGlobal } from 'astro';

export const isCommerceEnabled = (): boolean =>
  import.meta.env.PUBLIC_COMMERCE_ENABLED === 'true';

export const requireCommerceEnabled = async (
  astro: AstroGlobal
): Promise<Response | null> => {
  if (!isCommerceEnabled()) {
    astro.response.status = 404;
    return astro.rewrite('/404');
  }

  return null;
};

export const commerceFieldHidden = () => () => !isCommerceEnabled();

export default null;
