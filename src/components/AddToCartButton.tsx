'use client'

import { useCart, type CartItem } from '@/lib/cart-context'

interface Props {
  item: Omit<CartItem, 'quantity'>
  disabled?: boolean
  label?: string
}

export default function AddToCartButton({ item, disabled, label = 'In den Warenkorb' }: Props) {
  const { addItem, items } = useCart()
  const isInCart = items.some((i) => i.id === item.id)

  return (
    <button
      className={`btn ${disabled ? '' : isInCart ? 'btn-secondary' : 'btn-accent'}`}
      onClick={() => addItem(item)}
      disabled={disabled || (item.type === 'event' && isInCart)}
    >
      {disabled ? label : isInCart && item.type === 'event' ? 'Bereits im Warenkorb' : label}
    </button>
  )
}
