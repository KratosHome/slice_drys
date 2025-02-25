import Link from 'next/link'
import Image from 'next/image'
import { useLocale } from 'next-intl'
import {
  Dialog,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  MenuSection,
  MenuSeparator,
} from '@headlessui/react'
import { useState, Children } from 'react'

import Button from '@/components/client/ui/button'
import LocaleChange from '@/components/client/header/locale-change/locale-change'
import Cart from '@/components/client/header/card/cart'
import Socials from '../ui/Socials'

import { contacts } from '@/data/main/contacts'
import { cn } from '@/utils/cn'

interface HamburgerMenu {
  productLinks: ILink[]
  hamburgerLinksOther: ILink[]
}

export default function HamburgerMenu({
  productLinks,
  hamburgerLinksOther,
}: HamburgerMenu) {
  const [isOpen, setIsOpen] = useState(false)
  const locale = useLocale()
  const closeMenu = () => setIsOpen(!isOpen)

  const containerClasses = `tham tham-e-squeeze tham-w-6  ${isOpen ? 'tham-active' : ''}`

  return (
    <Menu>
      {/* {isOpen && (
        <div
          className="!fixed -top-[100px] z-50 h-screen w-full bg-black/50"
          onClick={() => setIsOpen(!isOpen)}
        ></div>
      )} */}
      <MenuButton
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'relative active:scale-110 lg:hidden',
          isOpen ? '-top-[100px]' : 'top-0',
        )}
      >
        <div className={containerClasses}>
          <div className="tham-box">
            <div className="tham-inner" />
          </div>
        </div>
      </MenuButton>
      <Dialog
        open={isOpen}
        as="div"
        className="fixed z-[500] w-screen focus:outline-none"
        onClose={close}
      >
        <MenuItems
          anchor="bottom"
          className={cn(
            'h-[100svh] w-full bg-[#E4E4E4] px-[12px] py-[32px]',
            // Base styles
            // 'fixed h-full w-full border transition ease-in-out',
            // Shared closed styles
            // 'data-[closed]:opacity-0',
            // Entering styles
            // 'z-[500] data-[enter]:data-[closed]:-translate-x-full data-[enter]:duration-300',
            // Leaving styles
            // 'data-[leave]:data-[closed]:-translate-x-full data-[leave]:duration-300',
          )}
        >
          <MenuSection className="grid grid-cols-[2fr_1fr_1fr_auto] items-center px-5">
            <MenuItem>
              <Button onClick={closeMenu} type={'button'} variant={'icons'}>
                <div className={containerClasses}>
                  <div className="tham-box">
                    <div className="tham-inner" />
                  </div>
                </div>
              </Button>
            </MenuItem>

            <MenuItem>
              <Link href="/" className="group relative w-fit">
                <Image
                  src={'/icons/logo.svg'}
                  alt="slice drus icon"
                  width={39}
                  height={46}
                />
                <div className="group-data-[focus]:bg-red absolute inset-0 group-data-[focus]:blur-2xl"></div>
              </Link>
            </MenuItem>
            <MenuItem>
              <div className="group relative w-fit justify-self-center">
                <LocaleChange />
                <div className="group-data-[focus]:bg-red absolute inset-0 group-data-[focus]:blur-2xl"></div>
              </div>
            </MenuItem>
            <MenuItem>
              <div className="group relative w-fit">
                <Cart />
                <div className="group-data-[focus]:bg-red absolute inset-0 group-data-[focus]:blur-2xl"></div>
              </div>
            </MenuItem>
          </MenuSection>

          <MenuSection className="px-8 pt-5">
            <div className="pb-4 font-semibold">Каталог</div>
            {productLinks?.map((link: ILink) => {
              return (
                <MenuItem key={link.id}>
                  <Link
                    className="group relative block w-min py-4"
                    href={`/${locale}/${link.href}`}
                  >
                    {link.name}
                    <div className="group-data-[focus]:bg-red absolute inset-0 group-data-[focus]:blur-2xl"></div>
                  </Link>
                </MenuItem>
              )
            })}
          </MenuSection>

          <MenuSeparator className="mx-8 my-4 h-px bg-black" />

          <MenuSection className="px-8 pt-2">
            {hamburgerLinksOther?.map((link: ILink) => {
              return (
                <MenuItem key={link.id}>
                  <Link href="#" className="group relative block w-min py-4">
                    {link.name}
                    <div className="group-data-[focus]:bg-red absolute inset-0 group-data-[focus]:blur-2xl"></div>
                  </Link>
                </MenuItem>
              )
            })}
          </MenuSection>

          <MenuSection className="flex justify-center gap-x-5 pt-5">
            {Children.toArray(<Socials variant="dark" />).map(
              (child, index) => (
                <MenuItem key={index}>{child}</MenuItem>
              ),
            )}
          </MenuSection>

          <MenuSection className="flex justify-center gap-x-3 pt-5">
            <Image
              src={'/icons/tel.svg'}
              alt="tel icon"
              width={24}
              height={24}
            />
            <MenuItem>
              <Link
                href={`tel:${contacts.phone}`}
                className="group relative font-medium"
              >
                {contacts.phone}
                <div className="group-data-[focus]:bg-red absolute inset-0 group-data-[focus]:blur-2xl"></div>
              </Link>
            </MenuItem>
          </MenuSection>
        </MenuItems>

        {/* <Transition
        appear
        show={isOpen}
        enter="transform transition duration-500 ease-out"
        enterFrom="-translate-x-full rotate-y-90"
        enterTo="translate-x-0"
        leave="transform transition duration-500 ease-in"
        leaveFrom="translate-x-0"
        leaveTo="-translate-x-full rotate-y-90"
      > */}
        {/* <div className="fixed inset-y-0 left-0 transition duration-300 data-[closed]:-translate-x-full"> */}

        {/* </div> */}
        {/* </Transition> */}
      </Dialog>
    </Menu>
  )
}
