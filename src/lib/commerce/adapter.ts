/**
 * Commerce adapter interface
 *
 * Every vendor (Commerce Layer, Shopify, etc.) must implement this interface.
 * All methods return vendor-neutral types from `src/lib/commerce/types.ts`.
 *
 * Adding new methods to this interface is a contract change. Review carefully.
 * New methods MUST be added here before any consumer uses them.
 */

import type {
  Money,
  Variant,
  InventoryStatus,
  Cart,
  LineItem,
  Address,
  ShippingMethod,
  PaymentMethod,
  Order,
  Customer,
} from './types';

export interface CommerceAdapter {
  /**
   * AUTH
   * Manage user sessions, authentication, and password reset flows
   */

  /**
   * Log in a user with email and password.
   * `expiresAt` is a unix-seconds timestamp marking when the access token
   * itself expires (independent of the session cookie's rolling 30-day TTL).
   */
  login(
    email: string,
    password: string
  ): Promise<{ token: string; customer: Customer; expiresAt: number }>;

  /**
   * Register a new user
   */
  register(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<{ token: string; customer: Customer; expiresAt: number }>;

  /**
   * Log out the current user (revoke token)
   */
  logout(token: string): Promise<void>;

  /**
   * Request a password reset email
   */
  /** Returns the reset token so the caller can send it in an email. */
  requestPasswordReset(email: string): Promise<{ resetToken: string }>;

  /**
   * Confirm password reset with code
   */
  confirmPasswordReset(code: string, newPassword: string): Promise<void>;

  /**
   * Refresh an expired session token. `expiresAt` is a unix-seconds timestamp
   * for the returned token (independent of the session cookie's rolling TTL).
   */
  refreshSession(
    token: string
  ): Promise<{ token: string; customer: Customer; expiresAt: number }>;

  /**
   * CATALOG
   * Product information and inventory
   */

  /**
   * Get inventory status for a variant
   */
  getVariantInventory(variantId: string): Promise<InventoryStatus>;

  /**
   * Get current price for a variant
   */
  getVariantPrice(variantId: string): Promise<Money>;

  /**
   * CART
   * Shopping cart operations
   */

  /**
   * Create a new cart
   */
  createCart(): Promise<Cart>;

  /**
   * Retrieve a cart by ID
   */
  getCart(cartId: string): Promise<Cart>;

  /**
   * Add an item to the cart
   */
  addLineItem(
    cartId: string,
    variantId: string,
    quantity: number
  ): Promise<LineItem>;

  /**
   * Update the quantity of a line item
   */
  updateLineItem(
    cartId: string,
    lineItemId: string,
    quantity: number
  ): Promise<LineItem>;

  /**
   * Remove an item from the cart
   */
  removeLineItem(cartId: string, lineItemId: string): Promise<void>;

  /**
   * CUSTOMER
   * User profile and order history
   */

  /**
   * Get the current customer profile
   */
  getCustomer(token: string): Promise<Customer>;

  /**
   * Update customer profile
   */
  updateCustomer(token: string, updates: Partial<Customer>): Promise<Customer>;

  /**
   * Change customer password
   */
  changePassword(
    token: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void>;

  /**
   * List all addresses for the customer
   */
  listAddresses(token: string): Promise<Address[]>;

  /**
   * Create a new address
   */
  createAddress(token: string, address: Address): Promise<Address>;

  /**
   * Update an existing address
   */
  updateAddress(
    token: string,
    addressId: string,
    updates: Partial<Address>
  ): Promise<Address>;

  /**
   * Delete an address
   */
  deleteAddress(token: string, addressId: string): Promise<void>;

  /**
   * Set the default shipping or billing address
   */
  setDefaultAddress(
    token: string,
    addressId: string,
    type: 'shipping' | 'billing'
  ): Promise<void>;

  /**
   * List all orders for the customer
   */
  listOrders(token: string): Promise<Order[]>;

  /**
   * Get a specific order
   */
  getOrder(token: string, orderId: string): Promise<Order>;

  /**
   * CHECKOUT
   * Order placement and payment processing
   */

  /**
   * Attach a customer to an order (for guest checkout)
   */
  attachCustomerToOrder(cartId: string, token: string): Promise<void>;

  /**
   * Set the email for an order (guest checkout)
   */
  setOrderEmail(cartId: string, email: string): Promise<void>;

  /**
   * Set the shipping address for an order
   */
  setShippingAddress(cartId: string, address: Address): Promise<void>;

  /**
   * Set the billing address for an order
   */
  setBillingAddress(cartId: string, address: Address): Promise<void>;

  /**
   * List available shipping methods for the order
   */
  listShippingMethods(cartId: string): Promise<ShippingMethod[]>;

  /**
   * Set the shipping method
   */
  setShippingMethod(cartId: string, shippingMethodId: string): Promise<void>;

  /**
   * Create a payment source (credit card, etc.)
   */
  createPaymentSource(
    cartId: string,
    paymentDetails: Record<string, unknown>
  ): Promise<PaymentMethod>;

  /**
   * Place the order and process payment
   */
  placeOrder(cartId: string, paymentMethodId: string): Promise<Order>;

  /**
   * SYNC
   * Product data synchronization from Sanity
   */

  /**
   * Create or update a variant
   */
  upsertVariant(variant: Variant): Promise<void>;

  /**
   * Delete a variant
   */
  deleteVariant(variantId: string): Promise<void>;
}

export default null;
