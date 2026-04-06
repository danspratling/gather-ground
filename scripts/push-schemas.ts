/**
 * push-schemas.ts
 *
 * Converts our TypeScript Storyblok component schema definitions into the JSON
 * format expected by `storyblok components push`, then writes the output to
 * .storyblok/components/<spaceId>/components.json.
 *
 * Run via:
 *   npm run sync-schemas
 *
 * Which executes:
 *   npx tsx scripts/push-schemas.ts && storyblok components push --space $STORYBLOK_SPACE_ID --from $STORYBLOK_SPACE_ID
 *
 * Requires STORYBLOK_SPACE_ID in .env (already present).
 * Requires STORYBLOK_PERSONAL_TOKEN in .env for `storyblok components push`
 * (the preview token is not sufficient for Management API writes).
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { execSync } from 'node:child_process';
import path from 'node:path';
import { loadEnv } from 'vite';

// --- Schema imports ---

import {
  accordionSchema,
  accordionItemSchema,
} from '../src/storyblok/accordion.ts';
import { badgeSchema } from '../src/storyblok/badge.ts';
import { blogCardSchema } from '../src/storyblok/blogCard.ts';
import { blogSectionSchema } from '../src/storyblok/blogSection.ts';
import { bodySchema } from '../src/storyblok/body.ts';
import { buttonSchema } from '../src/storyblok/button.ts';
import { callToActionSchema } from '../src/storyblok/callToAction.ts';
import { faqSchema } from '../src/storyblok/faq.ts';
import { faqSectionSchema } from '../src/storyblok/faqSection.ts';
import {
  footerSchema,
  footerSocialLinkSchema,
  footerLinkGroupSchema,
  footerLinkSchema,
  footerLegalLinkSchema,
} from '../src/storyblok/footer.ts';
import { headerSchema, headerNavLinkSchema } from '../src/storyblok/header.ts';
import { headingSchema } from '../src/storyblok/heading.ts';
import { pageSchema } from '../src/storyblok/homepage.ts';
import { inputSchema } from '../src/storyblok/input.ts';
import { labelSchema } from '../src/storyblok/label.ts';
import { navMenuSchema, navMenuItemSchema } from '../src/storyblok/navMenu.ts';
import { productCardSchema } from '../src/storyblok/productCard.ts';
import { productsSectionSchema } from '../src/storyblok/productsSection.ts';
import { testimonialSchema } from '../src/storyblok/testimonial.ts';
import { testimonialCardSchema } from '../src/storyblok/testimonialCard.ts';
import { testimonialsSectionSchema } from '../src/storyblok/testimonialsSection.ts';
import { heroSectionSchema } from '../src/storyblok/heroSection.ts';

// --- Collect all schemas ---

const schemas = [
  // Atoms
  accordionSchema,
  accordionItemSchema,
  badgeSchema,
  bodySchema,
  buttonSchema,
  headingSchema,
  inputSchema,
  labelSchema,
  // Cards
  blogCardSchema,
  productCardSchema,
  testimonialCardSchema,
  // Content types
  testimonialSchema,
  faqSchema,
  // Sections
  heroSectionSchema,
  productsSectionSchema,
  testimonialsSectionSchema,
  faqSectionSchema,
  blogSectionSchema,
  callToActionSchema,
  // Navigation
  headerSchema,
  headerNavLinkSchema,
  footerSchema,
  footerSocialLinkSchema,
  footerLinkGroupSchema,
  footerLinkSchema,
  footerLegalLinkSchema,
  navMenuSchema,
  navMenuItemSchema,
  // Page templates
  pageSchema,
];

// --- Write to .storyblok/components/<spaceId>/components.json ---

const env = loadEnv('', process.cwd(), 'STORYBLOK');
const spaceId = env.STORYBLOK_SPACE_ID;

if (!spaceId) {
  console.error('Error: STORYBLOK_SPACE_ID is not set in .env');
  process.exit(1);
}

const outputDir = path.resolve(
  process.cwd(),
  '.storyblok',
  'components',
  spaceId
);
const outputPath = path.join(outputDir, 'components.json');

await mkdir(outputDir, { recursive: true });
await writeFile(outputPath, JSON.stringify(schemas, null, 2), 'utf-8');
console.log(`✓ Wrote ${schemas.length} schemas to ${outputPath}`);

const personalToken = env.STORYBLOK_PERSONAL_TOKEN;
if (!personalToken) {
  console.error('Error: STORYBLOK_PERSONAL_TOKEN is not set in .env');
  console.error(
    'Get one from: app.storyblok.com → My Account → Personal Access Tokens'
  );
  process.exit(1);
}

console.log('  Authenticating with Storyblok...');
execSync(`storyblok login --token ${personalToken}`, { stdio: 'inherit' });

console.log('  Pushing schemas...');
execSync(`storyblok components push --from ${spaceId}`, { stdio: 'inherit' });
