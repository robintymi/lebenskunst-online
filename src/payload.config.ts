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
import { SiteTexts } from './collections/SiteTexts'
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
      views: {
        dashboard: {
          Component: '@/components/admin/Dashboard',
        },
      },
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
  globals: [SiteSettings, SiteTexts],
  plugins: [],
  onInit: async (payload) => {
    const email = process.env.BOOTSTRAP_ADMIN_EMAIL
    const password = process.env.BOOTSTRAP_ADMIN_PASSWORD

    if (!email || !password) return

    const existing = await payload.find({ collection: 'users', limit: 1 })
    if ((existing?.docs?.length || 0) > 0) return

    await payload.create({
      collection: 'users',
      data: {
        email,
        password,
        role: 'admin',
      },
      overrideAccess: true,
    })

    payload.logger.info(`Bootstrap admin user created: ${email}`)
  },
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
