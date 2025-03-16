import Image from 'next/image'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

export default async function NotFoundPage() {
  const t = await getTranslations('not_found_page')

  const fruits = [
    {
      src: 'orange',
      className: 'absolute left-5 top-5 w-24',
      alt: t('fruit.orange'),
    },
    {
      src: 'mango',
      className: 'absolute left-[140px] top-[250px] hidden w-12 md:block',
      alt: t('fruit.mango'),
    },
    {
      src: 'pear',
      className:
        'absolute left-[40px] top-[650px] hidden w-24 rotate-[-120deg] md:block',
      alt: t('fruit.pear'),
    },
    {
      src: 'pineapple',
      className: 'absolute bottom-24 left-36 h-12 w-12',
      alt: t('fruit.pineapple'),
    },
    {
      src: 'ginger',
      className: 'absolute bottom-10 left-[40px] h-12 w-12',
      alt: t('fruit.ginger'),
    },
    {
      src: 'grapefruit',
      className: 'absolute right-10 top-12 w-28',
      alt: t('fruit.grapefruit'),
    },
    {
      src: 'ginger',
      className: 'absolute right-[140px] top-[200px] w-16',
      alt: t('fruit.ginger'),
    },
    {
      src: 'mango',
      className: 'absolute right-[50px] top-[300px] hidden w-16 md:block',
      alt: t('fruit.mango'),
    },
    {
      src: 'orange',
      className: 'absolute bottom-[400px] right-0 w-12 rotate-45',
      alt: t('fruit.orange'),
    },
    {
      src: 'pineapple',
      className: 'absolute bottom-[300px] right-[50px] w-16 rotate-45',
      alt: t('fruit.pineapple'),
    },
    {
      src: 'pineapple',
      className: 'absolute bottom-[100px] right-[140px] hidden w-16 md:block',
      alt: t('fruit.pineapple'),
    },
    {
      src: 'kiwi',
      className: 'absolute bottom-5 right-5 w-10',
      alt: t('fruit.kiwi'),
    },
  ]

  return (
    <div className="relative mx-auto flex min-h-[calc(100vh-190px)] max-w-[1280px] flex-col items-center justify-center bg-white px-5">
      <div className="text-center">
        <div className="relative inline-block">
          <h1 className="relative flex items-center font-rubik text-[100px] text-black drop-shadow-lg sm:text-[138px] md:text-[250px]">
            <span className="relative">4</span>
            <span className="relative mx-4">
              <div className="absolute z-[-1] size-32 rounded-full bg-gradient-to-r from-yellow-200 to-orange-300 opacity-[0.5] blur-3xl md:size-64" />
              <Image
                src="/slider/fruit.webp"
                alt={t('fruitAlt')}
                className="w-32 md:w-64"
                width={232}
                height={232}
              />
            </span>
            <span className="relative">4</span>
          </h1>
        </div>
        <p className="text-[20px] text-gray-700">
          {t('notFoundMessage')}{' '}
          <Link
            href={'/'}
            className="text-red-400 duration-300 hover:text-red-600"
          >
            {t('goHome')}
          </Link>
        </p>
      </div>

      <div className="pointer-events-none absolute inset-0">
        {fruits.map((fruit, index) => (
          <Image
            key={index}
            src={`/slider/fruit/${fruit.src}.webp`}
            alt={fruit.alt}
            className={fruit.className}
            width={132}
            height={132}
          />
        ))}
      </div>
    </div>
  )
}
