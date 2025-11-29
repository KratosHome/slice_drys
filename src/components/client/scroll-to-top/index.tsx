"use client";

import dynamic from "next/dynamic";

const ScrollToTop = dynamic(
  () => import("@/components/client/scroll-to-top/scroll-to-top"),
  {
    ssr: false,
  },
);

export default ScrollToTop;
