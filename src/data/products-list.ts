import { IProduct } from '@/types/product'

export const productsList: IProduct[] = [
  {
    _id: '1',
    name: 'Курка сушена',
    img: '/images/meat.png',
    newPrice: [110, 120, 250],
    price: [130, 140, 270],
    available: true,
    weight: [30, 50, 100],
    badges: [
      { type: 'top', label: 'Топ' },
      { type: 'new', label: 'Новинка' },
    ],
    variables: [],
    category: [''],
    menu: [''],
    composition: [''],
    statusLabel: [''],
    visited: 0,
    nutritionalValue: {
      squirrels: '',
      fats: '',
      carbohydrates: '',
      energyValue: '',
    },
    description: '',
  },
  {
    _id: '2',
    name: 'Яловичина сушена',
    img: '/images/beef.png',
    available: true,
    newPrice: [],
    price: [130, 140, 270],
    weight: [30, 50, 100],
    badges: [
      { type: 'top', label: 'Топ' },
      { type: 'sale', label: 'Акція' },
    ],
    variables: [],
    category: [''],
    menu: [''],
    composition: [''],
    statusLabel: [''],
    visited: 0,
    nutritionalValue: {
      squirrels: '',
      fats: '',
      carbohydrates: '',
      energyValue: '',
    },
    description: '',
  },
  {
    _id: '3',
    name: 'Свинина сушена',
    img: '/images/mix.png',
    available: false,
    newPrice: [110, 120, 250],
    price: [130, 140, 270],
    weight: [30, 50, 100],
    badges: [],
    variables: [],
    category: [''],
    menu: [''],
    composition: [''],
    statusLabel: [''],
    visited: 0,
    nutritionalValue: {
      squirrels: '',
      fats: '',
      carbohydrates: '',
      energyValue: '',
    },
    description: '',
  },
  {
    _id: '4',
    name: 'Фрукти сушені',
    img: '/images/fruits.svg',
    available: true,
    newPrice: [],
    price: [130, 140, 270],
    weight: [30, 50, 100],
    badges: [
      { type: 'top', label: 'Топ' },
      { type: 'new', label: 'Новинка' },
      { type: 'sale', label: 'Акція' },
    ],
    variables: [],
    category: [''],
    menu: [''],
    composition: [''],
    statusLabel: [''],
    visited: 0,
    nutritionalValue: {
      squirrels: '',
      fats: '',
      carbohydrates: '',
      energyValue: '',
    },
    description: '',
  },
  {
    _id: '5',
    name: 'Курка сушена',
    img: '/images/meat.png',
    available: false,
    newPrice: [110, 120, 250],
    price: [130, 140, 270],
    weight: [30, 50, 100],
    badges: [],
    variables: [],
    category: [''],
    menu: [''],
    composition: [''],
    statusLabel: [''],
    visited: 0,
    nutritionalValue: {
      squirrels: '',
      fats: '',
      carbohydrates: '',
      energyValue: '',
    },
    description: '',
  },
  {
    _id: '6',
    name: 'Яловичина сушена',
    img: '/images/mix.png',
    available: true,
    newPrice: [110, 120, 250],
    price: [130, 140, 270],
    weight: [30, 50, 100],
    badges: [
      { type: 'top', label: 'Топ' },
      { type: 'sale', label: 'Акція' },
    ],
    variables: [],
    category: [''],
    menu: [''],
    composition: [''],
    statusLabel: [''],
    visited: 0,
    nutritionalValue: {
      squirrels: '',
      fats: '',
      carbohydrates: '',
      energyValue: '',
    },
    description: '',
  },
  {
    _id: '7',
    name: 'Свинина сушена',
    img: '/images/beef.png',
    available: true,
    newPrice: [],
    price: [130, 140, 270],
    weight: [30, 50, 100],
    badges: [
      { type: 'top', label: 'Топ' },
      { type: 'new', label: 'Новинка' },
      { type: 'sale', label: 'Акція' },
    ],
    variables: [],
    category: [''],
    menu: [''],
    composition: [''],
    statusLabel: [''],
    visited: 0,
    nutritionalValue: {
      squirrels: '',
      fats: '',
      carbohydrates: '',
      energyValue: '',
    },
    description: '',
  },
]