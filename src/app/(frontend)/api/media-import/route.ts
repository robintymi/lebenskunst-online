import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

const SIZE_SUFFIX_RE = /-\d+x\d+\.[a-z]+$/i

export async function POST(req: NextRequest) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: req.headers })

  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const mediaDir = path.join(process.cwd(), 'media')

  if (!fs.existsSync(mediaDir)) {
    return NextResponse.json({ error: 'Media-Verzeichnis nicht gefunden', path: mediaDir }, { status: 404 })
  }

  const allFiles = fs.readdirSync(mediaDir)
  const originals = allFiles.filter(
    (f) => /\.(jpg|jpeg|png|webp)$/i.test(f) && !SIZE_SUFFIX_RE.test(f),
  )

  const results: { file: string; status: 'created' | 'skipped' | 'error'; error?: string }[] = []

  for (const filename of originals) {
    const existing = await payload.find({
      collection: 'media',
      where: { filename: { equals: filename } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      results.push({ file: filename, status: 'skipped' })
      continue
    }

    try {
      const filePath = path.join(mediaDir, filename)
      const buffer = fs.readFileSync(filePath)
      const ext = path.extname(filename).toLowerCase()
      const mimeType = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg'
      const altText = path.basename(filename, ext).replace(/[_-]+/g, ' ')

      await payload.create({
        collection: 'media',
        data: { alt: altText },
        file: {
          data: buffer,
          mimetype: mimeType,
          name: filename,
          size: buffer.length,
        },
      })

      results.push({ file: filename, status: 'created' })
    } catch (err: any) {
      results.push({ file: filename, status: 'error', error: err?.message })
    }
  }

  const created = results.filter((r) => r.status === 'created').length
  const skipped = results.filter((r) => r.status === 'skipped').length
  const errors = results.filter((r) => r.status === 'error').length

  return NextResponse.json({ created, skipped, errors, results })
}
