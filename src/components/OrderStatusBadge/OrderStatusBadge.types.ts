/**
 * CL order status strings we receive from the API.
 * 'placed' and 'approved' are in-progress; 'fulfilled' = delivered; 'cancelled' = cancelled.
 */
export type CLOrderStatus = 'placed' | 'approved' | 'fulfilled' | 'cancelled';

export interface OrderStatusBadgeProps {
  status: CLOrderStatus;
}

export default null;
