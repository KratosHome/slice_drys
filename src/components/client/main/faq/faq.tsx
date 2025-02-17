'use client'

import Item from '@/components/client/main/faq/item'
import { FC, useEffect, useState } from 'react'
import { getBlockSettings } from '@/server/blocks/block-actions.server'
import { ILocaleProps } from '@/types/ILocale'

const Faq: FC<ILocaleProps> = ({ locale }) => {
  const [data, setData] = useState<{
    title: {
      type: string
      value: string
    }
    description: {
      type: string
      value: string
    }
    fAQ: { type: string; value: string[] }[]
  } | null>(null)

  useEffect(() => {
    async function fetchData() {
      const settings = await getBlockSettings('faq')

      if (settings) {
        setData({ ...settings[locale] })
      }
    }

    fetchData()
  }, [locale])

  if (!data) {
    return
  }

  return (
    <section
      aria-labelledby="FAQ"
      className="mx-auto mb-20 mt-60 max-w-[880px] items-center px-4"
    >
      <h1 className="font-rubik pr-0 text-center text-[38px] uppercase md:pr-20 md:text-[64px]">
        {data.title.value}
      </h1>
      <h2 className="slider-label relative mb-24 mt-5 grid max-w-max place-content-end">
        {data.description.value}
      </h2>
      {data?.faq?.value?.map((item: Faq) => (
        <Item
          key={item.title}
          question={item.title}
          answer={item.description}
        />
      ))}
    </section>
  )
}
export default Faq
