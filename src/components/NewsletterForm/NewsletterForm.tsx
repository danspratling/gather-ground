import { useRef, useState } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';

import type { NewsletterFormProps } from '@/components/NewsletterForm/NewsletterForm.types';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function NewsletterForm({ heading }: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const turnstileToken = useRef<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const resp = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, turnstileToken: turnstileToken.current }),
      });
      const data = (await resp.json()) as { success: boolean };
      if (data.success) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const siteKey = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY as
    | string
    | undefined;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm font-semibold text-off-white">{heading}</p>
      {status === 'success' ? (
        <p data-testid="success-message" className="text-sm text-brand-200">
          Thanks for subscribing!
        </p>
      ) : (
        <>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 sm:flex-row"
            noValidate
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              aria-label="Email address"
              className="min-w-0 flex-1 rounded-lg border border-brand-100 bg-off-white px-3.5 py-2.5 text-base text-gray-950 shadow-xs placeholder:text-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
            />
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="cursor-pointer rounded-full bg-brand-700 px-4 py-2.5 text-base font-semibold whitespace-nowrap text-brand-25 disabled:opacity-50"
            >
              {status === 'submitting' ? 'Subscribing…' : 'Subscribe'}
            </button>
          </form>
          {siteKey && (
            <Turnstile
              siteKey={siteKey}
              options={{ appearance: 'interaction-only', size: 'flexible' }}
              onSuccess={(token) => {
                turnstileToken.current = token;
              }}
            />
          )}
          {status === 'error' && (
            <p className="text-sm text-error-700">
              Something went wrong. Please try again.
            </p>
          )}
        </>
      )}
    </div>
  );
}
