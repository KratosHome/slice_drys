'use client'
import React from 'react'
import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'

import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Input } from '@/components/ui/input'
import SpinnerBtn from '@/components/ui/spinner-btn'
import { subscribeServer } from '@/server/subscribe/subscribe.server'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/utils/cn'
import { Button } from '@/components/ui/button'
import UnderlineWave from '@/components/ui/underline-wave'

function BlogFooter() {
  const locale = useLocale() as ILocale
  const t = useTranslations('blog')
  const tToast = useTranslations('toast')
  const { toast } = useToast()
  const [isLoading, setIsLoading] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    const formData = new FormData(e.currentTarget)
    const resp = await subscribeServer(formData.get('email') as string)
    setIsLoading(false)
    if (resp.success) {
      ;(e.target as HTMLFormElement).reset()
      toast({
        duration: 3000,
        title: tToast('success'),
        description: resp.message[locale],
      })
    } else {
      toast({
        variant: 'destructive',
        title: tToast('error'),
        description: resp.message[locale],
      })
    }
  }
  return (
    <section className="container mt-[83px] md:mt-[120px]">
      <p className="font-rubik bg-foreground text-background w-[77%] p-3 text-[clamp(20px,calc(20px+28*(100vw-375px)/1065),48px)] shadow-[-10px_10px_0px_#A90909] md:px-8 md:py-6 md:shadow-[-16px_17px_0px_#A90909]">
        {t('description-bottom')}
      </p>
      <div className="relative mt-[50px] ml-auto w-fit max-w-[73%] pb-3 text-base md:max-w-none md:pb-5 md:text-xl">
        {t('email-caption')}
        <UnderlineWave />
      </div>
      <div className="mb-[100px] grid items-center md:grid-cols-2">
        <div className="row-span-3 hidden md:block">
          <AspectRatio ratio={484 / 433}>
            <Image
              src="/images/Вag-Logo.webp"
              fill
              alt={t('handbag')}
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </AspectRatio>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 flex flex-col items-center justify-center"
        >
          <div>
            <span className="animate-follow font-rubik block text-[108px] leading-none">
              {'>'}
            </span>
          </div>
          <Input
            placeholder={t('email-placeholder')}
            type="email"
            required
            name="email"
            className="mt-[70px] h-[60px]! w-full max-w-[550px] p-4 text-base leading-normal md:px-4 md:py-[18px] md:text-xl"
          ></Input>
          <Button
            variant="button"
            className={cn(
              'mt-[80px] flex h-[60px]! items-center px-[60px] md:mt-[90px]',
            )}
            disabled={isLoading}
          >
            <SpinnerBtn show={isLoading} />
            {t('submit-btn')}
          </Button>
        </form>
      </div>
    </section>
  )
}

export default BlogFooter
