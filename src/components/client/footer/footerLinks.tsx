import { FC } from 'react'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { useIsMobile } from '@/hooks/use-mobile'

interface FooterLinksP {
  links: ILink[]
}

const FooterLinks: FC<FooterLinksP> = ({ links }) => {
  const local = useLocale()
  const isMobile = useIsMobile()

  return (
    <>
      {links?.map((link: ILink) => {
        const additionalStyles =
          isMobile && link.id > 4
            ? 'self-end text-right'
            : link.id > 6 ? 'self-end text-right' : ''

        return (
          <Link
            key={link.id}
            href={`/${local}/${link.href}`}
            className={`w-32 p-3 text-[20px] transition-all duration-300 ease-in-out hover:scale-105 hover:text-red ${additionalStyles}`}
          >
            {link.name}
          </Link>
        )
      })}
    </>
  )
}

export default FooterLinks
