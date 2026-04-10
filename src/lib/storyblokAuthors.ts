/**
 * Fetch author information for a set of stories from the Storyblok Management
 * API. The CDN API does not expose author data — only the Management API does
 * via `last_author` on each story object.
 *
 * Returns a map keyed by story ID → { name, avatarUrl }.
 *
 * Uses STORYBLOK_PERSONAL_TOKEN (server-only, never sent to the browser).
 */

const MAPI_BASE = 'https://mapi.storyblok.com/v1';
const AVATAR_BASE = 'https://a.storyblok.com/';

export interface StoryAuthor {
  name: string;
  avatarUrl: string;
}

export async function getStoryAuthors(
  spaceId: string,
  storyIds: number[]
): Promise<Map<number, StoryAuthor>> {
  const token = import.meta.env.STORYBLOK_PERSONAL_TOKEN;
  if (!token || storyIds.length === 0) return new Map();

  // Fetch all stories in one request using the `by_ids` filter. Storyblok
  // allows comma-separated IDs. The Management API returns `last_author` for
  // each story which includes `friendly_name` and `avatar`.
  const ids = storyIds.join(',');
  const res = await fetch(
    `${MAPI_BASE}/spaces/${spaceId}/stories?by_ids=${ids}&per_page=100`,
    { headers: { Authorization: token } }
  );

  if (!res.ok) return new Map();

  const { stories } = (await res.json()) as {
    stories: Array<{
      id: number;
      last_author?: {
        friendly_name?: string;
        avatar?: string;
      };
    }>;
  };

  const map = new Map<number, StoryAuthor>();
  for (const story of stories) {
    const a = story.last_author;
    map.set(story.id, {
      name: a?.friendly_name ?? '',
      avatarUrl: a?.avatar ? `${AVATAR_BASE}${a.avatar}` : '',
    });
  }
  return map;
}
