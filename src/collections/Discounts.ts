import type { CollectionConfig } from 'payload'

export const Discounts: CollectionConfig = {
  slug: 'discounts',
  admin: {
    useAsTitle: 'code',
    group: 'Shop',
    description: 'Rabattcodes und Gutscheine für den Shop',
    defaultColumns: ['code', 'type', 'value', 'usedCount', 'maxUses', 'active', 'expiresAt'],
  },
  access: {
    read: ({ req: { user } }) => Boolean(user?.role === 'admin'),
    create: ({ req: { user } }) => Boolean(user?.role === 'admin'),
    update: ({ req: { user } }) => Boolean(user?.role === 'admin'),
    delete: ({ req: { user } }) => Boolean(user?.role === 'admin'),
  },
  fields: [
    {
      name: 'code',
      label: 'Rabattcode',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'z.B. SOMMER20 — wird automatisch großgeschrieben' },
      hooks: {
        beforeValidate: [({ value }) => (typeof value === 'string' ? value.toUpperCase().trim() : value)],
      },
    },
    {
      name: 'type',
      label: 'Rabatttyp',
      type: 'select',
      required: true,
      options: [
        { label: 'Prozent (z.B. 20%)', value: 'percentage' },
        { label: 'Fester Betrag (z.B. 10€)', value: 'fixed' },
      ],
    },
    {
      name: 'value',
      label: 'Rabattwert',
      type: 'number',
      required: true,
      min: 0,
      admin: { description: 'Bei Prozent: 20 = 20%. Bei festem Betrag: 10 = 10€' },
    },
    {
      name: 'maxUses',
      label: 'Max. Verwendungen (0 = unbegrenzt)',
      type: 'number',
      defaultValue: 0,
      min: 0,
    },
    {
      name: 'usedCount',
      label: 'Bereits verwendet',
      type: 'number',
      defaultValue: 0,
      admin: { readOnly: true },
    },
    {
      name: 'expiresAt',
      label: 'Gültig bis',
      type: 'date',
      admin: { description: 'Leer lassen für unbegrenzte Gültigkeit' },
    },
    {
      name: 'active',
      label: 'Aktiv',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'description',
      label: 'Interne Notiz',
      type: 'text',
      admin: { description: 'Nur für dich sichtbar, z.B. "Weihnachtsaktion 2026"' },
    },
  ],
}
