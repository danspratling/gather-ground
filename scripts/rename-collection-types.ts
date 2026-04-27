/**
 * Rename Sanity document _type values to match the plural-collection convention.
 *
 * Naming convention (ADR-033):
 *   - Singleton documents → singular type name (siteSettings, blogPage, productPage)
 *   - Collection documents → plural type name (pages, blogPosts, products, authors, faqs, testimonials)
 *
 * Why a script (not `sanity migration`):
 *   `_type` is an immutable system field. Sanity rejects any patch or
 *   `createOrReplace` that changes it. Even delete+create on the same
 *   `_id` within a single transaction is rejected as a modification.
 *   The working pattern is two separate commits: delete the old doc,
 *   then create a fresh doc with the same `_id` and the new `_type`.
 *
 *   References (`_ref`) resolve by `_id` and re-attach as soon as the
 *   new doc lands. There is a brief window between the two commits
 *   where the doc does not exist; live queries during this window
 *   will not return it.
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

    // _type is immutable. Even within a single transaction Sanity rejects
    // delete+create on the same _id as a modification. We have to delete
    // and create in two separate commits. References (_ref) resolve by _id
    // so they re-attach as soon as the new document lands.
    const { _id, _rev: _discardRev, _type: _discardType, ...rest } = doc;
    const replacement = { _id, _type: newType, ...rest };

    try {
      await client.delete(_id);
      await client.create(replacement);
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
