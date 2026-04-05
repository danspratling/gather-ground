/**
 * Figma Code Connect for Body.astro
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
        Paragraph: 'p',
        Span: 'span',
        Div: 'div',
      }),
      size: figma.enum('Size', {
        XL: 'xl',
        LG: 'lg',
        MD: 'md',
        SM: 'sm',
        XS: 'xs',
      }),
      weight: figma.enum('Weight', {
        Regular: 'regular',
        Medium: 'medium',
        Semibold: 'semibold',
      }),
    },
    example: ({ as: tag, size, weight }) =>
      `<Body as="${tag}" size="${size}" weight="${weight}">Body text</Body>`,
  }
);

// @storybook-astro/framework's build server scans src/components/ and generates a
// virtual:astro-component-module wrapper that re-exports `default` for every source file.
// This export satisfies that requirement; it has no effect on Figma Code Connect publishing.
export default null;
