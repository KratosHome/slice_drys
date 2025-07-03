import { Loader } from 'lucide-react'

import dynamic from 'next/dynamic'

const BlogSection = dynamic(
  () => import('@/components/client/main/blog/blog'),
  {
    loading: () => <Loader />,
  },
)

export default BlogSection
