import { defineType, defineField, defineArrayMember } from 'sanity';

// Treat a `link` object as "populated" only when the branch matching its type
// actually has a value. Empty/blank branches don't count.
function hasLinkValue(link: unknown): boolean {
  if (!link || typeof link !== 'object') return false;
  const l = link as {
    type?: string;
    url?: string;
    internalLink?: unknown;
    email?: string;
    anchor?: string;
  };
  switch (l.type) {
    case 'url':
      return typeof l.url === 'string' && l.url.trim() !== '';
    case 'internal':
      return !!l.internalLink;
    case 'email':
      return typeof l.email === 'string' && l.email.trim() !== '';
    case 'anchor':
      return typeof l.anchor === 'string' && l.anchor.trim() !== '';
    default:
      return false;
  }
}

function labelRequiresHref(hrefField: string) {
  return (label: unknown, context: { parent?: unknown }) => {
    const parent = (context.parent || {}) as Record<string, unknown>;
    const hasLabel = typeof label === 'string' && label.trim() !== '';
    const hasHref = hasLinkValue(parent[hrefField]);
    if (hasHref && !hasLabel) return 'Add button text or remove the link.';
    return true;
  };
}

function hrefRequiresLabel(labelField: string) {
  return (href: unknown, context: { parent?: unknown }) => {
    const parent = (context.parent || {}) as Record<string, unknown>;
    const hasHref = hasLinkValue(href);
    const labelValue = parent[labelField];
    const hasLabel = typeof labelValue === 'string' && labelValue.trim() !== '';
    if (hasLabel && !hasHref) return 'Add a link or remove the button text.';
    return true;
  };
}

/** Testimonials Section — page section object. References testimonial documents. */
export const testimonialsSection = defineType({
  name: 'testimonialsSection',
  title: 'Testimonials Section',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subCopy',
      title: 'Supporting text',
      type: 'text',
      rows: 3,
      description: 'A short paragraph shown below the heading.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'testimonials',
      title: 'Testimonials',
      type: 'array',
      description:
        'Pick existing testimonials. Create new ones under Testimonials in the sidebar.',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'testimonials' }],
        }),
      ],
    }),
    defineField({
      name: 'ctaPrimaryLabel',
      title: 'Primary button text (optional)',
      type: 'string',
      description:
        'Shown below the heading. Useful for linking out to a reviews platform like Trustpilot. Leave both the text and link blank to hide the button.',
      validation: (Rule) => Rule.custom(labelRequiresHref('ctaPrimaryHref')),
    }),
    defineField({
      name: 'ctaPrimaryHref',
      title: 'Primary button link',
      type: 'link',
      validation: (Rule) => Rule.custom(hrefRequiresLabel('ctaPrimaryLabel')),
    }),
    defineField({
      name: 'ctaSecondaryLabel',
      title: 'Secondary button text (optional)',
      type: 'string',
      description:
        'Shown next to the primary button. Leave both the text and link blank to hide the button.',
      validation: (Rule) => Rule.custom(labelRequiresHref('ctaSecondaryHref')),
    }),
    defineField({
      name: 'ctaSecondaryHref',
      title: 'Secondary button link',
      type: 'link',
      validation: (Rule) => Rule.custom(hrefRequiresLabel('ctaSecondaryLabel')),
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title: title || 'Testimonials Section' }),
  },
});

export default null;
