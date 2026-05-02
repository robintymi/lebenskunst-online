import { cache } from 'react'
import { getPayloadClient } from '@/lib/payload'

export type SiteTextsGlobal = {
  header?: {
    logoText?: string
    navLinks?: Array<{ href: string; label: string }>
    membersLabelLoading?: string
    membersLabelLoggedOut?: string
    membersLabelFallbackName?: string
    searchPlaceholder?: string
    recentSearchesLabel?: string
    ariaSearchOpen?: string
    ariaSearch?: string
    ariaClose?: string
    ariaMenu?: string
  }
  footer?: {
    tagline?: string
    brandDescription?: string
    exploreTitle?: string
    exploreLinks?: Array<{ href: string; label: string }>
    legalTitle?: string
    legalLinks?: Array<{ href: string; label: string }>
    bottomText?: string
    adminLinkLabel?: string
  }
  cookieBanner?: {
    text?: string
    buttonLabel?: string
  }
  home?: {
    heroKicker?: string
    heroPrimaryCta?: string
    heroSecondaryCta?: string
    heroImageAlt?: string
    trustItems?: Array<{ value: string; label: string }>
    introHeading?: string
    introParagraphs?: Array<{ text: string }>
    introHighlight?: string
    featuresSubtitle?: string
    featuresTitle?: string
    features?: Array<{ title: string; desc: string; icon: string; href: string }>
    quoteAuthorName?: string
    quoteAuthorRole?: string
    quoteAvatarAlt?: string
    ctaHeading?: string
    ctaText?: string
    ctaPrimary?: string
    ctaSecondary?: string
    reviews?: {
      subtitle?: string
      title?: string
      writeButton?: string
      formTitle?: string
      formLabelName?: string
      formLabelRating?: string
      formLabelContext?: string
      formLabelExperience?: string
      formPlaceholderName?: string
      formPlaceholderContext?: string
      formPlaceholderExperience?: string
      cancelButton?: string
      submitButton?: string
      submittingLabel?: string
      successMessage?: string
      loadingText?: string
      emptyText?: string
      summaryText?: string
      summaryLabelSingle?: string
      summaryLabelPlural?: string
    }
  }
  leistungen?: {
    heroTitle?: string
    heroText?: string
    rooms?: Array<{
      id: string
      emoji: string
      title: string
      subtitle: string
      motto: string
      intro: string
      description: string
      accent: string
      formate?: Array<string | { text: string }>
      beispiele?: Array<string | { text: string }>
    }>
    formateHeading?: string
    beispieleHeading?: string
  }
  legal?: {
    impressum?: { title?: string; subtitle?: string; content?: unknown }
    datenschutz?: { title?: string; subtitle?: string; content?: unknown }
    agb?: { title?: string; subtitle?: string; content?: unknown }
    widerruf?: {
      title?: string
      subtitle?: string
      introContent?: unknown
      exclusionContent?: unknown
      consequencesContent?: unknown
      formIntroContent?: unknown
      templateContent?: unknown
    }
  }
} & Record<string, unknown>

export const getSiteTexts = cache(async (): Promise<SiteTextsGlobal | null> => {
  try {
    const payload = await getPayloadClient()
    const unsafePayload = payload as unknown as {
      findGlobal: (args: { slug: string }) => Promise<unknown>
    }
    const result = await unsafePayload.findGlobal({ slug: 'site-texts' })
    return result as unknown as SiteTextsGlobal
  } catch {
    return null
  }
})
