'use client'
import { useRef, useState } from 'react'
import { FC } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Info from './header-info'
import HamburgerMenu from './hamburger-menu'
import { useLocale, useTranslations } from 'next-intl'
import Button from '@/components/client/ui/button'
import LocaleChange from '@/components/client/header/locale-change/locale-change'
import Cart from '@/components/client/header/card/cart'
import NumberCall from '@/components/client/header/number-call/number-call'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { Label } from '@/components/admin/ui/label'
import { Input } from '@/components/admin/ui/input'
import { callMeBack } from '@/server/info/call-me-back'
import { useForm, Controller } from 'react-hook-form'
import ForwardedMaskedInput from '@/components/client/ui/ForwardedMaskedInput'

gsap.registerPlugin(ScrollTrigger)

interface HeaderP {
  headerLinks: ILink[]
}

interface FormData {
  name: string
  phoneNumber: string
}

const Header: FC<HeaderP> = ({ headerLinks }) => {
  const t = useTranslations('main.header')
  const local = useLocale()
  const headerRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLAnchorElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const socialRef = useRef<HTMLDivElement>(null)
  const cullRef = useRef<HTMLDivElement>(null)
  const curtRef = useRef<HTMLDivElement>(null)

  const [isCallOpen, setIsCallOpen] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      phoneNumber: '+38 (0',
    },
  })

  const sendCall = async (data: FormData) => {
    await callMeBack({
      name: data.name,
      phoneNumber: data.phoneNumber,
    })
    reset()
    setIsCallOpen(false)
  }

  useGSAP(() => {
    const mm = gsap.matchMedia()

    mm.add('(min-width: 1024px)', () => {
      const tl = gsap.timeline({
        defaults: { duration: 0.5, ease: 'power1.out' },
        scrollTrigger: {
          trigger: headerRef.current,
          start: 'top top',
          end: '+=200px',
          scrub: true,
          toggleActions: 'play none none reverse',
        },
      })

      tl.to(
        headerRef.current,
        {
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          height: '60px',
          marginTop: '0px',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          duration: 0.5,
          minWidth: '100vw',
          ease: 'power1.out',
        },
        0,
      )

      tl.to(menuRef.current, { padding: '0px 20px' }, '<')
      tl.to(logoRef.current, { scale: 0.3, y: -30 }, '<')
      tl.to(socialRef.current, { opacity: 0, y: -30 }, '<')
      tl.to(cullRef.current, { opacity: 0, y: -30 }, '<')
    })

    mm.add('(max-width: 1023px)', () => {
      const tl = gsap.timeline({
        defaults: { duration: 0.4, ease: 'power1.out' },
        scrollTrigger: {
          trigger: headerRef.current,
          start: 'top top',
          end: '+=200px',
          scrub: true,
          toggleActions: 'play none none reverse',
        },
      })

      tl.to(
        headerRef.current,
        {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(5px)',
          marginTop: '0px',
          boxShadow: '0px 3px 8px rgba(0, 0, 0, 0.08)',
          duration: 0.5,
          ease: 'power1.out',
        },
        0,
      )

      tl.to(curtRef.current, { marginTop: '10px' }, 0)
      tl.to(logoRef.current, { x: -20 }, '<')
      tl.to(menuRef.current, { padding: '0px 10px' }, '<')
      tl.to(socialRef.current, { opacity: 0, y: -15 }, '<')
      tl.to(cullRef.current, { opacity: 0, display: 'none', y: -15 }, '<')
    })
  })

  return (
    <>
      <Info title={`${t('free-delivery-from')}`} />
      <header
        ref={headerRef}
        className="fixed left-1/2 top-0 z-50 mt-6 w-full max-w-[1240px] -translate-x-1/2 border-b-[1px] border-[#E4E4E4] transition-all lg:pb-6"
      >
        <div
          ref={menuRef}
          className="mx-auto flex max-w-[1280px] items-center justify-between px-5 py-3"
        >
          <div>
            <nav className="hidden gap-3 lg:flex">
              {headerLinks?.map((link: ILink) => (
                <Link
                  key={link.id}
                  href={`/${local}/${link.href}`}
                  className="hover:text-red pr-3 text-[20px] transition-all duration-300 ease-in-out hover:scale-105"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            <HamburgerMenu headerLinks={headerLinks} hamburgerLinksOther={[]} />
            <div
              ref={socialRef}
              className="mt-5 hidden justify-end gap-x-5 pr-3 lg:flex"
            >
              <Button
                variant={'icons'}
                onClick={() =>
                  window.open(
                    'https://www.facebook.com/slicedrys/',
                    '_blank',
                    'noopener,noreferrer',
                  )
                }
              >
                <Image
                  src={'/icons/facebook.svg'}
                  alt={`${t('facebook-icon')}`}
                  width={32}
                  height={32}
                  className="cursor-pointer"
                />
              </Button>
              <Button
                variant={'icons'}
                onClick={() =>
                  window.open(
                    'https://www.instagram.com/slicedrys',
                    '_blank',
                    'noopener,noreferrer',
                  )
                }
              >
                <Image
                  src={'/icons/instagram.svg'}
                  alt={`${t('instagram-icon')}`}
                  width={32}
                  height={32}
                  className="cursor-pointer"
                />
              </Button>
            </div>
          </div>
          <Link
            ref={logoRef}
            href={`/${local}`}
            className="ml-[55px] py-3 lg:py-0"
          >
            <Image
              src={'/icons/logo.svg'}
              alt={`${t('logo')}`}
              className="h-[70px] w-[59px] transition-transform duration-300 ease-in-out lg:h-[100px] lg:w-[86px]"
              width={86}
              height={100}
            />
          </Link>
          <div>
            <div className="flex justify-center lg:justify-end">
              <nav className="mr-[52px] hidden gap-x-3 text-[20px] lg:flex">
                <Link
                  href={`/${local}/blog`}
                  className="hover:text-red p-3 text-[20px] transition-all duration-300 ease-in-out hover:scale-105"
                >
                  {t('blog')}
                </Link>
                <Link
                  href={`/${local}/opt`}
                  className="hover:text-red p-3 text-[20px] transition-all duration-300 ease-in-out hover:scale-105"
                >
                  {t('wholesale')}
                </Link>
                <Link
                  href={`/${local}/contacts`}
                  className="hover:text-red p-3 text-[20px] transition-all duration-300 ease-in-out hover:scale-105"
                >
                  {t('contacts')}
                </Link>
              </nav>
              <div ref={curtRef} className="flex items-center gap-x-4">
                <LocaleChange className="hidden lg:block" />
                <Cart />
              </div>
            </div>
            <div ref={cullRef} className="mt-3 flex justify-between">
              <NumberCall className="hidden lg:flex" />
              <Dialog open={isCallOpen} onOpenChange={setIsCallOpen}>
                <DialogTrigger asChild>
                  <Button type="button" variant="button">
                    {t('order')}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Зворотній дзвінок</DialogTitle>
                    <DialogDescription>
                      Залиште свої дані і ми вам перетелефонуємо
                    </DialogDescription>
                  </DialogHeader>
                  <form
                    onSubmit={handleSubmit(sendCall)}
                    className="grid gap-4 py-4"
                  >
                    <div className="flex flex-col items-start">
                      <Label htmlFor="name" className="text-right">
                        Ваше імя
                      </Label>
                      <Input
                        id="name"
                        placeholder="Введіть ваше ім'я"
                        {...register('name', { required: "Введіть ім'я" })}
                      />
                      {errors.name && (
                        <p className="text-sm text-red-500">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-start">
                      <Label htmlFor="phoneNumber" className="text-right">
                        Номер телефону
                      </Label>
                      <Controller
                        control={control}
                        name="phoneNumber"
                        rules={{
                          required: 'Введіть номер телефону',
                          validate: (value: string) =>
                            value && value.length === 18
                              ? true
                              : 'Введіть повний номер телефону',
                        }}
                        render={({
                          field: { onChange, onBlur, value, ref },
                        }) => {
                          const prefix = '+38 (0'
                          const handleChange = (
                            e: React.ChangeEvent<HTMLInputElement>,
                          ) => {
                            let newVal = e.target.value
                            if (!newVal.startsWith(prefix)) {
                              newVal = prefix
                            }
                            onChange(newVal)
                          }
                          return (
                            <ForwardedMaskedInput
                              id="phoneNumber"
                              mask={[
                                '+',
                                /\d/,
                                /\d/,
                                ' ',
                                '(',
                                /\d/,
                                /\d/,
                                /\d/,
                                ')',
                                ' ',
                                /\d/,
                                /\d/,
                                /\d/,
                                '-',
                                /\d/,
                                /\d/,
                                /\d/,
                                /\d/,
                              ]}
                              placeholder={prefix}
                              guide={false}
                              onBlur={onBlur}
                              onChange={handleChange}
                              value={value}
                              ref={ref}
                              className="h-[48px] w-full rounded-[8px] border-[1px] border-black bg-transparent px-[8px] py-[14px] text-[16px] text-black placeholder-black dark:border-white dark:text-[white] dark:placeholder-[#FAFAFA]"
                            />
                          )
                        }}
                      />
                      {errors.phoneNumber && (
                        <p className="text-sm text-red-500">
                          {errors.phoneNumber.message}
                        </p>
                      )}
                    </div>
                    <Button type="submit" variant="button">
                      {t('order')}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}

export default Header
