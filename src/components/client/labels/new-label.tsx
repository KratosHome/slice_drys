import React from 'react'
import { useTranslations } from 'next-intl'

const NewLabel = () => {
  const t = useTranslations('product')

  return (
    <div className="relative z-10 flex w-fit items-center gap-2 rounded-sm bg-[#07C70D] px-2 py-[2px] uppercase text-white">
      <svg
        className="md:h-6 md:w-6"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12.5858 4.58579C12.2107 4.21071 11.702 4 11.1716 4H4V11.1716C4 11.702 4.21071 12.2107 4.58579 12.5858L11.5858 19.5858C12.3668 20.3668 13.6332 20.3668 14.4142 19.5858L19.5858 14.4142C20.3668 13.6332 20.3668 12.3668 19.5858 11.5858L12.5858 4.58579Z"
          stroke="#FBFBFB"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect
          x="9"
          y="9"
          width="0.01"
          height="0.01"
          stroke="#FBFBFB"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
      <p className="mt-[2px]">{t('novelty')}</p>
    </div>
  )
}

export default NewLabel
