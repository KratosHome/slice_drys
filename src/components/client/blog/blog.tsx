// Імпорт компонентів і хуків
'use client'
import { useState, useEffect } from 'react'
import { getPosts } from '@/server/posts/get-posts.server'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/client/ui/pagination'
import Image from 'next/image'

interface BlogProps {
  locale: string
}

// Компонент блогу
export default function Blog({ locale }: BlogProps) {
  const [page, setPage] = useState(1) // Стан для зберігання поточної сторінки
  const [posts, setPosts] = useState<IPost[]>([]) // Стан для зберігання дописів

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await getPosts(locale, page, 8) // Отримання дописів
      const posts = data.post
      setPosts(posts)
    }

    fetchPosts() // Виклик функції для отримання дописів
  }, [locale, page]) // Залежність від locale і page

  const handleNext = () => {
    setPage((prevPage) => prevPage + 1) // Збільшення номера сторінки
  }

  const handlePrevious = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1) // Зменшення номера сторінки
    }
  }

  return (
    <div>
      {posts.length > 0 && ( // Перевірка наявності дописів
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {posts.slice(0, 2).map(
              (
                post,
                index, // Ітерація по перших двох дописах
              ) => (
                <div key={index}>
                  <h2>{post.title}</h2> {/* Відображення заголовку допису */}
                  <Image
                    width={250}
                    height={250}
                    src={post.img}
                    alt={`Image ${index}`} // Альтернативний текст з номером зображення
                  />
                </div>
              ),
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {posts.slice(2, 4).map(
              (
                post,
                index, // Ітерація по решті дописів
              ) => (
                <div key={index}>
                  <h2>{post.title}</h2> {/* Відображення заголовку допису */}
                  <Image
                    width={250}
                    height={250}
                    src={post.img}
                    alt={`Image ${index + 2}`} // Альтернативний текст з номером зображення
                  />
                </div>
              ),
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {posts.slice(4).map(
              (
                post,
                index, // Ітерація по решті дописів
              ) => (
                <div key={index}>
                  <h2>{post.title}</h2> {/* Відображення заголовку допису */}
                  <Image
                    width={250}
                    height={250}
                    src={post.img}
                    alt={`Image ${index + 2}`} // Альтернативний текст з номером зображення
                  />
                </div>
              ),
            )}
          </div>
        </>
      )}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" onClick={handlePrevious} />{' '}
            {/* Кнопка попередня сторінка */}
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">{page}</PaginationLink>{' '}
            {/* Поточна сторінка */}
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" onClick={handleNext} />{' '}
            {/* Кнопка наступна сторінка */}
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
