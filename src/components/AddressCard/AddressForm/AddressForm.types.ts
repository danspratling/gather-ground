export interface AddressFormValues {
  firstName: string;
  lastName: string;
  line1: string;
  line2?: string;
  city: string;
  postcode: string;
  country: string;
  phone?: string;
  isDefaultShipping?: boolean;
  isDefaultBilling?: boolean;
}

export interface AddressFormProps {
  /** Present in edit mode — triggers PATCH instead of POST */
  addressId?: string;
  /** Pre-populate form fields for edit mode */
  initialValues?: AddressFormValues;
  /** Called after successful create or update */
  onSuccess?: () => void;
}

export default null;
