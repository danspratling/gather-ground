export async function verifyTurnstile(token: string): Promise<boolean> {
  try {
    const resp = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        body: new URLSearchParams({
          secret: import.meta.env.TURNSTILE_SECRET_KEY ?? '',
          response: token,
        }),
      }
    );
    if (!resp.ok) return false;
    const data = (await resp.json()) as { success: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

export default null;
