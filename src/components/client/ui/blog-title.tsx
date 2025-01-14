import { useTranslations } from 'next-intl'

const BlogWordLocalization = () => {
  const t = useTranslations('Blog')
  return t('Blog')
}

const BlogTitleLocalization = () => {
  const t = useTranslations('Blog')
  return t('title')
}

export { BlogWordLocalization as WordBlogLocalization, BlogTitleLocalization }
