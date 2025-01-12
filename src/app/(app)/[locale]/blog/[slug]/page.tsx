'use client'

import { useParams } from 'next/navigation'
import { getPostBySlug } from '@/server/posts/get-posts.server'
import { useEffect, useState } from 'react'

// Визначаємо тип даних для поста

export default function ProductPage() {
  const params = useParams()
  const slug = params.slug as string

  // Оновлюємо типовий підпис стану
  const [post, setPost] = useState<IGetOnePost | null>(null)

  useEffect(() => {
    const fetchPost = async () => {
      const data: IGetOnePost = await getPostBySlug('uk', slug) // Отримання даних
      setPost(data) // Зберігаємо дані у стан
    }
    fetchPost()
  }, [slug])

  return (
    <div>
      <h1>{JSON.stringify(post)}</h1> {/* Відображуємо івпост */}
    </div>
  )
}
