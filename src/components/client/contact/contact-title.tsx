import { useTranslations } from 'next-intl'

const ContactTitle = () => {
  const t = useTranslations('Contacts')
  return (
    <div className="w-full">
      <div
        className="display: mt-8 block pl-[21px] text-5xl lg:text-9xl"
        style={{ fontFamily: 'var(--font-rubik-doodle-shadow)' }}
      >
        {t('Contacts')}
      </div>
      <div
        className="pr-5 pt-[27px] text-right text-base font-medium"
        style={{ fontFamily: 'var(--font-poppins)' }}
      >
        <p>{t('description')}</p>
      </div>
      <div className="flex w-full pt-1">
        <div className="ml-auto pr-[15px]">
          <svg
            width="282"
            height="15"
            viewBox="0 0 282 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 11.7873C17.2556 12.6522 33.7339 14.966 49.9946 13.5536C58.1186 12.848 66.1206 10.3655 74.1655 8.75929C95.1359 4.57246 116.308 4.91384 137.432 5.19506C162.21 5.52494 186.959 6.84621 211.729 7.62378C223.466 7.99224 234.705 8.0003 246.299 5.47894C257.914 2.95316 269.268 1.41487 281 1"
              stroke="#0F0F0F"
              stroke-linecap="round"
            />
            <path
              d="M1 11.7873C17.2556 12.6522 33.7339 14.966 49.9946 13.5536C58.1186 12.848 66.1206 10.3655 74.1655 8.75929C95.1359 4.57246 116.308 4.91384 137.432 5.19506C162.21 5.52494 186.959 6.84621 211.729 7.62378C223.466 7.99224 234.705 8.0003 246.299 5.47894C257.914 2.95316 269.268 1.41487 281 1"
              stroke="black"
              stroke-opacity="0.2"
              stroke-linecap="round"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}

export default ContactTitle
