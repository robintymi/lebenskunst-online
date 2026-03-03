import type { CollectionConfig } from 'payload'

export const Bundles: CollectionConfig = {
  slug: 'bundles',
  admin: {
    useAsTitle: 'name',
    group: 'Shop',
    description: 'Themenbundles: Gruppiere mehrere Shop-Items zu einem Bundle-Angebot',
    defaultColumns: ['name', 'bundlePrice', 'status'],
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
      label: 'Bundle-Name',
      type: 'text',
      required: true,
      admin: {
        description: 'z.B. "Abhängigkeiten — Komplett-Paket"',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'theme',
      label: 'Thema',
      type: 'select',
      required: true,
      options: [
        { label: 'Abhängigkeiten', value: 'abhaengigkeiten' },
        { label: 'Bewusstseinsarchitektur', value: 'bewusstseinsarchitektur' },
        { label: 'Diskohärenzmodell', value: 'diskohaerenzmodell' },
        { label: 'Sonstiges', value: 'sonstiges' },
      ],
      admin: {
        description: 'Kann im Admin jederzeit um neue Themen erweitert werden',
      },
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
      name: 'image',
      label: 'Bundle-Bild',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'items',
      label: 'Enthaltene Items',
      type: 'relationship',
      relationTo: 'shop-items',
      hasMany: true,
      required: true,
      admin: {
        description: 'Welche Shop-Items sind in diesem Bundle enthalten?',
      },
    },
    {
      name: 'bundlePrice',
      label: 'Bundle-Preis (€)',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Reduzierter Gesamtpreis für das Bundle (günstiger als Einzelkauf)',
      },
    },
    {
      name: 'savingsText',
      label: 'Ersparnis-Text',
      type: 'text',
      admin: {
        description: 'z.B. "Du sparst 25%" — wird automatisch berechnet wenn leer',
      },
    },
    {
      name: 'installmentEnabled',
      label: 'Ratenzahlung möglich',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'installmentCount',
      label: 'Anzahl Raten',
      type: 'number',
      min: 2,
      max: 12,
      admin: {
        condition: (_, siblingData) => siblingData?.installmentEnabled,
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
        { label: 'Archiviert', value: 'archived' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
}
