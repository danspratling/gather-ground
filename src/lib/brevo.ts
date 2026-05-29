const BREVO_API_URL = 'https://api.brevo.com/v3';

interface AddBrevoContactInput {
  email: string;
  attributes?: Record<string, unknown>;
  listIds?: number[];
}

export async function addBrevoContact({
  email,
  attributes,
  listIds,
}: AddBrevoContactInput): Promise<void> {
  const apiKey = import.meta.env.BREVO_API_KEY;
  if (!apiKey) {
    throw new Error('BREVO_API_KEY not set — cannot add Brevo contact');
  }

  const resp = await fetch(`${BREVO_API_URL}/contacts`, {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'content-type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify({
      email,
      attributes,
      listIds,
      updateEnabled: true,
    }),
  });

  if (resp.ok) return;

  let body: { code?: string; message?: string } = {};
  try {
    body = (await resp.json()) as typeof body;
  } catch {
    // ignore non-JSON error body
  }
  if (body.code === 'duplicate_parameter') return;

  throw new Error(
    `Brevo contact create failed (${resp.status}): ${body.message ?? 'unknown error'}`
  );
}

export function getNewsletterListIds(): number[] | undefined {
  const raw = import.meta.env.BREVO_NEWSLETTER_LIST_ID;
  if (!raw) return undefined;
  const id = Number(raw);
  return Number.isFinite(id) ? [id] : undefined;
}

export default null;
