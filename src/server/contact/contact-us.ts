'use server'
import TelegramBot from 'node-telegram-bot-api'
import { formatDate } from '@/utils/format-date'

interface FormData {
  phoneNumber: string
}

export async function contactUs(data: FormData) {
  const telegramBotToken: string | undefined = process.env.TELEGRAM_BOT_TOKEN
  const telegramBotChatId: string | undefined = process.env.TELEGRAM_BOT_CHAT_ID

  if (telegramBotToken && telegramBotChatId) {
    try {
      const formattedDate = formatDate(new Date())
      const bot = new TelegramBot(telegramBotToken, {
        polling: true,
      })

      await bot.sendMessage(
        telegramBotChatId,
        `
        'Зі сторінки Контактів',
        Дата відправки: ${formattedDate},
        Номер: ${data.phoneNumber},
      `,
      )
      return { success: true }
    } catch (err) {
      return { success: false, message: `${err}` }
    }
  } else {
    throw new Error('Telegram bot token or chat ID is not defined')
  }
}
