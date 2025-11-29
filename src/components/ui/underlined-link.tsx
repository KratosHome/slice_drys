"use client";

import Link from "next/link";

import {
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type Ref,
  forwardRef,
} from "react";
import { useLocale } from "next-intl";
import { cn } from "@/utils/cn";

interface IUnderlinedLinkButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  as: "button";
}

interface IUnderlinedLinkAnchorProps
  extends AnchorHTMLAttributes<HTMLAnchorElement> {
  as?: "a";
  href?: string;
}

type UnderlinedLinkProps = (
  | IUnderlinedLinkButtonProps
  | IUnderlinedLinkAnchorProps
) & {
  target?: "_blank" | "_self" | "_parent" | "_top";
  className?: string;
};

const UnderlinedLink = forwardRef<
  HTMLAnchorElement | HTMLButtonElement,
  UnderlinedLinkProps
>((props, ref) => {
  const {
    as = "a",
    className,
    children,
    target = "_blank",
    ...restProps
  } = props;

  const locale: string = useLocale();

  const classes: string = cn(
    "group relative flex items-center justify-start gap-3 bg-transparent px-6 py-2 text-[clamp(16px,calc(16px+4*(100vw-375px)/1065),20px)] font-medium transition-all duration-300 ease-in-out lg:hover:bg-transparent",
    locale === "uk"
      ? "min-w-[260px] lg:min-w-[290px]"
      : "min-w-[220px] lg:min-w-[240px]",
    className,
  );

  const content = (
    <>
      <span>{children}</span>
      <svg
        viewBox="0 0 42 15"
        fill="none"
        preserveAspectRatio="none"
        className="relative h-[15px] w-[42px] transition-all duration-400 ease-in-out lg:group-hover:w-[50px]"
      >
        <path
          d="M41.7071 8.20711C42.0976 7.81658 42.0976 7.18342 41.7071 6.79289L35.3431 0.428932C34.9526 0.0384079 34.3195 0.0384079 33.9289 0.428932C33.5384 0.819456 33.5384 1.45262 33.9289 1.84315L39.5858 7.5L33.9289 13.1569C33.5384 13.5474 33.5384 14.1805 33.9289 14.5711C34.3195 14.9616 34.9526 14.9616 35.3431 14.5711L41.7071 8.20711ZM0 8.5H41V6.5H0V8.5Z"
          fill="currentColor"
        />
      </svg>
      <span className="absolute -bottom-[20px] left-0 w-full px-4 py-2 transition-all duration-300 ease-in-out lg:[clip-path:polygon(0%_0%,0%_0%,0%_100%,0%_100%)] lg:group-hover:[clip-path:polygon(0%_0%,100%_0%,100%_100%,0%_100%)]">
        <svg preserveAspectRatio="none" viewBox="0 0 247 14" fill="none">
          <path
            d="M1 10.9575C15.2237 11.7558 29.6421 13.8917 43.8702 12.588C50.9788 11.9366 57.9805 9.64507 65.0198 8.16242C83.3689 4.29765 101.895 4.61277 120.378 4.87237C142.059 5.17687 163.714 6.3965 185.388 7.11426C195.658 7.45438 205.492 7.46182 215.637 5.1344C225.799 2.80292 235.734 1.38295 246 1"
            stroke="currentColor"
            strokeLinecap="round"
          />
        </svg>
      </span>
    </>
  );

  if (as === "button") {
    const { ...buttonProps } =
      restProps as ButtonHTMLAttributes<HTMLButtonElement>;
    return (
      <button
        ref={ref as Ref<HTMLButtonElement>}
        className={classes}
        {...buttonProps}
      >
        {content}
      </button>
    );
  } else {
    const { href, ...anchorProps } =
      restProps as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <Link href={href || "/public"} passHref legacyBehavior>
        <a
          ref={ref as Ref<HTMLAnchorElement>}
          className={classes}
          target={target}
          rel={target === "_blank" ? "noopener noreferrer" : undefined}
          {...anchorProps}
        >
          {content}
        </a>
      </Link>
    );
  }
});

UnderlinedLink.displayName = "UnderlinedLink";

export { UnderlinedLink };
