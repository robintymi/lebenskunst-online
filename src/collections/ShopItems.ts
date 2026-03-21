import type { CollectionConfig } from 'payload'

export const ShopItems: CollectionConfig = {
  slug: 'shop-items',
  admin: {
    useAsTitle: 'title',
    group: 'Shop',
    description: 'Alle Shop-Elemente: Veranstaltungen, Trainings, Videos, Audio, Bücher etc.',
    defaultColumns: ['title', 'itemType', 'price', 'status', 'createdAt'],
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
      name: 'itemType',
      label: 'Typ',
      type: 'select',
      required: true,
      options: [
        { label: 'Seminar', value: 'seminar' },
        { label: 'Workshop', value: 'workshop' },
        { label: 'Vortrag', value: 'vortrag' },
        { label: 'Einzeltraining', value: 'einzeltraining' },
        { label: 'Videomaterial', value: 'video' },
        { label: 'Audiomaterial', value: 'audio' },
        { label: 'Begleitmaterial', value: 'begleitmaterial' },
        { label: 'Buch', value: 'buch' },
        { label: 'Kunstwerk', value: 'kunst' },
      ],
      admin: {
        position: 'sidebar',
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
      admin: {
        description: 'Wird in der Shop-Übersicht angezeigt (max. 300 Zeichen)',
      },
    },
    {
      name: 'image',
      label: 'Hauptbild',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'gallery',
      label: 'Weitere Bilder',
      type: 'array',
      admin: {
        description: 'Optionale zusätzliche Bilder',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },

    // === PREIS & RATENZAHLUNG ===
    {
      name: 'pricing',
      label: 'Preis & Zahlung',
      type: 'group',
      fields: [
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
              label: 'Streichpreis (€)',
              type: 'number',
              min: 0,
              admin: {
                width: '33%',
                description: 'Durchgestrichener Originalpreis (optional)',
              },
            },
            {
              name: 'isFree',
              label: 'Kostenlos',
              type: 'checkbox',
              defaultValue: false,
              admin: { width: '33%' },
            },
          ],
        },
        {
          name: 'installmentEnabled',
          label: 'Ratenzahlung möglich',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Erlaubt dem Kunden in Raten zu bezahlen',
          },
        },
        {
          name: 'installmentCount',
          label: 'Anzahl Raten',
          type: 'number',
          min: 2,
          max: 12,
          admin: {
            condition: (_, siblingData) => siblingData?.installmentEnabled,
            description: 'In wie vielen monatlichen Raten darf bezahlt werden? (2-12)',
          },
        },
        {
          name: 'installmentAmount',
          label: 'Betrag pro Rate (€)',
          type: 'number',
          min: 0,
          admin: {
            condition: (_, siblingData) => siblingData?.installmentEnabled,
            description: 'Wird automatisch berechnet wenn leer (Preis / Anzahl Raten)',
          },
        },
      ],
    },

    // === VERANSTALTUNGS-FELDER (Seminare, Workshops, Vorträge) ===
    {
      name: 'eventDetails',
      label: 'Veranstaltungsdetails',
      type: 'group',
      admin: {
        condition: (data) =>
          ['seminar', 'workshop', 'vortrag'].includes(data?.itemType),
        description: 'Nur für Seminare, Workshops und Vorträge',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'date',
              label: 'Datum & Uhrzeit',
              type: 'date',
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
          name: 'locationName',
          label: 'Ort',
          type: 'text',
        },
        {
          name: 'locationAddress',
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
        {
          type: 'row',
          fields: [
            {
              name: 'maxParticipants',
              label: 'Max. Teilnehmer',
              type: 'number',
              min: 1,
              admin: {
                width: '50%',
                description: 'Leer = unbegrenzt',
              },
            },
            {
              name: 'currentParticipants',
              label: 'Aktuelle Teilnehmer',
              type: 'number',
              defaultValue: 0,
              admin: { width: '50%', readOnly: true },
            },
          ],
        },
      ],
    },

    // === EINZELTRAINING-FELDER ===
    {
      name: 'trainingDetails',
      label: 'Trainingsdetails',
      type: 'group',
      admin: {
        condition: (data) => data?.itemType === 'einzeltraining',
        description: 'Nur für Einzeltrainings',
      },
      fields: [
        {
          name: 'durationWeeks',
          label: 'Zugang in Wochen',
          type: 'number',
          min: 1,
          max: 52,
          defaultValue: 6,
          admin: {
            description: 'Wie lange hat der Käufer Zugang? (z.B. 4-8 Wochen)',
          },
        },
        {
          name: 'modules',
          label: 'Module / Lektionen',
          type: 'array',
          fields: [
            {
              name: 'title',
              label: 'Modultitel',
              type: 'text',
              required: true,
            },
            {
              name: 'description',
              label: 'Beschreibung',
              type: 'textarea',
            },
            {
              name: 'weekNumber',
              label: 'Woche',
              type: 'number',
              min: 1,
              admin: { description: 'In welcher Woche wird freigeschaltet?' },
            },
          ],
        },
      ],
    },

    // === DIGITALES MATERIAL (Video, Audio, Begleitmaterial) ===
    {
      name: 'digitalDetails',
      label: 'Digitales Material',
      type: 'group',
      admin: {
        condition: (data) =>
          ['video', 'audio', 'begleitmaterial'].includes(data?.itemType),
        description: 'Nur für Video-, Audio- und Begleitmaterial',
      },
      fields: [
        {
          name: 'format',
          label: 'Format',
          type: 'text',
          admin: { description: 'z.B. MP4, MP3, PDF' },
        },
        {
          name: 'duration',
          label: 'Dauer / Umfang',
          type: 'text',
          admin: { description: 'z.B. "45 Min." oder "120 Seiten"' },
        },
        {
          name: 'previewUrl',
          label: 'Vorschau-URL',
          type: 'text',
          admin: { description: 'Link zu einer kostenlosen Vorschau (optional)' },
        },
        {
          name: 'contentFile',
          label: 'Inhaltsdatei',
          type: 'upload',
          relationTo: 'content-files' as any,
          admin: { description: 'Die eigentliche Video-/Audio-/PDF-Datei (nur für Käufer zugänglich)' },
        },
      ],
    },

    // === BUCH-FELDER ===
    {
      name: 'bookDetails',
      label: 'Buchdetails',
      type: 'group',
      admin: {
        condition: (data) => data?.itemType === 'buch',
        description: 'Nur für Bücher',
      },
      fields: [
        { name: 'author', label: 'Autor/in', type: 'text' },
        { name: 'isbn', label: 'ISBN', type: 'text' },
        { name: 'pages', label: 'Seitenanzahl', type: 'number', min: 1 },
        { name: 'publisher', label: 'Verlag', type: 'text' },
        {
          name: 'shippingCost',
          label: 'Versandkosten (€)',
          type: 'number',
          min: 0,
          defaultValue: 0,
          admin: { description: '0 = Kostenloser Versand' },
        },
      ],
    },

    // === KUNSTWERK-FELDER ===
    {
      name: 'kunstDetails',
      label: 'Kunstwerk-Details',
      type: 'group',
      admin: {
        condition: (data) => data?.itemType === 'kunst',
        description: 'Nur für Kunstwerke',
      },
      fields: [
        { name: 'medium', label: 'Medium / Technik', type: 'text', admin: { description: 'z.B. Acryl auf Leinwand, Aquarell, Mischtechnik' } },
        { name: 'dimensions', label: 'Maße', type: 'text', admin: { description: 'z.B. 60 x 80 cm' } },
        { name: 'year', label: 'Entstehungsjahr', type: 'number', min: 1900, max: 2100 },
        { name: 'isUnikat', label: 'Unikat', type: 'checkbox', defaultValue: true, admin: { description: 'Kunstwerke sind standardmäßig Unikate (Stückzahl 1)' } },
        {
          name: 'videoUrl',
          label: 'Video zum Kunstwerk',
          type: 'text',
          admin: { description: 'Optional: Link zu einem Video über das Kunstwerk oder den Entstehungsprozess' },
        },
        {
          name: 'videoFile',
          label: 'Video-Datei',
          type: 'upload',
          relationTo: 'content-files' as any,
          admin: { description: 'Optional: Video-Datei direkt hochladen' },
        },
        {
          name: 'shippingCost',
          label: 'Versandkosten (€)',
          type: 'number',
          min: 0,
          defaultValue: 0,
          admin: { description: '0 = Kostenloser Versand oder Abholung' },
        },
      ],
    },

    // === KATEGORIEN & BUNDLES ===
    {
      name: 'categories',
      label: 'Kategorien',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      admin: {
        position: 'sidebar',
        description: 'z.B. Abhängigkeiten, Bewusstseinsarchitektur',
      },
    },
    {
      name: 'bundles',
      label: 'Teil von Bundles',
      type: 'relationship',
      relationTo: 'bundles',
      hasMany: true,
      admin: {
        position: 'sidebar',
        description: 'Themenbundles, zu denen dieses Item gehört',
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
        { label: 'Ausverkauft', value: 'sold_out' },
        { label: 'Archiviert', value: 'archived' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'featured',
      label: 'Hervorgehoben',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Wird auf der Startseite angezeigt',
      },
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
