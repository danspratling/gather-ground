export interface RegisterFormProps {
  /**
   * Where to send the user after a successful registration. Same rules as
   * `LoginForm.redirectTo`: same-origin absolute paths only, else falls back
   * to `?next=` (also same-origin), else `/account`.
   */
  redirectTo?: string;
  /**
   * Where the "privacy policy" link in the marketing opt-in copy points to.
   */
  privacyHref?: string;
  /**
   * Where the "already have an account? Sign in" link goes.
   */
  loginHref?: string;
}

export default null;
