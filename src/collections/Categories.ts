import type { CollectionConfig } from 'payload'

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export const Categories: CollectionConfig = {
  slug: 'categories',
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data && !data.slug && data.name) {
          data.slug = generateSlug(data.name)
        }
        return data
      },
    ],
  },
  admin: {
    useAsTitle: 'name',
    group: 'Shop',
    description: 'Themen-Kategorien zum Filtern (z.B. Abhängigkeiten, Bewusstseinsarchitektur)',
    defaultColumns: ['name', 'slug'],
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
      admin: {
        description: 'z.B. Abhängigkeiten, Bewusstseinsarchitektur, Diskohärenzmodell',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'description',
      label: 'Beschreibung',
      type: 'textarea',
    },
    {
      name: 'image',
      label: 'Kategoriebild',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'sortOrder',
      label: 'Sortierung',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Niedrigere Zahl = weiter oben',
      },
    },
  ],
}
