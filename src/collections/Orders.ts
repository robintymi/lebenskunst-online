import type { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderNumber',
    group: 'Shop',
    description: 'Alle Bestellungen und Buchungen',
    defaultColumns: ['orderNumber', 'customer', 'total', 'paymentType', 'status', 'createdAt'],
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return { customer: { equals: user.id } }
    },
    create: () => true,
    update: ({ req: { user } }) => Boolean(user?.role === 'admin'),
    delete: ({ req: { user } }) => Boolean(user?.role === 'admin'),
  },
  fields: [
    {
      name: 'orderNumber',
      label: 'Bestellnummer',
      type: 'text',
      required: true,
      unique: true,
      admin: { readOnly: true },
    },
    {
      name: 'customer',
      label: 'Kunde',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'items',
      label: 'Bestellpositionen',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'itemType',
          label: 'Typ',
          type: 'select',
          options: [
            { label: 'Shop-Item', value: 'shop-item' },
            { label: 'Bundle', value: 'bundle' },
          ],
          required: true,
        },
        {
          name: 'shopItem',
          label: 'Shop-Item',
          type: 'relationship',
          relationTo: 'shop-items',
          admin: {
            condition: (_, siblingData) => siblingData?.itemType === 'shop-item',
          },
        },
        {
          name: 'bundle',
          label: 'Bundle',
          type: 'relationship',
          relationTo: 'bundles',
          admin: {
            condition: (_, siblingData) => siblingData?.itemType === 'bundle',
          },
        },
        {
          name: 'quantity',
          label: 'Anzahl',
          type: 'number',
          required: true,
          min: 1,
          defaultValue: 1,
        },
        {
          name: 'unitPrice',
          label: 'Einzelpreis (€)',
          type: 'number',
          required: true,
        },
      ],
    },
    {
      name: 'total',
      label: 'Gesamtbetrag (€)',
      type: 'number',
      required: true,
      admin: { readOnly: true },
    },
    {
      name: 'paymentType',
      label: 'Zahlungsart',
      type: 'select',
      required: true,
      defaultValue: 'full',
      options: [
        { label: 'Einmalzahlung', value: 'full' },
        { label: 'Ratenzahlung', value: 'installment' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'installmentDetails',
      label: 'Ratenzahlungsdetails',
      type: 'group',
      admin: {
        condition: (data) => data?.paymentType === 'installment',
      },
      fields: [
        { name: 'totalInstallments', label: 'Anzahl Raten', type: 'number' },
        { name: 'amountPerInstallment', label: 'Betrag pro Rate (€)', type: 'number' },
        { name: 'paidInstallments', label: 'Bezahlte Raten', type: 'number', defaultValue: 0 },
        { name: 'nextPaymentDate', label: 'Nächste Zahlung', type: 'date' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Ausstehend', value: 'pending' },
        { label: 'Bezahlt', value: 'paid' },
        { label: 'Ratenzahlung aktiv', value: 'installment_active' },
        { label: 'Storniert', value: 'cancelled' },
        { label: 'Erstattet', value: 'refunded' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'stripeSessionId',
      label: 'Stripe Session ID',
      type: 'text',
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'stripePaymentIntentId',
      label: 'Stripe Payment Intent',
      type: 'text',
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'stripeSubscriptionId',
      label: 'Stripe Subscription (Raten)',
      type: 'text',
      admin: {
        position: 'sidebar',
        readOnly: true,
        condition: (data) => data?.paymentType === 'installment',
      },
    },
    {
      name: 'shippingAddress',
      label: 'Lieferadresse',
      type: 'group',
      admin: { description: 'Nur für physische Produkte (Bücher etc.)' },
      fields: [
        { name: 'street', label: 'Straße', type: 'text' },
        { name: 'city', label: 'Stadt', type: 'text' },
        { name: 'zip', label: 'PLZ', type: 'text' },
        { name: 'country', label: 'Land', type: 'text', defaultValue: 'Deutschland' },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        if (operation === 'create' && data) {
          data.orderNumber = `LK-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
        }
        return data
      },
    ],
  },
}
