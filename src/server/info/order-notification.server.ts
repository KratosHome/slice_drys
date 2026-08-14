import 'server-only'

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
  blogger?: {
    name: string
    interest: number
    link: string
    commissionAmount: number
  }
}

export async function sendOrderNotification(
  orderData: IOrderNotificationData,
): Promise<void> {
  const {
    totalPrice,
    name,
    phone,
    delivery,
    comment,
    products,
    paymentMethod,
    callback,
    blogger,
  } = orderData

  try {
    const formattedDate = formatDate(new Date())

    const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN as string, {
      polling: false,
    })

    const chatId = process.env.TELEGRAM_BOT_CHAT_ID as string

    const bloggerBlock = blogger
      ? `
БЛОГЕР / РЕФЕРАЛ:
ІМ'Я: ${blogger.name}
ВІДСОТОК: ${blogger.interest}%
ВИПЛАТА: ${blogger.commissionAmount} ₴
ПОСИЛАННЯ: ${blogger.link}
`
      : ''

    await bot.sendMessage(
      chatId,
      `
Вітаю, нове замовлення 🛒
ЧАС ЗАМОВЛЕННЯ: ${formattedDate}
СУМА: ${totalPrice}
СПОСІБ ОПЛАТИ: ${paymentMethod}

ІМ'Я: ${name}
ТЕЛЕФОН: ${phone}

ДОСТАВКА:
${delivery}

КОМЕНТАР:
${comment}

ТОВАРИ:
${products}

ДЗВІНОК КЛІЄНТУ: ${callback}
${bloggerBlock}
`.trim(),
    )
  } catch (error) {
    console.error('Order notification failed', {
      name: error instanceof Error ? error.name : 'UnknownError',
    })
  }
}
