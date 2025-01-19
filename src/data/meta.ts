import { capitalize } from '@/utils/capitalize'

export const generateMetadata = async (props: {
  params: Promise<{ locale: string; menu: string; category: string }>
}) => {
  const { params } = props
  const { menu } = await params

  return {
    title: `Slice Dry's | ${capitalize(menu)}`,
    description: `The best dried ${menu} products`,
  }
}
