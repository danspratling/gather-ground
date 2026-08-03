import type { CLOrderStatus } from '@/components/OrderStatusBadge/OrderStatusBadge.types';

export interface OrderDetailAddress {
  firstName: string;
  lastName: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
}

export interface OrderDetailLineItem {
  id: string;
  name: string;
  variantDescription?: string;
  imageUrl?: string;
  imageAlt?: string;
  unitPriceFormatted: string;
  quantity: number;
  lineTotalFormatted: string;
}

export interface OrderDetailProps {
  /** Human-readable order number e.g. "#1234" */
  orderNumber: string;
  /** CL order status */
  status: CLOrderStatus;
  /** Order placement date */
  placedAt: Date;
  /** Shipping address */
  shippingAddress: OrderDetailAddress;
  /** Billing address */
  billingAddress: OrderDetailAddress;
  /** Line items */
  lineItems: OrderDetailLineItem[];
  /** Subtotal formatted */
  subtotalFormatted: string;
  /** Shipping cost formatted */
  shippingCostFormatted: string;
  /** Order total formatted */
  totalFormatted: string;
}

export default null;
