export type ButtonVariant = 'default' | 'outline' | 'ghost' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

type ButtonBaseProps = {
  href?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  loading?: boolean;
  class?: string;
};

type ButtonWithLabel = ButtonBaseProps & {
  iconOnly?: false;
  label: string;
};

type ButtonIconOnly = ButtonBaseProps & {
  iconOnly: true;
  label?: never;
};

export type ButtonProps = ButtonWithLabel | ButtonIconOnly;

export default null;
