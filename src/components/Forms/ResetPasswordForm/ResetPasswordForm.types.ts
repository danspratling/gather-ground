export interface ResetPasswordFormProps {
  /**
   * Reset token from the email link. Server-rendered pages pass this in
   * from `Astro.url.searchParams`; React-only environments (Storybook) can
   * pass it directly as a prop. When omitted, the component reads
   * `?token=` from the current URL on mount.
   */
  token?: string;
  /**
   * Where to send the user after a successful reset. Defaults to
   * `/account/login` so they can immediately sign in with the new password.
   */
  loginHref?: string;
}

export default null;
