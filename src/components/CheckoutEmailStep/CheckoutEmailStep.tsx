import { useState, type FormEvent } from 'react';
import type { CheckoutEmailStepProps } from './CheckoutEmailStep.types';

type Status = 'idle' | 'submitting' | 'error';

interface FieldErrors {
  email?: string;
}

const inputClasses =
  'w-full rounded-lg border border-brand-100 bg-off-white px-3.5 py-2.5 text-sm text-brand-900 shadow-xs transition-colors placeholder:text-brand-500 focus:border-brand-700 focus:outline-none focus:ring-1 focus:ring-brand-700';

const inputErrorClasses =
  'border-destructive focus:border-destructive focus:ring-destructive';

const labelClasses = 'text-sm font-medium text-brand-700';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function CheckoutEmailStep({
  customer,
  onComplete,
  _status,
}: CheckoutEmailStepProps) {
  const [status, setStatus] = useState<Status>(_status ?? 'idle');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string>('');

  if (customer) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <p className={labelClasses}>Email address</p>
          <p className="text-sm text-brand-900">{customer.email}</p>
        </div>
        <form method="post" action="/api/commerce/auth/logout">
          <button
            type="submit"
            className="text-sm font-medium text-brand-700 underline underline-offset-2 hover:no-underline"
          >
            Sign out
          </button>
        </form>
      </div>
    );
  }

  const validate = (email: string): FieldErrors => {
    const errors: FieldErrors = {};
    if (!email) {
      errors.email = 'Email is required';
    } else if (!EMAIL_PATTERN.test(email)) {
      errors.email = 'Enter a valid email address';
    }
    return errors;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError('');

    const formData = new FormData(e.currentTarget);
    const email = ((formData.get('email') as string | null) ?? '').trim();

    const errors = validate(email);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setStatus('submitting');

    try {
      const resp = await fetch('/api/commerce/checkout/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (resp.ok) {
        onComplete(email);
        return;
      }

      const data = (await resp.json().catch(() => ({}))) as { error?: string };
      setFormError(data.error ?? 'Something went wrong. Please try again.');
      setStatus('error');
    } catch {
      setFormError('Network error. Please try again.');
      setStatus('error');
    }
  };

  const submitting = status === 'submitting';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="checkout-email" className={labelClasses}>
          Email address
          <span className="ml-0.5 text-brand-800" aria-hidden="true">
            *
          </span>
        </label>
        <input
          id="checkout-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="jane@example.com"
          aria-invalid={fieldErrors.email ? 'true' : undefined}
          aria-describedby={
            fieldErrors.email ? 'checkout-email-error' : undefined
          }
          className={`${inputClasses} ${fieldErrors.email ? inputErrorClasses : ''}`}
        />
        {fieldErrors.email && (
          <p
            id="checkout-email-error"
            data-testid="checkout-email-error"
            className="text-sm text-destructive"
          >
            {fieldErrors.email}
          </p>
        )}
      </div>

      {formError && (
        <p
          role="alert"
          data-testid="checkout-email-form-error"
          className="text-sm text-destructive"
        >
          {formError}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex w-full cursor-pointer items-center justify-center rounded-full border border-brand-600 bg-brand-700 px-4.5 py-3 text-base font-semibold whitespace-nowrap text-brand-25 transition-colors hover:bg-brand-600 disabled:pointer-events-none disabled:opacity-50"
      >
        {submitting ? 'Continuing…' : 'Continue'}
      </button>
    </form>
  );
}

export default null;
