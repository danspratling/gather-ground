export type ButtonVariant = 'default' | 'outline' | 'ghost' | 'link';
export type ButtonSize = 'sm' | 'default' | 'lg';

export interface ButtonProps {
  label: string;
  href?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  class?: string;
}
