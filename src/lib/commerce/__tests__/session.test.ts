/**
 * Tests for the commerce session cookie utilities.
 *
 * Uses a minimal mock of Astro's AstroCookies API (get / set / delete) to
 * verify that getSession / setSession / clearSession round-trip data correctly
 * and that bad / missing cookies return null instead of throwing.
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
import type { AstroCookies } from 'astro';
import {
  SESSION_COOKIE_NAME,
  getSession,
  setSession,
  clearSession,
  type SessionData,
} from '../session';

interface StoredCookie {
  value: string;
  options?: Record<string, unknown>;
}

function createMockCookies(): {
  cookies: AstroCookies;
  store: Map<string, StoredCookie>;
} {
  const store = new Map<string, StoredCookie>();

  const cookies = {
    get(name: string) {
      const entry = store.get(name);
      return entry ? { value: entry.value } : undefined;
    },
    set(name: string, value: string, options?: Record<string, unknown>) {
      store.set(name, { value, options });
    },
    delete(name: string) {
      store.delete(name);
    },
  } as unknown as AstroCookies;

  return { cookies, store };
}

const validSecret = 'a'.repeat(48);

const validSession: SessionData = {
  customerId: 'cust-123',
  accessToken: 'cl-access-token-xyz',
  refreshToken: 'cl-refresh-token-xyz',
  expiresAt: Math.floor(Date.now() / 1000) + 3600,
};

beforeAll(() => {
  vi.stubEnv('SESSION_SECRET', validSecret);
});

beforeEach(() => {
  // ensure each test starts from a clean stubbed env
  vi.stubEnv('SESSION_SECRET', validSecret);
});

afterAll(() => {
  vi.unstubAllEnvs();
});

describe('getSession', () => {
  it('returns null when the cookie is absent', async () => {
    const { cookies } = createMockCookies();
    await expect(getSession(cookies)).resolves.toBeNull();
  });

  it('returns null for an unparseable cookie value', async () => {
    const { cookies, store } = createMockCookies();
    store.set(SESSION_COOKIE_NAME, { value: 'definitely-not-a-sealed-blob' });
    await expect(getSession(cookies)).resolves.toBeNull();
  });
});

describe('setSession + getSession round-trip', () => {
  it('writes a session and reads back identical data', async () => {
    const { cookies } = createMockCookies();
    await setSession(cookies, validSession);

    const round = await getSession(cookies);
    expect(round).toEqual(validSession);
  });

  it('applies HttpOnly + SameSite=Lax + Path=/ + Max-Age cookie attributes', async () => {
    const { cookies, store } = createMockCookies();
    await setSession(cookies, validSession);

    const stored = store.get(SESSION_COOKIE_NAME);
    expect(stored?.options).toMatchObject({
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });
  });

  it('rejects a session sealed with a different secret', async () => {
    const { cookies } = createMockCookies();
    await setSession(cookies, validSession);

    vi.stubEnv('SESSION_SECRET', 'b'.repeat(48));
    await expect(getSession(cookies)).resolves.toBeNull();
  });
});

describe('clearSession', () => {
  it('removes the cookie from the store', async () => {
    const { cookies, store } = createMockCookies();
    await setSession(cookies, validSession);
    expect(store.has(SESSION_COOKIE_NAME)).toBe(true);

    clearSession(cookies);
    expect(store.has(SESSION_COOKIE_NAME)).toBe(false);
  });
});

describe('SESSION_SECRET validation', () => {
  it('throws when SESSION_SECRET is missing', async () => {
    vi.stubEnv('SESSION_SECRET', '');
    const { cookies } = createMockCookies();
    await expect(setSession(cookies, validSession)).rejects.toThrow(
      /SESSION_SECRET/
    );
  });

  it('throws when SESSION_SECRET is shorter than 32 characters', async () => {
    vi.stubEnv('SESSION_SECRET', 'too-short');
    const { cookies } = createMockCookies();
    await expect(setSession(cookies, validSession)).rejects.toThrow(
      /32 characters/
    );
  });
});
