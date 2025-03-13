import React from 'react'
import { Skeleton } from '@/components/admin/ui/skeleton'

const Page = () => {
  return (
    <div className="mx-auto max-w-[1280px] overflow-hidden p-5">
      <Skeleton className="mt-20 h-[155px] w-full rounded-xl" />
      <Skeleton className="mt-20 h-[955px] w-full rounded-xl" />
    </div>
  )
}

export default Page
