'use client'

import { UnderlinedLink } from '@/components/ui/underlined-link'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

import { useEffect, useRef, useState, useId, type ReactNode } from 'react'
import dynamic from 'next/dynamic'
import { cn } from '@/utils/cn'
import { getPaginationRange } from '@/utils/get-pagination-range'

const ReviewDialog = dynamic(() => import('./review-dialog'), { ssr: false })

interface ReviewsContentProps {
  children: ReactNode[]
  heading: ReactNode
  reviewIds: number[]
  addReviewLabel: string
  pagination: boolean
}

const REVIEWS_PER_SET = 6

export default function ReviewsContent({
  children,
  heading,
  reviewIds,
  addReviewLabel,
  pagination,
}: ReviewsContentProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const [displayedReviewsSet, setDisplayedReviewsSet] = useState<number>(1)
  const [isReviewsOpen, setIsReviewsOpen] = useState<boolean>(false)
  const [hasOpenedDialog, setHasOpenedDialog] = useState(false)
  const dialogId = useId()
  const dialogTriggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (
      !section ||
      reducedMotion.matches ||
      !('IntersectionObserver' in window)
    )
      return

    let disposed = false
    let cleanupAnimation: (() => void) | undefined
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        void import('./review-animation')
          .then(({ animateReviews }) => {
            if (disposed || reducedMotion.matches) return
            cleanupAnimation = animateReviews(
              section,
              Array.from(listRef.current?.children ?? []) as HTMLLIElement[],
            )
          })
          .catch(() => {
            // Reviews remain visible if the optional animation cannot load.
          })
      },
      { rootMargin: '200px' },
    )

    const stopForReducedMotion = () => {
      if (!reducedMotion.matches) return
      disposed = true
      observer.disconnect()
      cleanupAnimation?.()
    }
    reducedMotion.addEventListener('change', stopForReducedMotion)
    observer.observe(section)

    return () => {
      disposed = true
      observer.disconnect()
      reducedMotion.removeEventListener('change', stopForReducedMotion)
      cleanupAnimation?.()
    }
  }, [displayedReviewsSet, reviewIds.length])

  const currentReviewsSet = children.slice(
    (displayedReviewsSet - 1) * REVIEWS_PER_SET,
    displayedReviewsSet * REVIEWS_PER_SET,
  )

  const totalPages: number = Math.ceil(reviewIds.length / REVIEWS_PER_SET)

  const currentPage: number = displayedReviewsSet

  if (reviewIds.length === 0) return null

  return (
    <section
      ref={sectionRef}
      aria-labelledby="reviews"
      className="section 1440:overflow-visible relative w-full max-w-[1280px] overflow-x-clip pb-[72px] before:absolute before:top-[50px] before:-left-14 before:z-[-1] before:h-[208px] before:w-[149px] before:rotate-[73deg] before:bg-no-repeat after:absolute after:top-[-10px] after:-right-20 after:z-[-1] after:h-[208px] after:w-[149px] after:rotate-[-27deg] after:bg-[url('/images/jerky.webp')] after:bg-no-repeat md:before:bg-[url('/images/jerky.webp')] md:after:top-[40%] md:after:-right-4 lg:pb-[96px] lg:before:left-0"
    >
      <span className="absolute inset-0 z-[-1] before:absolute before:bottom-[210px] before:-left-24 before:z-[-1] before:h-[195px] before:w-[243px] before:rotate-[0deg] before:bg-no-repeat md:before:bg-[url('/images/jerky1.webp')]" />
      <div className="mx-auto w-full max-w-[910px] px-[20px] pb-[50px] lg:px-0">
        {heading}
        <ul
          ref={listRef}
          className="mt-[clamp(23px,calc(23px+87*(100vw-375px)/1065),100px)] px-6 md:px-12 lg:px-0"
        >
          {currentReviewsSet}
        </ul>

        {totalPages > 1 && pagination ? (
          <Pagination className="mt-[60px] md:mt-[120px]">
            <PaginationContent>
              <PaginationItem
                className={cn(currentPage === 1 && 'cursor-auto')}
              >
                <PaginationPrevious
                  className="text-[36px] md:text-[64px]"
                  disabled={currentPage === 1}
                  href={`#review-${
                    currentPage - 2 > 0
                      ? reviewIds[(currentPage - 2) * REVIEWS_PER_SET]
                      : reviewIds[0]
                  }`}
                  onClick={() =>
                    setDisplayedReviewsSet(
                      currentPage === 1 ? 1 : currentPage - 1,
                    )
                  }
                />
              </PaginationItem>
              {getPaginationRange(currentPage, totalPages).map(
                (item, index) => {
                  if (item === 'ellipsis') {
                    return (
                      <PaginationItem key={`ellipsis-${index}`}>
                        <PaginationEllipsis className="text-xl sm:text-2xl md:text-4xl" />
                      </PaginationItem>
                    )
                  }
                  return (
                    <PaginationItem key={item}>
                      <PaginationLink
                        href={`#review-${reviewIds[(item - 1) * REVIEWS_PER_SET]}`}
                        disabled={currentPage === item}
                        isActive={currentPage === item}
                        className="text-xl sm:text-2xl md:text-4xl"
                        onClick={() => setDisplayedReviewsSet(item)}
                      >
                        {item}
                      </PaginationLink>
                    </PaginationItem>
                  )
                },
              )}

              <PaginationItem
                className={cn(currentPage === totalPages && 'cursor-auto')}
              >
                <PaginationNext
                  className="text-[36px] md:text-[64px]"
                  disabled={currentPage === totalPages}
                  href={`#review-${
                    currentPage !== totalPages
                      ? reviewIds[currentPage * REVIEWS_PER_SET]
                      : reviewIds[(currentPage - 1) * REVIEWS_PER_SET]
                  }`}
                  onClick={() =>
                    setDisplayedReviewsSet(
                      currentPage === totalPages ? totalPages : currentPage + 1,
                    )
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        ) : null}
      </div>
      <UnderlinedLink
        ref={dialogTriggerRef}
        as="button"
        type="button"
        aria-haspopup="dialog"
        aria-expanded={isReviewsOpen}
        aria-controls={isReviewsOpen ? dialogId : undefined}
        className="order-1 max-w-max cursor-pointer md:order-0"
        onClick={() => {
          setHasOpenedDialog(true)
          setIsReviewsOpen(true)
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape') setIsReviewsOpen(false)
        }}
      >
        {addReviewLabel}
      </UnderlinedLink>
      {hasOpenedDialog ? (
        <ReviewDialog
          id={dialogId}
          open={isReviewsOpen}
          onOpenChange={setIsReviewsOpen}
          triggerRef={dialogTriggerRef}
        />
      ) : null}
    </section>
  )
}
