import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import type { StripePaymentElementProps } from './StripePaymentElement.types';

// Initialize Stripe once at module level (not inside a component)
const stripePromise = loadStripe(import.meta.env.PUBLIC_STRIPE_PUBLISHABLE_KEY);

// ---------------------------------------------------------------------------
// Inner form component (uses Stripe hooks — must be inside <Elements>)
// ---------------------------------------------------------------------------

interface PaymentFormProps {
  onSuccess: (paymentMethodId: string) => void;
  onError?: (error: string) => void;
}

function PaymentForm({ onSuccess, onError }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + '/checkout/confirmation/pending',
      },
      redirect: 'if_required',
    });

    setIsSubmitting(false);

    if (result.error) {
      const msg = result.error.message ?? 'Payment failed';
      setErrorMessage(msg);
      onError?.(msg);
    } else if (result.paymentIntent?.status === 'succeeded') {
      onSuccess(result.paymentIntent.id);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {errorMessage && (
        <p className="text-sm text-red-600" role="alert">
          {errorMessage}
        </p>
      )}
      <button
        type="submit"
        disabled={!stripe || isSubmitting}
        className="w-full rounded-md bg-terracotta-500 px-4 py-2 text-white disabled:opacity-50"
      >
        {isSubmitting ? 'Processing\u2026' : 'Pay now'}
      </button>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Outer component (wraps Elements provider)
// ---------------------------------------------------------------------------

export function StripePaymentElement({
  clientSecret,
  onSuccess,
  onError,
}: StripePaymentElementProps) {
  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <PaymentForm onSuccess={onSuccess} onError={onError} />
    </Elements>
  );
}

export default null;
