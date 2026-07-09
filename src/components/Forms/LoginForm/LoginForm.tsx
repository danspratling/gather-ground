import { useState } from 'react';
import type { LoginFormProps } from './LoginForm.types';

type Status = 'idle' | 'submitting' | 'success';

interface FieldErrors {
  email?: string;
  password?: string;
}

const inputClasses =
  'w-full rounded-lg border border-brand-100 bg-off-white px-3.5 py-2.5 text-sm text-brand-900 shadow-xs transition-colors placeholder:text-brand-500 focus:border-brand-700 focus:outline-none focus:ring-1 focus:ring-brand-700';

const inputErrorClasses =
  'border-destructive focus:border-destructive focus:ring-destructive';

const labelClasses = 'text-sm font-medium text-brand-700';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isSafeRedirect = (value: string): boolean =>
  value.startsWith('/') && !value.startsWith('//');

const resolveRedirect = (redirectTo?: string): string => {
  if (redirectTo && isSafeRedirect(redirectTo)) return redirectTo;
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const next = params.get('next');
    if (next && isSafeRedirect(next)) return next;
  }
  return '/account';
};

export default function LoginForm({ redirectTo }: LoginFormProps) {
  const [status, setStatus] = useState<Status>('idle');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string>('');

  const validate = (email: string, password: string): FieldErrors => {
    const errors: FieldErrors = {};
    if (!email) {
      errors.email = 'Email is required';
    } else if (!EMAIL_PATTERN.test(email)) {
      errors.email = 'Enter a valid email address';
    }
    if (!password) {
      errors.password = 'Password is required';
    }
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError('');

    const formData = new FormData(e.currentTarget);
    const email = ((formData.get('email') as string | null) ?? '').trim();
    const password = (formData.get('password') as string | null) ?? '';

    const errors = validate(email, password);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setStatus('submitting');

    try {
      const resp = await fetch('/api/commerce/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (resp.ok) {
        setStatus('success');
        window.location.assign(resolveRedirect(redirectTo));
        return;
      }

      if (resp.status === 429) {
        const retryAfter = Number(resp.headers.get('Retry-After') ?? '60');
        setFormError(
          `Too many attempts. Please try again in ${retryAfter} seconds.`
        );
      } else if (resp.status === 401) {
        setFormError('Invalid email or password');
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

  const submitting = status === 'submitting' || status === 'success';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="login-email" className={labelClasses}>
          Email
          <span className="ml-0.5 text-brand-800" aria-hidden="true">
            *
          </span>
        </label>
        <input
          id="login-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="jane@example.com"
          aria-invalid={fieldErrors.email ? 'true' : undefined}
          aria-describedby={fieldErrors.email ? 'login-email-error' : undefined}
          className={`${inputClasses} ${
            fieldErrors.email ? inputErrorClasses : ''
          }`}
        />
        {fieldErrors.email && (
          <p
            id="login-email-error"
            data-testid="login-email-error"
            className="text-sm text-destructive"
          >
            {fieldErrors.email}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-baseline justify-between gap-4">
          <label htmlFor="login-password" className={labelClasses}>
            Password
            <span className="ml-0.5 text-brand-800" aria-hidden="true">
              *
            </span>
          </label>
          <a
            href="/account/password-reset"
            className="text-sm font-medium text-brand-700 underline underline-offset-2 hover:no-underline"
          >
            Forgot password?
          </a>
        </div>
        <input
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="Enter your password"
          aria-invalid={fieldErrors.password ? 'true' : undefined}
          aria-describedby={
            fieldErrors.password ? 'login-password-error' : undefined
          }
          className={`${inputClasses} ${
            fieldErrors.password ? inputErrorClasses : ''
          }`}
        />
        {fieldErrors.password && (
          <p
            id="login-password-error"
            data-testid="login-password-error"
            className="text-sm text-destructive"
          >
            {fieldErrors.password}
          </p>
        )}
      </div>

      {formError && (
        <p
          role="alert"
          data-testid="login-form-error"
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
        {submitting ? 'Signing in…' : 'Sign in'}
      </button>

      <p className="text-center text-sm text-brand-600">
        Don't have an account?{' '}
        <a
          href="/account/register"
          className="font-medium text-brand-700 underline underline-offset-2 hover:no-underline"
        >
          Create one
        </a>
      </p>
    </form>
  );
}
