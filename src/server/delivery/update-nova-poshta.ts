'use server'
import { connectToDb } from '@/server/connectToDb'
import { NovaPoshta } from './novaPoshtaSchema'

export async function createPost() {
  try {
    await connectToDb()

    const NovaPoshtaData = {
      city: 'Київ',
      branches: [
        'Відділення №1: вул. Хрещатик, 22',
        'Відділення №2: проспект Перемоги, 12',
        'Відділення №3: вул. Володимирська, 40',
      ],
    }

    const novaPoshta = new NovaPoshta(NovaPoshtaData)

    console.log(11111111, novaPoshta)
    await novaPoshta.save()
    return { success: true, message: 'nova poshta data updated' }
  } catch (error) {
    return {
      success: false,
      message: `Can't update nova poshta data:  ${error}`,
    }
  }
}
