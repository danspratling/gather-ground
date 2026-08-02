import { useState, type FormEvent } from 'react';
import type { ChangePasswordFormProps } from './ChangePasswordForm.types';

type Status = 'idle' | 'submitting' | 'success' | 'error';

interface FieldErrors {
  confirmPassword?: string;
}

const MIN_PASSWORD_LENGTH = 8;

const inputClasses =
  'w-full rounded-lg border border-brand-100 bg-off-white px-3.5 py-2.5 text-sm text-brand-900 shadow-xs transition-colors placeholder:text-brand-500 focus:border-brand-700 focus:outline-none focus:ring-1 focus:ring-brand-700';

const inputErrorClasses =
  'border-destructive focus:border-destructive focus:ring-destructive';

const labelClasses = 'text-sm font-medium text-brand-700';

export default function ChangePasswordForm(_props: ChangePasswordFormProps) {
  const [status, setStatus] = useState<Status>('idle');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string>('');

  const validate = (
    newPassword: string,
    confirmPassword: string
  ): FieldErrors => {
    const errors: FieldErrors = {};
    if (newPassword !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    return errors;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === 'submitting') return;
    setFormError('');
    setFieldErrors({});

    const formData = new FormData(e.currentTarget);
    const currentPassword =
      (formData.get('currentPassword') as string | null) ?? '';
    const newPassword = (formData.get('newPassword') as string | null) ?? '';
    const confirmPassword =
      (formData.get('confirmPassword') as string | null) ?? '';

    const formEl = e.currentTarget;

    const errors = validate(newPassword, confirmPassword);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setStatus('submitting');

    try {
      const resp = await fetch('/api/commerce/account/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });

      if (resp.ok) {
        setStatus('success');
        formEl.reset();
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
    <form
      onSubmit={handleSubmit}
      className="flex w-full min-w-80 flex-col gap-6"
      noValidate
    >
      {formError && (
        <div
          role="alert"
          data-testid="change-password-error"
          className="rounded-lg border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-700"
        >
          {formError}
        </div>
      )}

      {status === 'success' && (
        <div
          role="status"
          data-testid="change-password-success"
          className="rounded-lg border border-success-200 bg-success-50 px-4 py-3 text-sm text-success-700"
        >
          Password updated successfully.
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="current-password" className={labelClasses}>
          Current password
          <span className="ml-0.5 text-brand-800" aria-hidden="true">
            *
          </span>
        </label>
        <input
          id="current-password"
          name="currentPassword"
          type="password"
          autoComplete="current-password"
          required
          className={inputClasses}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="new-password" className={labelClasses}>
          New password
          <span className="ml-0.5 text-brand-800" aria-hidden="true">
            *
          </span>
        </label>
        <input
          id="new-password"
          name="newPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={MIN_PASSWORD_LENGTH}
          className={inputClasses}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="confirm-password" className={labelClasses}>
          Confirm new password
          <span className="ml-0.5 text-brand-800" aria-hidden="true">
            *
          </span>
        </label>
        <input
          id="confirm-password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          aria-invalid={fieldErrors.confirmPassword ? 'true' : undefined}
          aria-describedby={
            fieldErrors.confirmPassword ? 'confirm-password-error' : undefined
          }
          className={`${inputClasses} ${
            fieldErrors.confirmPassword ? inputErrorClasses : ''
          }`}
        />
        {fieldErrors.confirmPassword && (
          <p
            id="confirm-password-error"
            data-testid="change-password-confirm-error"
            className="text-sm text-destructive"
          >
            {fieldErrors.confirmPassword}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting}
        data-testid="change-password-submit"
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-900 px-5 py-2.5 text-sm font-semibold text-off-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? (
          <>
            <span
              aria-hidden="true"
              className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            />
            Updating…
          </>
        ) : (
          'Update password'
        )}
      </button>
    </form>
  );
}
