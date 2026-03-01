import type { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderNumber',
    group: 'Shops',
    description: 'Alle Bestellungen und Buchungen',
    defaultColumns: ['orderNumber', 'customer', 'total', 'status', 'createdAt'],
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
            { label: 'Veranstaltung', value: 'event' },
            { label: 'Produkt', value: 'product' },
          ],
          required: true,
        },
        {
          name: 'event',
          label: 'Veranstaltung',
          type: 'relationship',
          relationTo: 'events',
          admin: {
            condition: (_, siblingData) => siblingData?.itemType === 'event',
          },
        },
        {
          name: 'product',
          label: 'Produkt',
          type: 'relationship',
          relationTo: 'products',
          admin: {
            condition: (_, siblingData) => siblingData?.itemType === 'product',
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
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Ausstehend', value: 'pending' },
        { label: 'Bezahlt', value: 'paid' },
        { label: 'Storniert', value: 'cancelled' },
        { label: 'Erstattet', value: 'refunded' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'stripePaymentIntentId',
      label: 'Stripe Payment Intent',
      type: 'text',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'shippingAddress',
      label: 'Lieferadresse',
      type: 'group',
      admin: {
        description: 'Nur für Produktbestellungen',
      },
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
