import { connectToDb } from '@/server/connectToDb'
import { NovaPoshtaCities } from '@/server/delivery/novaPoshtaSchema'

export const seedNovaPoshtaDefaultCities = async () => {
  try {
    await connectToDb()

    const count = await NovaPoshtaCities.countDocuments()
    if (count !== 0) {
      return {
        success: false,
        message: 'Directory of cities already exists. No changes were made.',
      }
    }

    const citiesData = [
      {
        city: 'м. Київ (Київська обл.)',
        ref: '8d5a980d-391c-11dd-90d9-001a92567626',
      },
      {
        city: 'Одеса (Одеська обл.)',
        ref: 'db5c88d0-391c-11dd-90d9-001a92567626',
      },
      {
        city: 'Дніпро (Дніпропетровська обл.)',
        ref: 'db5c88f0-391c-11dd-90d9-001a92567626',
        ukrposhta_id: '3641',
      },
      {
        city: 'Харків (Харківська обл.)',
        ref: 'db5c88e0-391c-11dd-90d9-001a92567626',
      },
      {
        city: 'м. Львів (Львівська обл.)',
        ref: 'db5c88f5-391c-11dd-90d9-001a92567626',
      },
      {
        city: 'м. Запоріжжя (Запорізька обл., Запорізький р-н.)',
        ref: 'db5c88c6-391c-11dd-90d9-001a92567626',
      },
      {
        city: 'м. Миколаїв (Миколаївська обл.)',
        ref: 'db5c888c-391c-11dd-90d9-001a92567626',
      },
      {
        city: 'Вінниця (Вінницька обл.)',
        ref: 'db5c88de-391c-11dd-90d9-001a92567626',
      },
      {
        city: 'м. Полтава (Полтавська обл.)',
        ref: 'db5c8892-391c-11dd-90d9-001a92567626',
      },
      {
        city: 'м. Хмельницький (Хмельницька обл.)',
        ref: 'db5c88ac-391c-11dd-90d9-001a92567626',
      },
      {
        city: 'м. Черкаси (Черкаська обл.)',
        ref: 'db5c8902-391c-11dd-90d9-001a92567626',
      },
      {
        city: 'Суми (Сумська обл.)',
        ref: 'db5c88e5-391c-11dd-90d9-001a92567626',
      },
      {
        city: 'м. Чернівці (Чернівецька обл.)',
        ref: 'e221d642-391c-11dd-90d9-001a92567626',
      },
      {
        city: 'Житомир (Житомирська обл.)',
        ref: 'db5c88c4-391c-11dd-90d9-001a92567626',
      },
      {
        city: 'Івано-Франківськ (Івано-Франківська обл.)',
        ref: 'db5c8904-391c-11dd-90d9-001a92567626',
      },
      {
        city: 'Чернігів (Чернігівська обл.)',
        ref: 'db5c897c-391c-11dd-90d9-001a92567626',
      },
      {
        city: 'Кропивницький (Кропивницька обл.)',
        ref: 'db5c891b-391c-11dd-90d9-001a92567626',
      },
      {
        city: 'Тернопіль (Тернопільська обл.)',
        ref: 'db5c8900-391c-11dd-90d9-001a92567626',
      },
      {
        city: 'м. Рівне (Рівненська обл.)',
        ref: 'db5c896a-391c-11dd-90d9-001a92567626',
      },
      {
        city: 'м. Херсон (Херсонська обл.)',
        ref: 'db5c88cc-391c-11dd-90d9-001a92567626',
      },
    ]

    await NovaPoshtaCities.create(citiesData)

    return {
      success: true,
      message: 'Directory of cities seeded successfully',
    }
  } catch (error) {
    return {
      success: false,
      message: `Error: ${error}`,
    }
  }
}
