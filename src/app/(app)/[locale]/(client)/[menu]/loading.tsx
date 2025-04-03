import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

export default function AnimatedLoader() {
  return (
    <div className="mx-auto max-w-[1280px] overflow-hidden p-5">
      <Skeleton className="h-[25px] w-[150px] rounded-xl" />
      <Skeleton className="mt-2 h-[90px] w-full" />
      <Skeleton className="mt-2 block h-[25px] w-[100px] rounded-xl md:hidden" />
      <div className="flex">
        <div className="mr-5 hidden md:block">
          <Skeleton className="mt-2 h-[325px] w-[350px] rounded-xl" />
          <Skeleton className="mt-2 h-[225px] w-[350px] rounded-xl" />
        </div>
        <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3">
          <Skeleton className="] mt-2 h-[425px] w-full" />
          <Skeleton className="] mt-2 h-[425px] w-full" />
          <Skeleton className="] mt-2 h-[425px] w-full" />
          <Skeleton className="] mt-2 h-[425px] w-full" />
          <Skeleton className="] mt-2 h-[425px] w-full" />
          <Skeleton className="] mt-2 h-[425px] w-full" />
        </div>
      </div>
      <div className="flex items-center justify-center">
        <Skeleton className="mt-16 h-[55px] w-[270px] rounded-xl" />
      </div>
      <Skeleton className="mt-16 h-[555px] w-full rounded-xl" />
    </div>
  )
}
