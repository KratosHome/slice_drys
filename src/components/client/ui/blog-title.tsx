import { useTranslations } from 'next-intl'

// Визначаємо інтерфейс для параметра 'variant'
interface BlogTitleProps {
  variant: string
}

const BlogTitle = ({ variant }: BlogTitleProps) => {
  const t = useTranslations('Blog')
  return t(variant)
}

export default BlogTitle
