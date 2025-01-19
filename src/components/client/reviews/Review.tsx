interface ReviewsProps {
  text: string
  author: string
  variant: string
}

export default function Reviews({ text, author, variant }: ReviewsProps) {
  return (
    // Перевіряємо, чи варіант "grey", і рендеримо div лише в цьому випадку
    variant === 'grey' ? (
      <div className="h-24 w-96 bg-gray-500">
        <div>{author}</div>
        {text}
      </div>
    ) : null
  )
}
