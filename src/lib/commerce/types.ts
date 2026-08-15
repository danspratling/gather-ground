/**
 * Vendor-neutral commerce types
 *
 * These types define the canonical shape of commerce data across all vendors
 * (Commerce Layer, Shopify, etc.). Vendor adapters map their responses to these
 * types. No vendor-specific shapes (no CL `data.attributes`, Shopify `gid://...`,
 * or REST relationship nesting) may leak into the application.
 */

/**
 * Money represents a monetary value with currency and formatting
 */
export interface Money {
  amount: number;
  currency: string; // ISO 4217 code (e.g., 'GBP', 'USD', 'EUR')
  formatted: string; // Localized string (e.g., '£19.99', '$19.99')
}

/**
 * OptionValue represents a single option choice for a variant (e.g., 'Red', 'Large')
 */
export interface OptionValue {
  id: string;
  name: string;
}

/**
 * Option represents a variant dimension (e.g., Color, Size)
 */
export interface Option {
  id: string;
  name: string;
  values: OptionValue[];
}

/**
 * Variant represents a product variant (e.g., a specific color/size combination)
 */
export interface Variant {
  id: string;
  name: string;
  sku: string;
  price: Money;
  compareAtPrice?: Money;
  image?: {
    url: string;
    altText?: string;
  };
  selectedOptions: Record<string, string>; // e.g., { color: 'Red', size: 'Large' }
  inventoryStatus: InventoryStatus;
  weight?: number; // in grams
}

/**
 * Product represents a product with variants and options
 */
export interface Product {
  id: string;
  name: string;
  description?: string;
  image?: {
    url: string;
    altText?: string;
  };
  options: Option[];
  variants: Variant[];
  priceRange: {
    min: Money;
    max: Money;
  };
  category?: string;
  tags?: string[];
}

/**
 * InventoryStatus represents stock availability
 */
export type InventoryStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

/**
 * LineItem represents a single item in a cart or order
 */
export interface LineItem {
  id: string;
  variantId: string;
  quantity: number;
  price: Money;
  subtotal: Money;
  selectedOptions: Record<string, string>;
}

/**
 * Cart represents a shopping cart
 */
export interface Cart {
  id: string;
  lineItems: LineItem[];
  subtotal: Money;
  tax?: Money;
  shippingCost?: Money;
  total: Money;
  discountCode?: string;
  discountAmount?: Money;
}

/**
 * Address represents a street address
 */
export interface Address {
  id?: string;
  firstName: string;
  lastName: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phone?: string;
}

/**
 * ShippingMethod represents an available shipping option
 */
export interface ShippingMethod {
  id: string;
  name: string;
  cost: Money;
  estimatedDays?: number;
}

/**
 * PaymentMethod represents a payment option (credit card, Apple Pay, etc.)
 */
export interface PaymentMethod {
  id: string;
  type: 'card' | 'apple_pay' | 'google_pay' | 'link';
  displayName: string;
  last4?: string; // Last 4 digits for cards
  clientSecret?: string; // Stripe: PaymentIntent client_secret for Elements mounting
}

/**
 * OrderStatus represents the state of an order
 */
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

/**
 * OrderSummary is the lightweight shape returned from the orders list endpoint.
 */
export interface OrderSummary {
  id: string;
  number: string;
  status: OrderStatus;
  placedAt: Date;
  total: Money;
  lineItemCount: number;
}

/**
 * Order represents a completed purchase
 */
export interface Order {
  id: string;
  number: string; // Human-readable order number (e.g., 'ORD-12345')
  customerId: string;
  lineItems: LineItem[];
  subtotal: Money;
  tax?: Money;
  shippingCost?: Money;
  discountAmount?: Money;
  total: Money;
  status: OrderStatus;
  shippingAddress: Address;
  billingAddress: Address;
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethod;
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
}

/**
 * Customer represents a registered user
 */
export interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  addresses: Address[];
  defaultShippingAddressId?: string;
  defaultBillingAddressId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export default null;
