'use client'

import { Splide, SplideSlide } from '@splidejs/react-splide'

const images = [
  'main/insta/image1.png',
  'main/insta/image2.png',
  'main/insta/image3.png',
  'main/insta/image4.png',
]

export default function AboutUs() {
  return (
    <section className="px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-3xl font-bold">Подорожуйте з нами</h2>
          <button className="flex items-center gap-2 rounded-full bg-gray-800 px-4 py-2 text-white transition hover:bg-gray-700">
            Ми у інстаграм <span className="text-lg">→</span>
          </button>
        </div>
        <Splide
          options={{
            type: 'loop',
            perPage: 4,
            perMove: 1,
            gap: '1rem',
            arrows: true,
            pagination: false,
            breakpoints: {
              768: { perPage: 2 },
              1024: { perPage: 4 },
            },
          }}
        >
          {images.map((image, index) => (
            <SplideSlide key={index}>
              <img
                src={image}
                alt={`Travel ${index}`}
                className="h-64 w-full rounded-xl object-cover"
              />
            </SplideSlide>
          ))}
        </Splide>
      </div>
    </section>
  )
}
