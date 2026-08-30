import React from 'react';
import { StripePaymentElement } from '../StripePaymentElement/StripePaymentElement';
import type { CheckoutPaymentStepProps } from './CheckoutPaymentStep.types';
import type { Address } from '@/lib/commerce/types';

const inputClasses =
  'w-full rounded-lg border border-brand-100 bg-off-white px-3.5 py-2.5 text-sm text-brand-900 shadow-xs transition-colors placeholder:text-brand-500 focus:border-brand-700 focus:outline-none focus:ring-1 focus:ring-brand-700';

const labelClasses = 'text-sm font-medium text-brand-700';

type Status = 'loading' | 'idle' | 'submitting' | 'error';

interface State {
  clientSecret: string | null;
  billingSameAsShipping: boolean;
  billingAddress: Partial<Address> | null;
  status: Status;
  error: string | null;
}

export function CheckoutPaymentStep({
  shippingAddress,
  onComplete,
  _clientSecret,
}: CheckoutPaymentStepProps) {
  const [state, setState] = React.useState<State>({
    clientSecret: _clientSecret ?? null,
    billingSameAsShipping: true,
    billingAddress: null,
    status: _clientSecret ? 'idle' : 'loading',
    error: null,
  });

  React.useEffect(() => {
    // If a mock secret was supplied (e.g. from Storybook), skip the API call
    if (_clientSecret) return;

    let cancelled = false;

    async function fetchClientSecret() {
      try {
        const resp = await fetch('/api/commerce/checkout/payment-source', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!resp.ok) {
          const data = (await resp.json().catch(() => ({}))) as {
            error?: string;
          };
          if (!cancelled) {
            setState((prev) => ({
              ...prev,
              status: 'error',
              error: data.error ?? 'Failed to initialise payment.',
            }));
          }
          return;
        }

        const data = (await resp.json()) as { clientSecret: string };
        if (!cancelled) {
          setState((prev) => ({
            ...prev,
            clientSecret: data.clientSecret,
            status: 'idle',
          }));
        }
      } catch {
        if (!cancelled) {
          setState((prev) => ({
            ...prev,
            status: 'error',
            error: 'Network error. Please try again.',
          }));
        }
      }
    }

    fetchClientSecret();

    return () => {
      cancelled = true;
    };
  }, [_clientSecret]);

  function handleBillingToggle(e: React.ChangeEvent<HTMLInputElement>) {
    setState((prev) => ({
      ...prev,
      billingSameAsShipping: e.target.checked,
      billingAddress: e.target.checked ? null : prev.billingAddress,
    }));
  }

  function handleBillingField(field: keyof Omit<Address, 'id'>, value: string) {
    setState((prev) => ({
      ...prev,
      billingAddress: { ...prev.billingAddress, [field]: value },
    }));
  }

  if (state.status === 'loading') {
    return (
      <div className="flex items-center justify-center py-10">
        <span className="text-sm text-brand-500">Loading payment details…</span>
      </div>
    );
  }

  if (state.status === 'error' || state.error) {
    return (
      <p className="text-sm text-destructive" role="alert">
        {state.error ?? 'Something went wrong.'}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Billing address */}
      <div className="flex flex-col gap-4">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={state.billingSameAsShipping}
            onChange={handleBillingToggle}
            className="h-4 w-4 rounded border-brand-100 accent-brand-700"
          />
          <span className={labelClasses}>Billing same as shipping</span>
        </label>

        {!state.billingSameAsShipping && (
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-brand-900">
              Billing address
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="billing-firstName" className={labelClasses}>
                  First name
                </label>
                <input
                  id="billing-firstName"
                  name="billing-firstName"
                  type="text"
                  autoComplete="billing given-name"
                  placeholder="Jane"
                  defaultValue={state.billingAddress?.firstName ?? ''}
                  onChange={(e) =>
                    handleBillingField('firstName', e.target.value)
                  }
                  className={inputClasses}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="billing-lastName" className={labelClasses}>
                  Last name
                </label>
                <input
                  id="billing-lastName"
                  name="billing-lastName"
                  type="text"
                  autoComplete="billing family-name"
                  placeholder="Smith"
                  defaultValue={state.billingAddress?.lastName ?? ''}
                  onChange={(e) =>
                    handleBillingField('lastName', e.target.value)
                  }
                  className={inputClasses}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="billing-line1" className={labelClasses}>
                Address line 1
              </label>
              <input
                id="billing-line1"
                name="billing-line1"
                type="text"
                autoComplete="billing address-line1"
                placeholder="123 Main St"
                defaultValue={state.billingAddress?.line1 ?? ''}
                onChange={(e) => handleBillingField('line1', e.target.value)}
                className={inputClasses}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="billing-line2" className={labelClasses}>
                Address line 2{' '}
                <span className="font-normal text-brand-500">(optional)</span>
              </label>
              <input
                id="billing-line2"
                name="billing-line2"
                type="text"
                autoComplete="billing address-line2"
                placeholder="Apt 4B"
                defaultValue={state.billingAddress?.line2 ?? ''}
                onChange={(e) => handleBillingField('line2', e.target.value)}
                className={inputClasses}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="billing-city" className={labelClasses}>
                  City
                </label>
                <input
                  id="billing-city"
                  name="billing-city"
                  type="text"
                  autoComplete="billing address-level2"
                  placeholder="London"
                  defaultValue={state.billingAddress?.city ?? ''}
                  onChange={(e) => handleBillingField('city', e.target.value)}
                  className={inputClasses}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="billing-postalCode" className={labelClasses}>
                  Postcode
                </label>
                <input
                  id="billing-postalCode"
                  name="billing-postalCode"
                  type="text"
                  autoComplete="billing postal-code"
                  placeholder="SW1A 1AA"
                  defaultValue={state.billingAddress?.postalCode ?? ''}
                  onChange={(e) =>
                    handleBillingField('postalCode', e.target.value)
                  }
                  className={inputClasses}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="billing-country" className={labelClasses}>
                Country
              </label>
              <input
                id="billing-country"
                name="billing-country"
                type="text"
                autoComplete="billing country-name"
                placeholder="United Kingdom"
                defaultValue={state.billingAddress?.country ?? ''}
                onChange={(e) => handleBillingField('country', e.target.value)}
                className={inputClasses}
              />
            </div>
          </div>
        )}
      </div>

      {/* Stripe payment element */}
      {state.clientSecret && (
        <StripePaymentElement
          clientSecret={state.clientSecret}
          onSuccess={(paymentIntentId) => onComplete(paymentIntentId)}
        />
      )}
    </div>
  );
}

export default null;
