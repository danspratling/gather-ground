export interface OrderLineItemProps {
  /** Product name */
  name: string;
  /** Variant description (e.g., "Small / Red") — optional */
  variantDescription?: string;
  /** Product image URL — optional */
  imageUrl?: string;
  /** Image alt text */
  imageAlt?: string;
  /** Unit price formatted (e.g., "£12.00") */
  unitPriceFormatted: string;
  /** Quantity ordered */
  quantity: number;
  /** Line total formatted (e.g., "£24.00") */
  lineTotalFormatted: string;
}

export default null;
