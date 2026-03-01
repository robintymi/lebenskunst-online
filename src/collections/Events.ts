import type { CollectionConfig } from 'payload'

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'title',
    group: 'Shops',
    description: 'Veranstaltungen wie Workshops, Frauenkreise, Breathwork etc.',
    defaultColumns: ['title', 'eventType', 'date', 'price', 'status'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user?.role === 'admin'),
    update: ({ req: { user } }) => Boolean(user?.role === 'admin'),
    delete: ({ req: { user } }) => Boolean(user?.role === 'admin'),
  },
  fields: [
    {
      name: 'title',
      label: 'Titel',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
        description: 'URL-freundlicher Name (z.B. breathwork-workshop-maerz)',
      },
    },
    {
      name: 'eventType',
      label: 'Art der Veranstaltung',
      type: 'select',
      required: true,
      options: [
        { label: 'Embodiment', value: 'embodiment' },
        { label: 'Energiearbeit', value: 'energiearbeit' },
        { label: 'Frauenkreis', value: 'frauenkreis' },
        { label: 'Kunsttherapie', value: 'kunsttherapie' },
        { label: 'Meditation', value: 'meditation' },
        { label: 'Breathwork', value: 'breathwork' },
        { label: 'Workshop', value: 'workshop' },
        { label: 'Sonstiges', value: 'sonstiges' },
      ],
    },
    {
      name: 'description',
      label: 'Beschreibung',
      type: 'richText',
      required: true,
    },
    {
      name: 'shortDescription',
      label: 'Kurzbeschreibung',
      type: 'textarea',
      maxLength: 300,
      admin: {
        description: 'Wird in der Übersicht angezeigt (max. 300 Zeichen)',
      },
    },
    {
      name: 'image',
      label: 'Bild',
      type: 'upload',
      relationTo: 'media',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'date',
          label: 'Datum',
          type: 'date',
          required: true,
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
              displayFormat: 'dd.MM.yyyy HH:mm',
            },
            width: '50%',
          },
        },
        {
          name: 'endDate',
          label: 'Enddatum',
          type: 'date',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
              displayFormat: 'dd.MM.yyyy HH:mm',
            },
            width: '50%',
            description: 'Optional, für mehrtägige Events',
          },
        },
      ],
    },
    {
      name: 'location',
      label: 'Ort',
      type: 'group',
      fields: [
        {
          name: 'name',
          label: 'Ortsname',
          type: 'text',
        },
        {
          name: 'address',
          label: 'Adresse',
          type: 'text',
        },
        {
          name: 'isOnline',
          label: 'Online-Veranstaltung',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'onlineLink',
          label: 'Online-Link (z.B. Zoom)',
          type: 'text',
          admin: {
            condition: (_, siblingData) => siblingData?.isOnline,
            description: 'Wird nur für gebuchte Teilnehmer sichtbar',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'price',
          label: 'Preis (€)',
          type: 'number',
          required: true,
          min: 0,
          admin: { width: '33%' },
        },
        {
          name: 'maxParticipants',
          label: 'Max. Teilnehmer',
          type: 'number',
          min: 1,
          admin: {
            width: '33%',
            description: 'Leer = unbegrenzt',
          },
        },
        {
          name: 'currentParticipants',
          label: 'Aktuelle Teilnehmer',
          type: 'number',
          defaultValue: 0,
          admin: { width: '33%', readOnly: true },
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Entwurf', value: 'draft' },
        { label: 'Veröffentlicht', value: 'published' },
        { label: 'Ausverkauft', value: 'sold_out' },
        { label: 'Abgesagt', value: 'cancelled' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'category',
      label: 'Kategorie',
      type: 'relationship',
      relationTo: 'categories',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
