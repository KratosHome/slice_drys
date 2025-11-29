"use server";

import TelegramBot from "node-telegram-bot-api";
import { formatDate } from "@/utils/format-date";

interface IFormData {
  name: string;
  phoneNumber: string;
}

export async function callMeBackServer(
  formData: IFormData,
): Promise<IResponse> {
  try {
    const formattedDate: string = formatDate(new Date());

    const bot = new TelegramBot(`${process.env.TELEGRAM_BOT_TOKEN}`, {
      polling: true,
    });

    const chatId: string = `${process.env.TELEGRAM_BOT_CHAT_ID}`;

    await bot.sendMessage(
      chatId,
      `
      Користувач хоче щоб йому зателефонували:
      Час відправки: ${formattedDate},
      Ім'я: ${formData.name}, 
      Номер: ${formData.phoneNumber},
    `,
    );

    return { success: true, message: "Повідомлення відправлено" };
  } catch (err) {
    return { success: false, message: `${err}` };
  }
}
