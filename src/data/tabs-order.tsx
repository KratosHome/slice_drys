import {
  AlertCircle,
  CheckCircle,
  Clock,
  Package,
  RefreshCw,
  Truck,
  XCircle,
} from 'lucide-react'

export const tabsOrder = [
  {
    value: 'new',
    icon: <Clock className="h-5 w-5 text-blue-500" />,
    label: 'Нові',
  },
  {
    value: 'awaiting-payment',
    icon: <AlertCircle className="h-5 w-5 text-yellow-500" />,
    label: 'Очікує оплати',
  },
  {
    value: 'awaiting-shipment',
    icon: <Package className="h-5 w-5 text-purple-500" />,
    label: 'Очікує відправки',
  },
  {
    value: 'shipped',
    icon: <Truck className="h-5 w-5 text-green-500" />,
    label: 'Відправлено',
  },
  {
    value: 'completed',
    icon: <CheckCircle className="h-5 w-5 text-gray-700" />,
    label: 'Виконано',
  },
  {
    value: 'awaiting-return',
    icon: <RefreshCw className="h-5 w-5 text-orange-500" />,
    label: 'Очікує повернення',
  },
  {
    value: 'cancelled',
    icon: <XCircle className="h-5 w-5 text-red-500" />,
    label: 'Скасовано',
  },
  {
    value: 'failed-delivery',
    icon: <AlertCircle className="h-5 w-5 text-red-700" />,
    label: 'Не доставлено',
  },
]
