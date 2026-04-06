import { Accordion as AccordionPrimitive } from '@base-ui/react/accordion';
import { MinusCircle, PlusCircle } from '@untitledui-pro/icons/line';
import { cn } from '@/lib/utils';
import type { AccordionProps } from '@/components/Accordion/Accordion.types';
import {
  Accordion as AccordionRoot,
  AccordionContent,
  AccordionItem,
} from '@/components/ui/accordion';

export default function Accordion({ items, class: className }: AccordionProps) {
  return (
    <AccordionRoot
      className={cn('w-full', className)}
      aria-label="Frequently asked questions"
    >
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          value={String(index)}
          className="border-t border-gray-200 last:border-b"
        >
          <AccordionPrimitive.Header className="flex">
            <AccordionPrimitive.Trigger className="group flex w-full cursor-pointer items-center justify-between gap-4 py-6 text-left outline-none focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-2">
              <span className="text-lg font-semibold text-gray-900">
                {item.title}
              </span>
              <span className="shrink-0 text-brand-700" aria-hidden="true">
                <PlusCircle className="size-6 group-aria-expanded:hidden" />
                <MinusCircle className="hidden size-6 group-aria-expanded:block" />
              </span>
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionContent>
            <p className="pb-6 text-base font-normal text-gray-600">
              {item.detail}
            </p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </AccordionRoot>
  );
}
