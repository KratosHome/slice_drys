import { useTranslations } from 'next-intl'

const ContactsTitle = () => {
  const t = useTranslations('Contacts')
  return (
    <div className="flex">
      <div className="mb-10 mt-10 flex justify-between">
        <div className="flex w-full flex-wrap justify-between">
          <div className="flex w-[100%] min-w-[300px] sm:w-[34%]">
            <div
              className="w-[100%] text-[128px]"
              style={{ fontFamily: 'var(--font-rubik-doodle-shadow)' }}
            >
              {t('Contacts')}
            </div>
          </div>

          <div className="flex w-[100%] items-center sm:w-[65%]">
            <div className="flex h-min w-full items-center justify-center bg-black p-5 text-left font-poppins text-xl text-white drop-shadow-[16px_-16px_0px_#A90909]">
              {t('title')}
              <p>{t('email')}</p>
              <p>{t('phone')}</p>
              <p>{t('address')}</p>
              <p>{t('openTime')} - {t('closeTime')}</p>
            </div>

          </div>
        </div>
      </div>
      <div className="my-4 border-t border-dashed border-black"></div>
    </div>
  )
}

export default ContactsTitle
