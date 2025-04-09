'use server'

type GetReviewsOptions = {
  locale: ILocale
  page?: number
  limit?: number
}

type ReviewsWithPaginationData =
  | {
      dataLocalized: IReviewLocal[]
      currentPage?: number
      totalPages?: number
      totalReviews?: number
      success: true
      message: string
    }
  | {
      success: false
      message: string
    }

const url = process.env.NEXT_URL

export async function getReviews({
  locale,
  page,
  limit,
}: GetReviewsOptions): Promise<ReviewsWithPaginationData> {
  try {
    const response = await fetch(`${url}/api/reviews/all`, {
      cache: 'force-cache',
      next: { tags: ['reviews'] },
    })
    if (response.status !== 200) {
      console.error(`Помилка при отриманні відгуків: `, response)
      return {
        success: false,
        message: 'Помилка при отриманні відгуків',
      }
    }
    const data = await response.json()
    if (limit && page) {
      return {
        dataLocalized: formatReviews(data, locale),
        currentPage: page,
        totalPages: Math.ceil(data.length / limit),
        totalReviews: data.length,
        success: true,
        message: 'PReviews retrieved',
      }
    } else {
      return {
        dataLocalized: formatReviews(data, locale),
        success: true,
        message: 'PReviews retrieved',
      }
    }
  } catch (error) {
    console.error(`Помилка при отриманні відгуків: `, error)
    return {
      success: false,
      message: 'Помилка при отриманні відгуків',
    }
  }
}

const formatReviews = (reviews: IReview[], locale: ILocale) =>
  reviews.map((review) => ({
    _id: review._id?.toString(),
    author: review.author[locale],
    text: review.text[locale],
    rating: review.rating,
    updatedAt: review.updatedAt,
    createdAt: review.createdAt,
  }))
