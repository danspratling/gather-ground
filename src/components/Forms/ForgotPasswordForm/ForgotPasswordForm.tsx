import { useState, type FormEvent } from 'react';
import type { ForgotPasswordFormProps } from './ForgotPasswordForm.types';

type Status = 'idle' | 'submitting' | 'submitted';

const inputClasses =
  'w-full rounded-lg border border-brand-100 bg-off-white px-3.5 py-2.5 text-sm text-brand-900 shadow-xs transition-colors placeholder:text-brand-500 focus:border-brand-700 focus:outline-none focus:ring-1 focus:ring-brand-700';

const inputErrorClasses =
  'border-destructive focus:border-destructive focus:ring-destructive';

const labelClasses = 'text-sm font-medium text-brand-700';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordForm({
  loginHref = '/account/login',
}: ForgotPasswordFormProps) {
  const [status, setStatus] = useState<Status>('idle');
  const [emailError, setEmailError] = useState<string>('');
  const [formError, setFormError] = useState<string>('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError('');
    setEmailError('');

    const formData = new FormData(e.currentTarget);
    const email = ((formData.get('email') as string | null) ?? '').trim();

    if (!email) {
      setEmailError('Email is required');
      return;
    }
    if (!EMAIL_PATTERN.test(email)) {
      setEmailError('Enter a valid email address');
      return;
    }

    setStatus('submitting');

    try {
      const resp = await fetch('/api/commerce/auth/password-reset/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (resp.ok) {
        setStatus('submitted');
        return;
      }

      if (resp.status === 429) {
        const parsed = parseInt(resp.headers.get('Retry-After') ?? '', 10);
        const retryAfter = Number.isFinite(parsed) && parsed > 0 ? parsed : 60;
        setFormError(
          `Too many attempts. Please try again in ${retryAfter} seconds.`
        );
      } else {
        const data = (await resp.json().catch(() => ({}))) as {
          error?: string;
        };
        setFormError(data.error ?? 'Something went wrong. Please try again.');
      }
      setStatus('idle');
    } catch {
      setFormError('Network error. Please try again.');
      setStatus('idle');
    }
  };

  // The API deliberately returns 200 whether or not the email is registered,
  // and the success copy mirrors that — never confirm account existence.
  if (status === 'submitted') {
    return (
      <div
        role="status"
        data-testid="forgot-password-submitted"
        className="flex flex-col gap-3 rounded-lg border border-brand-100 bg-off-white p-6 text-brand-700"
      >
        <p className="text-lg font-semibold text-brand-900">Check your inbox</p>
        <p className="text-sm">
          If an account exists for that email address, we've sent a link to
          reset your password. It may take a few minutes to arrive.
        </p>
        <p className="text-sm">
          <a
            href={loginHref}
            className="font-medium text-brand-700 underline underline-offset-2 hover:no-underline"
          >
            Back to sign in
          </a>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="forgot-email" className={labelClasses}>
          Email
          <span className="ml-0.5 text-brand-800" aria-hidden="true">
            *
          </span>
        </label>
        <input
          id="forgot-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="jane@example.com"
          aria-invalid={emailError ? 'true' : undefined}
          aria-describedby={emailError ? 'forgot-email-error' : undefined}
          className={`${inputClasses} ${emailError ? inputErrorClasses : ''}`}
        />
        {emailError && (
          <p
            id="forgot-email-error"
            data-testid="forgot-email-error"
            className="text-sm text-destructive"
          >
            {emailError}
          </p>
        )}
      </div>

      {formError && (
        <p
          role="alert"
          data-testid="forgot-form-error"
          className="text-sm text-destructive"
        >
          {formError}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="inline-flex w-full cursor-pointer items-center justify-center rounded-full border border-brand-600 bg-brand-700 px-4.5 py-3 text-base font-semibold whitespace-nowrap text-brand-25 transition-colors hover:bg-brand-600 disabled:pointer-events-none disabled:opacity-50"
      >
        {status === 'submitting' ? 'Sending…' : 'Send reset link'}
      </button>

      <p className="text-center text-sm text-brand-600">
        Remembered your password?{' '}
        <a
          href={loginHref}
          className="font-medium text-brand-700 underline underline-offset-2 hover:no-underline"
        >
          Sign in
        </a>
      </p>
    </form>
  );
}
