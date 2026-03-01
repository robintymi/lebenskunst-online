export function formatPrice(price: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(price)
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function formatDateShort(date: string): string {
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}

export const eventTypeLabels: Record<string, string> = {
  embodiment: 'Embodiment',
  energiearbeit: 'Energiearbeit',
  frauenkreis: 'Frauenkreis',
  kunsttherapie: 'Kunsttherapie',
  meditation: 'Meditation',
  breathwork: 'Breathwork',
  workshop: 'Workshop',
  sonstiges: 'Sonstiges',
}
