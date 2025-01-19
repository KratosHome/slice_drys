export const menuToUk = (menu: string): string => {
  const translations: { [key: string]: string } = {
    meat: "м'ясо",
    fruits: 'фрукти',
    vegetables: 'овочі',
    mix: 'мікс',
    promo: 'акція',
  }
  return translations[menu] || menu
}
