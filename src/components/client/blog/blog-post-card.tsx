import Image from 'next/image'
import Link from 'next/link'
import { useLocale } from 'next-intl'

interface BlogPostCardProps {
  key: any
  image: string
  title: string
  date: string
  slag?: string
}

export default function BlogPostCard({
  key,
  image,
  title,
  date,
  slag,
}: BlogPostCardProps) {
  const local = useLocale()
  slag = slag ? slag : '111'

  return (
    <Link href={`/${local}/blog/${slag}`}>
      <div key={key} className="ml-5 mr-5 flex-1 cursor-pointer">
        <div className="relative w-full pb-[75%]">
          <Image src={image} alt="img" layout="fill" objectFit="cover" />
        </div>
        <h3 className="text-left font-poppins text-lg font-normal text-gray-400">
          {date}
        </h3>
        <h2 className="text-left font-poppins text-2xl font-semibold">
          {title}
        </h2>
      </div>
    </Link>
  )
}
