import { Loader } from 'lucide-react'

import dynamic from 'next/dynamic'

const ProductSlider = dynamic(
  () => import('@/components/client/product-slider/product-slider'),
  {
    loading: () => <Loader />,
  },
)

export default ProductSlider
