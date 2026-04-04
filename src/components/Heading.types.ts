export type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
export type HeadingSize = 'display-xl' | 'display-md' | 'text-xl' | 'text-lg';
export type HeadingWeight = 'medium' | 'semibold';

export interface HeadingProps {
  as?: HeadingTag;
  size?: HeadingSize;
  weight?: HeadingWeight;
  color?: string;
  text?: string;
  class?: string;
}

export default null;
