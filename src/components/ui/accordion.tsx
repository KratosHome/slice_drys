"use client";

import { Root, Item, Trigger, Content } from "@radix-ui/react-accordion";

import {
  type ComponentPropsWithoutRef,
  type ComponentRef,
  forwardRef,
} from "react";
import { cn } from "@/utils/cn";

const Accordion = Root;

const AccordionItem = forwardRef<
  ComponentRef<typeof Item>,
  ComponentPropsWithoutRef<typeof Item>
>(({ className, ...props }, ref) => (
  <Item ref={ref} className={cn(className)} {...props} />
));

AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = forwardRef<
  ComponentRef<typeof Trigger>,
  ComponentPropsWithoutRef<typeof Trigger>
>(({ className, children, ...props }, ref) => (
  <div className="flex">
    <Trigger
      ref={ref}
      className={cn(
        "flex flex-1 cursor-pointer items-center justify-between rounded-[0.125rem] px-6 py-2 text-left text-sm font-medium transition-all [&[data-state=open]>span]:rotate-270",
        "text-background bg-foreground text-base font-normal sm:text-xl md:text-2xl",
        className,
      )}
      {...props}
    >
      {children}
      <span className="font-rubik text-background flex h-6 w-6 shrink-0 rotate-90 items-center justify-center text-xl transition-transform duration-200 sm:text-2xl md:text-4xl">
        {">"}
      </span>
    </Trigger>
  </div>
));

AccordionTrigger.displayName = Trigger.displayName;

const AccordionContent = forwardRef<
  ComponentRef<typeof Content>,
  ComponentPropsWithoutRef<typeof Content>
>(({ className, children, ...props }, ref) => (
  <Content
    ref={ref}
    className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down -ml-8 overflow-hidden pl-8 text-sm"
    {...props}
  >
    <div
      className={cn(
        "flex flex-col border-dotted border-black text-base md:text-xl",
        className,
      )}
    >
      {children}
    </div>
  </Content>
));

AccordionContent.displayName = Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
