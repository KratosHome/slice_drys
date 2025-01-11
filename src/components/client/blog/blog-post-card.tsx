import Image from 'next/image' // Імпортуємо компонент Image з next/image

interface BlogPostCardProps {
  key: any
  image: string
  title: string
  date: string
}

export default function BlogPostCard({
  key,
  image,
  title,
  date,
}: BlogPostCardProps) {
  return (
    <div key={key} className="ml-5 mr-5 flex-1">
      <div className="relative w-full pb-[75%]">
        <Image src={image} alt="img" layout="fill" objectFit="cover" />
      </div>
      <h3>{date}</h3>
      <h2>{title}</h2>
    </div>
  )
}
