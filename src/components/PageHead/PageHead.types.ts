export interface PageHeadProps {
  title: string;
  description?: string;
  canonicalUrl?: string;
  ogType?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  twitterImage?: string;
  /** Optional SVG favicon URL (overrides the built-in /favicon.svg). */
  favicon?: string;
  /** Render the RSS alternate link — only set true on the blog index page. */
  showRssFeed?: boolean;
}

export default null;
