import type { APIRoute } from 'astro';

import { hydrateSession } from '@/lib/commerce/sessionHydrate';
import {
  isNonEmptyString,
  isValidPassword,
  jsonResponse,
  parseJsonBody,
} from '@/lib/commerce/apiHelpers';
import { changePassword } from '@/lib/commerce/commercelayer/customer';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  const { session, customer, sessionExpired } = await hydrateSession(cookies);

  if (!customer || !session) {
    return jsonResponse(401, {
      success: false,
      error: sessionExpired ? 'Session expired' : 'Not authenticated',
    });
  }

  const body = await parseJsonBody(request);
  if (!body) {
    return jsonResponse(400, { success: false, error: 'Invalid request body' });
  }

  const { currentPassword, newPassword, confirmPassword } = body;

  if (!isNonEmptyString(currentPassword)) {
    return jsonResponse(400, {
      success: false,
      error: 'Current password is required',
    });
  }
  if (!isValidPassword(newPassword)) {
    return jsonResponse(400, {
      success: false,
      error: 'New password must be at least 8 characters',
    });
  }
  if (newPassword !== confirmPassword) {
    return jsonResponse(400, {
      success: false,
      error: 'Passwords do not match',
    });
  }

  try {
    await changePassword(session.accessToken, currentPassword, newPassword);
  } catch (err) {
    if (err instanceof Error && err.message === 'INVALID_CURRENT_PASSWORD') {
      return jsonResponse(422, {
        success: false,
        error: 'Current password is incorrect',
      });
    }
    console.error('Password change failed:', err);
    return jsonResponse(500, {
      success: false,
      error: 'Failed to change password',
    });
  }

  return jsonResponse(200, { success: true });
};
