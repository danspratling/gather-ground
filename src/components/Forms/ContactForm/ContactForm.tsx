import { useState, useRef } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';
import type { ContactFormProps } from './ContactForm.types';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function ContactForm(_props: ContactFormProps) {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const turnstileToken = useRef<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;
    const marketingOptIn = formData.get('marketingOptIn') === 'on';

    try {
      const resp = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          message,
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
      <div className="rounded-lg bg-success-50 p-6 text-success-700">
        <p className="font-semibold">Message sent!</p>
        <p className="mt-1 text-sm">
          We'll get back to you as soon as possible.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="contact-name"
          className="text-sm font-semibold text-gray-900"
        >
          Name <span aria-hidden="true">*</span>
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          className="rounded-lg border border-gray-300 px-3.5 py-2.5 text-base text-gray-950 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
          placeholder="Your name"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="contact-email"
          className="text-sm font-semibold text-gray-900"
        >
          Email <span aria-hidden="true">*</span>
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          className="rounded-lg border border-gray-300 px-3.5 py-2.5 text-base text-gray-950 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
          placeholder="you@example.com"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="contact-message"
          className="text-sm font-semibold text-gray-900"
        >
          Message <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          className="resize-y rounded-lg border border-gray-300 px-3.5 py-2.5 text-base text-gray-950 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
          placeholder="How can we help?"
        />
      </div>
      {siteKey && (
        <Turnstile
          siteKey={siteKey}
          onSuccess={(token) => {
            turnstileToken.current = token;
          }}
        />
      )}
      <label className="flex items-start gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          name="marketingOptIn"
          className="mt-1 h-4 w-4 cursor-pointer rounded border-gray-300 text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
        />
        <span>
          I'd like to receive occasional emails from Gather Ground about farm
          news, recipes, and seasonal produce. You can unsubscribe at any time.
        </span>
      </label>
      {status === 'error' && (
        <p className="text-sm text-error-700">{errorMessage}</p>
      )}
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="cursor-pointer rounded-full bg-brand-700 px-6 py-2.5 text-base font-semibold text-brand-25 disabled:opacity-50"
      >
        {status === 'submitting' ? 'Sending…' : 'Send message'}
      </button>
    </form>
  );
}
