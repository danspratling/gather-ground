export interface Address {
  id?: string;
  firstName: string;
  lastName: string;
  line1: string;
  line2?: string;
  city: string;
  postcode: string;
  country: string;
  isDefaultShipping?: boolean;
  isDefaultBilling?: boolean;
}

export interface AddressCardProps {
  address: Address;
}

export default null;
