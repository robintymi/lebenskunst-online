import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    group: 'Shops',
    description: 'Kunstgegenstände und Produkte zum Verkauf',
    defaultColumns: ['name', 'price', 'stock', 'status'],
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
      label: 'Produktname',
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
        description: 'URL-freundlicher Name',
      },
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
    },
    {
      name: 'images',
      label: 'Bilder',
      type: 'array',
      minRows: 1,
      fields: [
        {
          name: 'image',
          label: 'Bild',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'alt',
          label: 'Bildbeschreibung',
          type: 'text',
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
          name: 'comparePrice',
          label: 'Vergleichspreis (€)',
          type: 'number',
          min: 0,
          admin: {
            width: '33%',
            description: 'Durchgestrichener Originalpreis (optional)',
          },
        },
        {
          name: 'stock',
          label: 'Bestand',
          type: 'number',
          min: 0,
          defaultValue: 1,
          admin: {
            width: '33%',
            description: '0 = Ausverkauft',
          },
        },
      ],
    },
    {
      name: 'details',
      label: 'Produktdetails',
      type: 'group',
      fields: [
        {
          name: 'dimensions',
          label: 'Maße',
          type: 'text',
          admin: { description: 'z.B. 30x40 cm' },
        },
        {
          name: 'material',
          label: 'Material',
          type: 'text',
        },
        {
          name: 'artist',
          label: 'Künstler/in',
          type: 'text',
        },
        {
          name: 'year',
          label: 'Entstehungsjahr',
          type: 'number',
        },
      ],
    },
    {
      name: 'shipping',
      label: 'Versand',
      type: 'group',
      fields: [
        {
          name: 'weight',
          label: 'Gewicht (kg)',
          type: 'number',
          min: 0,
        },
        {
          name: 'shippingCost',
          label: 'Versandkosten (€)',
          type: 'number',
          min: 0,
          defaultValue: 0,
          admin: { description: '0 = Kostenloser Versand' },
        },
        {
          name: 'isPickupOnly',
          label: 'Nur Abholung',
          type: 'checkbox',
          defaultValue: false,
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
        { label: 'Archiviert', value: 'archived' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'category',
      label: 'Kategorie',
      type: 'relationship',
      relationTo: 'categories',
      admin: { position: 'sidebar' },
    },
  ],
}
