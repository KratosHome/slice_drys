import React from 'react'
import Link from 'next/link'

interface ProductMenuProps {
  menuToLocale: string
  filteredMenus: { key: string; label: string }[]
  locale: string
  capitalize: (str: string) => string
}

const ProductMenu: React.FC<ProductMenuProps> = ({
  menuToLocale,
  filteredMenus,
  locale,
  capitalize,
}) => {
  return (
    <div className="flex items-end justify-between border border-[#E4E4E4] p-5">
      <h2 className="text-[32px] font-black leading-none text-[#A90909] sm:text-[48px] md:text-[54px] lg:text-[64px]">
        {capitalize(menuToLocale)}
      </h2>
      <div className="flex gap-5">
        {filteredMenus.map((menuItem) => (
          <Link
            key={menuItem.key}
            href={`/${locale}/products/${menuItem.key}`}
            className="text-base font-medium hover:text-[#a90909] sm:text-[18px] md:text-[20px] lg:text-[24px]"
          >
            {capitalize(menuItem.label)}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default ProductMenu
