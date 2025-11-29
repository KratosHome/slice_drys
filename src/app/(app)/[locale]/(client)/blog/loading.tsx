import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function AnimatedLoader() {
  const fakePosts = Array.from({ length: 6 }, (_, index) => ({
    id: `fake-${index}`,
  }));

  return (
    <div className="mx-auto max-w-[1280px] overflow-hidden p-5">
      <Skeleton className="h-[25px] w-[190px] rounded-xl" />
      <div className="mt-7 flex gap-5">
        <Skeleton className="h-[105px] w-[390px] rounded-xl" />
        <Skeleton className="h-[105px] w-full rounded-xl" />
      </div>
      <div className="mt-[50px] flex flex-col gap-44 lg:mt-[108px]">
        <div className="grid justify-center gap-7 md:grid-cols-2 md:gap-[50px]">
          <Skeleton className="h-[405px] w-full rounded-xl" />
          <Skeleton className="h-[405px] w-full rounded-xl" />
        </div>
        <span className="mb-[35px] border-t border-dashed border-black"></span>
        <div className="grid grid-cols-2 md:grid-cols-3 md:gap-[clamp(24px,calc(24px+46*(100vw-768px)/672),70px)] md:gap-x-[86px]">
          {fakePosts.map((item) => (
            <Skeleton key={item.id} className="h-[405px] w-full rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
