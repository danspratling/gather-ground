import { useState, type FormEvent } from 'react';
import type { ProfileFormProps } from './ProfileForm.types';

type Status = 'idle' | 'submitting' | 'success' | 'error';

const inputClasses =
  'w-full rounded-lg border border-brand-100 bg-off-white px-3.5 py-2.5 text-sm text-brand-900 shadow-xs transition-colors placeholder:text-brand-500 focus:border-brand-700 focus:outline-none focus:ring-1 focus:ring-brand-700';

const labelClasses = 'text-sm font-medium text-brand-700';

export default function ProfileForm({ initialValues }: ProfileFormProps) {
  const [status, setStatus] = useState<Status>('idle');
  const [formError, setFormError] = useState<string>('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === 'submitting') return;
    setFormError('');

    const formData = new FormData(e.currentTarget);
    const firstName = (
      (formData.get('firstName') as string | null) ?? ''
    ).trim();
    const lastName = ((formData.get('lastName') as string | null) ?? '').trim();
    const email = ((formData.get('email') as string | null) ?? '').trim();

    setStatus('submitting');

    try {
      const resp = await fetch('/api/commerce/account/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email }),
      });

      if (resp.ok) {
        setStatus('success');
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
    <form onSubmit={handleSubmit} className="flex w-full min-w-80 flex-col gap-6" noValidate>
      {formError && (
        <div
          role="alert"
          data-testid="profile-form-error"
          className="rounded-lg border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-700"
        >
          {formError}
        </div>
      )}

      {status === 'success' && (
        <div
          role="status"
          data-testid="profile-form-success"
          className="rounded-lg border border-success-200 bg-success-50 px-4 py-3 text-sm text-success-700"
        >
          Profile updated successfully.
        </div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex flex-1 flex-col gap-1.5">
          <label htmlFor="profile-first-name" className={labelClasses}>
            First name
            <span className="ml-0.5 text-brand-800" aria-hidden="true">
              *
            </span>
          </label>
          <input
            id="profile-first-name"
            name="firstName"
            type="text"
            autoComplete="given-name"
            required
            defaultValue={initialValues.firstName}
            className={inputClasses}
          />
        </div>

        <div className="flex flex-1 flex-col gap-1.5">
          <label htmlFor="profile-last-name" className={labelClasses}>
            Last name
            <span className="ml-0.5 text-brand-800" aria-hidden="true">
              *
            </span>
          </label>
          <input
            id="profile-last-name"
            name="lastName"
            type="text"
            autoComplete="family-name"
            required
            defaultValue={initialValues.lastName}
            className={inputClasses}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="profile-email" className={labelClasses}>
          Email
          <span className="ml-0.5 text-brand-800" aria-hidden="true">
            *
          </span>
        </label>
        <input
          id="profile-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          defaultValue={initialValues.email}
          className={inputClasses}
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        data-testid="profile-form-submit"
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-900 px-5 py-2.5 text-sm font-semibold text-off-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? (
          <>
            <span
              aria-hidden="true"
              className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            />
            Saving…
          </>
        ) : (
          'Save changes'
        )}
      </button>
    </form>
  );
}
