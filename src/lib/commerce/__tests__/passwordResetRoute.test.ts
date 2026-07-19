/**
 * Tests for POST /api/commerce/auth/password-reset/request and /confirm.
 */

import {
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
  afterAll,
  vi,
} from 'vitest';

const requestResetMock = vi.fn();
const confirmResetMock = vi.fn();
const sendPasswordResetEmailMock = vi.fn();

// Prevent Resend from being called in tests.
vi.mock('@/lib/commerce/passwordResetEmail', () => ({
  sendPasswordResetEmail: (...args: unknown[]) =>
    sendPasswordResetEmailMock(...args),
  default: null,
}));

vi.mock('@/lib/commerce', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/commerce')>();
  return {
    ...actual,
    commerce: {
      ...actual.commerce,
      requestPasswordReset: (...args: unknown[]) => requestResetMock(...args),
      confirmPasswordReset: (...args: unknown[]) => confirmResetMock(...args),
    },
  };
});

import { resetRateLimit } from '../rateLimit';
import { POST as requestPOST } from '@/pages/api/commerce/auth/password-reset/request';
import { POST as confirmPOST } from '@/pages/api/commerce/auth/password-reset/confirm';
import { makeJsonContext } from './authRouteTestUtils';

beforeAll(() => {
  vi.stubEnv('SESSION_SECRET', 'a'.repeat(48));
});

beforeEach(() => {
  requestResetMock.mockReset();
  confirmResetMock.mockReset();
  sendPasswordResetEmailMock.mockReset();
  sendPasswordResetEmailMock.mockResolvedValue(undefined);
  resetRateLimit();
});

afterAll(() => {
  vi.unstubAllEnvs();
});

const requestUrl =
  'https://example.com/api/commerce/auth/password-reset/request';
const confirmUrl =
  'https://example.com/api/commerce/auth/password-reset/confirm';

describe('POST /api/commerce/auth/password-reset/request', () => {
  it('returns 200 success for a known email', async () => {
    requestResetMock.mockResolvedValueOnce({ resetToken: 'tok-test' });

    const response = await requestPOST(
      makeJsonContext(requestUrl, { email: 'real@example.com' })
    );

    expect(response.status).toBe(200);
    const json = (await response.json()) as { success: boolean };
    expect(json.success).toBe(true);
    expect(requestResetMock).toHaveBeenCalledWith('real@example.com');
  });

  it('returns 200 even when the adapter throws (no account enumeration)', async () => {
    requestResetMock.mockRejectedValueOnce(new Error('no such customer'));

    const response = await requestPOST(
      makeJsonContext(requestUrl, { email: 'ghost@example.com' })
    );

    expect(response.status).toBe(200);
    const json = (await response.json()) as { success: boolean };
    expect(json.success).toBe(true);
  });

  it('returns 400 for an invalid email', async () => {
    const response = await requestPOST(
      makeJsonContext(requestUrl, { email: 'not-an-email' })
    );
    expect(response.status).toBe(400);
    expect(requestResetMock).not.toHaveBeenCalled();
  });

  it('returns 429 after the rate limit is exceeded', async () => {
    requestResetMock.mockResolvedValue({ resetToken: 'tok-test' });

    for (let i = 0; i < 3; i++) {
      const r = await requestPOST(
        makeJsonContext(requestUrl, { email: 'a@b.com' })
      );
      expect(r.status).toBe(200);
    }
    const blocked = await requestPOST(
      makeJsonContext(requestUrl, { email: 'a@b.com' })
    );
    expect(blocked.status).toBe(429);
    expect(blocked.headers.get('Retry-After')).toBeTruthy();
  });
});

describe('POST /api/commerce/auth/password-reset/confirm', () => {
  it('returns 200 success on a valid token + password', async () => {
    confirmResetMock.mockResolvedValueOnce(undefined);

    const response = await confirmPOST(
      makeJsonContext(confirmUrl, {
        token: 'reset-token-xyz',
        password: 'longenough1',
      })
    );

    expect(response.status).toBe(200);
    expect(confirmResetMock).toHaveBeenCalledWith(
      'reset-token-xyz',
      'longenough1'
    );
  });

  it('returns 400 when the token is missing', async () => {
    const response = await confirmPOST(
      makeJsonContext(confirmUrl, { password: 'longenough1' })
    );
    expect(response.status).toBe(400);
    expect(confirmResetMock).not.toHaveBeenCalled();
  });

  it('returns 400 when the password is too short', async () => {
    const response = await confirmPOST(
      makeJsonContext(confirmUrl, {
        token: 'reset-token-xyz',
        password: 'short',
      })
    );
    expect(response.status).toBe(400);
    expect(confirmResetMock).not.toHaveBeenCalled();
  });

  it('returns 400 generic error when the adapter rejects (expired / invalid token)', async () => {
    confirmResetMock.mockRejectedValueOnce(new Error('token expired'));

    const response = await confirmPOST(
      makeJsonContext(confirmUrl, {
        token: 'expired-token',
        password: 'longenough1',
      })
    );

    expect(response.status).toBe(400);
    const json = (await response.json()) as { error: string };
    expect(json.error).toBe('Reset link is invalid or has expired');
  });
});
