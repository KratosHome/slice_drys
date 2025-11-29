import type { ButtonHTMLAttributes } from "react";

type ChangeQuantityIconProps = {
  content: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function ChangeQuantityIcon({
  content,
  ...props
}: ChangeQuantityIconProps) {
  return (
    <button
      className="font-rubik active:text-red-cust flex cursor-pointer items-center justify-center text-4xl font-normal transition-all duration-200 will-change-transform active:scale-105"
      {...props}
    >
      {content}
    </button>
  );
}
