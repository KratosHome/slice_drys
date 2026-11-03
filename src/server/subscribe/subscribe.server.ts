'use server'
import { connectToDbServer } from '@/server/connect-to-db.server'
import { Subscription } from './subscription-schema.server'

export async function subscribeServer(email: string) {
  const failure = {
    success: false,
    created: false,
    message: {
      uk: 'Не вдалося оформити підписку. Спробуйте ще раз.',
      en: 'Unable to confirm your subscription. Please try again.',
    },
  }
  if (typeof email !== 'string') return failure
  const address = email.trim().toLowerCase()
  if (address.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address))
    return failure
  const existing = {
    success: true,
    created: false,
    message: {
      uk: 'Ви вже підписані на розсилку',
      en: 'You are already subscribed to the newsletter',
    },
  }
  try {
    await connectToDbServer()
    await Subscription.collection.createIndex({ email: 1 }, { unique: true })
    // Match existing subscriptions that were saved before email normalization.
    const result = await Subscription.updateOne(
      { email: address },
      { $setOnInsert: { email: address } },
      { upsert: true, collation: { locale: 'en', strength: 2 } },
    )
    if (!result.acknowledged) return failure
    if (!result.upsertedCount) return existing
    return {
      success: true,
      created: true,
      message: {
        uk: 'Ви успішно підписались на розсилку',
        en: 'You have successfully subscribed to the newsletter',
      },
    }
  } catch (error) {
    const conflict = error as {
      code?: number
      keyValue?: { email?: string }
    } | null
    if (conflict?.code === 11000 && conflict.keyValue?.email === address)
      return existing
    return failure
  }
}
