'use client'
export default function ToTheTop() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="mx-auto flex max-w-[1280px] justify-end">
      <div
        className="font-rubik inline-block rotate-90 cursor-pointer text-[96px]"
        onClick={scrollToTop}
      >
        {'<'}
      </div>
    </div>
  )
}
