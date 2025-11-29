"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";

interface ISliderItemProps {
  title: string;
  hoverHexColor: string;
  isHovered: boolean;
}

export default function SliderItem({
  title,
  hoverHexColor,
  isHovered,
}: ISliderItemProps) {
  const [textWidth, setTextWidth] = useState<number>(190);

  const textRef = useRef<SVGTextElement>(null);

  useEffect(() => {
    if (textRef.current) {
      const width = textRef.current.getBBox().width;
      setTextWidth(Math.max(width, 190));
    }
  }, [title, isHovered]);

  const Text = () => (
    <div
      className={cn(
        "z-20 -translate-y-4 text-[36px] font-semibold sm:-translate-y-8 md:-translate-y-10",
        isHovered && "font-bold",
      )}
    >
      <svg
        viewBox={`0 95 ${textWidth + 150} 50`}
        height="70"
        className="w-[200px] sm:w-[220px] md:w-[250px]"
      >
        <path
          stroke="transparent"
          fill="transparent"
          d={`M 35,150 A ${textWidth + 120},120 0 0,1 ${120 + textWidth},150`}
          id="curve"
        />
        <text
          className={cn(
            isHovered
              ? "text-[1.5rem] lg:text-[2.3rem]"
              : "fill-mid_gray text-[1rem] lg:text-[1.75rem]",
          )}
          fontFamily="Arial"
          letterSpacing="5"
          fill={
            isHovered
              ? hoverHexColor
              : "light-dark(hsl(var(--muted-foreground)),hsl(var(--foreground)))"
          }
        >
          <textPath href="#curve" startOffset="50%" textAnchor="middle">
            {title}
          </textPath>
        </text>
      </svg>
    </div>
  );

  const Bullet = () => (
    <div
      className={cn(
        "absolute mt-5 size-1 bg-black sm:size-2 dark:bg-white",
        isHovered && "size-2 sm:size-5",
      )}
      style={isHovered ? { background: hoverHexColor } : {}}
    />
  );

  const Blur = () => (
    <div
      style={{ background: hoverHexColor }}
      className={cn(
        `absolute aspect-1/1 w-[5rem] rounded opacity-0 md:w-[10rem]`,
        isHovered && "opacity-30 blur-xl md:blur-3xl",
      )}
    />
  );

  return (
    <>
      <Text />
      <Bullet />
      <Blur />
    </>
  );
}
