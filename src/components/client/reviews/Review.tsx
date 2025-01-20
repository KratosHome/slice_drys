interface ReviewsProps {
  text: string
  author: string
  variant: string
}

export default function Reviews({ text, author, variant }: ReviewsProps) {
  return (
    // Перевіряємо, чи варіант "grey", і рендеримо div лише в цьому випадку
    variant === 'grey' ? (
      <div className="mx-5">
        <div className="mx-auto w-full max-w-[800px] border border-black bg-[#E4E4E4]">
          <div
            className="h-0 -translate-x-7 -translate-y-5 text-[96px]"
            style={{ fontFamily: 'var(--font-rubik-doodle-shadow)' }}
          >
            “
          </div>

          <div className="px-10 py-5">
            <div className="pb-2 font-bold">{author}</div>

            <div>{text}</div>
          </div>
          <div
            className="h-0 -translate-y-20 translate-x-7 text-end text-[96px]"
            style={{ fontFamily: 'var(--font-rubik-doodle-shadow)' }}
          >
            “
          </div>
        </div>
      </div>
    ) : null
  )
}
