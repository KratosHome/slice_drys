'use server'
import TelegramBot from 'node-telegram-bot-api'
import { formatDate } from '@/utils/format-date'

interface IOrderNotificationData {
  totalPrice: string
  paymentMethod: string
  name: string
  phone: string
  delivery: string
  comment: string
  products: string
  callback: string
}

export async function sendOrderNotification(orderData: IOrderNotificationData) {
  'use server'
  const {
    totalPrice,
    name,
    phone,
    delivery,
    comment,
    products,
    paymentMethod,
    callback,
  } = orderData
  try {
    const formattedDate = formatDate(new Date())
    const bot = new TelegramBot(`${process.env.TELEGRAM_BOT_TOKEN}`, {
      polling: false,
    })
    const chatId = `${process.env.TELEGRAM_BOT_CHAT_ID}`

    await bot.sendMessage(
      chatId,
      `
Вітаю в нас нове замовлення:
ЧАС ЗАМОВЛЕННЯ: ${formattedDate},
СУМА: ${totalPrice},
СПОСІБ ОПЛАТИ: ${paymentMethod},
ІМ'Я: ${name},
ТЕЛЕФОН: ${phone},
ДОСТАВКА: 
${delivery},
КОМЕНТАР: 
${comment},
ТОВАРИ:______________________
${products},
_______________________________
ДЗВІНОК КЛІЄНТУ: ${callback}

    `,
    )
    return { success: true }
  } catch (err) {
    return { success: false, message: `${err}` }
  }
}
