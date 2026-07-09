import { useEffect, useState, type FormEvent } from 'react';
import type { ResetPasswordFormProps } from './ResetPasswordForm.types';

type Status = 'idle' | 'submitting' | 'success';

interface FieldErrors {
  password?: string;
  confirm?: string;
}

const MIN_PASSWORD_LENGTH = 8;

const inputClasses =
  'w-full rounded-lg border border-brand-100 bg-off-white px-3.5 py-2.5 text-sm text-brand-900 shadow-xs transition-colors placeholder:text-brand-500 focus:border-brand-700 focus:outline-none focus:ring-1 focus:ring-brand-700';

const inputErrorClasses =
  'border-destructive focus:border-destructive focus:ring-destructive';

const labelClasses = 'text-sm font-medium text-brand-700';

/**
 * Reads the `?token=` query param on mount. Kept in an effect so the
 * component is safe to render server-side (`window` is undefined).
 */
function useTokenFromUrl(initial?: string): string {
  const [token, setToken] = useState(initial ?? '');
  useEffect(() => {
    if (initial) return;
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get('token');
    if (fromUrl) setToken(fromUrl);
  }, [initial]);
  return token;
}

export default function ResetPasswordForm({
  token: tokenProp,
  loginHref = '/account/login',
}: ResetPasswordFormProps) {
  const token = useTokenFromUrl(tokenProp);
  const [status, setStatus] = useState<Status>('idle');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string>('');

  const validate = (password: string, confirm: string): FieldErrors => {
    const errors: FieldErrors = {};
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < MIN_PASSWORD_LENGTH) {
      errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
    }
    if (!confirm) {
      errors.confirm = 'Please confirm your password';
    } else if (password !== confirm) {
      errors.confirm = 'Passwords do not match';
    }
    return errors;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError('');

    const formData = new FormData(e.currentTarget);
    const password = (formData.get('password') as string | null) ?? '';
    const confirm = (formData.get('confirm') as string | null) ?? '';

    const errors = validate(password, confirm);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setStatus('submitting');

    try {
      const resp = await fetch('/api/commerce/auth/password-reset/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      if (resp.ok) {
        setStatus('success');
        return;
      }

      if (resp.status === 429) {
        const parsed = parseInt(resp.headers.get('Retry-After') ?? '', 10);
        const retryAfter = Number.isFinite(parsed) && parsed > 0 ? parsed : 60;
        setFormError(
          `Too many attempts. Please try again in ${retryAfter} seconds.`
        );
      } else if (resp.status === 400) {
        // Server returns 400 for both an invalid/expired token and a rejected
        // new password. Both messages are safe to surface verbatim from the
        // API; nothing here leaks account information.
        const data = (await resp.json().catch(() => ({}))) as {
          error?: string;
        };
        setFormError(data.error ?? 'Reset link is invalid or has expired');
      } else {
        setFormError('Something went wrong. Please try again.');
      }
      setStatus('idle');
    } catch {
      setFormError('Network error. Please try again.');
      setStatus('idle');
    }
  };

  // Missing token means the user hit /account/reset-password without a link.
  // Show a hard error rather than letting them fill in the form and submit —
  // the server would reject it anyway, but this is a clearer failure mode.
  if (!token) {
    return (
      <div
        role="alert"
        data-testid="reset-invalid-token"
        className="flex flex-col gap-3 rounded-lg border border-destructive/40 bg-off-white p-6 text-brand-700"
      >
        <p className="text-lg font-semibold text-destructive">
          Reset link is invalid or has expired
        </p>
        <p className="text-sm">
          The link you used to get here is missing or incorrect. Password reset
          links expire after a short time — request a new one to continue.
        </p>
        <p className="text-sm">
          <a
            href="/account/password-reset"
            className="font-medium text-brand-700 underline underline-offset-2 hover:no-underline"
          >
            Request a new link
          </a>
        </p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div
        role="status"
        data-testid="reset-success"
        className="flex flex-col gap-3 rounded-lg border border-brand-100 bg-off-white p-6 text-brand-700"
      >
        <p className="text-lg font-semibold text-brand-900">Password updated</p>
        <p className="text-sm">
          Your password has been updated. You can now sign in with your new
          password.
        </p>
        <p className="text-sm">
          <a
            href={loginHref}
            className="font-medium text-brand-700 underline underline-offset-2 hover:no-underline"
          >
            Sign in
          </a>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="reset-password" className={labelClasses}>
          New password
          <span className="ml-0.5 text-brand-800" aria-hidden="true">
            *
          </span>
        </label>
        <input
          id="reset-password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={MIN_PASSWORD_LENGTH}
          placeholder="At least 8 characters"
          aria-invalid={fieldErrors.password ? 'true' : undefined}
          aria-describedby={
            fieldErrors.password ? 'reset-password-error' : undefined
          }
          className={`${inputClasses} ${
            fieldErrors.password ? inputErrorClasses : ''
          }`}
        />
        {fieldErrors.password && (
          <p
            id="reset-password-error"
            data-testid="reset-password-error"
            className="text-sm text-destructive"
          >
            {fieldErrors.password}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="reset-confirm" className={labelClasses}>
          Confirm new password
          <span className="ml-0.5 text-brand-800" aria-hidden="true">
            *
          </span>
        </label>
        <input
          id="reset-confirm"
          name="confirm"
          type="password"
          autoComplete="new-password"
          required
          placeholder="Repeat your new password"
          aria-invalid={fieldErrors.confirm ? 'true' : undefined}
          aria-describedby={
            fieldErrors.confirm ? 'reset-confirm-error' : undefined
          }
          className={`${inputClasses} ${
            fieldErrors.confirm ? inputErrorClasses : ''
          }`}
        />
        {fieldErrors.confirm && (
          <p
            id="reset-confirm-error"
            data-testid="reset-confirm-error"
            className="text-sm text-destructive"
          >
            {fieldErrors.confirm}
          </p>
        )}
      </div>

      {formError && (
        <p
          role="alert"
          data-testid="reset-form-error"
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
        {status === 'submitting' ? 'Updating…' : 'Update password'}
      </button>
    </form>
  );
}
