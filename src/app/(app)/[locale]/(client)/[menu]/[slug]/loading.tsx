import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function AnimatedLoader() {
  return (
    <div className="mx-auto max-w-[1280px] overflow-hidden p-5">
      <Skeleton className="h-[25px] w-[150px] rounded-xl" />
      <div className="mt-2 flex w-full flex-col gap-5 lg:flex-row">
        <Skeleton className="h-[205px] w-full rounded-xl lg:h-[605px]" />
        <div className="w-full">
          <Skeleton className="h-[55px] w-full rounded-xl" />
          <Skeleton className="mt-2 h-[85px] w-full rounded-xl" />
          <div className="mt-12 flex gap-5">
            <Skeleton className="mt-2 h-[45px] w-[130px] rounded-xl" />
            <Skeleton className="mt-2 h-[45px] w-[130px] rounded-xl" />
          </div>
          <div className="mt-12 flex justify-end gap-5">
            <Skeleton className="mt-2 h-[45px] w-[130px] rounded-xl" />
            <Skeleton className="mt-2 h-[45px] w-[130px] rounded-xl" />
          </div>
          <Skeleton className="mt-2 h-[45px] w-[130px] rounded-xl" />
          <div className="mt-12 flex justify-end gap-2">
            <Skeleton className="mt-2 h-[65px] w-[65px] rounded-full" />
            <Skeleton className="mt-2 h-[65px] w-[65px] rounded-full" />
            <Skeleton className="mt-2 h-[65px] w-[65px] rounded-full" />
            <Skeleton className="mt-2 h-[65px] w-[65px] rounded-full" />
          </div>
        </div>
      </div>
      <div className="mt-16 flex w-full flex-col items-center justify-center">
        <Skeleton className="mt-2 h-[145px] w-full max-w-[900px] rounded-xl" />
        <Skeleton className="mt-2 h-[245px] w-full max-w-[900px] rounded-xl" />
        <Skeleton className="mt-2 h-[245px] w-full max-w-[900px] rounded-xl" />
      </div>
    </div>
  );
}
