import { pageLinks, routs } from '@/data/main/routs'

import HeaderShell from './header-shell'
import HamburgerMenu from '@/components/client/header/hamburger-menu'
import LocaleChange from '@/components/client/header/locale-change'
import SmallCart from '@/components/client/header/small-cart'
import CallMe from '@/components/client/header/call-me'
import ThemeToggle from '@/components/client/theme-toggle'
import NumberCall from '@/components/client/number-call'
import Socials from '@/components/ui/socials'
import { TransitionLink } from '@/components/client/transition-link'

import { useLocale, useTranslations } from 'next-intl'
import { cn } from '@/utils/cn'

interface IHeaderProps {
  productLinks: IPublicCategoryLink[]
}

export default function Header({ productLinks }: IHeaderProps) {
  const t = useTranslations('main.header')

  const locale = useLocale() as ILocale

  return (
    <>
      <HeaderShell>
        <div className="mx-auto grid h-full max-w-[1280px] grid-cols-[1fr_auto_1fr] items-center justify-between py-3 lg:gap-x-6 xl:gap-x-8">
          <div className="max-w-min">
            <nav className="hidden gap-3 lg:flex">
              {productLinks.slice(0, 4)?.map((link) => (
                <TransitionLink
                  key={link.slug}
                  href={`/${locale}${routs.products}/${link.slug}`}
                  className="pr-3 text-[20px] transition-all duration-300 ease-in-out hover:scale-105 hover:text-red-500"
                >
                  {link.name[locale]}
                </TransitionLink>
              ))}
            </nav>
            <HamburgerMenu
              productLinks={productLinks}
              hamburgerLinksOther={pageLinks[locale].slice(1, 5)}
            />
            <div className="site-header-social mt-5 hidden justify-end lg:flex">
              <Socials size={33} />
            </div>
          </div>
          <TransitionLink
            href={`/${locale}`}
            className="site-header-logo text-foreground h-full self-start"
          >
            <svg
              width="86px"
              height="100px"
              className="h-full"
              role="img"
              aria-label={t('logo-slice-drys')}
            >
              <use href="/icons/sprite.svg#logo" />
            </svg>
          </TransitionLink>
          <div className="justify-self-end">
            <div className="flex justify-end lg:justify-between lg:gap-x-4 xl:gap-x-10">
              <nav className="hidden gap-x-[10px] text-[20px] lg:flex">
                {pageLinks[locale].slice(1, 4)?.map((link: ILink) => (
                  <TransitionLink
                    key={link.id}
                    href={`/${locale}/${link.href}`}
                    className="px-2 py-3 text-[20px] transition-all duration-300 ease-in-out will-change-transform hover:scale-105 hover:text-red-500 xl:px-3"
                  >
                    {link.name}
                  </TransitionLink>
                ))}
              </nav>
              <div className="flex items-center justify-center gap-x-4 lg:justify-between">
                <LocaleChange className="hidden lg:flex" />
                <ThemeToggle />
                <SmallCart />
              </div>
            </div>
            <div
              className={cn(
                'site-header-call',
                'flex origin-top-right justify-between',
              )}
            >
              <NumberCall className="hidden lg:flex" />
              <CallMe />
            </div>
          </div>
        </div>
      </HeaderShell>
    </>
  )
}
