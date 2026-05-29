import { useState, useRef } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';
import type { ContactFormProps } from './ContactForm.types';

type Status = 'idle' | 'submitting' | 'success' | 'error';

const inputClasses =
  'w-full rounded-lg border border-brand-100 bg-off-white px-3.5 py-2.5 text-sm text-brand-900 shadow-xs transition-colors placeholder:text-brand-500 focus:border-brand-700 focus:outline-none focus:ring-1 focus:ring-brand-700';

const labelClasses = 'text-sm font-medium text-brand-700';

export default function ContactForm({
  privacyHref = '/privacy',
}: ContactFormProps) {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const turnstileToken = useRef<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    const formData = new FormData(e.currentTarget);
    const firstName =
      (formData.get('firstName') as string | null)?.trim() ?? '';
    const lastName = (formData.get('lastName') as string | null)?.trim() ?? '';
    const email = (formData.get('email') as string | null)?.trim() ?? '';
    const phone = (formData.get('phone') as string | null)?.trim() || undefined;
    const message = (formData.get('message') as string | null)?.trim() ?? '';
    const consent = formData.get('consent') === 'on';
    const marketingOptIn = formData.get('marketingOptIn') === 'on';

    try {
      const resp = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          message,
          consent,
          marketingOptIn,
          turnstileToken: turnstileToken.current,
        }),
      });
      const data = (await resp.json()) as {
        success: boolean;
        error?: string;
      };
      if (data.success) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMessage(
          data.error ?? 'Something went wrong. Please try again.'
        );
      }
    } catch {
      setStatus('error');
      setErrorMessage('Network error. Please try again.');
    }
  };

  const siteKey = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY as
    | string
    | undefined;

  if (status === 'success') {
    return (
      <div className="rounded-lg border border-brand-100 bg-off-white p-6 text-brand-700">
        <p className="text-lg font-semibold text-brand-900">Message sent!</p>
        <p className="mt-1 text-sm">
          Thanks for getting in touch — we'll get back to you as soon as we can.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="firstName" className={labelClasses}>
            First name
            <span className="ml-0.5 text-brand-800" aria-hidden="true">
              *
            </span>
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            required
            placeholder="Jane"
            className={inputClasses}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="lastName" className={labelClasses}>
            Last name
            <span className="ml-0.5 text-brand-800" aria-hidden="true">
              *
            </span>
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            required
            placeholder="Smith"
            className={inputClasses}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className={labelClasses}>
          Email
          <span className="ml-0.5 text-brand-800" aria-hidden="true">
            *
          </span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="jane@example.com"
          className={inputClasses}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="phone" className={labelClasses}>
          Phone number
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          placeholder="07700 900123"
          className={inputClasses}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className={labelClasses}>
          Message
          <span className="ml-0.5 text-brand-800" aria-hidden="true">
            *
          </span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Leave us a message..."
          className={inputClasses}
        />
      </div>

      <div className="flex items-start gap-3">
        <input
          id="consent"
          name="consent"
          type="checkbox"
          required
          aria-describedby="consent-hint"
          className="mt-0.5 size-4 shrink-0 cursor-pointer rounded border-brand-300 text-brand-600"
        />
        <label htmlFor="consent" className="text-sm text-brand-600">
          I agree to the{' '}
          <a
            href={privacyHref}
            className="font-medium underline underline-offset-2 hover:no-underline"
          >
            privacy policy
          </a>
        </label>
      </div>
      <p id="consent-hint" className="sr-only">
        You must agree to the privacy policy before submitting.
      </p>

      <label className="flex items-start gap-3">
        <input
          type="checkbox"
          name="marketingOptIn"
          className="mt-0.5 size-4 shrink-0 cursor-pointer rounded border-brand-300 text-brand-600"
        />
        <span className="text-sm text-brand-600">
          I'd like to receive occasional emails from Gather Ground about farm
          news, recipes, and seasonal produce. You can unsubscribe at any time.
        </span>
      </label>

      {siteKey && (
        <Turnstile
          siteKey={siteKey}
          options={{ appearance: 'interaction-only' }}
          onSuccess={(token) => {
            turnstileToken.current = token;
          }}
        />
      )}

      {status === 'error' && (
        <p className="text-sm text-destructive">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="inline-flex w-full cursor-pointer items-center justify-center rounded-full border border-brand-600 bg-brand-700 px-4.5 py-3 text-base font-semibold whitespace-nowrap text-brand-25 transition-colors hover:bg-brand-600 disabled:pointer-events-none disabled:opacity-50"
      >
        {status === 'submitting' ? 'Sending…' : 'Send message'}
      </button>
    </form>
  );
}
