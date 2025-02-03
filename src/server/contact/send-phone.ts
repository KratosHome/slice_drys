import type { NextApiRequest, NextApiResponse } from 'next'
import TelegramBot from 'node-telegram-bot-api'

// Ініціалізуємо бота поза обробником запитів
const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = process.env
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN!, { polling: false })

export default async function SendPhone(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { phoneNumber } = req.body

    // Валідація
    if (!phoneNumber || !/^\+380\d{9}$/.test(phoneNumber)) {
      return res.status(400).json({ error: 'Некоректний формат номера' })
    }

    // Відправка в Telegram
    await bot.sendMessage(
      TELEGRAM_CHAT_ID!,
      `📱 Новий номер телефону: ${phoneNumber}\n📅 Дата: ${new Date().toLocaleString()}`,
    )

    res.status(200).json({ success: true })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'Помилка сервера' })
  }
}
