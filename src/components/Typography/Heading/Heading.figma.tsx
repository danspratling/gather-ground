/**
 * Figma Code Connect for Heading.astro
 *
 * Publishes code snippets to Figma Dev Mode so designers see real usage.
 * Publish via: npx figma connect publish
 * See: https://github.com/figma/code-connect
 *
 * Note: Verify Figma property names ('Tag', 'Size', 'Weight') match the
 * actual component properties in the Figma file before publishing.
 */
import figma from '@figma/code-connect';

figma.connect(
  'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=1647-376184',
  {
    props: {
      as: figma.enum('Tag', {
        H1: 'h1',
        H2: 'h2',
        H3: 'h3',
        H4: 'h4',
        H5: 'h5',
        H6: 'h6',
      }),
      size: figma.enum('Size', {
        'Display XL': 'display-xl',
        'Display MD': 'display-md',
        'Text XL': 'text-xl',
        'Text LG': 'text-lg',
      }),
      weight: figma.enum('Weight', {
        Medium: 'medium',
        Semibold: 'semibold',
      }),
    },
    example: ({ as: tag, size, weight }) =>
      `<Heading as="${tag}" size="${size}" weight="${weight}">Heading text</Heading>`,
  }
);

// @storybook-astro/framework's build server scans src/components/ and generates a
// virtual:astro-component-module wrapper that re-exports `default` for every source file.
// This export satisfies that requirement; it has no effect on Figma Code Connect publishing.
export default null;
