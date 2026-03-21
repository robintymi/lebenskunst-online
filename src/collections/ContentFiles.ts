import type { CollectionConfig } from 'payload'

export const ContentFiles: CollectionConfig = {
  slug: 'content-files',
  admin: {
    group: 'Medien',
    description: 'Video-, Audio- und PDF-Dateien für digitale Produkte',
  },
  access: {
    // Only admins can read directly — content is served via /api/content/[id] with auth check
    read: ({ req: { user } }) => Boolean(user?.role === 'admin'),
    create: ({ req: { user } }) => Boolean(user?.role === 'admin'),
    update: ({ req: { user } }) => Boolean(user?.role === 'admin'),
    delete: ({ req: { user } }) => Boolean(user?.role === 'admin'),
  },
  upload: {
    staticDir: 'content',
    mimeTypes: [
      'video/mp4',
      'video/webm',
      'video/quicktime',
      'audio/mpeg',
      'audio/mp3',
      'audio/wav',
      'audio/ogg',
      'application/pdf',
    ],
  },
  fields: [
    {
      name: 'alt',
      label: 'Beschreibung',
      type: 'text',
      admin: { description: 'Kurze Beschreibung der Datei' },
    },
  ],
}
