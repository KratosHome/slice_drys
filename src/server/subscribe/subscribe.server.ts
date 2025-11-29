"use server";
import { connectToDbServer } from "@/server/connect-to-db.server";
import { Subscription } from "./subscription-schema.server";

export async function subscribeServer(email: string) {
  "use server";
  try {
    await connectToDbServer();

    const currentSubscription = await Subscription.findOne({ email }).lean();

    if (currentSubscription)
      return {
        success: true,
        message: {
          uk: "Ви вже підписані на розсилку",
          en: "You are already subscribed to the newsletter",
        },
      };
    const newSubscription = new Subscription({ email });
    await newSubscription.save();
    return {
      success: true,
      message: {
        uk: "Ви успішно підписались на розсилку",
        en: "You have successfully subscribed to the newsletter",
      },
    };
  } catch (error) {
    return {
      success: false,
      message: {
        uk: `Помилка підписки на розсилку: ${JSON.stringify(error, null, 2)}`,
        en: `Error subscribing to the newsletter: ${JSON.stringify(error, null, 2)}`,
      },
    };
  }
}
