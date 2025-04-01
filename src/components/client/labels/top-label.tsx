'use client'
import { useTranslations } from 'next-intl'

const TopLabel = () => {
  const t = useTranslations('product')

  return (
    <div className="relative z-10 flex w-fit items-center gap-2 rounded-sm bg-[#EC9006] px-2 py-[2px] text-white uppercase">
      <svg
        className="md:h-6 md:w-6"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M17.3604 20H6C4.89543 20 4 19.1046 4 18V10H7.92963C8.59834 10 9.2228 9.6658 9.59373 9.1094L12.1094 5.3359C12.6658 4.5013 13.6025 4 14.6056 4H14.8195C15.4375 4 15.9075 4.55487 15.8059 5.1644L15 10H18.5604C19.8225 10 20.7691 11.1547 20.5216 12.3922L19.3216 18.3922C19.1346 19.3271 18.3138 20 17.3604 20Z"
          stroke="#FBFBFB"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M8 10V20" stroke="#FBFBFB" />
      </svg>
      <p className="mt-[2px]">{t('top')}</p>
    </div>
  )
}

export default TopLabel
