// @storybook-astro/framework does not export Meta/StoryObj — Astro stories are untyped by design.
// See: https://storybook-astro.org/writing-stories/
import ContactHero from './ContactHero.astro';

const meta = {
  title: 'Sections/Contact Hero',
  component: ContactHero,
  parameters: {
    layout: 'fullscreen',
    chromatic: { viewports: [375, 1440] },
    a11y: { config: { rules: [{ id: 'frame-tested', enabled: false }] } },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=1639-379476',
    },
  },
};

export default meta;

export const Default = {
  args: {
    heading: 'Get in touch',
    body: "We'd love to hear from you. Send us a message and we'll get back to you as soon as possible.",
    embedUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d100943.26869313888!2d144.9630576!3d-37.8136278!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf577d6e99d97a57d!2sMelbourne%20VIC%2C%20Australia!5e0!3m2!1sen!2sau!4v1714000000000',
    mapTitle: 'Gather Ground Farm location',
  },
};
