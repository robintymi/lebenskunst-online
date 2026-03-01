import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    group: 'Verwaltung',
  },
  access: {
    read: () => true,
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
      name: 'bookedEvents',
      label: 'Gebuchte Veranstaltungen',
      type: 'relationship',
      relationTo: 'events',
      hasMany: true,
      admin: {
        description: 'Veranstaltungen, die dieses Mitglied gebucht hat',
      },
    },
    {
      name: 'purchasedProducts',
      label: 'Gekaufte Produkte',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
    },
  ],
}
