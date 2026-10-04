'use client'

import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { useEffect, useId, useState } from 'react'

const MenuPanel = dynamic(() => import('./menu-panel'), { ssr: false })

interface IHamburgerMenuProps {
  productLinks: IPublicCategoryLink[]
  hamburgerLinksOther: ILink[]
}

export default function HamburgerMenu({
  productLinks,
  hamburgerLinksOther,
}: IHamburgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [hasOpened, setHasOpened] = useState(false)
  const menuId = useId()
  const t = useTranslations('main.hamburger-menu')

  const toggleMenu = () => {
    setHasOpened(true)
    setIsOpen((open) => !open)
  }
  const closeMenu = () => setIsOpen(false)
  const containerClasses = `tham tham-e-squeeze tham-w-6 ${isOpen ? 'tham-active' : ''}`

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px)')
    const closeOnDesktop = () => {
      if (desktop.matches) setIsOpen(false)
    }
    desktop.addEventListener('change', closeOnDesktop)
    return () => desktop.removeEventListener('change', closeOnDesktop)
  }, [])

  return (
    <>
      <Button
        onClick={toggleMenu}
        onKeyDown={(event) => {
          if (event.key === 'Escape') closeMenu()
        }}
        variant="none"
        className="relative bg-transparent active:scale-110 lg:hidden"
        aria-label={t('open-main-menu')}
        aria-expanded={isOpen}
        aria-controls={isOpen ? menuId : undefined}
      >
        <div className={containerClasses}>
          <div className="tham-box">
            <div className="tham-inner bg-foreground" />
          </div>
        </div>
      </Button>
      {hasOpened && (
        <MenuPanel
          id={menuId}
          isOpen={isOpen}
          onClose={closeMenu}
          productLinks={productLinks}
          hamburgerLinksOther={hamburgerLinksOther}
        />
      )}
    </>
  )
}
