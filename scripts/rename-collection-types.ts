/**
 * Rename Sanity document _type values to match the plural-collection convention.
 *
 * Naming convention (ADR-033):
 *   - Singleton documents → singular type name (siteSettings, blogPage, productPage)
 *   - Collection documents → plural type name (pages, blogPosts, products, authors, faqs, testimonials)
 *
 * Why this is non-trivial:
 *   `_type` is an immutable system field. Sanity rejects any patch or
 *   `createOrReplace` that changes it, and rejects delete+create on the
 *   same `_id` within one transaction as a modification. The working
 *   pattern is two separate commits per document:
 *     1. delete the old document
 *     2. create a fresh document with the same `_id` and the new `_type`
 *
 *   Strong references block deletion. Before deleting, every incoming
 *   strong reference to the doc must be temporarily weakened (`_weak: true`).
 *   After re-creating the doc, the references are strengthened again
 *   (remove `_weak`). Since the new doc reuses the original `_id`, the
 *   reference targets are unchanged.
 *
 * Run:
 *   SANITY_API_WRITE_TOKEN=... npm run migrate:rename-types          # dry-run
 *   SANITY_API_WRITE_TOKEN=... npm run migrate:rename-types -- --apply
 *
 * The token must have Editor or Admin write access. Generate at:
 *   https://www.sanity.io/manage/project/mrz1ftls/api
 *
 * Idempotent: each run only acts on documents that still have an old `_type`.
 * Safe to re-run after a partial failure.
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

interface RefPath {
  docId: string;
  /** Sanity-patch path expression, e.g. "author" or `body[_key=="abc"].image` */
  path: string;
}

/**
 * Walk a document and collect every patch path that contains a reference to `targetId`.
 */
function findReferencePaths(doc: SanityDoc, targetId: string): RefPath[] {
  const paths: RefPath[] = [];

  function walk(value: unknown, currentPath: string): void {
    if (!value || typeof value !== 'object') return;

    if (Array.isArray(value)) {
      value.forEach((item, i) => {
        const isObject = item && typeof item === 'object';
        const itemKey =
          isObject &&
          '_key' in item &&
          typeof (item as Record<string, unknown>)._key === 'string'
            ? `[_key=="${(item as Record<string, unknown>)._key as string}"]`
            : `[${i}]`;
        walk(item, `${currentPath}${itemKey}`);
      });
      return;
    }

    const obj = value as Record<string, unknown>;
    if (obj._ref === targetId && obj._type === 'reference') {
      paths.push({ docId: doc._id, path: currentPath });
      return;
    }

    for (const [k, v] of Object.entries(obj)) {
      if (k.startsWith('_')) continue;
      const next = currentPath === '' ? k : `${currentPath}.${k}`;
      walk(v, next);
    }
  }

  walk(doc, '');
  return paths;
}

async function findIncomingReferences(targetId: string): Promise<RefPath[]> {
  const referencingDocs = await client.fetch<SanityDoc[]>(
    `*[references($id)]`,
    { id: targetId }
  );
  return referencingDocs.flatMap((doc) => findReferencePaths(doc, targetId));
}

async function setRefWeakness(refs: RefPath[], weak: boolean): Promise<void> {
  // Group paths by document to batch patches per doc.
  const byDoc = refs.reduce<Record<string, string[]>>((acc, r) => {
    (acc[r.docId] ??= []).push(r.path);
    return acc;
  }, {});

  for (const [docId, paths] of Object.entries(byDoc)) {
    const patch = client.patch(docId);
    for (const path of paths) {
      if (weak) {
        patch.set({ [`${path}._weak`]: true });
      } else {
        patch.unset([`${path}._weak`]);
      }
    }
    await patch.commit({ visibility: 'async' });
  }
}

async function migrateDoc(doc: SanityDoc): Promise<void> {
  const newType = RENAMES[doc._type];
  if (!newType) return;

  const incoming = await findIncomingReferences(doc._id);

  if (incoming.length > 0) {
    await setRefWeakness(incoming, true);
  }

  try {
    const { _id, _rev: _discardRev, _type: _discardType, ...rest } = doc;
    await client.delete(_id);
    await client.create({ _id, _type: newType, ...rest });
  } finally {
    if (incoming.length > 0) {
      // Re-strengthen — if create failed this leaves refs weak, which is
      // recoverable on a re-run.
      await setRefWeakness(incoming, false);
    }
  }
}

async function main() {
  console.log(`Mode: ${APPLY ? 'APPLY (writes)' : 'DRY-RUN (no writes)'}`);
  console.log('Renames:', RENAMES);
  console.log('');

  const oldTypes = Object.keys(RENAMES);
  const docs = await client.fetch<SanityDoc[]>(`*[_type in $types]`, {
    types: oldTypes,
  });

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
    try {
      await migrateDoc(doc);
      succeeded++;
      process.stdout.write('.');
    } catch (err) {
      failed++;
      console.error(`\nFailed for ${doc._id} (${doc._type}):`, err);
    }
  }

  console.log(`\n\nDone. ${succeeded} succeeded, ${failed} failed.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
