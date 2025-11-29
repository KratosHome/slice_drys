"use server";
import TelegramBot from "node-telegram-bot-api";
import { formatDate } from "@/utils/format-date";

interface FormData {
  name: string;
  phoneNumber: string;
  email: string;
  whereSell: string;
  link: string;
  howYouFindUs?: string;
}

export async function sendWholesale(formData: FormData) {
  "use server";
  try {
    const formattedDate = formatDate(new Date());
    const bot = new TelegramBot(`${process.env.TELEGRAM_BOT_TOKEN}`, {
      polling: true,
    });
    const chatId = `${process.env.TELEGRAM_BOT_CHAT_ID}`;

    await bot.sendMessage(
      chatId,
      `
      Хтось хочу співпраці:
      Час відправки: ${formattedDate},
      Імя: ${formData.name}, 
      Електронна адреса: ${formData.email},
      Телефон: ${formData.phoneNumber},
      Де збираються продавати: ${formData.whereSell},
      Посилання або назва компанії: ${formData.link},
      Будьте обережні переходячі на підозрілі посилання - спочатку пошукайте інформацію про компанію в інтернеті.
      Як нас знайшли: ${formData.howYouFindUs || "не вказано"},
    `,
    );
    return { success: true };
  } catch (err) {
    return { success: false, message: `${err}` };
  }
}
