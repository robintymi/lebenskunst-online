import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
    group: 'Verwaltung',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user?.role === 'admin'),
    update: ({ req: { user } }) => Boolean(user?.role === 'admin'),
    delete: ({ req: { user } }) => Boolean(user?.role === 'admin'),
  },
  fields: [
    {
      name: 'name',
      label: 'Kategoriename',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'type',
      label: 'Typ',
      type: 'select',
      required: true,
      options: [
        { label: 'Veranstaltung', value: 'event' },
        { label: 'Produkt', value: 'product' },
      ],
    },
    {
      name: 'description',
      label: 'Beschreibung',
      type: 'textarea',
    },
  ],
}
