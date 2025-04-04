'use server'

import { connectToDb } from '@/server/connectToDb'
import { Order } from './orderSchema'
import { getLocale, getTranslations } from 'next-intl/server'

export async function createOrder(orderData: IOrder): Promise<IOrderResponse> {
  'use server'
  const t = await getTranslations('order')
  const locale = (await getLocale()) as ILocale
  try {
    await connectToDb()

    const order = new Order(orderData)
    await order.save()

    return {
      success: true,
      message: {
        [locale]: t('success'),
      },
    }
  } catch (error) {
    console.error('Error creating order: ', error)
    return {
      success: false,
      message: {
        [locale]: t('error'),
      },
    }
  }
}
