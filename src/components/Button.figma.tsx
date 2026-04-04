/**
 * Figma Code Connect for Button.astro
 *
 * Publishes code snippets to Figma Dev Mode so designers see real usage.
 * Publish via: npx figma connect publish
 * See: https://github.com/figma/code-connect
 */
import figma from '@figma/code-connect';

figma.connect(
  'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=3287-427074',
  {
    props: {
      variant: figma.enum('Hierarchy', {
        Primary: 'default',
        Secondary: 'outline',
        Tertiary: 'ghost',
        Link: 'link',
      }),
      size: figma.enum('Size', {
        sm: 'sm',
        md: 'default',
        lg: 'lg',
      }),
      disabled: figma.enum('State', {
        Default: false,
        Hover: false,
        Focused: false,
        Disabled: true,
        Loading: false,
      }),
    },
    example: ({ variant, size, disabled }) =>
      `<Button label="Button CTA" variant="${variant}" size="${size}"${disabled ? ' disabled' : ''} />`,
  }
);

// @storybook-astro/framework's build server scans src/components/ and generates a
// virtual:astro-component-module wrapper that re-exports `default` for every source file.
// This export satisfies that requirement; it has no effect on Figma Code Connect publishing.
export default null;
