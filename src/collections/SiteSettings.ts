import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Seiteneinstellungen',
  admin: {
    group: 'Verwaltung',
    description: 'Einstellungen für die Startseite und allgemeine Seitenoptionen',
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user?.role === 'admin'),
  },
  fields: [
    {
      name: 'heroImage',
      label: 'Startseiten-Bild',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Das große Portraitbild auf der Startseite (wird im Kreis angezeigt)',
      },
    },
    {
      name: 'heroTitle',
      label: 'Überschrift',
      type: 'text',
      defaultValue: 'Lebenskunst',
      admin: {
        description: 'Die große Überschrift auf der Startseite',
      },
    },
    {
      name: 'heroSubtitle',
      label: 'Untertitel',
      type: 'textarea',
      defaultValue: 'Ich begleite Menschen auf dem Weg zu mehr Bewusstsein, Lebendigkeit und authentischem Selbstausdruck. Denn wahre Erfüllung entsteht nicht im Außen, sondern im Innen. Dort beginnt das Leben.',
      admin: {
        description: 'Der Text unter der Überschrift auf der Startseite',
      },
    },
    {
      name: 'quoteText',
      label: 'Zitat',
      type: 'textarea',
      defaultValue: 'Selbstausdruck ist der Tanz der Seele — und vielleicht genau das, wonach wir alle suchen.',
    },
    {
      name: 'testimonials',
      label: 'Kundenstimmen',
      type: 'array',
      admin: {
        description: 'Bewertungen und Erfahrungsberichte von Teilnehmern',
      },
      fields: [
        {
          name: 'name',
          label: 'Name',
          type: 'text',
          required: true,
          admin: { description: 'z.B. "Maria K." oder "Thomas"' },
        },
        {
          name: 'text',
          label: 'Bewertungstext',
          type: 'textarea',
          required: true,
        },
        {
          name: 'rating',
          label: 'Sterne (1-5)',
          type: 'number',
          min: 1,
          max: 5,
          defaultValue: 5,
        },
        {
          name: 'context',
          label: 'Kontext',
          type: 'text',
          admin: { description: 'z.B. "Workshop-Teilnehmerin" oder "Einzeltraining"' },
        },
      ],
    },
  ],
}
