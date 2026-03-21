import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET() {
  const payload = await getPayload({ config })

  const reviews = await payload.find({
    collection: 'reviews',
    where: { approved: { equals: true } },
    sort: '-createdAt',
    limit: 20,
  })

  return NextResponse.json({ reviews: reviews.docs })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, text, rating, context } = body

    if (!name || !text || !rating) {
      return NextResponse.json(
        { error: 'Name, Bewertung und Text sind Pflichtfelder.' },
        { status: 400 },
      )
    }

    if (name.length > 100 || text.length > 1000) {
      return NextResponse.json({ error: 'Text zu lang.' }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Bewertung muss zwischen 1 und 5 sein.' },
        { status: 400 },
      )
    }

    const payload = await getPayload({ config })

    const review = await payload.create({
      collection: 'reviews',
      data: {
        name: name.trim(),
        text: text.trim(),
        rating: Math.round(rating),
        context: context?.trim() || undefined,
        approved: true,
      },
    })

    return NextResponse.json({ success: true, review })
  } catch (error) {
    console.error('Review submission error:', error)
    return NextResponse.json(
      { error: 'Bewertung konnte nicht gespeichert werden.' },
      { status: 500 },
    )
  }
}
