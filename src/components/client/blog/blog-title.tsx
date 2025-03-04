import { useTranslations } from 'next-intl'

const BlogTitle = () => {
  const t = useTranslations('blog')
  return (
    <div className="mt-10 flex w-full flex-wrap items-center justify-between gap-[26px] lg:mt-[60px] lg:flex-nowrap lg:gap-[54px]">
      <div className="w-full font-rubik text-[clamp(64px,calc(64px+64*(100vw-768px)/672),128px)] md:w-fit">
        {t('title')}
      </div>

      <div className="ml-auto w-full bg-black p-4 font-poppins text-base text-white shadow-[16px_-16px_0px_#A90909] sm:max-w-[75%] md:mr-8 md:text-xl lg:max-w-none">
        {t('description-top')}
      </div>
    </div>
  )
}

export default BlogTitle
