'use server'
import { connectToDb } from '@/server/connectToDb'
import { Subscription } from './subscriptionSchema'

export async function subscribe(email: string) {
  try {
    await connectToDb()

    const currentSubscription = await Subscription.findOne({ email }).lean()

    if (currentSubscription)
      return {
        success: true,
        message: {
          uk: 'Ви вже підписані на розсилку',
          en: 'You are already subscribed to the newsletter',
        },
      }
    const newSubscription = new Subscription({ email })
    await newSubscription.save()
    return {
      success: true,
      message: {
        uk: 'Ви успішно підписались на розсилку',
        en: 'You have successfully subscribed to the newsletter',
      },
    }
  } catch (error) {
    return {
      success: false,
      message: {
        uk: `Помилка підписки на розсилку: ${JSON.stringify(error, null, 2)}`,
        en: `Error subscribing to the newsletter: ${JSON.stringify(error, null, 2)}`,
      },
    }
  }
}
