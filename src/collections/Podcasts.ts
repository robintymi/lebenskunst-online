import type { CollectionConfig } from 'payload'

export const Podcasts: CollectionConfig = {
  slug: 'podcasts',
  admin: {
    useAsTitle: 'title',
    group: 'Inhalte',
    description: 'Podcast-Episoden für die Landingpage',
    defaultColumns: ['title', 'episodeNumber', 'publishDate', 'status'],
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
      label: 'Episodentitel',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'episodeNumber',
      label: 'Episodennummer',
      type: 'number',
      min: 1,
      admin: { position: 'sidebar' },
    },
    {
      name: 'description',
      label: 'Beschreibung',
      type: 'richText',
    },
    {
      name: 'shortDescription',
      label: 'Kurzbeschreibung',
      type: 'textarea',
      maxLength: 300,
    },
    {
      name: 'coverImage',
      label: 'Coverbild',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'audioUrl',
      label: 'Audio-URL',
      type: 'text',
      admin: {
        description: 'Link zur Podcast-Datei (Spotify, Apple Podcasts, eigener Host etc.)',
      },
    },
    {
      name: 'spotifyUrl',
      label: 'Spotify-Link',
      type: 'text',
    },
    {
      name: 'applePodcastsUrl',
      label: 'Apple Podcasts-Link',
      type: 'text',
    },
    {
      name: 'duration',
      label: 'Dauer',
      type: 'text',
      admin: { description: 'z.B. "45 Min."' },
    },
    {
      name: 'publishDate',
      label: 'Veröffentlichungsdatum',
      type: 'date',
      admin: {
        date: { displayFormat: 'dd.MM.yyyy' },
        position: 'sidebar',
      },
    },
    {
      name: 'relatedItems',
      label: 'Verwandte Shop-Items',
      type: 'relationship',
      relationTo: 'shop-items',
      hasMany: true,
      admin: {
        description: 'Shop-Items die zum Thema dieser Episode passen',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Entwurf', value: 'draft' },
        { label: 'Veröffentlicht', value: 'published' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
}
