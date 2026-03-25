import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(req: NextRequest) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: req.headers })
  if (!user || user.role !== 'admin') return NextResponse.json({ error: 'Kein Zugriff' }, { status: 403 })

  const { userId, subject, message } = await req.json()
  if (!userId || !subject || !message) return NextResponse.json({ error: 'userId, subject und message sind Pflicht' }, { status: 400 })

  const customer = await payload.findByID({ collection: 'users', id: userId })
  if (!customer?.email) return NextResponse.json({ error: 'Kunde nicht gefunden' }, { status: 404 })

  const isDevMode = !process.env.RESEND_API_KEY
  if (isDevMode) {
    console.log(`[DEV] Email to ${customer.email}: ${subject}\n${message}`)
    return NextResponse.json({ success: true, dev: true })
  }

  try {
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'Lebenskunst <noreply@lebenskunstonline.de>',
      to: customer.email,
      subject,
      html: `<div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:32px"><p>${message.replace(/\n/g, '<br/>')}</p><hr style="border:none;border-top:1px solid #eee;margin:24px 0"/><p style="font-size:12px;color:#888">Lebenskunst Online · lebenskunstonline.de</p></div>`,
    })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Admin email send error:', err)
    return NextResponse.json({ error: 'E-Mail konnte nicht gesendet werden' }, { status: 500 })
  }
}
