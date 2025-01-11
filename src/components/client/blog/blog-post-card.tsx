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
    <div key={key} className="m-20 flex-1">
      <div className="relative w-full pb-[75%]">
        <Image src={image} alt="img" layout="fill" objectFit="cover" />
        {/* <img
          src={image}
          alt="img"
          style={{ width: '100%', aspectRatio: '4 / 3' }}
        /> */}
      </div>
      <h3>{date}</h3>
      <h2>{title}</h2>
    </div>
  )
}
