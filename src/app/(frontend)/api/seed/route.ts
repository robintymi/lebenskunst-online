import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

const PRODUCTS = [
  // === BEISTELLTISCHE ===
  {
    title: 'Lotustisch',
    slug: 'lotustisch',
    itemType: 'kunst',
    price: 349,
    category: 'Beistelltische',
    shortDescription: 'Handgefertigter Beistelltisch mit Lotusblüten-Motiv auf der Tischplatte und integrierter Beleuchtung. Naturholzbeine verleihen diesem Unikat seinen besonderen Charme.',
    medium: 'Naturholz, Epoxidharz, LED-Beleuchtung',
    dimensions: 'ca. 35 x 35 x 40 cm',
    localImage: 'Lotustisch_1.jpg',
    featured: true,
  },

  // === ACRYLMALEREI ===
  {
    title: 'Zerfall',
    slug: 'zerfall',
    itemType: 'kunst',
    price: 300,
    category: 'Acrylmalerei',
    shortDescription: 'Ausdrucksstarkes Herz-Ass in Mischtechnik — ein Symbol für Vergänglichkeit und die Schönheit des Unperfekten. Signiertes Original in gedeckten Erdtönen mit roten Akzenten.',
    medium: 'Acryl, Mischtechnik auf Leinwand',
    dimensions: 'ca. 60 x 80 cm, gerahmt',
    localImage: 'Zerfall_1.jpg',
    featured: true,
  },
  {
    title: 'Gartenmalerei',
    slug: 'gartenmalerei',
    itemType: 'kunst',
    price: 300,
    category: 'Acrylmalerei',
    shortDescription: 'Farbenprächtiges Blumenarrangement auf leuchtendem Grün — eine Hommage an die Vielfalt der Natur. Detailreiche Blüten in zarten Pastelltönen vor lebhaftem Hintergrund.',
    medium: 'Acryl, Mischtechnik auf Leinwand',
    dimensions: 'ca. 70 x 50 cm, gerahmt',
    localImage: 'Gartenmalerei_1.jpg',
    featured: true,
  },
  {
    title: 'In Freiheit gefangen',
    slug: 'in-freiheit-gefangen',
    itemType: 'kunst',
    price: 240,
    category: 'Acrylmalerei',
    shortDescription: 'Ein kraftvolles Werk über das Spannungsfeld zwischen Freiheit und innerer Gefangenschaft. Tiefgründig und ausdrucksstark — ein Kunstwerk, das zum Nachdenken einlädt.',
    medium: 'Acryl auf Leinwand',
    dimensions: 'ca. 60 x 80 cm',
    localImage: null,
  },

  // === 3D-BILDER ===
  {
    title: 'Ruhender Buddha',
    slug: 'ruhender-buddha',
    itemType: 'kunst',
    price: 49,
    category: '3D-Bilder',
    shortDescription: 'Meditatives Buddha-Relief in Bronze- und Türkistönen auf einer handbearbeiteten Holzscheibe. Ein Wandobjekt, das Ruhe und inneren Frieden in jeden Raum bringt.',
    medium: 'Epoxidharz, Bronze-Pigmente, Holzscheibe',
    dimensions: 'ca. 30 x 25 cm',
    localImage: 'ruhender Buddha_1.jpg',
  },
  {
    title: 'Fensterblick',
    slug: 'fensterblick',
    itemType: 'kunst',
    price: 89,
    category: '3D-Bilder',
    shortDescription: 'Atmosphärisches 3D-Diorama mit winterlicher Szene — eine beleuchtete Parkbank hinter einem Fenster mit Backsteinmauer. Integrierte LED-Laternen schaffen stimmungsvolles Licht.',
    medium: 'Epoxidharz, Miniatur-Elemente, LED-Beleuchtung, Holzscheibe',
    dimensions: 'ca. 30 x 25 cm',
    localImage: 'Fensterblick_1.jpg',
  },
  {
    title: 'Trister Parkblick',
    slug: 'trister-parkblick',
    itemType: 'kunst',
    price: 89,
    category: '3D-Bilder',
    shortDescription: 'Detailreiches 3D-Relief mit romantischer Parkszene — Treppenstufen, beleuchtete Laternen und eine mystische Waldstimmung. Handbemalter Porzellanrand mit floralem Dekor.',
    medium: 'Epoxidharz, Miniatur-Elemente, LED-Beleuchtung, bemalte Keramik',
    dimensions: 'ca. 35 x 30 cm',
    localImage: 'trister Parkblick_1.jpg',
  },
  {
    title: 'Wasserlauf',
    slug: 'wasserlauf',
    itemType: 'kunst',
    price: 89,
    category: '3D-Bilder',
    shortDescription: 'Naturinspiriertes 3D-Wandobjekt mit beleuchtetem Bachlauf — Moos, Steine und Baumstämme verschmelzen zu einer lebendigen Naturszene. LED-Lichterkette als sanfte Hintergrundbeleuchtung.',
    medium: 'Epoxidharz, Naturmaterialien, LED-Beleuchtung, Holzscheibe',
    dimensions: 'ca. 30 x 25 cm',
    localImage: 'Wasserlauf_1.jpg',
  },
  {
    title: 'Blick in den Wald',
    slug: 'blick-in-den-wald',
    itemType: 'kunst',
    price: 89,
    category: '3D-Bilder',
    shortDescription: 'Stimmungsvolles 3D-Epoxidharz-Bild mit Tannenzapfen und warmem Lichtspiel — wie ein Blick in den herbstlichen Wald. Auf einer runden Holzscheibe mit natürlicher Rinde.',
    medium: 'Epoxidharz, Tannenzapfen, LED-Beleuchtung, Holzscheibe',
    dimensions: 'ca. 30 cm Durchmesser',
    localImage: 'Blick in den Wald_1.jpg',
  },

  // === KLEINDEKO ===
  {
    title: 'Etagere',
    slug: 'etagere',
    itemType: 'kunst',
    price: 25,
    category: 'Kleindeko',
    shortDescription: 'Elegante zweistöckige Etagere in kräftigem Rot mit gold-marmoriertem Finish. Handgegossen aus Epoxidharz mit goldfarbenen Verbindungselementen — perfekt als Schmuckablage oder Servierplatte.',
    medium: 'Epoxidharz, Goldpigmente, Metallgestell',
    dimensions: 'ca. 25 x 25 x 30 cm',
    localImage: 'Etagere rot_weiß_1.jpg',
  },
  {
    title: 'Moos-Teelicht',
    slug: 'moos-teelicht',
    itemType: 'kunst',
    price: 39,
    category: 'Kleindeko',
    shortDescription: 'Naturnahes Teelicht-Arrangement auf einer handverzierten Epoxidharz-Platte mit Moos und Goldakzenten. Vier Teelichter in Schwarz-Kupfer schaffen eine warme, erdige Atmosphäre.',
    medium: 'Epoxidharz, Naturmoos, Goldpigmente, Teelichthalter',
    dimensions: 'ca. 30 x 15 cm',
    localImage: 'Moos_Teelicht_1.jpg',
  },
  {
    title: 'Der Wanderschuh',
    slug: 'der-wanderschuh',
    itemType: 'kunst',
    price: 45,
    category: 'Kleindeko',
    shortDescription: 'Charmantes Wandobjekt mit einem detailgetreuen Miniatur-Wanderschuh als Blumenvase auf einer naturbelassenen Holzscheibe. Ein originelles Dekostück mit Liebe zum Detail.',
    medium: 'Miniatur-Schuh, Kunstblumen, Kiesel, Holzscheibe',
    dimensions: 'ca. 20 cm Durchmesser',
    localImage: 'Der Wanderschuh_1.jpg',
  },

  // === UHREN ===
  {
    title: 'Turmuhr',
    slug: 'turmuhr',
    itemType: 'kunst',
    price: 99,
    category: 'Uhren',
    shortDescription: 'Handgefertigte Wanduhr mit einzigartigem Design — ein funktionales Kunstwerk, das Zeit und Ästhetik verbindet. Jedes Stück ein Unikat.',
    medium: 'Epoxidharz, Uhrwerk, Naturmaterialien',
    localImage: null,
  },
  {
    title: 'Ewig ist zeitlos',
    slug: 'ewig-ist-zeitlos',
    itemType: 'kunst',
    price: 99,
    category: 'Uhren',
    shortDescription: 'Philosophische Wanduhr, die das Konzept der Zeitlosigkeit in ein Kunstwerk verwandelt. Ein Statement-Stück für alle, die Vergänglichkeit und Beständigkeit gleichermaßen schätzen.',
    medium: 'Epoxidharz, Uhrwerk, Mischtechnik',
    localImage: null,
  },

  // === NACHTLICHT ===
  {
    title: 'Kunstzimmer',
    slug: 'kunstzimmer',
    itemType: 'kunst',
    price: 99,
    category: 'Nachtlicht',
    shortDescription: 'Stimmungsvolles Nachtlicht-Kunstwerk — ein beleuchtetes Miniatur-Zimmer, das warmes Licht und kreative Gestaltung vereint. Perfekt als Deko oder sanftes Nachtlicht.',
    medium: 'Epoxidharz, LED-Beleuchtung, Miniatur-Elemente',
    localImage: null,
  },

  // === WEITERE ===
  {
    title: 'Die Blume des Lebens in Rosegold interpretiert',
    slug: 'blume-des-lebens-rosegold',
    itemType: 'kunst',
    price: 350,
    category: 'Acrylmalerei',
    shortDescription: 'Prachtvolles Kunstwerk mit dem heiligen geometrischen Muster der Blume des Lebens in schimmerndem Roségold. Ein spirituelles Statement-Piece für Bewusstseinsliebhaber.',
    medium: 'Acryl, Roségold-Pigmente auf Leinwand',
    dimensions: 'ca. 80 x 80 cm',
    localImage: null,
    featured: true,
  },
  {
    title: 'Elefantenkraft',
    slug: 'elefantenkraft',
    itemType: 'kunst',
    price: 79,
    category: '3D-Bilder',
    shortDescription: 'Kraftvolles 3D-Relief eines Elefanten — Symbol für Stärke, Weisheit und Erdverbundenheit. Handgearbeitet mit natürlichen Materialien.',
    medium: 'Epoxidharz, Naturmaterialien',
    localImage: null,
  },
]

async function uploadImage(payload: any, imagePath: string, altText: string) {
  try {
    const fullPath = path.resolve(process.cwd(), '..', imagePath)
    if (!fs.existsSync(fullPath)) return null

    const buffer = fs.readFileSync(fullPath)
    const filename = path.basename(fullPath)

    const media = await payload.create({
      collection: 'media',
      data: { alt: altText },
      file: {
        data: buffer,
        mimetype: 'image/jpeg',
        name: filename,
        size: buffer.length,
      },
    })

    return media.id
  } catch (err) {
    console.error(`Failed to upload image ${imagePath}:`, err)
    return null
  }
}

export async function POST() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Seed ist in der Produktionsumgebung deaktiviert.' }, { status: 403 })
  }

  try {
    const payload = await getPayload({ config })

    // Check if products already exist
    const existing = await payload.find({ collection: 'shop-items', limit: 1 })
    if (existing.docs.length > 0) {
      return NextResponse.json({
        message: 'Shop bereits befüllt. Lösche zuerst alle Produkte im Admin wenn du neu seeden willst.',
        count: existing.totalDocs,
      })
    }

    console.log('[SEED] Starting product seed...')

    // Create categories
    const categoryNames = [...new Set(PRODUCTS.map((p) => p.category))]
    const categoryMap: Record<string, string> = {}

    for (const name of categoryNames) {
      const cat = await payload.create({
        collection: 'categories',
        data: {
          name,
          slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-'),
        },
      })
      categoryMap[name] = cat.id
      console.log(`[SEED] Category: ${name}`)
    }

    // Create products
    let created = 0
    for (const product of PRODUCTS) {
      let imageId: string | null = null

      // Upload main image if available locally
      if (product.localImage) {
        imageId = await uploadImage(
          payload,
          product.localImage,
          product.title,
        )
      }

      // Upload gallery images (look for _2, _3 variants)
      const galleryIds: string[] = []
      if (product.localImage) {
        const baseName = product.localImage.replace(/_1\.jpg$/, '')
        for (const suffix of ['_2.jpg', '_3.jpg']) {
          const galleryImage = `${baseName}${suffix}`
          const gId = await uploadImage(payload, galleryImage, `${product.title} — Ansicht`)
          if (gId) galleryIds.push(gId)
        }
      }

      await payload.create({
        collection: 'shop-items',
        data: {
          title: product.title,
          slug: product.slug,
          itemType: product.itemType,
          shortDescription: product.shortDescription,
          description: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [{ type: 'text', text: product.shortDescription }],
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              version: 1,
            },
          },
          image: imageId || undefined,
          gallery: galleryIds.map((id) => ({ image: id })),
          pricing: {
            price: product.price,
            isFree: false,
          },
          kunstDetails: {
            medium: product.medium,
            dimensions: product.dimensions || undefined,
            isUnikat: true,
          },
          categories: product.category ? [categoryMap[product.category]] : [],
          status: 'published',
          featured: product.featured || false,
          sortOrder: created,
        } as any,
      })

      console.log(`[SEED] Product ${created + 1}/${PRODUCTS.length}: ${product.title} — ${product.price}€`)
      created++
    }

    // Create a few example reviews
    const reviews = [
      { name: 'Maria K.', text: 'Die Kunstwerke von Susanne sind einfach einzigartig. Mein Lotustisch ist ein absoluter Blickfang in meinem Wohnzimmer!', rating: 5, context: 'Kundin' },
      { name: 'Thomas R.', text: 'Fantastische Handarbeit — jedes Stück erzählt eine Geschichte. Die 3D-Bilder mit Beleuchtung sind besonders beeindruckend.', rating: 5, context: 'Kunstsammler' },
      { name: 'Julia M.', text: 'Susannes Workshops haben mich inspiriert und die Kunst berührt mich jedes Mal aufs Neue. Absolute Empfehlung!', rating: 5, context: 'Workshop-Teilnehmerin' },
    ]

    for (const review of reviews) {
      await payload.create({
        collection: 'reviews',
        data: { ...review, approved: true },
      })
    }
    console.log(`[SEED] Created ${reviews.length} reviews`)

    return NextResponse.json({
      success: true,
      message: `${created} Produkte, ${categoryNames.length} Kategorien und ${reviews.length} Bewertungen erstellt!`,
      products: created,
      categories: categoryNames.length,
      reviews: reviews.length,
    })
  } catch (error: any) {
    console.error('[SEED] Error:', error)
    return NextResponse.json({ error: error?.message || 'Seed failed' }, { status: 500 })
  }
}
