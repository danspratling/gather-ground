import { type QueryParams } from 'sanity';
import { sanityClient } from 'sanity:client';

const visualEditingEnabled =
  import.meta.env.PUBLIC_SANITY_VISUAL_EDITING_ENABLED === 'true' ||
  import.meta.env.PROD === false;
const token = import.meta.env.SANITY_API_READ_TOKEN;

/**
 * Fetch data from Sanity with Visual Editing support.
 *
 * In Visual Editing mode: uses draft perspective + stega encoding + token auth.
 * In production: uses published perspective, no stega, CDN.
 */
export async function loadQuery<T>({
  query,
  params,
}: {
  query: string;
  params?: QueryParams;
}): Promise<{ data: T }> {
  if (visualEditingEnabled && !token) {
    throw new Error(
      'The SANITY_API_READ_TOKEN environment variable is required during Visual Editing.'
    );
  }

  const perspective = visualEditingEnabled ? 'drafts' : 'published';

  const { result } = await sanityClient.fetch<T>(query, params ?? {}, {
    filterResponse: false,
    perspective,
    resultSourceMap: visualEditingEnabled ? 'withKeyArraySelector' : false,
    stega: visualEditingEnabled
      ? { enabled: true, studioUrl: '/studio' }
      : false,
    ...(visualEditingEnabled ? { token } : {}),
    useCdn: !visualEditingEnabled,
  });

  return { data: result };
}

export default null;
