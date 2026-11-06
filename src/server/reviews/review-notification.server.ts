import 'server-only'

import { Api } from 'node-telegram-bot-api'
import { SITE_URL } from '@/data/contacts'

export async function sendProductReviewNotification(data: {
  productName: string
  author: string
  text: string
  rating?: number
  photoCount: number
  isReply: boolean
}): Promise<void> {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_BOT_CHAT_ID
    if (!token || !chatId) throw new Error('Missing notification configuration')
    const bot = new Api(token, { maxRetries: 0 })
    await bot.sendMessage({
      chat_id: chatId,
      text: [
        data.isReply
          ? 'Нова відповідь на відгук 💬'
          : 'Новий відгук про товар ⭐',
        `ТОВАР: ${data.productName}`,
        `АВТОР: ${data.author}`,
        ...(data.rating ? [`ОЦІНКА: ${data.rating}/5`] : []),
        `ФОТО: ${data.photoCount}`,
        '',
        data.text,
        '',
        'Очікує перевірки в адмінці:',
        `${SITE_URL.replace(/\/$/, '')}/uk/admin/reviews`,
      ].join('\n'),
    })
  } catch (error) {
    // Persistence succeeded already. A Telegram outage must not cause duplicate
    // submissions or expose token-bearing transport errors to visitors.
    console.error('Product review notification failed', {
      name: error instanceof Error ? error.name : 'UnknownError',
    })
  }
}
