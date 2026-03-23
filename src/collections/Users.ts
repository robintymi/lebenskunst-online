import type { CollectionConfig } from 'payload'
import { sendWelcomeEmail } from '@/lib/email'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    useAPIKey: false,
    forgotPassword: {
      generateEmailHTML: ({ token, user }) => {
        const resetURL = `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/passwort-reset?token=${token}`
        const firstName = (user as { firstName?: string }).firstName || ''
        return `<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#FAFAFE;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#2D1B4E;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAFAFE;padding:2rem 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border-radius:16px;overflow:hidden;box-shadow:0 4px 16px rgba(107,76,154,0.08);">
        <tr><td style="background:linear-gradient(135deg,#6B4C9A,#9B6DB7);padding:2rem;text-align:center;">
          <h1 style="color:#FFFFFF;font-size:1.75rem;margin:0;font-weight:600;">Lebenskunst</h1>
        </td></tr>
        <tr><td style="padding:2rem;">
          <h2 style="color:#2D1B4E;margin:0 0 0.5rem;font-size:1.5rem;">Passwort zurücksetzen</h2>
          <p>Hallo${firstName ? ` ${firstName}` : ''},</p>
          <p>du hast eine Anfrage zum Zurücksetzen deines Passworts gestellt. Klicke auf den folgenden Button, um ein neues Passwort zu vergeben:</p>
          <div style="text-align:center;margin:2rem 0;">
            <a href="${resetURL}" style="display:inline-block;padding:0.875rem 2rem;background:linear-gradient(135deg,#6B4C9A,#9B6DB7);color:#FFFFFF;border-radius:999px;text-decoration:none;font-weight:500;">Passwort zurücksetzen</a>
          </div>
          <p style="font-size:0.875rem;color:#7E6E96;">Falls du diese Anfrage nicht gestellt hast, kannst du diese E-Mail ignorieren. Der Link ist 1 Stunde gültig.</p>
          <p>Herzliche Grüße,<br/>Dein Lebenskunst-Team</p>
        </td></tr>
        <tr><td style="padding:1.5rem 2rem;border-top:1px solid rgba(155,109,183,0.15);text-align:center;font-size:0.8125rem;color:#7E6E96;">
          <p style="margin:0;">Lebenskunst &mdash; Deine Reise zu dir selbst</p>
          <p style="margin:0.5rem 0 0;"><a href="https://lebenskunstonline.de" style="color:#6B4C9A;text-decoration:none;">lebenskunstonline.de</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
      },
      generateEmailSubject: () => 'Lebenskunst — Passwort zurücksetzen',
    },
  },
  admin: {
    useAsTitle: 'email',
    group: 'Verwaltung',
    hidden: ({ user }) => user?.role !== 'admin',
  },
  access: {
    admin: ({ req: { user } }) => Boolean(user?.role === 'admin'),
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return { id: { equals: user.id } }
    },
    create: () => true,
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return { id: { equals: user.id } }
    },
    delete: ({ req: { user } }) => Boolean(user?.role === 'admin'),
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Mitglied', value: 'member' },
      ],
      defaultValue: 'member',
      required: true,
      access: {
        update: ({ req: { user } }) => Boolean(user?.role === 'admin'),
      },
      admin: {
        description: 'Admin kann alles verwalten, Mitglied hat Zugang zum Mitgliederbereich',
        condition: (data, siblingData, { user }) => user?.role === 'admin',
      },
    },
    {
      name: 'firstName',
      label: 'Vorname',
      type: 'text',
    },
    {
      name: 'lastName',
      label: 'Nachname',
      type: 'text',
    },
    {
      name: 'phone',
      label: 'Telefon',
      type: 'text',
    },
    {
      name: 'purchasedItems',
      label: 'Gekaufte Items',
      type: 'relationship',
      relationTo: 'shop-items',
      hasMany: true,
      admin: {
        description: 'Alle gekauften/gebuchten Shop-Items',
      },
    },
    {
      name: 'purchasedBundles',
      label: 'Gekaufte Bundles',
      type: 'relationship',
      relationTo: 'bundles',
      hasMany: true,
    },
    {
      name: 'trainingAccess',
      label: 'Trainings-Zugang',
      type: 'array',
      admin: {
        description: 'Aktive Einzeltrainings mit Ablaufdatum',
        readOnly: true,
      },
      fields: [
        {
          name: 'training',
          type: 'relationship',
          relationTo: 'shop-items',
          required: true,
        },
        {
          name: 'startDate',
          label: 'Startdatum',
          type: 'date',
          required: true,
        },
        {
          name: 'endDate',
          label: 'Enddatum',
          type: 'date',
          required: true,
        },
      ],
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, operation }) => {
        if (operation === 'create' && doc.role === 'member') {
          try {
            await sendWelcomeEmail({
              firstName: doc.firstName || 'Mitglied',
              email: doc.email,
            })
          } catch (err) {
            console.error('Failed to send welcome email:', err)
          }
        }
      },
    ],
  },
}
