'use server'
import { instaData } from '@/data/main/instaFeed'

export async function getFeed(limit: number) {
  const accessToken = process.env.INSTAGRAM_TOKEN // Должен быть из Instagram Graph API
  const userId = process.env.INSTAGRAM_ID // ID Instagram Business/Creator аккаунта
  const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink'
  const url = `https://graph.instagram.com/${userId}/media?fields=${fields}&limit=${limit}&access_token=${accessToken}`

  if (!accessToken) {
    console.log('No access token, returning mock data...')
    return new Promise((resolve) => {
      setTimeout(() => resolve(instaData.slice(0, limit)), 500)
    })
  }

  const res = await fetch(url)
  const data = await res.json()
  return data.data
}
