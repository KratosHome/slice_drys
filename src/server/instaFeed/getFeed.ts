'use server'
import { instaData } from '@/data/main/instaFeed'

export async function getFeed(limit: number) {
  const accessToken = process.env.INSTAGRAM_TOKEN
  const userId = process.env.INSTAGRAM_ID
  const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink'
  const url = `https://graph.instagram.com/${userId}/media?fields=${fields}&limit=${limit}&access_token=${accessToken}`

  if (!accessToken) {
    return new Promise((resolve) => {
      setTimeout(
        () =>
          resolve({
            data: instaData.slice(0, limit),
          }),
        0,
      )
    })
  }

  const res = await fetch(url)
  const data = await res.json()
  return data.data
}
