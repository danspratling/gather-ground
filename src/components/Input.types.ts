export type InputType = 'text' | 'email' | 'tel' | 'url' | 'password';
export type InputSize = 'sm' | 'md';

export interface InputProps {
  name: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  type?: InputType;
  size?: InputSize;
  hint?: string;
  error?: string;
  disabled?: boolean;
  iconLeading?: boolean;
  class?: string;
}

export default null;
