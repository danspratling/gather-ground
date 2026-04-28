export async function verifyTurnstile(token: string): Promise<boolean> {
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
  const data = (await resp.json()) as { success: boolean };
  return data.success === true;
}

export default null;
