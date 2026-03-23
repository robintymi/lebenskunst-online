import type { CollectionConfig } from 'payload'

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  admin: {
    useAsTitle: 'name',
    group: 'Verwaltung',
    description: 'Kundenbewertungen — können von Besuchern ohne Login abgegeben werden',
    defaultColumns: ['name', 'rating', 'text', 'approved', 'createdAt'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: ({ req: { user } }) => Boolean(user?.role === 'admin'),
    delete: ({ req: { user } }) => Boolean(user?.role === 'admin'),
  },
  fields: [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      required: true,
      admin: { description: 'Name des Bewerters' },
    },
    {
      name: 'text',
      label: 'Bewertungstext',
      type: 'textarea',
      required: true,
      maxLength: 1000,
    },
    {
      name: 'rating',
      label: 'Sterne (1-5)',
      type: 'number',
      required: true,
      min: 1,
      max: 5,
      defaultValue: 5,
    },
    {
      name: 'context',
      label: 'Kontext',
      type: 'text',
      admin: { description: 'z.B. "Workshop-Teilnehmerin" — wird vom Besucher ausgefüllt' },
    },
    {
      name: 'approved',
      label: 'Freigegeben',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Nur freigegebene Bewertungen werden auf der Startseite angezeigt. Susanne kann hier Bewertungen ausblenden.',
      },
    },
  ],
}
