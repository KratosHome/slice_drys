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
import BlogPostCard from './blog-post-card'

interface BlogProps {
  locale: string
}

export default function Blog({ locale }: BlogProps) {
  const [page, setPage] = useState(1)
  const [posts, setPosts] = useState<IPost[]>([])

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await getPosts(locale, page, 8)
      const posts = data.post
      setPosts(posts)
    }

    fetchPosts()
  }, [locale, page])

  const handleNext = () => {
    setPage((prevPage) => prevPage + 1)
  }

  const handlePrevious = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1)
    }
  }

  return (
    <div>
      {posts.length > 0 && ( // Перевірка наявності дописів
        <div className="m-20">
          <div className="flex basis-2/5 justify-between">
            {posts.slice(0, 2).map((post, index) => (
              <BlogPostCard
                key={index}
                image={post.img}
                date={new Date(post.updatedAt).toLocaleDateString('uk-UA')}
                title={post.title}
              />
            ))}
          </div>
          <div className="flex flex-wrap justify-between">
            {posts.slice(2).map((post, index) => (
              <div key={index} className="basis-1/3">
                <BlogPostCard
                  key={index}
                  image={post.img}
                  date={new Date(post.updatedAt).toLocaleDateString('uk-UA')}
                  title={post.title}
                />
              </div>
            ))}
          </div>
        </div>
      )}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" onClick={handlePrevious} />{' '}
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">{page}</PaginationLink>{' '}
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" onClick={handleNext} />{' '}
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
