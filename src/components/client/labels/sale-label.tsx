import React from 'react'
import { useTranslations } from 'next-intl'

const SaleLabel = () => {
  const t = useTranslations('product')

  return (
    <div className="relative z-10 flex w-fit items-center gap-2 rounded-sm bg-[#A90909] px-2 py-[2px] uppercase text-white">
      <svg
        className="md:h-6 md:w-6"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10.5099 3.66452C11.3048 2.77651 12.6952 2.77651 13.4901 3.66452L14.1909 4.44729C14.596 4.89986 15.1849 5.14377 15.7914 5.11024L16.8404 5.05225C18.0304 4.98646 19.0135 5.96956 18.9477 7.1596L18.8898 8.20861C18.8562 8.81511 19.1001 9.40398 19.5527 9.80913L20.3355 10.5099C21.2235 11.3048 21.2235 12.6952 20.3355 13.4901L19.5527 14.1909C19.1001 14.596 18.8562 15.1849 18.8898 15.7914L18.9477 16.8404C19.0135 18.0304 18.0304 19.0135 16.8404 18.9477L15.7914 18.8898C15.1849 18.8562 14.596 19.1001 14.1909 19.5527L13.4901 20.3355C12.6952 21.2235 11.3048 21.2235 10.5099 20.3355L9.80913 19.5527C9.40398 19.1001 8.81511 18.8562 8.20861 18.8898L7.1596 18.9477C5.96956 19.0135 4.98646 18.0304 5.05225 16.8404L5.11024 15.7914C5.14377 15.1849 4.89986 14.596 4.44729 14.1909L3.66452 13.4901C2.77651 12.6952 2.77651 11.3048 3.66452 10.5099L4.44729 9.80913C4.89986 9.40398 5.14377 8.81511 5.11024 8.20861L5.05225 7.1596C4.98646 5.96956 5.96956 4.98646 7.1596 5.05225L8.20861 5.11024C8.81511 5.14377 9.40398 4.89986 9.80913 4.44729L10.5099 3.66452Z"
          stroke="#FBFBFB"
        />
        <rect
          x="9.5"
          y="9.5"
          width="0.01"
          height="0.01"
          stroke="#FBFBFB"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <rect
          x="14.5"
          y="14.5"
          width="0.01"
          height="0.01"
          stroke="#FBFBFB"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M15 9L9 15"
          stroke="#FBFBFB"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <p className="mt-[2px]">{t('sale')}</p>
    </div>
  )
}

export default SaleLabel
