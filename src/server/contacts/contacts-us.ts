'use server'
import TelegramBot from 'node-telegram-bot-api'
import { formatDate } from '@/utils/format-date'

interface FormData {
  name: string
  phoneNumber: string
}

export async function contactUs(formData: FormData) {
  try {
    const formattedDate = formatDate(new Date())
    const bot = new TelegramBot(`${process.env.TELEGRAM_BOT_TOKEN}`, {
      polling: true,
    })
    const chatId = `${process.env.TELEGRAM_BOT_CHAT_ID}`

    await bot.sendMessage(
      chatId,
      `
      Час відправки: ${formattedDate},
      Імя: ${formData.name}, 
      Номер: ${formData.phoneNumber},
    `,
    )
    return { success: true }
  } catch (err) {
    return { success: false, message: `${err}` }
  }
}
