interface CartProductCardProps {
  image: string
  name: string
  price: number
  weight: number
  quantity: number
}

export default function CartProductCard({
  image,
  name,
  price,
  weight,
  quantity,
}: CartProductCardProps) {
  return (
    <div className="flex items-center rounded-lg border border-gray-200 p-4">
      <img
        src={image}
        alt={name}
        className="h-16 w-16 rounded-md object-cover"
      />
      <div className="ml-4">
        <h2 className="text-lg font-semibold">{name}</h2>
        <p className="text-sm text-gray-500">Вага: {weight}г</p>
        <p className="text-sm text-gray-500">Кількість: {quantity}</p>
        <p className="mt-1 text-lg font-semibold">{price} грн</p>
      </div>
    </div>
  )
}
