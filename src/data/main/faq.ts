import { contacts } from '@/data/contacts'

const faqDataUk: IFaq[] = [
  {
    title: 'Як ви виготовляєте сушеники?',
    description:
      'Ми контролюємо кожен етап — від вибору інгредієнтів до фінального пакування. Так можемо стежити за якістю продукції впродовж усього процесу виготовлення.',
  },
  {
    title: 'Як і коли доставляєте замовлення?',
    description:
      'Передаємо замовлення Новій пошті протягом 1–2 робочих днів після оформлення. Доставляємо по всій Україні у відділення, поштомат або кур’єром; дорога зазвичай займає 1–3 дні залежно від населеного пункту та роботи перевізника. Для замовлень від 1000 грн доставка безкоштовна.',
  },
  {
    title: 'Що входить до складу сушеників?',
    description:
      'Кожен смак має власну рецептуру з ретельно підібраних інгредієнтів — без штучних добавок, консервантів і ГМО. Повний склад завжди зазначаємо в картці товару.',
  },
  {
    title: 'Як правильно зберігати сушеники?',
    description:
      'Зберігайте продукцію за температури від +3 °C до +25 °C і відносної вологості 70%. Строк придатності — 12 місяців від дати виготовлення; точну дату зазначено на упаковці.',
  },
  {
    title: 'Як можна оплатити замовлення?',
    description:
      'Під час оформлення можна обрати оплату карткою через платіжну систему або післяплату. Комісія за післяплату Нової пошти становить 20 грн + 2% від суми замовлення.',
  },
  {
    title: 'Чи можна замовити сушеники гуртом?',
    description:
      'Так, ми працюємо з магазинами, закладами та партнерськими проєктами. Залиште заявку в розділі «Опт» — підберемо асортимент, обсяг і умови співпраці під ваш бізнес.',
  },
  {
    title: 'Які умови повернення та обміну?',
    description: `Повернення та обмін здійснюємо відповідно до законодавства України й умов Публічної оферти. Товар належної якості має залишатися невикористаним, зі збереженими товарним виглядом, споживчими властивостями та пломбами, якщо вони були. Якщо товар пошкоджений або неналежної якості, зв’яжіться з нами: ${contacts.phone} або ${contacts.mail}.`,
  },
]

const faqDataEn: IFaq[] = [
  {
    title: 'How do you make your dried snacks?',
    description:
      'We oversee every stage, from selecting the ingredients to final packaging. This allows us to monitor product quality throughout the entire production process.',
  },
  {
    title: 'How and when do you deliver orders?',
    description:
      'We hand orders over to Nova Poshta within 1–2 business days after they are placed. We deliver across Ukraine to a branch, parcel locker, or by courier; transit usually takes 1–3 days depending on the destination and the carrier’s operations. Delivery is free for orders of UAH 1,000 or more.',
  },
  {
    title: 'What are the dried snacks made from?',
    description:
      'Each flavour has its own recipe made with carefully selected ingredients — free from artificial additives, preservatives, and GMOs. The full list of ingredients is always provided on the product page.',
  },
  {
    title: 'How should I store the dried snacks?',
    description:
      'Store the products at temperatures from +3 °C to +25 °C and relative humidity of 70%. Shelf life is 12 months from the date of manufacture; the exact date is shown on the packaging.',
  },
  {
    title: 'How can I pay for my order?',
    description:
      'At checkout, you can pay by card through the payment system or choose cash on delivery. Nova Poshta charges UAH 20 + 2% of the order total for cash on delivery.',
  },
  {
    title: 'Can I order dried snacks wholesale?',
    description:
      'Yes. We work with retailers, food-service businesses, and other partners. Submit the form on our Wholesale page, and we will recommend an assortment, order volume, and terms that fit your business.',
  },
  {
    title: 'What are the return and exchange terms?',
    description: `Returns and exchanges are handled in accordance with Ukrainian law and our Public Offer. Goods of adequate quality must remain unused, with their presentation, consumer properties, and seals (if any) intact. If an item is damaged or of inadequate quality, contact us at ${contacts.phone} or ${contacts.mail}.`,
  },
]

export const faqData = {
  uk: faqDataUk,
  en: faqDataEn,
}
