import Link from 'next/link'
import Image from 'next/image'
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  MenuSection,
  MenuSeparator,
  Transition,
} from '@headlessui/react'
import { useState } from 'react'
import Button from '@/components/client/ui/button'
import LocaleChange from '../locale-change/locale-change'
import Cart from '@/components/client/cart/cart-button'
import Search from '@/components/client/search/search'

interface HamburgerMenu {
  headerLinks: ILink[]
  hamburgerLinksOther: ILink[]
}

export default function HamburgerMenu({
  headerLinks,
  hamburgerLinksOther,
}: HamburgerMenu) {
  const [isOpen, setIsOpen] = useState(false)

  const closeMenu = () => setIsOpen(!isOpen)

  const containerClasses = `tham tham-e-squeeze tham-w-6  ${isOpen ? 'tham-active' : ''}`

  return (
    <Menu>
      {isOpen && (
        <div
          className="fixed -top-[100px] z-50 h-screen w-full bg-black/50"
          onClick={() => setIsOpen(!isOpen)}
        ></div>
      )}
      <MenuButton
        onClick={() => setIsOpen(!isOpen)}
        className="block duration-300 hover:scale-110 lg:hidden lap:fixed lap:left-5 lap:top-8 lap:z-50"
      >
        <div className={containerClasses}>
          <div className="tham-box">
            <div className="tham-inner" />
          </div>
        </div>
      </MenuButton>
      <Transition
        appear
        show={isOpen}
        enter="transform transition duration-500 ease-out"
        enterFrom="-translate-x-full rotate-y-90"
        enterTo="translate-x-0 rotate-y-0"
        leave="transform transition duration-500 ease-in"
        leaveFrom="translate-x-0 rotate-y-0"
        leaveTo="-translate-x-full rotate-y-90"
      >
        <MenuItems
          anchor="bottom"
          className="absolute !top-[30px] left-0 !z-50 min-h-screen w-full bg-[#E4E4E4] px-[12px] py-[32px]"
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
                <div className="absolute bottom-0 left-0 right-0 top-0 group-data-[focus]:bg-red group-data-[focus]:blur-2xl"></div>
              </Link>
            </MenuItem>
            <MenuItem>
              <div className="group relative w-fit justify-self-center">
                <LocaleChange />
                <div className="absolute bottom-0 left-0 right-0 top-0 group-data-[focus]:bg-red group-data-[focus]:blur-2xl"></div>
              </div>
            </MenuItem>
            <MenuItem>
              <div className="group relative w-fit">
                <Cart />
                <div className="absolute bottom-0 left-0 right-0 top-0 group-data-[focus]:bg-red group-data-[focus]:blur-2xl"></div>
              </div>
            </MenuItem>
          </MenuSection>

          <MenuSection className="px-8 pt-5">
            <div className="pb-4 font-semibold">Каталог</div>
            {headerLinks?.map((link: ILink) => {
              return (
                <MenuItem key={link.id}>
                  <Link
                    className="group relative block w-min py-4"
                    href={link.href}
                  >
                    {link.name}
                    <div className="absolute bottom-0 left-0 right-0 top-0 group-data-[focus]:bg-red group-data-[focus]:blur-2xl"></div>
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
                    <div className="absolute bottom-0 left-0 right-0 top-0 group-data-[focus]:bg-red group-data-[focus]:blur-2xl"></div>
                  </Link>
                </MenuItem>
              )
            })}
          </MenuSection>

          <MenuSection className="flex justify-center gap-x-5 pt-5">
            <MenuItem>
              <Link href="#" className="group relative w-fit">
                <Image
                  src={'/icons/facebook.svg'}
                  alt="facebook icon"
                  width={32}
                  height={32}
                  className="cursor-pointer"
                />
                <div className="absolute bottom-0 left-0 right-0 top-0 group-data-[focus]:bg-red group-data-[focus]:blur-2xl"></div>
              </Link>
            </MenuItem>
            <MenuItem>
              <Link href="#" className="group relative w-fit">
                <Image
                  src={'/icons/instagram.svg'}
                  alt="insta icon"
                  width={32}
                  height={32}
                  className="cursor-pointer"
                />
                <div className="absolute bottom-0 left-0 right-0 top-0 group-data-[focus]:bg-red group-data-[focus]:blur-2xl"></div>
              </Link>
            </MenuItem>
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
                href="tel:+380123456789"
                className="group relative font-medium"
              >
                +380123456789
                <div className="absolute bottom-0 left-0 right-0 top-0 group-data-[focus]:bg-red group-data-[focus]:blur-2xl"></div>
              </Link>
            </MenuItem>
          </MenuSection>

          <MenuSection className="px-8 pt-5">
            <Search />
            <MenuItem>
              <button
                type="submit"
                className="group relative block h-8 w-[88px] bg-black text-sm text-white"
              >
                Шукати
                <div className="absolute bottom-0 left-0 right-0 top-0 group-data-[focus]:bg-red group-data-[focus]:blur-2xl"></div>
              </button>
            </MenuItem>
          </MenuSection>
        </MenuItems>
      </Transition>
    </Menu>
  )
}
