import Link from 'next/link'
import Image from 'next/image'
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  MenuSection,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  MenuSeparator,
  Input,
  Field,
} from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import { useEffect, useState } from 'react'

import Lang from './lang'
import closeIcon from '/public/icons/close.svg'
import logo from '/public/icons/logo.svg'
import facebookIcon from '/public/icons/facebook.svg'
import instagramIcon from '/public/icons/instagram.svg'
import telIcon from '/public/icons/tel.svg'
import searchIcon from '/public/icons/search.svg'
import burgerIcon from '/public/icons/burger.svg'
import Button from './button'

import { headerLinks } from '../data/header-links'
import { hamburgerLinksMain } from '../data/header-links'
import { hamburgerLinksOther } from '../data/header-links'
import CartIcon from './cart-icon'

export default function HamburgerMenu() {
  const [isScroll, setIsScroll] = useState<boolean>(false)

  useEffect(() => {
    if (isScroll) {
      document.body.classList.add('no-scroll')
    } else {
      document.body.classList.remove('no-scroll')
    }
  }, [isScroll])

  return (
    <Menu>
      <MenuButton className="hidden lap:fixed lap:left-5 lap:top-8 lap:z-50 lap:block">
        <Image src={burgerIcon} alt="burger icon" width={32} height={32} />
      </MenuButton>

      <MenuItems
        anchor="bottom"
        transition
        className="bottom-0 right-0 z-40 origin-top bg-light_gray pb-6 pt-3 transition duration-200 ease-out [--anchor-gap:-64px] data-[closed]:scale-95 data-[closed]:opacity-0"
      >
        <MenuSection className="grid grid-cols-[2fr_1fr_1fr_auto] items-center px-5">
          <MenuItem>
            <button onClick={() => setIsScroll(false)}>
              <Image src={closeIcon} alt="close icon" />
            </button>
          </MenuItem>
          <MenuItem>
            <Link href="/">
              <Image src={logo} alt="slice drus icon" width={39} height={46} />
            </Link>
          </MenuItem>
          <MenuItem>
            <div className="justify-self-center">
              <Lang />
            </div>
          </MenuItem>
          <MenuItem>
            <CartIcon />
          </MenuItem>
        </MenuSection>

        <MenuSection className="px-8 pt-5">
          <div className="pb-4 font-semibold">Каталог</div>
          {headerLinks?.map((link) => {
            return (
              <MenuItem>
                <Link className="block w-min py-4" href="#">
                  {link.link}
                </Link>
              </MenuItem>
            )
          })}
        </MenuSection>

        <MenuSection className="px-8 pt-5">
          <Disclosure>
            <DisclosureButton className="group flex items-center gap-x-3 pb-4 font-semibold">
              Головна
              <ChevronDownIcon className="size-5 fill-black group-data-[open]:rotate-180" />
            </DisclosureButton>
            <DisclosurePanel
              transition
              className="origin-top bg-white transition duration-300 ease-out data-[closed]:-translate-y-6 data-[closed]:opacity-0"
            >
              {hamburgerLinksMain?.map((link) => {
                return (
                  <>
                    <MenuItem>
                      {({ close }) => (
                        <Link
                          href="#"
                          onClick={close}
                          className="block px-3 py-4"
                        >
                          {link.link}
                        </Link>
                      )}
                    </MenuItem>
                    <MenuSeparator className="my-1 h-px bg-light_gray" />
                  </>
                )
              })}
            </DisclosurePanel>
          </Disclosure>
        </MenuSection>

        <MenuSection className="px-8 pt-2">
          {hamburgerLinksOther?.map((link) => {
            return (
              <MenuItem>
                <Link className="block w-min py-4" href="#">
                  {link.link}
                </Link>
              </MenuItem>
            )
          })}
        </MenuSection>

        <MenuSection className="flex justify-center gap-x-5 pt-5">
          <MenuItem>
            <Link href="#">
              <Image
                src={facebookIcon}
                alt="facebook icon"
                width={32}
                height={32}
                className="cursor-pointer"
              />
            </Link>
          </MenuItem>
          <MenuItem>
            <Link href="#">
              <Image
                src={instagramIcon}
                alt="insta icon"
                width={32}
                height={32}
                className="cursor-pointer"
              />
            </Link>
          </MenuItem>
        </MenuSection>

        <MenuSection className="flex justify-center gap-x-3 pt-5">
          <Image src={telIcon} alt="tel icon" width={24} height={24} />
          <MenuItem>
            <Link href="tel:+380123456789" className="font-medium">
              +380123456789
            </Link>
          </MenuItem>
        </MenuSection>

        <MenuSection className="px-8 pt-5">
          <form
            action="/logout"
            method="post"
            className="flex justify-center gap-x-4"
          >
            <Field className="relative">
              <Input
                name="search"
                type="text"
                className="h-8 w-56 rounded-sm"
              />
              <Image
                src={searchIcon}
                alt="search icon"
                className="absolute right-1 top-0"
              />
            </Field>
            <MenuItem>
              <Button
                type="submit"
                text="Шукати"
                className="block h-8 w-[88px]"
              ></Button>
            </MenuItem>
          </form>
        </MenuSection>
      </MenuItems>
    </Menu>
  )
}
