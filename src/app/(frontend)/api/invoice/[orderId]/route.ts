import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const { orderId } = await params
  const payload = await getPayload({ config })

  const { user } = await payload.auth({ headers: req.headers })
  if (!user) {
    return new NextResponse('Nicht angemeldet', { status: 401 })
  }

  let order: any
  try {
    order = await payload.findByID({ collection: 'orders', id: orderId, depth: 2 })
  } catch {
    return new NextResponse('Bestellung nicht gefunden', { status: 404 })
  }

  const customerId = typeof order.customer === 'string' ? order.customer : order.customer?.id
  if (customerId !== user.id && user.role !== 'admin') {
    return new NextResponse('Kein Zugriff', { status: 403 })
  }

  const customer = typeof order.customer === 'object' ? order.customer : user
  const orderDate = new Date(order.createdAt).toLocaleDateString('de-DE', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  })

  const invoiceNumber = `RE-${order.orderNumber}`

  const itemRows = (order.items || []).map((item: any) => {
    const name = item.shopItem?.title || item.bundle?.name || 'Artikel'
    const qty = item.quantity || 1
    const unitPrice = item.unitPrice || 0
    const total = qty * unitPrice
    return `
      <tr>
        <td>${name}</td>
        <td style="text-align:center">${qty}</td>
        <td style="text-align:right">€${unitPrice.toFixed(2).replace('.', ',')}</td>
        <td style="text-align:right">€${total.toFixed(2).replace('.', ',')}</td>
      </tr>
    `
  }).join('')

  // VAT display: set INVOICE_SHOW_VAT=true in env if Susanne is NOT a Kleinunternehmerin (§19 UStG)
  const showVat = process.env.INVOICE_SHOW_VAT === 'true'
  const netTotal = order.total / 1.19
  const vatAmount = order.total - netTotal

  const html = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Rechnung ${invoiceNumber}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Georgia', serif; color: #2d1b1b; background: #fff; padding: 40px; max-width: 800px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 48px; padding-bottom: 24px; border-bottom: 2px solid #BE465A; }
    .brand { font-size: 28px; font-weight: bold; color: #BE465A; letter-spacing: 1px; }
    .brand-sub { font-size: 13px; color: #8B3A47; margin-top: 4px; }
    .invoice-meta { text-align: right; }
    .invoice-title { font-size: 22px; font-weight: bold; color: #BE465A; }
    .invoice-number { font-size: 14px; color: #666; margin-top: 4px; }
    .invoice-date { font-size: 14px; color: #666; }
    .addresses { display: flex; justify-content: space-between; margin-bottom: 40px; }
    .address-block h3 { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #999; margin-bottom: 8px; }
    .address-block p { font-size: 14px; line-height: 1.6; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    thead tr { background: #BE465A; color: white; }
    thead th { padding: 10px 12px; text-align: left; font-size: 13px; font-weight: normal; }
    thead th:nth-child(2) { text-align: center; }
    thead th:nth-child(3), thead th:nth-child(4) { text-align: right; }
    tbody tr { border-bottom: 1px solid #f0e8e8; }
    tbody tr:last-child { border-bottom: none; }
    tbody td { padding: 10px 12px; font-size: 14px; }
    .totals { margin-left: auto; width: 280px; }
    .totals-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; border-bottom: 1px solid #f0e8e8; }
    .totals-row.total { font-size: 16px; font-weight: bold; color: #BE465A; border-bottom: none; padding-top: 10px; }
    .payment-info { margin-top: 32px; padding: 16px; background: #FFF5F5; border-left: 4px solid #BE465A; border-radius: 0 4px 4px 0; }
    .payment-info h3 { font-size: 13px; font-weight: bold; color: #BE465A; margin-bottom: 6px; }
    .payment-info p { font-size: 13px; color: #666; line-height: 1.6; }
    .footer { margin-top: 48px; padding-top: 24px; border-top: 1px solid #f0e8e8; font-size: 12px; color: #999; text-align: center; line-height: 1.8; }
    @media print {
      body { padding: 20px; }
      .no-print { display: none; }
    }
    .print-btn { display: block; margin: 0 auto 32px; padding: 10px 24px; background: #BE465A; color: white; border: none; border-radius: 999px; font-size: 14px; cursor: pointer; }
    .print-btn:hover { background: #8B3A47; }
  </style>
</head>
<body>
  <button class="print-btn no-print" onclick="window.print()">🖨️ Rechnung drucken / als PDF speichern</button>

  <div class="header">
    <div>
      <div class="brand">Lebenskunst</div>
      <div class="brand-sub">lebenskunstonline.de</div>
    </div>
    <div class="invoice-meta">
      <div class="invoice-title">Rechnung</div>
      <div class="invoice-number">${invoiceNumber}</div>
      <div class="invoice-date">Datum: ${orderDate}</div>
    </div>
  </div>

  <div class="addresses">
    <div class="address-block">
      <h3>Rechnungsempfänger</h3>
      <p>
        ${customer.firstName || ''} ${customer.lastName || ''}<br>
        ${customer.email || ''}<br>
        ${order.shippingAddress ? `${order.shippingAddress.street}<br>${order.shippingAddress.zip} ${order.shippingAddress.city}<br>${order.shippingAddress.country || 'Deutschland'}` : ''}
      </p>
    </div>
    <div class="address-block" style="text-align:right">
      <h3>Anbieter</h3>
      <p>
        Susanne Sturm<br>
        Lebenskunst Online<br>
        Schweriner Straße 44<br>
        15757 Halbe<br>
        Deutschland
      </p>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Beschreibung</th>
        <th>Menge</th>
        <th>Einzelpreis</th>
        <th>Gesamt</th>
      </tr>
    </thead>
    <tbody>
      ${itemRows}
    </tbody>
  </table>

  <div class="totals">
    ${showVat ? `
    <div class="totals-row"><span>Nettobetrag</span><span>€${netTotal.toFixed(2).replace('.', ',')}</span></div>
    <div class="totals-row"><span>MwSt. 19%</span><span>€${vatAmount.toFixed(2).replace('.', ',')}</span></div>
    ` : ''}
    <div class="totals-row total"><span>Gesamtbetrag</span><span>€${order.total.toFixed(2).replace('.', ',')}</span></div>
  </div>

  <div class="payment-info">
    <h3>Zahlungsstatus</h3>
    <p>
      ${order.paymentType === 'installment'
        ? `Ratenzahlung — ${order.installmentDetails?.paidInstallments || 0} von ${order.installmentDetails?.totalInstallments || '?'} Raten bezahlt`
        : `Einmalzahlung — ${order.status === 'paid' ? 'Bezahlt' : 'Ausstehend'}`
      }
    </p>
    ${!showVat ? `<p style="margin-top:8px;font-size:12px;color:#888;">Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.</p>` : ''}
  </div>

  <div class="footer">
    <p>Lebenskunst Online · lebenskunstonline.de</p>
    <p>Bestellnummer: ${order.orderNumber} · Rechnungsnummer: ${invoiceNumber}</p>
    <p>Vielen Dank für dein Vertrauen!</p>
  </div>
</body>
</html>`

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  })
}
