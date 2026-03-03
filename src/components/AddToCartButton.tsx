'use client'

import { useCart, type CartItem } from '@/lib/cart-context'
import { isEventType } from '@/lib/utils'

interface Props {
  item: Omit<CartItem, 'quantity'>
  disabled?: boolean
  label?: string
}

export default function AddToCartButton({ item, disabled, label = 'In den Warenkorb' }: Props) {
  const { addItem, items } = useCart()
  const isInCart = items.some((i) => i.id === item.id)

  // Single-purchase items: events, trainings, bundles
  const isSinglePurchase =
    item.type === 'bundle' ||
    isEventType(item.itemType || '') ||
    item.itemType === 'einzeltraining'

  return (
    <button
      className={`btn ${disabled ? '' : isInCart ? 'btn-secondary' : 'btn-accent'}`}
      onClick={() => addItem(item)}
      disabled={disabled || (isSinglePurchase && isInCart)}
    >
      {disabled ? label : isSinglePurchase && isInCart ? 'Bereits im Warenkorb' : label}
    </button>
  )
}
