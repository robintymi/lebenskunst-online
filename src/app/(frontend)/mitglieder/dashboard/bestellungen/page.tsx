'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import styles from '../dashboard.module.css'
import { formatPrice, formatDateShort } from '@/lib/utils'

interface OrderItem {
  shopItem: { id: string; title: string } | string
  unitPrice: number
  quantity: number
}

interface InstallmentDetails {
  totalInstallments?: number
  amountPerInstallment?: number
  paidInstallments?: number
  nextPaymentDate?: string
}

interface Order {
  id: string
  orderNumber: string
  status: 'paid' | 'pending' | 'installment_active' | 'cancelled' | 'refunded'
  paymentType: 'full' | 'installment'
  total: number
  createdAt: string
  items: OrderItem[]
  installmentDetails?: InstallmentDetails
}

const statusLabels: Record<string, string> = {
  paid: 'Bezahlt',
  pending: 'Ausstehend',
  installment_active: 'Ratenzahlung aktiv',
  cancelled: 'Storniert',
  refunded: 'Erstattet',
}

const statusClasses: Record<string, string> = {
  paid: styles.statusPaid,
  pending: styles.statusPending,
  installment_active: styles.statusInstallment,
  cancelled: styles.statusCancelled,
  refunded: styles.statusCancelled,
}

export default function OrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user?.id) return

    const fetchOrders = async () => {
      try {
        const res = await fetch(
          `/api/orders?where[customer][equals]=${user.id}&sort=-createdAt&depth=1`,
          { credentials: 'include' }
        )
        if (res.ok) {
          const data = await res.json()
          setOrders(data.docs || [])
        }
      } catch {
        setError('Bestellungen konnten nicht geladen werden. Bitte versuche es später erneut.')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [user?.id])

  if (loading) {
    return (
      <div>
        <div className={styles.pageHeader}>
          <h1>Meine Bestellungen</h1>
          <p>Deine Bestellhistorie im Überblick.</p>
        </div>
        <div className={styles.emptyState}>
          <p>Bestellungen werden geladen...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1>Meine Bestellungen</h1>
        <p>Deine Bestellhistorie im Überblick.</p>
      </div>

      {error && (
        <p style={{ color: '#BE465A', fontSize: '14px', padding: '12px', background: '#fff0f2', borderRadius: '8px', marginBottom: '16px' }}>
          {error}
        </p>
      )}

      {orders.length === 0 && !error ? (
        <div className={styles.emptyState}>
          <h3>Noch keine Bestellungen</h3>
          <p>Du hast noch keine Bestellungen aufgegeben.</p>
          <Link href="/shop" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>
            Zum Shop
          </Link>
        </div>
      ) : (
        orders.map((order) => (
          <div key={order.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <strong>{order.orderNumber}</strong>
              <span className={`${styles.statusBadge} ${statusClasses[order.status] || ''}`}>
                {statusLabels[order.status] || order.status}
              </span>
            </div>

            <div className={styles.orderMeta}>
              <span>{formatDateShort(order.createdAt)}</span>
              <span>{order.paymentType === 'installment' ? 'Ratenzahlung' : 'Einmalzahlung'}</span>

              <strong>{formatPrice(order.total)}</strong>
            </div>

            {order.paymentType === 'installment' && order.installmentDetails?.totalInstallments && (
              <div style={{ marginTop: '0.75rem' }}>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{
                      width: `${((order.installmentDetails.paidInstallments || 0) / order.installmentDetails.totalInstallments) * 100}%`,
                    }}
                  />
                </div>
                <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                  Ratenzahlung: {order.installmentDetails.paidInstallments || 0} von {order.installmentDetails.totalInstallments} Raten bezahlt
                </span>
              </div>
            )}

            <div style={{ marginTop: '1rem' }}>
              {order.items?.map((item, index) => {
                const itemName = typeof item.shopItem === 'object' ? item.shopItem.title : 'Artikel'
                return (
                  <div key={index} className={styles.orderItem}>
                    <span>{itemName}</span>
                    <span>
                      {formatPrice(item.unitPrice)} &times; {item.quantity}
                    </span>
                  </div>
                )
              })}
            </div>

            {(order.status === 'paid' || order.status === 'installment_active') && (
              <a
                href={`/api/invoice/${order.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.invoiceLink}
              >
                Rechnung anzeigen
              </a>
            )}
          </div>
        ))
      )}
    </div>
  )
}
