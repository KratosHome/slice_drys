import { useTranslations } from 'next-intl'
import Image from 'next/image'

export default function AboutUs() {
  const t = useTranslations('AboutUs')

  return (
    <div>
      <div className="mx-auto flex w-full max-w-[1280] flex-col items-center p-5 pb-16">
        <div></div>
        <div className="mx-auto flex flex-col items-center">
          <div
            className="w-[100%] text-[96px]"
            style={{ fontFamily: 'var(--font-rubik-doodle-shadow)' }}
          >
            {t('about us')}
          </div>
          <Image
            src={'/icons/arc-arrow-down.svg'}
            alt="arc-arrow-down image"
            width={42}
            height={60}
            className="mr-auto -translate-x-8 -rotate-[20deg] pb-16 md:-translate-x-32 md:rotate-0"
          />
        </div>
        <div className="mr-auto flex min-w-[30%] flex-row items-center">
          <div className="justify-center bg-black px-6 py-12">
            <Image
              src={'/icons/logo-white.svg'}
              alt="logo-white"
              width={120}
              height={140}
            />
          </div>
          <div
            className="flex w-[100%] items-center justify-between text-[36px]"
            style={{ fontFamily: 'var(--font-rubik-doodle-shadow)' }}
          >
            <div className="flex-1"></div>
            <div className="flex-1">-</div>
            <div className="flex-1">{t('is')}</div>
          </div>
        </div>

        <div className="mt-20 max-w-[100%] items-end md:mt-20">
          <div className="float-right -mt-32 pl-10 md:-mt-80">
            <Image
              className="w-[350px] md:w-[500px]"
              src={'/images/pork.jpeg'}
              alt="pork image"
              width={500}
              height={675}
            />
          </div>
          <p className="min-w-[500px] text-[20px]">{t('description')}</p>
        </div>
      </div>

      <div className="flex justify-center bg-black py-20">
        <div className="flex max-w-[1280] flex-col-reverse lg:flex-row">
          <Image
            className="mr-10 mt-10 w-full flex-1"
            src={'/images/oranges-in-bag.png'}
            alt="pork image"
            width={550}
            height={675}
          />
          <div className="flex-1 flex-col justify-center">
            <div
              style={{ fontFamily: 'var(--font-rubik-doodle-shadow)' }}
              className="text-center text-[96px] text-white"
            >
              {t('mission')}
            </div>
            <div className="mx-auto w-[80%] py-10 text-center text-2xl leading-6 text-white">
              {t('mission description')}
            </div>
            <div
              style={{ fontFamily: 'var(--font-rubik-doodle-shadow)' }}
              className="mx-auto w-[60%] text-center text-[40px] text-white"
            >
              {t('bite')}
            </div>
            <Image
              className="mx-auto flex-1 p-5"
              src={'/images/curved-line.svg'}
              alt="pork image"
              width={358}
              height={13}
            />
          </div>
        </div>
      </div>

      <div className="mx-auto my-16 flex max-w-[1280] flex-col items-center justify-center lg:flex-row">
        <div className="ml-3 flex-1 pr-10 text-[20px]">
          {t('more description')}
        </div>
        <Image
          className="w-full flex-1 py-16 lg:py-0"
          src={'/images/beef-in-bag.png'}
          alt="pork image"
          width={550}
          height={675}
        />
      </div>
    </div>
  )
}
