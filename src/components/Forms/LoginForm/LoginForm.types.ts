export interface LoginFormProps {
  /**
   * Where to send the user after a successful login. If omitted, the form
   * reads `?next=` from the current URL, falling back to `/account`. Must be a
   * same-origin absolute path (starting with `/`) — off-site URLs are ignored.
   */
  redirectTo?: string;
}

export default null;
