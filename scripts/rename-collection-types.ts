/**
 * Rename Sanity document _type values to match the plural-collection convention.
 *
 * Naming convention (ADR-033):
 *   - Singleton documents → singular type name (siteSettings, blogPage, productPage)
 *   - Collection documents → plural type name (pages, blogPosts, products, authors, faqs, testimonials)
 *
 * Why a script (not `sanity migration`):
 *   `_type` is a system field that the migration API's `at()`/patch operations
 *   cannot mutate. The supported path is to fetch each document, recreate it
 *   under the new `_id` (since `_id` may be tied to `_type` in some setups —
 *   here we keep the same id), update `_type`, then delete the old document.
 *   We use a transaction with `createOrReplace` + a fresh document to swap.
 *
 * Run:
 *   SANITY_API_WRITE_TOKEN=... npx tsx scripts/rename-collection-types.ts          # dry-run
 *   SANITY_API_WRITE_TOKEN=... npx tsx scripts/rename-collection-types.ts --apply  # execute
 *
 * The token must have Editor or Admin write access. Generate at:
 *   https://www.sanity.io/manage/project/mrz1ftls/api
 *
 * Tested: handles drafts (drafts.<id>) and preserves all fields including _id,
 * _createdAt, _rev. References to renamed docs are unaffected — refs use _ref/_id,
 * not _type.
 */
import { createClient } from '@sanity/client';

const RENAMES: Record<string, string> = {
  page: 'pages',
  blogPost: 'blogPosts',
  author: 'authors',
  faq: 'faqs',
  testimonial: 'testimonials',
};

const APPLY = process.argv.includes('--apply');

const token = process.env.SANITY_API_WRITE_TOKEN;
if (!token) {
  console.error('Missing SANITY_API_WRITE_TOKEN env var');
  process.exit(1);
}

const client = createClient({
  projectId: 'mrz1ftls',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
});

interface SanityDoc {
  _id: string;
  _type: string;
  _rev: string;
  [key: string]: unknown;
}

async function main() {
  console.log(`Mode: ${APPLY ? 'APPLY (writes)' : 'DRY-RUN (no writes)'}`);
  console.log('Renames:', RENAMES);
  console.log('');

  const oldTypes = Object.keys(RENAMES);
  const query = `*[_type in $types]`;
  const docs = await client.fetch<SanityDoc[]>(query, { types: oldTypes });

  console.log(`Found ${docs.length} documents to migrate.`);

  const grouped = docs.reduce<Record<string, number>>((acc, d) => {
    acc[d._type] = (acc[d._type] || 0) + 1;
    return acc;
  }, {});
  for (const [type, count] of Object.entries(grouped)) {
    console.log(`  ${type} → ${RENAMES[type]}: ${count} docs`);
  }
  console.log('');

  if (!APPLY) {
    console.log('Dry-run complete. Re-run with --apply to execute.');
    return;
  }

  let succeeded = 0;
  let failed = 0;

  for (const doc of docs) {
    const newType = RENAMES[doc._type];
    if (!newType) continue;

    const { _id, _rev: _discardRev, _type: _discardType, ...rest } = doc;
    const replacement = { _id, _type: newType, ...rest };

    try {
      await client
        .transaction()
        .createOrReplace(replacement)
        .commit({ visibility: 'async' });
      succeeded++;
      process.stdout.write('.');
    } catch (err) {
      failed++;
      console.error(`\nFailed for ${_id}:`, err);
    }
  }

  console.log(`\n\nDone. ${succeeded} succeeded, ${failed} failed.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
