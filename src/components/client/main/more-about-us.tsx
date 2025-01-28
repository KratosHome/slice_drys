'use client'

import { FC } from 'react'
import { formatDate } from '@/utils/format-date'

interface MoreAboutUsProps {
  data: IPost[]
}

const MoreAboutUs: FC<MoreAboutUsProps> = ({ data }) => {
  return (
    <section
      aria-labelledby="partners"
      className="bg-black px-6 py-12 text-white"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-3xl font-bold">Більше про нашу діяльність</h2>
          <button className="flex items-center gap-2 rounded-full bg-gray-800 px-4 py-2 text-white transition hover:bg-gray-700">
            Блог <span className="text-lg">→</span>
          </button>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {data.map((post) => (
            <div
              key={post._id}
              className="overflow-hidden rounded-xl bg-gray-900"
            >
              <img
                src={post.img}
                alt={post.title}
                className="h-64 w-full object-cover"
              />
              <div className="p-4">
                <p className="text-lg font-medium">{post.title}</p>
                <p className="mt-2 text-sm text-gray-400">
                  {formatDate(post.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default MoreAboutUs
