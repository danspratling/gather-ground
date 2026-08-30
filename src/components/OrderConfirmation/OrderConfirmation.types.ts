export interface OrderConfirmationProps {
  /** CL order ID — used to build the account order detail link */
  orderId: string;
  /** Human-readable order number e.g. "#1234" — falls back to orderId if absent */
  orderNumber?: string;
  /** Customer email — shown as "confirmation sent to…" when present */
  customerEmail?: string;
  /** When true, renders a "View order details" link to /account/orders/:id */
  isAuthenticated?: boolean;
}

export default null;
