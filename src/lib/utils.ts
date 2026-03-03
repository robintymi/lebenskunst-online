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

export const itemTypeLabels: Record<string, string> = {
  seminar: 'Seminar',
  workshop: 'Workshop',
  vortrag: 'Vortrag',
  einzeltraining: 'Einzeltraining',
  video: 'Videomaterial',
  audio: 'Audiomaterial',
  begleitmaterial: 'Begleitmaterial',
  buch: 'Buch',
}

export const itemTypeGroups: Record<string, string[]> = {
  'Veranstaltungen': ['seminar', 'workshop', 'vortrag'],
  'Digitale Inhalte': ['video', 'audio', 'begleitmaterial'],
  'Trainings': ['einzeltraining'],
  'Bücher': ['buch'],
}

export function isEventType(itemType: string): boolean {
  return ['seminar', 'workshop', 'vortrag'].includes(itemType)
}

export function isDigitalType(itemType: string): boolean {
  return ['video', 'audio', 'begleitmaterial', 'einzeltraining'].includes(itemType)
}
