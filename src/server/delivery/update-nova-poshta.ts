' server'
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
    await novaPoshta.save()

    const response = await fetch('https://api.novaposhta.ua/v2.0/json/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apiKey: '',
        modelName: 'Address',
        calledMethod: 'getCities',
      }),
    })
    const data = await response.json()
    const cities = data.data.map(
      (city: { Description: string; Ref: string }) => ({
        Description: city.Description,
        Ref: city.Ref,
      }),
    )
    console.log(11111111111111, cities)

    return { success: true, message: 'nova poshta data updated' }
  } catch (error) {
    return {
      success: false,
      message: `Can't update nova poshta data:  ${error}`,
    }
  }
}
