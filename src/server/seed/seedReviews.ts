'use server'
import { connectToDb } from '@/server/connectToDb'
import { Reviews } from '@/server/reviews/reviewsSchema'
import { reviewsData } from '@/data/main/reviews'

export const seedReviews = async () => {
  'use server'
  try {
    await connectToDb()

    const count = await Reviews.countDocuments()
    if (count !== 0) {
      return {
        success: false,
        message: 'Reviews already exist. No changes were made.',
      }
    }

    await Reviews.create(reviewsData)

    return {
      success: true,
      message: 'Reviews seeded successfully',
    }
  } catch (error) {
    return {
      success: false,
      message: `Error: ${error}`,
    }
  }
}
