import { useState, useEffect } from 'react';
import type { CookieBannerProps } from './CookieBanner.types';

export default function CookieBanner(_props: CookieBannerProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    window.dispatchEvent(new Event('cookie-consent-accepted'));
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-50 flex flex-wrap items-center justify-between gap-4 bg-gray-950 px-6 py-4 md:px-8"
    >
      <p className="text-sm text-brand-100">
        We use cookies to improve your experience on our site.
      </p>
      <div className="flex gap-3">
        <button
          onClick={decline}
          className="cursor-pointer rounded-full border border-brand-500 px-4 py-2 text-sm font-semibold text-brand-100 hover:border-brand-300 hover:text-off-white"
        >
          Decline
        </button>
        <button
          onClick={accept}
          className="cursor-pointer rounded-full bg-brand-700 px-4 py-2 text-sm font-semibold text-brand-25 hover:bg-brand-600"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
