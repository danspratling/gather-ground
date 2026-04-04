import { ArrowRight } from '@untitledui-pro/icons/line';
import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import type { NavMenuProps } from '@/components/NavMenu.types';

export default function NavMenu({
  label,
  items,
  class: className,
}: NavMenuProps) {
  return (
    <NavigationMenu className={cn(className)}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={cn(
              'h-auto bg-transparent px-2 py-0.5 text-sm font-medium text-brand-700 rounded-[6px]',
              'hover:bg-transparent hover:text-brand-900',
              'data-popup-open:bg-transparent data-open:bg-transparent'
            )}
          >
            {label}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="flex w-56 flex-col gap-0.5 p-1">
              {items.map((item) => (
                <li key={item.href}>
                  <NavigationMenuLink
                    href={item.href}
                    className={cn(
                      'flex flex-col gap-0.5 rounded-lg px-3 py-2.5 hover:bg-brand-25',
                      item.iconTrailing &&
                        'flex-row items-center justify-between'
                    )}
                  >
                    <span className="text-sm font-medium text-brand-900">
                      {item.label}
                    </span>
                    {item.description && (
                      <span className="text-xs font-normal text-brand-400">
                        {item.description}
                      </span>
                    )}
                    {item.iconTrailing && (
                      <ArrowRight
                        className="size-4 shrink-0 text-brand-400"
                        aria-hidden="true"
                      />
                    )}
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
