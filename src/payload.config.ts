import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import nodemailer from 'nodemailer'
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
import { ContentFiles } from './collections/ContentFiles'
import { SiteSettings } from './collections/SiteSettings'
import { Reviews } from './collections/Reviews'
import { Discounts } from './collections/Discounts'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '- Lebenskunst Admin',
    },
    components: {
      beforeNavLinks: ['@/components/admin/WebsiteLink'],
    },
  },
  collections: [Users, ShopItems, Bundles, Podcasts, Media, ContentFiles, Orders, Categories, Reviews, Discounts],
  editor: lexicalEditor(),
  secret: (() => {
    if (!process.env.PAYLOAD_SECRET) throw new Error('PAYLOAD_SECRET environment variable is not set')
    return process.env.PAYLOAD_SECRET
  })(),
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.MONGODB_URI || '',
  }),
  sharp,
  globals: [SiteSettings],
  plugins: [],
  email: process.env.RESEND_API_KEY
    ? nodemailerAdapter({
        defaultFromAddress: 'noreply@lebenskunstonline.de',
        defaultFromName: 'Lebenskunst',
        transport: nodemailer.createTransport({
          host: 'smtp.resend.com',
          port: 465,
          secure: true,
          auth: {
            user: 'resend',
            pass: process.env.RESEND_API_KEY,
          },
        }),
      })
    : undefined,
})
