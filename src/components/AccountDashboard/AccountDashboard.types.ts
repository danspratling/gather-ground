import type { Address } from '@/components/AddressCard/AddressCard.types';

export interface AccountDashboardProps {
  customerName: string;
  /** Default shipping address, if one exists */
  defaultAddress?: Address;
  // TODO: recentOrders — awaiting GG-242 (OrderListItem, E32 orders epic)
  // TODO: cartItems — awaiting GG-218 (CartItemRow, E21 cart epic)
}

export default null;
