import type { CollectionConfig } from 'payload'
import { sendWelcomeEmail } from '@/lib/email'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    group: 'Verwaltung',
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return { id: { equals: user.id } }
    },
    create: () => true,
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return { id: { equals: user.id } }
    },
    delete: ({ req: { user } }) => Boolean(user?.role === 'admin'),
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Mitglied', value: 'member' },
      ],
      defaultValue: 'member',
      required: true,
      admin: {
        description: 'Admin kann alles verwalten, Mitglied hat Zugang zum Mitgliederbereich',
      },
    },
    {
      name: 'firstName',
      label: 'Vorname',
      type: 'text',
    },
    {
      name: 'lastName',
      label: 'Nachname',
      type: 'text',
    },
    {
      name: 'phone',
      label: 'Telefon',
      type: 'text',
    },
    {
      name: 'purchasedItems',
      label: 'Gekaufte Items',
      type: 'relationship',
      relationTo: 'shop-items',
      hasMany: true,
      admin: {
        description: 'Alle gekauften/gebuchten Shop-Items',
      },
    },
    {
      name: 'purchasedBundles',
      label: 'Gekaufte Bundles',
      type: 'relationship',
      relationTo: 'bundles',
      hasMany: true,
    },
    {
      name: 'trainingAccess',
      label: 'Trainings-Zugang',
      type: 'array',
      admin: {
        description: 'Aktive Einzeltrainings mit Ablaufdatum',
        readOnly: true,
      },
      fields: [
        {
          name: 'training',
          type: 'relationship',
          relationTo: 'shop-items',
          required: true,
        },
        {
          name: 'startDate',
          label: 'Startdatum',
          type: 'date',
          required: true,
        },
        {
          name: 'endDate',
          label: 'Enddatum',
          type: 'date',
          required: true,
        },
      ],
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, operation }) => {
        if (operation === 'create' && doc.role === 'member') {
          try {
            await sendWelcomeEmail({
              firstName: doc.firstName || 'Mitglied',
              email: doc.email,
            })
          } catch (err) {
            console.error('Failed to send welcome email:', err)
          }
        }
      },
    ],
  },
}
