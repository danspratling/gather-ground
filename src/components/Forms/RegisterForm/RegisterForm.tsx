import { useMemo, useState, type FormEvent } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';
import type { RegisterFormProps } from './RegisterForm.types';

type Status = 'idle' | 'submitting' | 'success';

interface FieldErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
}

const MIN_PASSWORD_LENGTH = 8;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputClasses =
  'w-full rounded-lg border border-brand-100 bg-off-white px-3.5 py-2.5 text-sm text-brand-900 shadow-xs transition-colors placeholder:text-brand-500 focus:border-brand-700 focus:outline-none focus:ring-1 focus:ring-brand-700';

const inputErrorClasses =
  'border-destructive focus:border-destructive focus:ring-destructive';

const labelClasses = 'text-sm font-medium text-brand-700';

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

/**
 * Coarse-grained password strength indicator. Not a security control — the
 * only enforced check is >= MIN_PASSWORD_LENGTH characters on both client
 * and server. This exists to nudge users toward stronger passwords without
 * blocking them.
 *
 * Score buckets:
 * - 0: empty
 * - 1: 'Weak' — <8 chars or only one character class
 * - 2: 'Fair' — >=8 chars with 2 character classes
 * - 3: 'Good' — >=10 chars with 3 character classes
 * - 4: 'Strong' — >=12 chars with 4 character classes
 */
export type PasswordStrength = {
  score: 0 | 1 | 2 | 3 | 4;
  label: '' | 'Weak' | 'Fair' | 'Good' | 'Strong';
};

export function scorePassword(password: string): PasswordStrength {
  if (!password) return { score: 0, label: '' };

  const classes =
    (/[a-z]/.test(password) ? 1 : 0) +
    (/[A-Z]/.test(password) ? 1 : 0) +
    (/\d/.test(password) ? 1 : 0) +
    (/[^A-Za-z0-9]/.test(password) ? 1 : 0);

  if (password.length < MIN_PASSWORD_LENGTH || classes <= 1) {
    return { score: 1, label: 'Weak' };
  }
  if (password.length >= 12 && classes >= 4) {
    return { score: 4, label: 'Strong' };
  }
  if (password.length >= 10 && classes >= 3) {
    return { score: 3, label: 'Good' };
  }
  return { score: 2, label: 'Fair' };
}

const strengthBarColour: Record<PasswordStrength['score'], string> = {
  0: 'bg-brand-100',
  1: 'bg-destructive',
  2: 'bg-brand-400',
  3: 'bg-brand-600',
  4: 'bg-brand-700',
};

// Score maps 1:1 onto discrete Tailwind widths so we avoid an inline
// style={{ width: ... }} attribute (repo styling rule).
const strengthBarWidth: Record<PasswordStrength['score'], string> = {
  0: 'w-0',
  1: 'w-1/4',
  2: 'w-1/2',
  3: 'w-3/4',
  4: 'w-full',
};

export default function RegisterForm({
  redirectTo,
  privacyHref = '/privacy',
  loginHref = '/account/login',
}: RegisterFormProps) {
  const [status, setStatus] = useState<Status>('idle');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [turnstileToken, setTurnstileToken] = useState<string>('');

  const strength = useMemo(() => scorePassword(password), [password]);

  const siteKey = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY as
    | string
    | undefined;

  const validate = (
    firstName: string,
    lastName: string,
    email: string,
    pwd: string
  ): FieldErrors => {
    const errors: FieldErrors = {};
    if (!firstName) errors.firstName = 'First name is required';
    if (!lastName) errors.lastName = 'Last name is required';
    if (!email) {
      errors.email = 'Email is required';
    } else if (!EMAIL_PATTERN.test(email)) {
      errors.email = 'Enter a valid email address';
    }
    if (!pwd) {
      errors.password = 'Password is required';
    } else if (pwd.length < MIN_PASSWORD_LENGTH) {
      errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
    }
    return errors;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError('');

    const formData = new FormData(e.currentTarget);
    const firstName = (
      (formData.get('firstName') as string | null) ?? ''
    ).trim();
    const lastName = ((formData.get('lastName') as string | null) ?? '').trim();
    const email = ((formData.get('email') as string | null) ?? '').trim();
    const pwd = (formData.get('password') as string | null) ?? '';
    const marketingOptIn = formData.get('marketingOptIn') === 'on';

    const errors = validate(firstName, lastName, email, pwd);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setStatus('submitting');

    try {
      const resp = await fetch('/api/commerce/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password: pwd,
          marketingOptIn,
          turnstileToken,
        }),
      });

      if (resp.ok) {
        setStatus('success');
        window.location.assign(resolveRedirect(redirectTo));
        return;
      }

      if (resp.status === 429) {
        const parsed = parseInt(resp.headers.get('Retry-After') ?? '', 10);
        const retryAfter = Number.isFinite(parsed) && parsed > 0 ? parsed : 60;
        setFormError(
          `Too many attempts. Please try again in ${retryAfter} seconds.`
        );
      } else if (resp.status === 409) {
        // Generic — API does not disclose whether the email already exists.
        setFormError('Could not create account. Please try again.');
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
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="register-first-name" className={labelClasses}>
            First name
            <span className="ml-0.5 text-brand-800" aria-hidden="true">
              *
            </span>
          </label>
          <input
            id="register-first-name"
            name="firstName"
            type="text"
            autoComplete="given-name"
            required
            placeholder="Jane"
            aria-invalid={fieldErrors.firstName ? 'true' : undefined}
            aria-describedby={
              fieldErrors.firstName ? 'register-first-name-error' : undefined
            }
            className={`${inputClasses} ${
              fieldErrors.firstName ? inputErrorClasses : ''
            }`}
          />
          {fieldErrors.firstName && (
            <p
              id="register-first-name-error"
              data-testid="register-first-name-error"
              className="text-sm text-destructive"
            >
              {fieldErrors.firstName}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="register-last-name" className={labelClasses}>
            Last name
            <span className="ml-0.5 text-brand-800" aria-hidden="true">
              *
            </span>
          </label>
          <input
            id="register-last-name"
            name="lastName"
            type="text"
            autoComplete="family-name"
            required
            placeholder="Smith"
            aria-invalid={fieldErrors.lastName ? 'true' : undefined}
            aria-describedby={
              fieldErrors.lastName ? 'register-last-name-error' : undefined
            }
            className={`${inputClasses} ${
              fieldErrors.lastName ? inputErrorClasses : ''
            }`}
          />
          {fieldErrors.lastName && (
            <p
              id="register-last-name-error"
              data-testid="register-last-name-error"
              className="text-sm text-destructive"
            >
              {fieldErrors.lastName}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="register-email" className={labelClasses}>
          Email
          <span className="ml-0.5 text-brand-800" aria-hidden="true">
            *
          </span>
        </label>
        <input
          id="register-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="jane@example.com"
          aria-invalid={fieldErrors.email ? 'true' : undefined}
          aria-describedby={
            fieldErrors.email ? 'register-email-error' : undefined
          }
          className={`${inputClasses} ${
            fieldErrors.email ? inputErrorClasses : ''
          }`}
        />
        {fieldErrors.email && (
          <p
            id="register-email-error"
            data-testid="register-email-error"
            className="text-sm text-destructive"
          >
            {fieldErrors.email}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="register-password" className={labelClasses}>
          Password
          <span className="ml-0.5 text-brand-800" aria-hidden="true">
            *
          </span>
        </label>
        <input
          id="register-password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={MIN_PASSWORD_LENGTH}
          placeholder="At least 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-invalid={fieldErrors.password ? 'true' : undefined}
          aria-describedby={
            fieldErrors.password
              ? 'register-password-error'
              : 'register-password-strength'
          }
          className={`${inputClasses} ${
            fieldErrors.password ? inputErrorClasses : ''
          }`}
        />
        {fieldErrors.password ? (
          <p
            id="register-password-error"
            data-testid="register-password-error"
            className="text-sm text-destructive"
          >
            {fieldErrors.password}
          </p>
        ) : (
          <div
            id="register-password-strength"
            data-testid="register-password-strength"
            className="flex items-center gap-2"
          >
            <div
              className="h-1 flex-1 rounded-full bg-brand-100"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={4}
              aria-valuenow={strength.score}
              aria-label="Password strength"
            >
              <div
                className={`h-full rounded-full transition-all ${strengthBarColour[strength.score]} ${strengthBarWidth[strength.score]}`}
              />
            </div>
            {strength.label && (
              <span className="w-12 shrink-0 text-right text-xs text-brand-600">
                {strength.label}
              </span>
            )}
          </div>
        )}
      </div>

      <label className="flex items-start gap-3">
        <input
          type="checkbox"
          name="marketingOptIn"
          className="mt-0.5 size-4 shrink-0 cursor-pointer rounded border-brand-300 text-brand-600"
        />
        <span className="text-sm text-brand-600">
          I'd like to receive occasional emails from Gather Ground about farm
          news, recipes, and seasonal produce. You can unsubscribe at any time.
          See our{' '}
          <a
            href={privacyHref}
            className="font-medium underline underline-offset-2 hover:no-underline"
          >
            privacy policy
          </a>
          .
        </span>
      </label>

      {siteKey && (
        <Turnstile
          siteKey={siteKey}
          options={{ appearance: 'interaction-only' }}
          onSuccess={(token) => setTurnstileToken(token)}
        />
      )}

      {formError && (
        <p
          role="alert"
          data-testid="register-form-error"
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
        {submitting ? 'Creating account…' : 'Create account'}
      </button>

      <p className="text-center text-sm text-brand-600">
        Already have an account?{' '}
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
