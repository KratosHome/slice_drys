'use server'
import TelegramBot from 'node-telegram-bot-api'
import { formatDate } from '@/utils/format-date'

interface FormData {
  name: string
  text: string
}

export async function sendReviews(formData: FormData) {
  'use server'
  try {
    const formattedDate = formatDate(new Date())
    const bot = new TelegramBot(`${process.env.TELEGRAM_BOT_TOKEN}`, {
      polling: true,
    })
    const chatId = `${process.env.TELEGRAM_BOT_CHAT_ID}`

    await bot.sendMessage(
      chatId,
      `
      Вітаю в нас новий відгук:
      Час відправки: ${formattedDate},
      Імя: ${formData.name}, 
      Відгук: ${formData.text},
    `,
    )
    return { success: true }
  } catch (err) {
    return { success: false, message: `${err}` }
  }
}
