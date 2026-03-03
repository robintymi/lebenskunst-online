import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { localStorageAdapter } from '@payloadcms/storage-local'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Users } from './collections/Users'
import { ShopItems } from './collections/ShopItems'
import { Bundles } from './collections/Bundles'
import { Podcasts } from './collections/Podcasts'
import { Media } from './collections/Media'
import { Orders } from './collections/Orders'
import { Categories } from './collections/Categories'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '- Lebenskunst Admin',
    },
  },
  collections: [Users, ShopItems, Bundles, Podcasts, Media, Orders, Categories],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.MONGODB_URI || '',
  }),
  sharp,
  plugins: [
    localStorageAdapter({
      collections: {
        media: true,
      },
      generateFileURL: ({ filename }) => {
        return `/media/${filename}`
      },
    }),
  ],
})
