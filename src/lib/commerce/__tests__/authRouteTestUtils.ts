/**
 * Shared mocks for `/api/commerce/auth/*` route tests.
 * NOT a test file — `__tests__` directory but no `.test` suffix.
 */

import type { AstroCookies, APIContext } from 'astro';
import { vi } from 'vitest';

export interface StoredCookie {
  value: string;
  options?: Record<string, unknown>;
}

export function createMockCookies(): {
  cookies: AstroCookies;
  store: Map<string, StoredCookie>;
  deleteSpy: ReturnType<typeof vi.fn>;
} {
  const store = new Map<string, StoredCookie>();
  const deleteSpy = vi.fn(
    (name: string, _options?: Record<string, unknown>) => {
      store.delete(name);
    }
  );

  const cookies = {
    get(name: string) {
      const entry = store.get(name);
      return entry ? { value: entry.value } : undefined;
    },
    set(name: string, value: string, options?: Record<string, unknown>) {
      store.set(name, { value, options });
    },
    delete: deleteSpy,
  } as unknown as AstroCookies;

  return { cookies, store, deleteSpy };
}

export function makeJsonContext(
  url: string,
  body: unknown,
  headers: HeadersInit = {}
): APIContext & { _store: Map<string, StoredCookie> } {
  const request = new Request(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
  const { cookies, store } = createMockCookies();
  return {
    request,
    cookies,
    clientAddress: '203.0.113.1',
    _store: store,
  } as unknown as APIContext & { _store: Map<string, StoredCookie> };
}

export function makeRawContext(
  request: Request
): APIContext & { _store: Map<string, StoredCookie> } {
  const { cookies, store } = createMockCookies();
  return {
    request,
    cookies,
    clientAddress: '203.0.113.1',
    _store: store,
  } as unknown as APIContext & { _store: Map<string, StoredCookie> };
}
