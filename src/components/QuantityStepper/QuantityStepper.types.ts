export interface QuantityStepperProps {
  value: number;
  min?: number;
  max?: number;
  disabled?: boolean;
  onChange: (quantity: number) => void;
  class?: string;
}

export default null;
