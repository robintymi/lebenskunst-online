import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function PATCH(req: NextRequest) {
  const payload = await getPayload({ config })

  const { user } = await payload.auth({ headers: req.headers })
  if (!user) {
    return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 })
  }

  try {
    const body = await req.json()

    // Only allow updating safe fields
    const allowedFields: Record<string, any> = {}
    if (body.firstName !== undefined) allowedFields.firstName = body.firstName
    if (body.lastName !== undefined) allowedFields.lastName = body.lastName
    if (body.phone !== undefined) allowedFields.phone = body.phone
    if (body.password !== undefined) allowedFields.password = body.password

    const updated = await payload.update({
      collection: 'users',
      id: user.id,
      data: allowedFields,
    })

    return NextResponse.json({
      success: true,
      user: {
        id: updated.id,
        email: updated.email,
        firstName: updated.firstName,
        lastName: updated.lastName,
        phone: updated.phone,
      },
    })
  } catch (error: any) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: error?.message || 'Profil konnte nicht aktualisiert werden.' },
      { status: 400 },
    )
  }
}
