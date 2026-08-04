/**
 * Cart merge helper — wraps the Commerce Layer mergeCart adapter method.
 * Exposed here so auth route files can import it without violating the
 * no-restricted-imports ESLint rule (routes cannot import from commercelayer directly).
 */
import { mergeCart as clMergeCart } from '@/lib/commerce/commercelayer/cart';
import type { Cart } from '@/lib/commerce/types';

export async function mergeCart(
  guestCartId: string,
  customerId: string
): Promise<Cart> {
  return clMergeCart(guestCartId, customerId);
}

export default null;
