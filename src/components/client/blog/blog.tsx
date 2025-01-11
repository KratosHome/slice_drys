'use client'
import { useState, useEffect } from 'react' // Імпорт хуків
import { getPosts } from '@/server/posts/get-posts.server'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/client/ui/pagination'

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
      <div>{JSON.stringify(posts)}</div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" onClick={handlePrevious} />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">{page}</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" onClick={handleNext} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
