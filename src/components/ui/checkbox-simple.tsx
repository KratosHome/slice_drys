import type { ComponentPropsWithoutRef } from "react";

import { Check } from "lucide-react";

import { cn } from "@/utils/cn";

type CheckboxSimpleProps = Readonly<
  {
    label: string;
    name: string;
    isValid: boolean;
    className?: string;
    isChecked?: boolean;
  } & ComponentPropsWithoutRef<"input">
>;

export default function CheckboxSimple({
  name,
  isValid,
  isChecked,
  label,
  ...props
}: CheckboxSimpleProps) {
  return (
    <label
      className="relative flex cursor-pointer items-center space-x-3 select-none"
      htmlFor={name}
    >
      <span className="relative mr-4 grid h-[27px] w-[27px] place-items-center">
        <Check size={16} className={cn(isChecked ? "visible" : "invisible")} />
        <svg
          height={27}
          width={27}
          className="text-foreground absolute inset-0 origin-center"
        >
          <use href="/icons/sprite.svg#o" />
        </svg>
        <input
          type="checkbox"
          {...props}
          id={name}
          className={`${isValid ? "" : "text-red-700"} absolute inset-0 cursor-pointer opacity-0`}
        />
      </span>
      {label}
    </label>
  );
}
