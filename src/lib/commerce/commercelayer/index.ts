/**
 * Commerce Layer adapter
 *
 * Full implementation of the CommerceAdapter interface using CL SDK
 * Methods are organized by scope and implemented across multiple tickets:
 * - Auth: this ticket (GG-E03-D)
 * - Catalog: GG-E10-E
 * - Cart: GG-E20-A
 * - Customer/orders: GG-E32-API-01, GG-E33-API-01, GG-E34-API-01
 * - Checkout: GG-E40-API-01
 * - Sync: GG-E11-A
 */

import type { CommerceAdapter } from '../adapter';
import * as auth from './auth';
import * as cart from './cart';
import * as customer from './customer';

/**
 * Commerce Layer adapter implementation
 * Auth methods are fully implemented; other methods are stubs pending their respective tickets
 */
export const commerceLayerAdapter: CommerceAdapter = {
  // AUTH ===================================================================

  login: auth.login,
  register: auth.register,
  logout: auth.logout,
  requestPasswordReset: auth.requestPasswordReset,
  confirmPasswordReset: auth.confirmPasswordReset,
  refreshSession: auth.refreshSession,

  // CATALOG ================================================================
  // Implemented in GG-E10-E

  getVariantInventory: async () => {
    throw new Error('Not yet implemented (GG-E10-E)');
  },

  getVariantPrice: async () => {
    throw new Error('Not yet implemented (GG-E10-E)');
  },

  // CART ===================================================================
  // Implemented in GG-E20-A

  createCart: cart.createCart,
  getCart: cart.getCart,
  addLineItem: cart.addLineItem,
  updateLineItem: cart.updateLineItem,
  removeLineItem: cart.removeLineItem,

  // CUSTOMER ===============================================================
  // Implemented in GG-E32-API-01, GG-E33-API-01, GG-E34-API-01

  getCustomer: customer.getCustomer,

  updateCustomer: async (token, updates) => {
    await customer.updateProfile(token, {
      firstName: updates.firstName,
      lastName: updates.lastName,
      email: updates.email,
    });
    return customer.getCustomer(token);
  },

  changePassword: customer.changePassword,

  listAddresses: customer.listAddresses,

  createAddress: customer.createAddress,

  updateAddress: customer.updateAddress,

  deleteAddress: customer.deleteAddress,

  setDefaultAddress: customer.setDefaultAddress,

  listOrders: async () => {
    throw new Error('Not yet implemented (GG-E32-API-01)');
  },

  getOrder: async () => {
    throw new Error('Not yet implemented (GG-E32-API-01)');
  },

  // CHECKOUT ===============================================================
  // Implemented in GG-E40-API-01

  attachCustomerToOrder: async () => {
    throw new Error('Not yet implemented (GG-E40-API-01)');
  },

  setOrderEmail: async () => {
    throw new Error('Not yet implemented (GG-E40-API-01)');
  },

  setShippingAddress: async () => {
    throw new Error('Not yet implemented (GG-E40-API-01)');
  },

  setBillingAddress: async () => {
    throw new Error('Not yet implemented (GG-E40-API-01)');
  },

  listShippingMethods: async () => {
    throw new Error('Not yet implemented (GG-E40-API-01)');
  },

  setShippingMethod: async () => {
    throw new Error('Not yet implemented (GG-E40-API-01)');
  },

  createPaymentSource: async () => {
    throw new Error('Not yet implemented (GG-E40-API-01)');
  },

  placeOrder: async () => {
    throw new Error('Not yet implemented (GG-E40-API-01)');
  },

  // SYNC ===================================================================
  // Implemented in GG-E11-A

  upsertVariant: async () => {
    throw new Error('Not yet implemented (GG-E11-A)');
  },

  deleteVariant: async () => {
    throw new Error('Not yet implemented (GG-E11-A)');
  },
};

export default null;
