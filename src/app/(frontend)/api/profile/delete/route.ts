import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * DELETE /api/profile/delete
 * Allows a logged-in user to delete their own account (DSGVO Art. 17).
 * Requires password confirmation.
 */
export async function DELETE(req: NextRequest) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: req.headers })

  if (!user) {
    return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 })
  }

  let password: string
  try {
    const body = await req.json()
    password = body.password
  } catch {
    return NextResponse.json({ error: 'Ungültige Anfrage' }, { status: 400 })
  }

  if (!password) {
    return NextResponse.json({ error: 'Passwort zur Bestätigung erforderlich' }, { status: 400 })
  }

  // Verify password before deleting
  try {
    await payload.login({ collection: 'users', data: { email: user.email, password } })
  } catch {
    return NextResponse.json({ error: 'Passwort falsch' }, { status: 403 })
  }

  // Delete the account (overrideAccess because user can't delete via normal access control)
  try {
    await payload.delete({ collection: 'users', id: user.id, overrideAccess: true })
  } catch (err: any) {
    console.error('Account deletion failed:', err)
    return NextResponse.json({ error: 'Konto konnte nicht gelöscht werden' }, { status: 500 })
  }

  return NextResponse.json({ success: true, message: 'Konto wurde gelöscht' })
}
