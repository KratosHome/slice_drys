'use server'

import TelegramBot from 'node-telegram-bot-api'
import { formatDate } from '@/utils/format-date'

interface IFormData {
  name: string
  text: string
}

export async function sendReviews(formData: IFormData): Promise<IResponse> {
  try {
    const name = formData.name.trim()
    const text = formData.text.trim()
    const botToken = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_BOT_CHAT_ID

    if (
      !botToken ||
      !chatId ||
      name.length === 0 ||
      name.length > 100 ||
      text.length === 0 ||
      text.length > 2_000
    ) {
      return { success: false, message: 'Не вдалося відправити відгук' }
    }

    const formattedDate: string = formatDate(new Date())
    const bot = new TelegramBot(botToken)

    await bot.sendMessage(
      chatId,
      `
      Вітаю в нас новий відгук:
      Час відправки: ${formattedDate},
      Ім'я: ${name},
      Відгук: ${text},
    `,
    )
    return { success: true, message: 'Відгук відправлений' }
  } catch (err) {
    return { success: false, message: `${err}` }
  }
}
