import type { GlobalConfig } from 'payload'

export const SiteTexts: GlobalConfig = {
  slug: 'site-texts',
  label: 'Seitentexte',
  admin: {
    group: 'Verwaltung',
    description:
      'Zentrale Texte für Header, Footer, Startseite, Leistungen und Rechtliches. Diese Inhalte erscheinen auf der öffentlichen Website.',
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user?.role === 'admin'),
  },
  fields: [
    {
      name: 'header',
      label: 'Header',
      type: 'group',
      fields: [
        {
          name: 'logoText',
          label: 'Logo-Text',
          type: 'text',
          defaultValue: 'Lebenskunst',
        },
        {
          name: 'navLinks',
          label: 'Navigation',
          type: 'array',
          admin: { description: 'Links in der Hauptnavigation' },
          defaultValue: [
            { href: '/', label: 'Home' },
            { href: '/leistungen', label: 'Meine Leistungen' },
            { href: '/shop', label: 'Shop' },
            { href: '/podcast', label: 'Podcast' },
          ],
          fields: [
            { name: 'href', label: 'Link', type: 'text', required: true },
            { name: 'label', label: 'Text', type: 'text', required: true },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'membersLabelLoading',
              label: 'Mitglieder-Link (Loading)',
              type: 'text',
              defaultValue: 'Mitgliederbereich',
              admin: { width: '50%' },
            },
            {
              name: 'membersLabelLoggedOut',
              label: 'Mitglieder-Link (Ausgeloggt)',
              type: 'text',
              defaultValue: 'Anmelden',
              admin: { width: '50%' },
            },
          ],
        },
        {
          name: 'membersLabelFallbackName',
          label: 'Mitglieder-Link (Fallback Name)',
          type: 'text',
          defaultValue: 'Mein Konto',
          admin: { description: 'Wird angezeigt, wenn kein Vorname vorhanden ist.' },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'searchPlaceholder',
              label: 'Suche Placeholder',
              type: 'text',
              defaultValue: 'Suchen …',
              admin: { width: '50%' },
            },
            {
              name: 'recentSearchesLabel',
              label: 'Label „Zuletzt gesucht“',
              type: 'text',
              defaultValue: 'Zuletzt gesucht',
              admin: { width: '50%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'ariaSearchOpen',
              label: 'Aria „Suche öffnen“',
              type: 'text',
              defaultValue: 'Suche öffnen',
              admin: { width: '33%' },
            },
            {
              name: 'ariaSearch',
              label: 'Aria „Suchen“',
              type: 'text',
              defaultValue: 'Suchen',
              admin: { width: '33%' },
            },
            {
              name: 'ariaClose',
              label: 'Aria „Schließen“',
              type: 'text',
              defaultValue: 'Schließen',
              admin: { width: '33%' },
            },
          ],
        },
        {
          name: 'ariaMenu',
          label: 'Aria „Menü“',
          type: 'text',
          defaultValue: 'Menü',
        },
      ],
    },
    {
      name: 'footer',
      label: 'Footer',
      type: 'group',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'tagline',
              label: 'Tagline',
              type: 'text',
              defaultValue: 'Deine Reise zu dir selbst',
              admin: { width: '50%' },
            },
            {
              name: 'brandDescription',
              label: 'Beschreibung',
              type: 'textarea',
              defaultValue:
                'Bewusstseinstraining, Workshops, Einzeltrainings, Podcast und mehr für dein persönliches Wachstum.',
              admin: { width: '50%' },
            },
          ],
        },
        {
          name: 'exploreTitle',
          label: 'Spalte „Entdecken“ (Titel)',
          type: 'text',
          defaultValue: 'Entdecken',
        },
        {
          name: 'exploreLinks',
          label: 'Spalte „Entdecken“ (Links)',
          type: 'array',
          defaultValue: [
            { href: '/shop', label: 'Shop' },
            { href: '/podcast', label: 'Podcast' },
            { href: '/mitglieder', label: 'Mitgliederbereich' },
          ],
          fields: [
            { name: 'href', label: 'Link', type: 'text', required: true },
            { name: 'label', label: 'Text', type: 'text', required: true },
          ],
        },
        {
          name: 'legalTitle',
          label: 'Spalte „Rechtliches“ (Titel)',
          type: 'text',
          defaultValue: 'Rechtliches',
        },
        {
          name: 'legalLinks',
          label: 'Spalte „Rechtliches“ (Links)',
          type: 'array',
          defaultValue: [
            { href: '/impressum', label: 'Impressum' },
            { href: '/datenschutz', label: 'Datenschutz' },
            { href: '/agb', label: 'AGB' },
            { href: '/widerruf', label: 'Vertrag widerrufen' },
          ],
          fields: [
            { name: 'href', label: 'Link', type: 'text', required: true },
            { name: 'label', label: 'Text', type: 'text', required: true },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'bottomText',
              label: 'Unterer Hinweis (ohne Jahreszahl)',
              type: 'text',
              defaultValue: 'Lebenskunst — Susanne Sturm. Mit Herz gemacht.',
              admin: { width: '70%' },
            },
            {
              name: 'adminLinkLabel',
              label: 'Admin-Link Text',
              type: 'text',
              defaultValue: 'Admin',
              admin: { width: '30%' },
            },
          ],
        },
      ],
    },
    {
      name: 'cookieBanner',
      label: 'Cookie-Banner',
      type: 'group',
      fields: [
        {
          name: 'text',
          label: 'Text',
          type: 'textarea',
          defaultValue:
            'Diese Website verwendet nur technisch notwendige Cookies für die Anmeldung. Keine Tracking-Cookies.',
        },
        {
          name: 'buttonLabel',
          label: 'Button-Text',
          type: 'text',
          defaultValue: 'Verstanden',
        },
      ],
    },
    {
      name: 'home',
      label: 'Startseite',
      type: 'group',
      fields: [
        {
          name: 'heroKicker',
          label: 'Hero — Kicker',
          type: 'text',
          defaultValue: 'Bewusstsein · Lebendigkeit · Selbstausdruck',
        },
        {
          type: 'row',
          fields: [
            {
              name: 'heroPrimaryCta',
              label: 'Hero — Primärer Button',
              type: 'text',
              defaultValue: 'Angebote entdecken',
              admin: { width: '50%' },
            },
            {
              name: 'heroSecondaryCta',
              label: 'Hero — Sekundärer Button',
              type: 'text',
              defaultValue: 'Podcast hören',
              admin: { width: '50%' },
            },
          ],
        },
        {
          name: 'heroImageAlt',
          label: 'Hero — Bild Alt-Text',
          type: 'text',
          defaultValue: 'Susanne Sturm — Lebenskunst',
        },
        {
          name: 'trustItems',
          label: 'Trust-Bar',
          type: 'array',
          defaultValue: [
            { value: '10+', label: 'Jahre Erfahrung' },
            { value: '500+', label: 'Begleitete Menschen' },
            { value: 'Live & Online', label: 'Flexibel teilnehmen' },
            { value: 'Ratenzahlung', label: 'Bequem in Raten zahlen' },
          ],
          fields: [
            { name: 'value', label: 'Wert', type: 'text', required: true },
            { name: 'label', label: 'Text', type: 'text', required: true },
          ],
        },
        {
          name: 'introHeading',
          label: 'Intro — Überschrift',
          type: 'text',
          defaultValue: 'Willkommen — schön, dass du da bist',
        },
        {
          name: 'introParagraphs',
          label: 'Intro — Absätze',
          type: 'array',
          defaultValue: [
            {
              text:
                'Mein Herzensanliegen ist es, dich darin zu unterstützen, dich selbst wieder zu spüren — jenseits des ständigen Tuns, um etwas zu erreichen, zu gefallen oder eine Reaktion zu bekommen.',
            },
            {
              text:
                'In meinen Trainings geht es um die Rückkehr zu dir selbst — um den Moment, in dem du nicht mehr funktionierst, sondern fühlst. Wir erforschen gemeinsam, wie du dein trainiertes Antwortverhalten erkennst, loslässt und lernst, wieder aus dem Inneren heraus zu handeln — mit Genuss, Präsenz und Freude.',
            },
            {
              text:
                'Geprägt von schwierigen Lebensphasen — einer herausfordernden Kindheit, intensiven Partnerschaften und einem tiefen Burnout — durfte ich erfahren, wie es ist, wenn das Leben stillsteht. Erst durch Bewusstseinstraining, Breathwork und die Arbeit mit meinem Körper fand ich zurück zu mir selbst, zu meiner Lebendigkeit und meinem inneren Frieden.',
            },
            {
              text:
                'Heute möchte ich dieses Wissen, diese Erfahrung und diese Tiefe weitergeben — an Menschen, die sich nach echter Verbindung, Ausdruck und Sinn sehnen.',
            },
          ],
          fields: [{ name: 'text', label: 'Text', type: 'textarea', required: true }],
        },
        {
          name: 'introHighlight',
          label: 'Intro — Highlight-Kasten',
          type: 'textarea',
          defaultValue:
            'Ich glaube, wir haben in dieser lauten, schnellen Welt oft vergessen, was es heißt, wirklich da zu sein. Wir reagieren mehr, als wir leben. Wir schauen mehr nach außen, als nach innen. Und genau da möchte ich ansetzen — damit wir wieder spüren, wer wir sind.',
        },
        {
          type: 'row',
          fields: [
            {
              name: 'featuresSubtitle',
              label: 'Features — Untertitel',
              type: 'text',
              defaultValue: 'Gemeinsam wachsen',
              admin: { width: '50%' },
            },
            {
              name: 'featuresTitle',
              label: 'Features — Überschrift',
              type: 'text',
              defaultValue: 'Was dich erwartet',
              admin: { width: '50%' },
            },
          ],
        },
        {
          name: 'features',
          label: 'Features — Kacheln',
          type: 'array',
          defaultValue: [
            {
              title: 'Seminare & Workshops',
              desc: 'Live und online — gemeinsam in die Tiefe gehen. Buche direkt deinen Platz.',
              icon: '🌿',
              href: '/shop',
            },
            {
              title: 'Einzeltrainings',
              desc: 'Mehrteilige Trainings über mehrere Wochen für nachhaltige Veränderung.',
              icon: '🧭',
              href: '/shop',
            },
            {
              title: 'Video & Audio',
              desc: 'Materialien für dein Selbststudium — in deinem Tempo, wann du bereit bist.',
              icon: '🎧',
              href: '/shop',
            },
            {
              title: 'Themenbundles',
              desc: 'Gebündelte Pakete zu Themen wie Abhängigkeiten oder Bewusstseinsarchitektur.',
              icon: '📦',
              href: '/shop',
            },
            {
              title: 'Podcast',
              desc: 'Impulse und Gespräche für dein persönliches Wachstum.',
              icon: '🎙️',
              href: '/podcast',
            },
            {
              title: 'Mitgliederbereich',
              desc: 'Dein persönliches Dashboard mit gebuchten Inhalten und Trainings.',
              icon: '🔑',
              href: '/mitglieder',
            },
          ],
          fields: [
            { name: 'title', label: 'Titel', type: 'text', required: true },
            { name: 'desc', label: 'Beschreibung', type: 'textarea', required: true },
            { name: 'icon', label: 'Icon (Emoji)', type: 'text', required: true },
            { name: 'href', label: 'Link', type: 'text', required: true },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'quoteAuthorName',
              label: 'Zitat — Name',
              type: 'text',
              defaultValue: 'Susanne Sturm',
              admin: { width: '50%' },
            },
            {
              name: 'quoteAuthorRole',
              label: 'Zitat — Rolle',
              type: 'text',
              defaultValue: 'Gründerin, Lebenskunst',
              admin: { width: '50%' },
            },
          ],
        },
        {
          name: 'quoteAvatarAlt',
          label: 'Zitat — Avatar Alt-Text',
          type: 'text',
          defaultValue: 'Susanne',
        },
        {
          name: 'reviews',
          label: 'Bewertungen (Startseite)',
          type: 'group',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'subtitle',
                  label: 'Untertitel',
                  type: 'text',
                  defaultValue: 'Erfahrungen',
                  admin: { width: '50%' },
                },
                {
                  name: 'title',
                  label: 'Überschrift',
                  type: 'text',
                  defaultValue: 'Was Teilnehmer sagen',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'writeButton',
              label: 'Button „Bewertung schreiben“',
              type: 'text',
              defaultValue: 'Bewertung schreiben',
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'formTitle',
                  label: 'Formular-Titel',
                  type: 'text',
                  defaultValue: 'Deine Bewertung',
                  admin: { width: '50%' },
                },
                {
                  name: 'formLabelName',
                  label: 'Label „Name“',
                  type: 'text',
                  defaultValue: 'Name *',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'formLabelRating',
                  label: 'Label „Bewertung“',
                  type: 'text',
                  defaultValue: 'Bewertung *',
                  admin: { width: '50%' },
                },
                {
                  name: 'formLabelContext',
                  label: 'Label „Kontext“',
                  type: 'text',
                  defaultValue: 'Kontext (optional)',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'formPlaceholderName',
                  label: 'Placeholder Name',
                  type: 'text',
                  defaultValue: 'Dein Name',
                  admin: { width: '50%' },
                },
                {
                  name: 'formPlaceholderContext',
                  label: 'Placeholder Kontext',
                  type: 'text',
                  defaultValue: 'z.B. \"Workshop-Teilnehmerin\"',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'formLabelExperience',
                  label: 'Label „Erfahrung“',
                  type: 'text',
                  defaultValue: 'Deine Erfahrung *',
                  admin: { width: '50%' },
                },
                {
                  name: 'formPlaceholderExperience',
                  label: 'Placeholder Erfahrung',
                  type: 'text',
                  defaultValue: 'Erzähle von deiner Erfahrung...',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'cancelButton',
                  label: 'Button „Abbrechen“',
                  type: 'text',
                  defaultValue: 'Abbrechen',
                  admin: { width: '50%' },
                },
                {
                  name: 'submitButton',
                  label: 'Button „Bewertung absenden“',
                  type: 'text',
                  defaultValue: 'Bewertung absenden',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'submittingLabel',
              label: 'Text beim Senden',
              type: 'text',
              defaultValue: 'Wird gesendet...',
            },
            {
              name: 'successMessage',
              label: 'Erfolgsnachricht',
              type: 'text',
              defaultValue: 'Vielen Dank für deine Bewertung!',
            },
            {
              name: 'loadingText',
              label: 'Ladetext',
              type: 'text',
              defaultValue: 'Bewertungen werden geladen...',
            },
            {
              name: 'emptyText',
              label: 'Text wenn keine Bewertungen vorhanden',
              type: 'textarea',
              defaultValue:
                'Noch keine Bewertungen vorhanden. Sei die erste Person, die eine Bewertung schreibt!',
            },
            {
              name: 'summaryText',
              label: 'Zusammenfassung (Template)',
              type: 'text',
              defaultValue: '{{avg}} von 5 Sternen — {{count}} {{label}}',
              admin: {
                description:
                  'Variablen: {{avg}}, {{count}}, {{label}}. Beispiel-Labels siehe unten.',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'summaryLabelSingle',
                  label: 'Label für 1 Bewertung',
                  type: 'text',
                  defaultValue: 'Bewertung',
                  admin: { width: '50%' },
                },
                {
                  name: 'summaryLabelPlural',
                  label: 'Label für mehrere Bewertungen',
                  type: 'text',
                  defaultValue: 'Bewertungen',
                  admin: { width: '50%' },
                },
              ],
            },
          ],
        },
        {
          name: 'ctaHeading',
          label: 'CTA — Überschrift',
          type: 'text',
          defaultValue: 'Bereit für den ersten Schritt?',
        },
        {
          name: 'ctaText',
          label: 'CTA — Text',
          type: 'textarea',
          defaultValue:
            'Schau dich im Shop um oder melde dich an, um Zugang zu deinen gebuchten Inhalten zu erhalten.',
        },
        {
          type: 'row',
          fields: [
            {
              name: 'ctaPrimary',
              label: 'CTA — Primärer Button',
              type: 'text',
              defaultValue: 'Zum Shop',
              admin: { width: '50%' },
            },
            {
              name: 'ctaSecondary',
              label: 'CTA — Sekundärer Button',
              type: 'text',
              defaultValue: 'Konto erstellen',
              admin: { width: '50%' },
            },
          ],
        },
      ],
    },
    {
      name: 'leistungen',
      label: 'Leistungen-Seite',
      type: 'group',
      fields: [
        {
          name: 'heroTitle',
          label: 'Hero — Titel',
          type: 'text',
          defaultValue: 'Meine Leistungen',
        },
        {
          name: 'heroText',
          label: 'Hero — Text',
          type: 'textarea',
          defaultValue:
            'Drei Räume für dein persönliches Wachstum — jeder mit einem eigenen Fokus, alle verbunden durch die Einladung, dir selbst zu begegnen.',
        },
        {
          name: 'rooms',
          label: 'Räume',
          type: 'array',
          defaultValue: [
            {
              id: 'erfahrungsraeume',
              emoji: '🌿',
              title: 'Erfahrungsräume',
              subtitle: 'Training für Körper & Wahrnehmung',
              motto: 'Spüren. Erleben. Im Körper ankommen.',
              intro:
                'In den Erfahrungsräumen geht es nicht um Analyse, sondern um unmittelbares Erleben. Über Bewegung, Atem und Wahrnehmung entsteht ein direkter Zugang zu dir selbst.',
              accent: 'green',
              formate: [
                { text: 'Körperorientierte Trainings' },
                { text: 'Atem- & Wahrnehmungsworkshops' },
                { text: 'Gruppenformate zur Selbsterfahrung' },
              ],
              description:
                'In den Erfahrungsräumen steht dein unmittelbares Erleben im Mittelpunkt. Du arbeitest nicht über den Kopf, sondern über deinen Körper, deinen Atem und deine Wahrnehmung. Diese Trainings helfen dir, dich selbst wieder klarer zu spüren, deine Präsenz zu stärken und einen direkten Zugang zu deiner inneren Stabilität zu finden. Alle Formate sind praxisnah, körperorientiert und so aufgebaut, dass du das Erlebte in deinen Alltag übertragen kannst.',
              beispiele: [
                { text: 'Präsenz (dein neuer Raum!)' },
                { text: 'Lebensenergie (Kundalini)' },
                { text: 'Gegenwart' },
                { text: 'Loslassen' },
                { text: 'Sinnlichkeit' },
              ],
            },
            {
              id: 'bewusstheitsraeume',
              emoji: '🔥',
              title: 'Bewusstheitsräume',
              subtitle: 'Seminare für Klarheit & persönliche Entwicklung',
              motto: 'Erkennen. Verstehen. Neu ausrichten.',
              intro:
                'Diese Räume verbinden Selbsterfahrung mit bewusster Reflexion. Du erkennst Muster, verstehst Zusammenhänge und entwickelst neue Perspektiven.',
              accent: 'fire',
              formate: [{ text: 'Seminare' }, { text: 'Trainingsreihen' }, { text: 'Einzeltrainings' }],
              description:
                'In den Bewusstheitsräumen verbindest du Selbsterfahrung mit bewusster Reflexion. Du erkennst Zusammenhänge, verstehst deine eigenen Muster und entwickelst neue Perspektiven auf dich selbst und dein Handeln. Die Seminare sind erlebnisorientiert aufgebaut und kombinieren praktische Übungen mit gezielter Reflexion.',
              beispiele: [{ text: '„Wann hast du aufgehört, du zu sein?“' }],
            },
            {
              id: 'verbindungsraeume',
              emoji: '🌸',
              title: 'Verbindungsräume',
              subtitle: 'Austausch & echte Verbindung',
              motto: 'Teilen. Zuhören. Einfach sein.',
              intro:
                'Diese Räume entstehen durch Begegnung. Ohne Methode, ohne Ziel — getragen von Präsenz und echtem Austausch.',
              accent: 'blossom',
              formate: [{ text: 'Moderierte Gesprächskreise' }, { text: 'Offene Gruppenabende' }],
              description:
                'In den Verbindungsräumen geht es nicht um Entwicklung, sondern um Begegnung. Ohne Methode, ohne Druck, ohne Ziel. Du kommst, wie du bist. Wir hören zu, teilen, sind da. Oft entsteht genau daraus die tiefste Form von Verbindung.',
              beispiele: [],
            },
          ],
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'id', label: 'ID (URL-Anker)', type: 'text', required: true, admin: { width: '50%' } },
                { name: 'emoji', label: 'Emoji', type: 'text', required: true, admin: { width: '50%' } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'title', label: 'Titel', type: 'text', required: true, admin: { width: '50%' } },
                { name: 'subtitle', label: 'Untertitel', type: 'text', required: true, admin: { width: '50%' } },
              ],
            },
            {
              name: 'accent',
              label: 'Farb-Akzent',
              type: 'select',
              required: true,
              defaultValue: 'green',
              options: [
                { label: 'Grün', value: 'green' },
                { label: 'Feuer', value: 'fire' },
                { label: 'Blossom', value: 'blossom' },
              ],
            },
            { name: 'motto', label: 'Motto', type: 'text', required: true },
            { name: 'intro', label: 'Intro', type: 'textarea', required: true },
            {
              name: 'formate',
              label: 'Formate',
              type: 'array',
              fields: [{ name: 'text', label: 'Text', type: 'text', required: true }],
            },
            { name: 'description', label: 'Beschreibung', type: 'textarea', required: true },
            {
              name: 'beispiele',
              label: 'Beispiele (optional)',
              type: 'array',
              fields: [{ name: 'text', label: 'Text', type: 'text', required: true }],
            },
          ],
        },
        {
          name: 'formateHeading',
          label: 'Label „Formate“',
          type: 'text',
          defaultValue: 'Formate',
          admin: { position: 'sidebar' },
        },
        {
          name: 'beispieleHeading',
          label: 'Label „Beispiele“',
          type: 'text',
          defaultValue: 'Beispiele',
          admin: { position: 'sidebar' },
        },
      ],
    },
    {
      name: 'legal',
      label: 'Rechtliches',
      type: 'group',
      fields: [
        {
          name: 'impressum',
          label: 'Impressum',
          type: 'group',
          fields: [
            { name: 'title', label: 'Titel', type: 'text', defaultValue: 'Impressum' },
            { name: 'subtitle', label: 'Untertitel', type: 'text', defaultValue: 'Angaben gemäß § 5 TMG' },
            {
              name: 'content',
              label: 'Inhalt',
              type: 'richText',
              admin: { description: 'Wenn leer, wird die im Code hinterlegte Standard-Version angezeigt.' },
            },
          ],
        },
        {
          name: 'datenschutz',
          label: 'Datenschutzerklärung',
          type: 'group',
          fields: [
            { name: 'title', label: 'Titel', type: 'text', defaultValue: 'Datenschutzerklärung' },
            { name: 'subtitle', label: 'Untertitel', type: 'text', defaultValue: 'Stand: März 2026' },
            {
              name: 'content',
              label: 'Inhalt',
              type: 'richText',
              admin: { description: 'Wenn leer, wird die im Code hinterlegte Standard-Version angezeigt.' },
            },
          ],
        },
        {
          name: 'agb',
          label: 'AGB',
          type: 'group',
          fields: [
            { name: 'title', label: 'Titel', type: 'text', defaultValue: 'Allgemeine Geschäftsbedingungen' },
            { name: 'subtitle', label: 'Untertitel', type: 'text', defaultValue: 'Stand: Mai 2026' },
            {
              name: 'content',
              label: 'Inhalt',
              type: 'richText',
              admin: { description: 'Wenn leer, wird die im Code hinterlegte Standard-Version angezeigt.' },
            },
          ],
        },
        {
          name: 'widerruf',
          label: 'Widerruf',
          type: 'group',
          fields: [
            { name: 'title', label: 'Titel', type: 'text', defaultValue: 'Widerrufsrecht & Widerrufsformular' },
            { name: 'subtitle', label: 'Untertitel', type: 'text', defaultValue: 'Stand: Mai 2026' },
            {
              name: 'introContent',
              label: 'Abschnitt 1 (Einleitung)',
              type: 'richText',
              admin: { description: 'Wird über dem Formular angezeigt. Wenn leer, Standardtext.' },
            },
            {
              name: 'exclusionContent',
              label: 'Abschnitt 2 (Ausschluss)',
              type: 'richText',
              admin: { description: 'Wird über dem Formular angezeigt. Wenn leer, Standardtext.' },
            },
            {
              name: 'consequencesContent',
              label: 'Abschnitt 3 (Folgen)',
              type: 'richText',
              admin: { description: 'Wird über dem Formular angezeigt. Wenn leer, Standardtext.' },
            },
            {
              name: 'formIntroContent',
              label: 'Abschnitt 4 (Text über Formular)',
              type: 'richText',
              admin: { description: 'Direkt über dem Online-Formular.' },
            },
            {
              name: 'templateContent',
              label: 'Abschnitt 5 (Muster-Widerrufsformular)',
              type: 'richText',
              admin: { description: 'Unter dem Online-Formular.' },
            },
          ],
        },
      ],
    },
  ],
}
