export interface InstagramFeedSectionProps {
  eyebrow?: string;
  heading: string;
  subCopy?: string;
  /** Label for the "Follow on Instagram" button. */
  viewAllLabel?: string;
  /**
   * Instagram handle (no @). Used to build the profile link for the
   * "Follow on Instagram" button. When omitted, the button is hidden.
   * On real pages this is read from Sanity siteSettings; in stories it
   * can be passed directly.
   */
  handle?: string;
  /**
   * Behold.so feed id — the value after `https://feeds.behold.so/`.
   * Powers the `<behold-widget>` that renders the live Instagram grid.
   * On real pages this is read from Sanity siteSettings; in stories it
   * can be passed directly so the widget renders against a real feed.
   */
  feedId?: string;
}

export default null;
