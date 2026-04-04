export interface NavMenuItem {
  label: string;
  href: string;
  description?: string;
  iconTrailing?: boolean;
}

export interface NavMenuProps {
  label: string;
  items: NavMenuItem[];
  class?: string;
}

export default null;
