"use server";

import TelegramBot from "node-telegram-bot-api";
import { formatDate } from "@/utils/format-date";

interface IFormData {
  name: string;
  text: string;
}

export async function sendReviews(formData: IFormData): Promise<IResponse> {
  try {
    const formattedDate: string = formatDate(new Date());

    const bot = new TelegramBot(`${process.env.TELEGRAM_BOT_TOKEN}`, {
      polling: true,
    });
    const chatId: string = `${process.env.TELEGRAM_BOT_CHAT_ID}`;

    await bot.sendMessage(
      chatId,
      `
      Вітаю в нас новий відгук:
      Час відправки: ${formattedDate},
      Ім'я: ${formData.name}, 
      Відгук: ${formData.text},
    `,
    );
    return { success: true, message: "Відгук відправлений" };
  } catch (err) {
    return { success: false, message: `${err}` };
  }
}
