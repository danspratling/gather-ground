export interface StripePaymentElementProps {
  clientSecret: string;
  onSuccess: (paymentMethodId: string) => void;
  onError?: (error: string) => void;
}

export default null;
