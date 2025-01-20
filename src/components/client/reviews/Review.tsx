interface ReviewsProps {
  text: string
  author: string
  variant: string
}

export default function Reviews({ text, author, variant }: ReviewsProps) {
  return (
    // Перевіряємо, чи варіант "grey", і рендеримо div лише в цьому випадку
    variant === 'grey' ? (
      <div className="mx-5 mx-auto my-10 max-w-[900px] pr-16">
        <div className="w-full border border-black bg-[#E4E4E4]">
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
    ) : variant === 'black' ? (
      <div className="mx-5 mx-auto my-10 max-w-[900px]">
        <div className="w-full border border-black bg-black text-white">
          <div className="px-10 py-5 pr-40">
            <div className="pb-2 font-bold">{author}</div>
            <div>{text}</div>
          </div>
          <div
            className="h-0 -translate-x-5 -translate-y-40 text-end text-[200px]"
            style={{ fontFamily: 'var(--font-rubik-doodle-shadow)' }}
          >
            “
          </div>
        </div>
      </div>
    ) : variant === 'grey-white' ? (
      <div className="mx-5 mx-auto my-10 max-w-[900px] pr-20">
        <div className="w-full bg-[#E4E4E4] p-5">
          <div className="w-full bg-white p-2">
            <div
              className="h-0 -translate-x-16 -translate-y-16 text-[96px]"
              style={{ fontFamily: 'var(--font-rubik-doodle-shadow)' }}
            >
              “
            </div>

            <div className="px-2">
              <div className="pb-2 font-bold">{author}</div>

              <div>{text}</div>
            </div>
            <div
              className="h-0 -translate-y-10 translate-x-16 text-end text-[96px]"
              style={{ fontFamily: 'var(--font-rubik-doodle-shadow)' }}
            >
              “
            </div>
          </div>
        </div>
      </div>
    ) : null
  )
}
