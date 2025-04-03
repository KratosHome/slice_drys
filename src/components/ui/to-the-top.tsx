'use client'
export default function ToTheTop() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="mx-auto flex max-w-[1280px] justify-end">
      <div
        className="font-rubik mr-20 inline-block rotate-90 cursor-pointer text-[96px] transition-transform duration-300 hover:-translate-y-2 hover:scale-110 hover:text-stone-700"
        onClick={scrollToTop}
      >
        {'<'}
      </div>
    </div>
  )
}
