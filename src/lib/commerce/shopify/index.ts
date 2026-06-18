/**
 * Shopify commerce adapter (stub)
 *
 * Placeholder to prove the vendor-neutral CommerceAdapter boundary compiles
 * against more than one implementation. All methods throw "not implemented".
 *
 * Real Shopify support is a future-track ticket and will replace this stub.
 */

import type { CommerceAdapter } from '../adapter';

const notImplemented = (method: string) => async (): Promise<never> => {
  throw new Error(`Shopify commerce adapter not implemented: ${method}`);
};

export const shopifyAdapter: CommerceAdapter = {
  // AUTH
  login: notImplemented('login'),
  register: notImplemented('register'),
  logout: notImplemented('logout'),
  requestPasswordReset: notImplemented('requestPasswordReset'),
  confirmPasswordReset: notImplemented('confirmPasswordReset'),
  refreshSession: notImplemented('refreshSession'),

  // CATALOG
  getVariantInventory: notImplemented('getVariantInventory'),
  getVariantPrice: notImplemented('getVariantPrice'),

  // CART
  createCart: notImplemented('createCart'),
  getCart: notImplemented('getCart'),
  addLineItem: notImplemented('addLineItem'),
  updateLineItem: notImplemented('updateLineItem'),
  removeLineItem: notImplemented('removeLineItem'),

  // CUSTOMER
  getCustomer: notImplemented('getCustomer'),
  updateCustomer: notImplemented('updateCustomer'),
  changePassword: notImplemented('changePassword'),
  listAddresses: notImplemented('listAddresses'),
  createAddress: notImplemented('createAddress'),
  updateAddress: notImplemented('updateAddress'),
  deleteAddress: notImplemented('deleteAddress'),
  setDefaultAddress: notImplemented('setDefaultAddress'),
  listOrders: notImplemented('listOrders'),
  getOrder: notImplemented('getOrder'),

  // CHECKOUT
  attachCustomerToOrder: notImplemented('attachCustomerToOrder'),
  setOrderEmail: notImplemented('setOrderEmail'),
  setShippingAddress: notImplemented('setShippingAddress'),
  setBillingAddress: notImplemented('setBillingAddress'),
  listShippingMethods: notImplemented('listShippingMethods'),
  setShippingMethod: notImplemented('setShippingMethod'),
  createPaymentSource: notImplemented('createPaymentSource'),
  placeOrder: notImplemented('placeOrder'),

  // SYNC
  upsertVariant: notImplemented('upsertVariant'),
  deleteVariant: notImplemented('deleteVariant'),
};

export default null;
