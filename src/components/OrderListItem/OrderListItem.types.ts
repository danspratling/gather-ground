import type { CLOrderStatus } from '@/components/OrderStatusBadge/OrderStatusBadge.types';

export interface OrderListItemProps {
  /** Order ID — used to build the href link */
  id: string;
  /** Human-readable order number e.g. "#1234" */
  orderNumber: string;
  /** Order placement date — accepts Date or ISO string (Storybook serialises Date args as strings) */
  placedAt: Date | string;
  /** CL order status */
  status: CLOrderStatus;
  /** Number of line items in the order */
  itemCount: number;
  /** Order total formatted e.g. "£48.00" */
  totalFormatted: string;
}

export default null;
