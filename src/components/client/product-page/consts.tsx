import { CardIcon, ChequeIcon, PaperIcon } from './icons'

export const mockSliders = [
  '/sliders/meat.png',
  '/sliders/fruit.png',
  '/sliders/promo.png',
]

export const mockProduct: IProduct = {
  name: 'Курка сушена',
  description:
    'Сушене куряче м’ясо, приготовлене з ретельно відібраних спецій та трав. Ідеальний перекус для активних людей та поціновувачів натуральних продуктів.',
  img: '',
  variables: [
    {
      weight: 30,
      price: 130,
      currency: 'грн',
      count: 1,
    },
  ],
  category: ["М'ясо", 'Сушені продукти'],
  menu: ['Перекус', 'Обід'],
  composition: ['Куряче м’ясо', 'Спеції', 'Трави'],
  statusLabel: ['В наявності'],
  nutritionalValue: {
    proteins: '45 г',
    fats: '15 г',
    carbohydrates: '0 г',
    energyValue: '15 г',
  },
}

export const accordions = [
  {
    title: 'Інформація про продукт',
    fields: [
      {
        label: 'Умови зберігання',
        value: 'за температури від +3°С до +25°С та відносній вологості 70%',
      },
      {
        label: 'Строк придатності',
        value: '12 місяців від дня виготовлення. Дата вказана на упаковці',
      },
    ],
  },
  {
    title: 'Поживна (харчова) цінність на 100 г продукту',
    fields: [
      { label: 'Білки', value: mockProduct.nutritionalValue.proteins },
      { label: 'Жири', value: mockProduct.nutritionalValue.fats },
      {
        label: 'Вуглеводи',
        value: mockProduct.nutritionalValue.carbohydrates,
      },
      {
        label: 'Енергетична цінність',
        value: mockProduct.nutritionalValue.energyValue,
      },
    ],
  },
  {
    title: 'Доставка і оплата',
    fields: [
      {
        label: 'Доставка по Україні',
        value: (
          <>
            Ми пропонуємо швидку та надійну доставку нашої продукції по всій
            території України за допомогою Нової Пошти. Після оформлення
            замовлення, ми відправляємо його протягом
            <b> 1-2 робочих днів</b>. Термін доставки залежить від вашого
            місцезнаходження та зазвичай займає <b>1-3 дні.</b>
          </>
        ),
      },
      {
        label: 'Способи оплати',
        value: (
          <>
            <p>
              Ми пропонуємо
              <b> кілька зручних варіантів оплати:</b>
            </p>

            <ul className="grid gap-3 pt-3">
              <li className="flex items-center gap-4">
                <CardIcon /> Онлайн-оплата карткою (Visa/Mastercard) через
                безпечну платіжну систему.
              </li>

              <li className="flex items-center gap-4">
                <ChequeIcon /> Накладений платіж (оплата при отриманні) у
                відділенні Нової Пошти.
              </li>

              <li className="flex items-center gap-4">
                <PaperIcon /> Безготівковий розрахунок для корпоративних
                клієнтів та великих замовлень.
              </li>
            </ul>
          </>
        ),
      },
      {
        label: 'Вартість доставки',
        value: (
          <>
            Доставка розраховується згідно з тарифами Нової Пошти і оплачується
            клієнтом при отриманні замовлення.
            <b> При замовленні на суму від 1000 грн - доставка безкоштовна!</b>
          </>
        ),
      },
      {
        label: 'Повернення та обмін',
        value:
          'Якщо продукція не відповідає вашим очікуванням, ви можете повернути її протягом 14 днів з моменту отримання замовлення, за умови збереження цілісності упаковки. Для цього зверніться до нашої служби підтримки.',
      },
    ],
  },
]
