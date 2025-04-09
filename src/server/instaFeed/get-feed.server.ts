'use server'

export async function getFeedServer(limit: number) {
  'use server'
  const accessToken = process.env.INSTAGRAM_TOKEN
  const userId = process.env.INSTAGRAM_ID
  const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink'
  const url = `https://graph.instagram.com/${userId}/media?fields=${fields}&limit=${limit}&access_token=${accessToken}`

  const res = await fetch(url)
  const data = await res.json()
  return data.data
}
