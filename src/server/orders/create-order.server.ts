'use server'

import { connectToDbServer } from '@/server/connect-to-db.server'
import { Order } from './order-schema.server'
import { getLocale, getTranslations } from 'next-intl/server'

export async function createOrderServer(
  orderData: IOrder,
): Promise<IOrderResponse> {
  'use server'
  const t = await getTranslations('order')
  const locale = (await getLocale()) as ILocale
  try {
    await connectToDbServer()

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
