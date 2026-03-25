import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

const FROM_EMAIL = process.env.FROM_EMAIL || 'Lebenskunst <noreply@lebenskunstonline.de>'

function devLog(type: string, to: string, subject: string) {
  console.log(`\n📧 [DEV EMAIL] ${type}`)
  console.log(`   An: ${to}`)
  console.log(`   Betreff: ${subject}\n`)
}

interface OrderEmailData {
  customerName: string
  customerEmail: string
  orderNumber: string
  items: Array<{ name: string; quantity: number; unitPrice: number }>
  total: number
  paymentType: 'full' | 'installment'
  installmentDetails?: {
    totalInstallments: number
    amountPerInstallment: number
  }
}

interface WelcomeEmailData {
  firstName: string
  email: string
}

interface EventReminderData {
  customerName: string
  customerEmail: string
  eventTitle: string
  eventDate: string
  location?: string
  isOnline?: boolean
  onlineLink?: string
}

function formatEur(amount: number): string {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount)
}

function baseTemplate(content: string): string {
  return `
<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#FAFAFE;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#2D1B4E;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAFAFE;padding:2rem 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border-radius:16px;overflow:hidden;box-shadow:0 4px 16px rgba(107,76,154,0.08);">
        <tr><td style="background:linear-gradient(135deg,#6B4C9A,#9B6DB7);padding:2rem;text-align:center;">
          <h1 style="color:#FFFFFF;font-size:1.75rem;margin:0;font-weight:600;">Lebenskunst</h1>
        </td></tr>
        <tr><td style="padding:2rem;">
          ${content}
        </td></tr>
        <tr><td style="padding:1.5rem 2rem;border-top:1px solid rgba(155,109,183,0.15);text-align:center;font-size:0.8125rem;color:#7E6E96;">
          <p style="margin:0;">Lebenskunst &mdash; Deine Reise zu dir selbst</p>
          <p style="margin:0.5rem 0 0;"><a href="https://lebenskunstonline.de" style="color:#6B4C9A;text-decoration:none;">lebenskunstonline.de</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export async function sendOrderConfirmation(data: OrderEmailData) {
  if (!resend) {
    devLog('Bestellbestätigung', data.customerEmail, `Bestellung ${data.orderNumber} — ${formatEur(data.total)}`)
    return
  }

  const itemRows = data.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:0.5rem 0;border-bottom:1px solid rgba(155,109,183,0.1);">${item.name}${item.quantity > 1 ? ` (${item.quantity}x)` : ''}</td>
          <td style="padding:0.5rem 0;border-bottom:1px solid rgba(155,109,183,0.1);text-align:right;">${formatEur(item.unitPrice * item.quantity)}</td>
        </tr>`,
    )
    .join('')

  const installmentInfo =
    data.paymentType === 'installment' && data.installmentDetails
      ? `<p style="margin:1rem 0;padding:1rem;background:rgba(60,130,210,0.08);border-radius:8px;font-size:0.9375rem;">
           <strong>Ratenzahlung:</strong> ${data.installmentDetails.totalInstallments} Raten &agrave; ${formatEur(data.installmentDetails.amountPerInstallment)} / Monat
         </p>`
      : ''

  const html = baseTemplate(`
    <h2 style="color:#2D1B4E;margin:0 0 0.5rem;font-size:1.5rem;">Bestellbestätigung</h2>
    <p>Hallo ${data.customerName},</p>
    <p>vielen Dank für deine Bestellung! Hier ist deine Zusammenfassung:</p>
    <p style="font-size:0.875rem;color:#7E6E96;">Bestellnummer: <strong>${data.orderNumber}</strong></p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:1rem 0;">
      ${itemRows}
      <tr>
        <td style="padding:0.75rem 0;font-weight:700;">Gesamt</td>
        <td style="padding:0.75rem 0;text-align:right;font-weight:700;color:#6B4C9A;">${formatEur(data.total)}</td>
      </tr>
    </table>
    ${installmentInfo}
    <p>Du findest deine Bestellung und gekauften Inhalte jederzeit in deinem <a href="https://lebenskunstonline.de/mitglieder/dashboard" style="color:#6B4C9A;">Mitgliederbereich</a>.</p>
    <p>Herzliche Grüße,<br/>Dein Lebenskunst-Team</p>
  `)

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.customerEmail,
      subject: `Bestellbestätigung — ${data.orderNumber}`,
      html,
    })
  } catch (error) {
    console.error('Failed to send order confirmation:', error)
  }
}

export async function sendWelcomeEmail(data: WelcomeEmailData) {
  if (!resend) {
    devLog('Willkommensmail', data.email, `Willkommen ${data.firstName}!`)
    return
  }

  const html = baseTemplate(`
    <h2 style="color:#2D1B4E;margin:0 0 0.5rem;font-size:1.5rem;">Willkommen bei Lebenskunst!</h2>
    <p>Hallo ${data.firstName},</p>
    <p>schön, dass du dabei bist! Dein Konto wurde erfolgreich erstellt.</p>
    <p>Entdecke jetzt unser Angebot:</p>
    <ul style="padding-left:1.25rem;margin:1rem 0;">
      <li style="margin-bottom:0.5rem;">Seminare, Workshops und Vorträge</li>
      <li style="margin-bottom:0.5rem;">Einzeltrainings mit wöchentlichen Modulen</li>
      <li style="margin-bottom:0.5rem;">Videos, Audio und Begleitmaterial</li>
      <li style="margin-bottom:0.5rem;">Themenbundles zum Sparpreis</li>
    </ul>
    <div style="text-align:center;margin:2rem 0;">
      <a href="https://lebenskunstonline.de/shop" style="display:inline-block;padding:0.875rem 2rem;background:linear-gradient(135deg,#6B4C9A,#9B6DB7);color:#FFFFFF;border-radius:999px;text-decoration:none;font-weight:500;">Zum Shop</a>
    </div>
    <p>Herzliche Grüße,<br/>Dein Lebenskunst-Team</p>
  `)

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: 'Willkommen bei Lebenskunst!',
      html,
    })
  } catch (error) {
    console.error('Failed to send welcome email:', error)
  }
}

export async function sendInstallmentPaymentConfirmation(
  customerEmail: string,
  customerName: string,
  orderNumber: string,
  paidInstallments: number,
  totalInstallments: number,
  amount: number,
) {
  if (!resend) {
    devLog('Ratenzahlung', customerEmail, `Rate ${paidInstallments}/${totalInstallments} — ${orderNumber}`)
    return
  }

  const remaining = totalInstallments - paidInstallments
  const html = baseTemplate(`
    <h2 style="color:#2D1B4E;margin:0 0 0.5rem;font-size:1.5rem;">Ratenzahlung eingegangen</h2>
    <p>Hallo ${customerName},</p>
    <p>deine ${paidInstallments}. Rate für die Bestellung <strong>${orderNumber}</strong> wurde erfolgreich eingezogen.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:1rem 0;">
      <tr>
        <td style="padding:0.5rem 0;">Eingezogener Betrag</td>
        <td style="padding:0.5rem 0;text-align:right;font-weight:700;color:#6B4C9A;">${formatEur(amount)}</td>
      </tr>
      <tr>
        <td style="padding:0.5rem 0;">Bezahlte Raten</td>
        <td style="padding:0.5rem 0;text-align:right;">${paidInstallments} von ${totalInstallments}</td>
      </tr>
      <tr>
        <td style="padding:0.5rem 0;">Verbleibend</td>
        <td style="padding:0.5rem 0;text-align:right;">${remaining > 0 ? `${remaining} Rate${remaining > 1 ? 'n' : ''}` : 'Vollständig bezahlt!'}</td>
      </tr>
    </table>
    ${remaining === 0 ? '<p style="padding:1rem;background:rgba(91,140,90,0.1);border-radius:8px;color:#5B8C5A;font-weight:500;">Alle Raten sind bezahlt — vielen Dank!</p>' : ''}
    <p>Herzliche Grüße,<br/>Dein Lebenskunst-Team</p>
  `)

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: customerEmail,
      subject: `Ratenzahlung ${paidInstallments}/${totalInstallments} — ${orderNumber}`,
      html,
    })
  } catch (error) {
    console.error('Failed to send installment confirmation:', error)
  }
}

export async function sendEventReminder(data: EventReminderData) {
  if (!resend) {
    devLog('Event-Erinnerung', data.customerEmail, `Erinnerung: ${data.eventTitle}`)
    return
  }

  const locationInfo = data.isOnline
    ? `<p><strong>Online-Veranstaltung</strong>${data.onlineLink ? `<br/><a href="${data.onlineLink}" style="color:#6B4C9A;">Zum Meeting-Raum</a>` : ''}</p>`
    : data.location
      ? `<p><strong>Ort:</strong> ${data.location}</p>`
      : ''

  const html = baseTemplate(`
    <h2 style="color:#2D1B4E;margin:0 0 0.5rem;font-size:1.5rem;">Erinnerung: ${data.eventTitle}</h2>
    <p>Hallo ${data.customerName},</p>
    <p>in Kürze findet deine gebuchte Veranstaltung statt:</p>
    <div style="padding:1.25rem;background:rgba(107,76,154,0.05);border-radius:12px;margin:1rem 0;">
      <h3 style="margin:0 0 0.5rem;color:#2D1B4E;">${data.eventTitle}</h3>
      <p style="margin:0;"><strong>Datum:</strong> ${data.eventDate}</p>
      ${locationInfo}
    </div>
    <p>Wir freuen uns auf dich!</p>
    <p>Herzliche Grüße,<br/>Dein Lebenskunst-Team</p>
  `)

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.customerEmail,
      subject: `Erinnerung: ${data.eventTitle}`,
      html,
    })
  } catch (error) {
    console.error('Failed to send event reminder:', error)
  }
}

interface EventCancellationEmailData {
  customerName: string
  customerEmail: string
  eventTitle: string
  orderNumber: string
  cancellationReason?: string
}

export async function sendPaymentFailureNotification(
  customerEmail: string,
  customerName: string,
  orderNumber: string,
  attemptNumber: number,
): Promise<void> {
  if (!resend) {
    devLog('Zahlung fehlgeschlagen', customerEmail, `Zahlung fehlgeschlagen – Bestellung ${orderNumber}`)
    return
  }

  const content = `
    <h2 style="color:#BE465A;margin-bottom:8px;">Zahlung fehlgeschlagen</h2>
    <p style="margin-bottom:16px;">Hallo ${customerName},</p>
    <p style="margin-bottom:16px;">
      Leider konnte deine Ratenzahlung für Bestellung <strong>${orderNumber}</strong>
      nicht eingezogen werden (Versuch ${attemptNumber}).
    </p>
    <p style="margin-bottom:16px;">
      Bitte stelle sicher, dass deine Zahlungsmethode gültig ist und ausreichend gedeckt ist.
      Stripe wird die Zahlung automatisch erneut versuchen.
    </p>
    <p style="margin-bottom:16px;">
      Bei Fragen melde dich bitte unter
      <a href="mailto:joseline148@aol.com" style="color:#BE465A;">joseline148@aol.com</a>.
    </p>
    <p>Mit herzlichen Grüßen,<br/>Susanne</p>
  `
  const html = baseTemplate(content)

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: customerEmail,
      subject: `Zahlung fehlgeschlagen – Bestellung ${orderNumber}`,
      html,
    })
  } catch (error) {
    console.error('Failed to send payment failure notification:', error)
  }
}

export async function sendEventCancellation(data: EventCancellationEmailData): Promise<void> {
  const { customerName, customerEmail, eventTitle, orderNumber, cancellationReason } = data

  if (!resend) {
    devLog('Event-Absage', customerEmail, `Event abgesagt: ${eventTitle}`)
    return
  }

  const content = `
    <h2 style="color:#BE465A;margin-bottom:8px;">Event abgesagt: ${eventTitle}</h2>
    <p style="margin-bottom:16px;">Hallo ${customerName},</p>
    <p style="margin-bottom:16px;">leider müssen wir dir mitteilen, dass das folgende Event abgesagt wurde:</p>
    <div style="background:#fff0f2;border-left:4px solid #BE465A;padding:16px;border-radius:4px;margin-bottom:16px;">
      <strong>${eventTitle}</strong><br/>
      Bestellnummer: ${orderNumber}
      ${cancellationReason ? `<br/><br/>Grund: ${cancellationReason}` : ''}
    </div>
    <p style="margin-bottom:16px;">Du wirst selbstverständlich vollständig erstattet. Bitte melde dich bei uns, falls du Fragen hast.</p>
    <p>Mit herzlichen Grüßen,<br/>Susanne</p>
  `

  const html = baseTemplate(content)

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: customerEmail,
      subject: `Event abgesagt: ${eventTitle}`,
      html,
    })
  } catch (error) {
    console.error('Failed to send event cancellation:', error)
  }
}
