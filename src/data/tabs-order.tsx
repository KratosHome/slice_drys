import {
  CheckCircle,
  Clock,
  RefreshCw,
  Truck,
  XCircle,
  AlertCircle,
  Package,
} from 'lucide-react'

export const tabsOrder = [
  {
    value: 'new',
    icon: <Clock className="size-5" />,
    label: 'Нові',
  },
  {
    value: 'awaiting-payment',
    icon: <AlertCircle className="size-5" />,
    label: 'Очікує оплати',
  },
  {
    value: 'awaiting-shipment',
    icon: <Package className="size-5" />,
    label: 'Очікує відправки',
  },
  {
    value: 'shipped',
    icon: <Truck className="size-5" />,
    label: 'Відправлено',
  },
  {
    value: 'completed',
    icon: <CheckCircle className="size-5" />,
    label: 'Виконано',
  },
  {
    value: 'awaiting-return',
    icon: <RefreshCw className="size-5" />,
    label: 'Очікує повернення',
  },
  {
    value: 'cancelled',
    icon: <XCircle className="size-5" />,
    label: 'Скасовано',
  },
  {
    value: 'failed-delivery',
    icon: <AlertCircle className="size-5" />,
    label: 'Не доставлено',
  },
]
