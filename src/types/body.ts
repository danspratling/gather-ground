export type BodyTag = 'p' | 'span' | 'div';
export type BodySize = 'xl' | 'lg' | 'md' | 'sm' | 'xs';
export type BodyWeight = 'regular' | 'medium' | 'semibold';

export interface BodyProps {
  as?: BodyTag;
  size?: BodySize;
  weight?: BodyWeight;
  color?: string;
  text?: string;
  class?: string;
}
