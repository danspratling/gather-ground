export interface ForgotPasswordFormProps {
  /**
   * Where the "Back to sign in" link goes. Defaults to `/account/login`.
   * Kept configurable so the same component can be embedded in other flows
   * later (e.g. a marketing page) without hard-coding the return path.
   */
  loginHref?: string;
}

export default null;
