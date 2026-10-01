'use server'

import { Api } from 'node-telegram-bot-api'
import { formatDate } from '@/utils/format-date'

interface IFormData {
  name: string
  phoneNumber: string
}

export async function callMeBackServer(
  formData: IFormData,
): Promise<IResponse> {
  try {
    const formattedDate: string = formatDate(new Date())

    const bot = new Api(`${process.env.TELEGRAM_BOT_TOKEN}`, {
      maxRetries: 0,
    })

    const chatId: string = `${process.env.TELEGRAM_BOT_CHAT_ID}`

    await bot.sendMessage({
      chat_id: chatId,
      text: `
      Користувач хоче щоб йому зателефонували:
      Час відправки: ${formattedDate},
      Ім'я: ${formData.name}, 
      Номер: ${formData.phoneNumber},
    `,
    })

    return { success: true, message: 'Повідомлення відправлено' }
  } catch (err) {
    return { success: false, message: `${err}` }
  }
}
