import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AGB',
}

export default function AGBPage() {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: '800px' }}>
        <h1>Allgemeine Geschäftsbedingungen (AGB)</h1>

        {/* § 1 Geltungsbereich */}
        <h2 style={{ marginTop: '2.5rem', marginBottom: '1rem' }}>
          § 1 Geltungsbereich
        </h2>
        <p style={{ marginBottom: '1rem' }}>
          (1) Diese Allgemeinen Geschäftsbedingungen (nachfolgend „AGB") gelten
          für alle Verträge, die zwischen
        </p>
        <p style={{ marginBottom: '1rem' }}>
          Susanne Sturm
          <br />
          Schweriner Straße 44
          <br />
          15757 Halbe
          <br />
          E-Mail: lebenskunst777@aol.com
          <br />
          (nachfolgend „Anbieter")
        </p>
        <p style={{ marginBottom: '1rem' }}>
          und dem Kunden (nachfolgend „Kunde") über den Online-Shop auf der
          Website lebenskunstonline.de geschlossen werden. Der Shop umfasst den
          Verkauf von digitalen Produkten (Video- und Audioinhalte,
          Begleitmaterialien), Büchern, Seminaren, Workshops, Vorträgen,
          Einzeltrainings sowie Themenbundles.
        </p>
        <p style={{ marginBottom: '1rem' }}>
          (2) Maßgeblich ist die zum Zeitpunkt des Vertragsschlusses gültige
          Fassung der AGB.
        </p>
        <p style={{ marginBottom: '1rem' }}>
          (3) Abweichende Bedingungen des Kunden werden nicht anerkannt, es sei
          denn, der Anbieter stimmt ihrer Geltung ausdrücklich schriftlich zu.
        </p>
        <p style={{ marginBottom: '1rem' }}>
          (4) Die Geschäftsbeziehung zwischen dem Anbieter und dem Kunden
          unterliegt dem Recht der Bundesrepublik Deutschland. Bei
          Verbrauchern gilt diese Rechtswahl nur insoweit, als nicht der durch
          zwingende Bestimmungen des Rechts des Staates, in dem der Verbraucher
          seinen gewöhnlichen Aufenthalt hat, gewährte Schutz entzogen wird.
        </p>

        {/* § 2 Vertragsschluss */}
        <h2 style={{ marginTop: '2.5rem', marginBottom: '1rem' }}>
          § 2 Vertragsschluss
        </h2>
        <p style={{ marginBottom: '1rem' }}>
          (1) Die Darstellung der Produkte im Online-Shop stellt kein
          rechtlich bindendes Angebot, sondern eine Aufforderung zur
          Bestellung (invitatio ad offerendum) dar.
        </p>
        <p style={{ marginBottom: '1rem' }}>
          (2) Durch Anklicken des Buttons „Kostenpflichtig bestellen" gibt der
          Kunde ein verbindliches Kaufangebot ab. Vor Absenden der Bestellung
          kann der Kunde die Daten jederzeit ändern und einsehen.
        </p>
        <p style={{ marginBottom: '1rem' }}>
          (3) Der Anbieter bestätigt den Eingang der Bestellung unverzüglich
          per E-Mail (Bestellbestätigung). Diese Bestellbestätigung stellt die
          Annahme des Angebots dar. Mit ihr kommt der Kaufvertrag zustande.
        </p>
        <p style={{ marginBottom: '1rem' }}>
          (4) Für den Erwerb von Produkten ist eine Registrierung und
          Erstellung eines Nutzerkontos erforderlich.
        </p>

        {/* § 3 Preise und Zahlung */}
        <h2 style={{ marginTop: '2.5rem', marginBottom: '1rem' }}>
          § 3 Preise und Zahlung
        </h2>
        <p style={{ marginBottom: '1rem' }}>
          (1) Alle angegebenen Preise sind Endpreise inklusive der gesetzlichen
          Mehrwertsteuer, sofern nicht anders angegeben. Zusätzliche Liefer-
          und Versandkosten werden gesondert ausgewiesen und sind vom Kunden zu
          tragen.
        </p>
        <p style={{ marginBottom: '1rem' }}>
          (2) Die Zahlung erfolgt über den Zahlungsdienstleister Stripe.
          Folgende Zahlungsarten stehen zur Verfügung:
        </p>
        <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
          <li style={{ marginBottom: '0.5rem' }}>Kreditkarte (Visa, Mastercard, American Express)</li>
          <li style={{ marginBottom: '0.5rem' }}>SEPA-Lastschrift</li>
          <li style={{ marginBottom: '0.5rem' }}>Weitere über Stripe verfügbare Zahlungsmethoden</li>
        </ul>
        <p style={{ marginBottom: '1rem' }}>
          (3) Der Kaufpreis ist sofort mit Bestellung fällig, sofern keine
          Ratenzahlung vereinbart wurde. Bei digitalen Produkten erfolgt die
          Freischaltung nach Zahlungseingang.
        </p>

        {/* § 4 Ratenzahlung */}
        <h2 style={{ marginTop: '2.5rem', marginBottom: '1rem' }}>
          § 4 Ratenzahlung
        </h2>
        <p style={{ marginBottom: '1rem' }}>
          (1) Für ausgewählte Produkte und Leistungen bietet der Anbieter die
          Möglichkeit der Ratenzahlung an. Ob Ratenzahlung verfügbar ist, wird
          auf der jeweiligen Produktseite angezeigt.
        </p>
        <p style={{ marginBottom: '1rem' }}>
          (2) Die Anzahl der Raten, die Höhe der einzelnen Raten und die
          Zahlungstermine werden dem Kunden vor Vertragsschluss transparent
          mitgeteilt und sind Bestandteil der Bestellbestätigung.
        </p>
        <p style={{ marginBottom: '1rem' }}>
          (3) Die Raten werden automatisch über Stripe zum jeweils vereinbarten
          Termin eingezogen. Der Kunde ist verpflichtet, für ausreichende
          Deckung des hinterlegten Zahlungsmittels zu sorgen.
        </p>
        <p style={{ marginBottom: '1rem' }}>
          (4) Bei Zahlungsverzug einer Rate ist der Anbieter berechtigt, den
          gesamten Restbetrag sofort fällig zu stellen. Der Zugang zu digitalen
          Inhalten kann bis zur vollständigen Begleichung des ausstehenden
          Betrags eingeschränkt werden.
        </p>
        <p style={{ marginBottom: '1rem' }}>
          (5) Ratenzahlungen sind nicht mit anderen Rabatten oder Aktionen
          kombinierbar, sofern nicht ausdrücklich anders angegeben.
        </p>

        {/* § 5 Widerrufsrecht */}
        <h2 style={{ marginTop: '2.5rem', marginBottom: '1rem' }}>
          § 5 Widerrufsrecht
        </h2>
        <h3 style={{ marginTop: '1.5rem', marginBottom: '0.75rem' }}>
          Widerrufsbelehrung
        </h3>
        <p style={{ marginBottom: '1rem' }}>
          Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen
          diesen Vertrag zu widerrufen. Die Widerrufsfrist beträgt vierzehn
          Tage ab dem Tag des Vertragsschlusses.
        </p>
        <p style={{ marginBottom: '1rem' }}>
          Um Ihr Widerrufsrecht auszuüben, müssen Sie uns
        </p>
        <p style={{ marginBottom: '1rem' }}>
          Susanne Sturm
          <br />
          Schweriner Straße 44
          <br />
          15757 Halbe
          <br />
          E-Mail: lebenskunst777@aol.com
          <br />
          Telefon: 0176 20 555 116
        </p>
        <p style={{ marginBottom: '1rem' }}>
          mittels einer eindeutigen Erklärung (z. B. ein mit der Post
          versandter Brief oder E-Mail) über Ihren Entschluss, diesen Vertrag
          zu widerrufen, informieren. Zur Wahrung der Widerrufsfrist reicht es
          aus, dass Sie die Mitteilung über die Ausübung des Widerrufsrechts
          vor Ablauf der Widerrufsfrist absenden.
        </p>

        <h3 style={{ marginTop: '1.5rem', marginBottom: '0.75rem' }}>
          Folgen des Widerrufs
        </h3>
        <p style={{ marginBottom: '1rem' }}>
          Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen,
          die wir von Ihnen erhalten haben, einschließlich der Lieferkosten
          (mit Ausnahme der zusätzlichen Kosten, die sich daraus ergeben, dass
          Sie eine andere Art der Lieferung als die von uns angebotene,
          günstigste Standardlieferung gewählt haben), unverzüglich und
          spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem
          die Mitteilung über Ihren Widerruf dieses Vertrags bei uns
          eingegangen ist. Für diese Rückzahlung verwenden wir dasselbe
          Zahlungsmittel, das Sie bei der ursprünglichen Transaktion eingesetzt
          haben, es sei denn, mit Ihnen wurde ausdrücklich etwas anderes
          vereinbart.
        </p>

        <h3 style={{ marginTop: '1.5rem', marginBottom: '0.75rem' }}>
          Vorzeitiges Erlöschen des Widerrufsrechts bei digitalen Inhalten
        </h3>
        <p style={{ marginBottom: '1rem' }}>
          Das Widerrufsrecht erlischt vorzeitig, wenn der Anbieter mit der
          Ausführung des Vertrags begonnen hat, nachdem der Kunde ausdrücklich
          zugestimmt hat, dass der Anbieter mit der Ausführung des Vertrags vor
          Ablauf der Widerrufsfrist beginnt, und der Kunde seine Kenntnis davon
          bestätigt hat, dass er durch seine Zustimmung mit Beginn der
          Ausführung des Vertrags sein Widerrufsrecht verliert (§ 356 Abs. 5
          BGB).
        </p>
        <p style={{ marginBottom: '1rem' }}>
          Dies gilt insbesondere für digitale Inhalte wie Video- und
          Audioinhalte, die nach dem Kauf sofort zum Streaming oder Download
          bereitgestellt werden. Vor der Bereitstellung wird der Kunde
          ausdrücklich auf den Verlust des Widerrufsrechts hingewiesen und
          muss diesem zustimmen.
        </p>

        {/* § 6 Lieferung digitaler Inhalte */}
        <h2 style={{ marginTop: '2.5rem', marginBottom: '1rem' }}>
          § 6 Lieferung digitaler Inhalte
        </h2>
        <p style={{ marginBottom: '1rem' }}>
          (1) Digitale Inhalte (Videos, Audios, Begleitmaterialien) werden
          nach Zahlungseingang im Nutzerkonto des Kunden freigeschaltet. Der
          Zugang erfolgt über den Mitgliederbereich auf lebenskunstonline.de.
        </p>
        <p style={{ marginBottom: '1rem' }}>
          (2) Der Kunde erhält ein einfaches, nicht übertragbares und nicht
          unterlizenzierbares Nutzungsrecht an den erworbenen digitalen
          Inhalten für den persönlichen, nicht-kommerziellen Gebrauch.
        </p>
        <p style={{ marginBottom: '1rem' }}>
          (3) Eine Weitergabe, Vervielfältigung, öffentliche Wiedergabe oder
          sonstige Verwertung der digitalen Inhalte ist ohne ausdrückliche
          schriftliche Genehmigung des Anbieters nicht gestattet.
        </p>
        <p style={{ marginBottom: '1rem' }}>
          (4) Der Anbieter behält sich vor, die technische Bereitstellung der
          digitalen Inhalte anzupassen, sofern dies für den Kunden zumutbar ist
          und keine wesentliche Einschränkung der Nutzbarkeit darstellt.
        </p>
        <p style={{ marginBottom: '1rem' }}>
          (5) Die Verfügbarkeit digitaler Inhalte wird für mindestens zwei
          Jahre nach Erwerb gewährleistet, sofern nichts anderes vereinbart
          wurde.
        </p>

        {/* § 7 Bücher und physische Produkte */}
        <h2 style={{ marginTop: '2.5rem', marginBottom: '1rem' }}>
          § 7 Bücher und physische Produkte
        </h2>
        <p style={{ marginBottom: '1rem' }}>
          (1) Bücher und sonstige physische Produkte werden nach
          Zahlungseingang an die vom Kunden angegebene Lieferadresse versandt.
          Die voraussichtliche Lieferzeit wird auf der Produktseite angegeben.
        </p>
        <p style={{ marginBottom: '1rem' }}>
          (2) Die Gefahr des zufälligen Untergangs und der zufälligen
          Verschlechterung geht bei Verbrauchern erst mit der Übergabe der
          Ware über.
        </p>
        <p style={{ marginBottom: '1rem' }}>
          (3) Es gelten die gesetzlichen Gewährleistungsrechte.
        </p>

        {/* § 8 Veranstaltungen und Trainings */}
        <h2 style={{ marginTop: '2.5rem', marginBottom: '1rem' }}>
          § 8 Veranstaltungen und Trainings
        </h2>

        <h3 style={{ marginTop: '1.5rem', marginBottom: '0.75rem' }}>
          Buchung
        </h3>
        <p style={{ marginBottom: '1rem' }}>
          (1) Die Buchung von Seminaren, Workshops, Vorträgen und
          Einzeltrainings erfolgt verbindlich über den Online-Shop. Der Kunde
          erhält nach Buchung eine Bestätigung per E-Mail mit allen relevanten
          Informationen zur Veranstaltung (Datum, Uhrzeit, Ort bzw.
          Zugangsdaten bei Online-Veranstaltungen).
        </p>
        <p style={{ marginBottom: '1rem' }}>
          (2) Die Teilnehmerzahl kann begrenzt sein. Die Plätze werden in der
          Reihenfolge des Bestelleingangs vergeben.
        </p>

        <h3 style={{ marginTop: '1.5rem', marginBottom: '0.75rem' }}>
          Stornierung durch den Kunden
        </h3>
        <p style={{ marginBottom: '1rem' }}>
          (3) Eine Stornierung von Veranstaltungen ist zu folgenden
          Bedingungen möglich:
        </p>
        <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
          <li style={{ marginBottom: '0.5rem' }}>
            Bis 30 Tage vor Veranstaltungsbeginn: kostenfreie Stornierung,
            volle Erstattung des Kaufpreises
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            Bis 14 Tage vor Veranstaltungsbeginn: Erstattung von 50 % des
            Kaufpreises
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            Weniger als 14 Tage vor Veranstaltungsbeginn: keine Erstattung
          </li>
        </ul>
        <p style={{ marginBottom: '1rem' }}>
          (4) Bei Einzeltrainings gelten die individuell vereinbarten
          Stornierungsbedingungen. Sofern keine abweichende Vereinbarung
          getroffen wurde, gelten die oben genannten Fristen entsprechend.
        </p>
        <p style={{ marginBottom: '1rem' }}>
          (5) Die Benennung einer Ersatzperson ist nach vorheriger Absprache
          mit dem Anbieter möglich.
        </p>

        <h3 style={{ marginTop: '1.5rem', marginBottom: '0.75rem' }}>
          Absage durch den Anbieter
        </h3>
        <p style={{ marginBottom: '1rem' }}>
          (6) Der Anbieter behält sich vor, Veranstaltungen bei zu geringer
          Teilnehmerzahl oder aus wichtigem Grund (z. B. Erkrankung des
          Referenten, höhere Gewalt) abzusagen. In diesem Fall wird der
          Kaufpreis vollständig erstattet. Weitergehende Ansprüche des Kunden
          bestehen nicht.
        </p>
        <p style={{ marginBottom: '1rem' }}>
          (7) Der Anbieter ist berechtigt, Termin, Ort oder Format einer
          Veranstaltung bei Vorliegen eines wichtigen Grundes zu ändern. Der
          Kunde wird hierüber unverzüglich informiert und kann in diesem Fall
          kostenfrei stornieren.
        </p>

        <h3 style={{ marginTop: '1.5rem', marginBottom: '0.75rem' }}>
          Teilnahmebedingungen
        </h3>
        <p style={{ marginBottom: '1rem' }}>
          (8) Die Teilnahme an Veranstaltungen erfolgt auf eigene
          Verantwortung. Die angebotenen Inhalte stellen keine therapeutische
          oder medizinische Beratung dar und ersetzen nicht die Behandlung
          durch qualifizierte Fachpersonen.
        </p>
        <p style={{ marginBottom: '1rem' }}>
          (9) Der Kunde verpflichtet sich, die Inhalte der Veranstaltungen
          vertraulich zu behandeln und keine Audio- oder Videoaufnahmen ohne
          ausdrückliche Genehmigung des Anbieters anzufertigen.
        </p>

        {/* § 9 Themenbundles */}
        <h2 style={{ marginTop: '2.5rem', marginBottom: '1rem' }}>
          § 9 Themenbundles
        </h2>
        <p style={{ marginBottom: '1rem' }}>
          (1) Themenbundles fassen mehrere Produkte oder Leistungen zu einem
          vergünstigten Gesamtpaket zusammen. Der Inhalt eines Bundles wird auf
          der jeweiligen Produktseite detailliert beschrieben.
        </p>
        <p style={{ marginBottom: '1rem' }}>
          (2) Ein Umtausch einzelner Bestandteile eines Bundles ist
          ausgeschlossen. Das Widerrufsrecht gemäß § 5 dieser AGB bleibt
          unberührt und bezieht sich auf das gesamte Bundle.
        </p>

        {/* § 10 Haftung */}
        <h2 style={{ marginTop: '2.5rem', marginBottom: '1rem' }}>
          § 10 Haftung
        </h2>
        <p style={{ marginBottom: '1rem' }}>
          (1) Der Anbieter haftet unbeschränkt für Vorsatz und grobe
          Fahrlässigkeit. Bei leichter Fahrlässigkeit haftet der Anbieter nur
          bei Verletzung einer wesentlichen Vertragspflicht
          (Kardinalpflicht) und nur in Höhe des vorhersehbaren,
          vertragstypischen Schadens.
        </p>
        <p style={{ marginBottom: '1rem' }}>
          (2) Die vorstehenden Haftungsbeschränkungen gelten nicht für Schäden
          aus der Verletzung des Lebens, des Körpers oder der Gesundheit, für
          Ansprüche nach dem Produkthaftungsgesetz sowie für Fälle arglistig
          verschwiegener Mängel oder der Übernahme einer Garantie.
        </p>
        <p style={{ marginBottom: '1rem' }}>
          (3) Der Anbieter haftet nicht für vorübergehende technische Störungen
          beim Zugang zu digitalen Inhalten oder zum Mitgliederbereich, sofern
          diese auf Umständen beruhen, die der Anbieter nicht zu vertreten hat
          (z. B. höhere Gewalt, Störungen beim Hosting-Anbieter).
        </p>
        <p style={{ marginBottom: '1rem' }}>
          (4) Die angebotenen Inhalte dienen der persönlichen Weiterentwicklung
          und Bildung. Der Anbieter übernimmt keine Haftung für den
          persönlichen Erfolg des Kunden durch die Nutzung der Produkte oder
          Teilnahme an Veranstaltungen.
        </p>

        {/* § 11 Datenschutz */}
        <h2 style={{ marginTop: '2.5rem', marginBottom: '1rem' }}>
          § 11 Datenschutz
        </h2>
        <p style={{ marginBottom: '1rem' }}>
          Die Erhebung, Verarbeitung und Nutzung personenbezogener Daten
          erfolgt gemäß unserer Datenschutzerklärung, die unter{' '}
          <a href="/datenschutz">lebenskunstonline.de/datenschutz</a>{' '}
          abrufbar ist und Bestandteil dieser AGB ist.
        </p>

        {/* § 12 Schlussbestimmungen */}
        <h2 style={{ marginTop: '2.5rem', marginBottom: '1rem' }}>
          § 12 Schlussbestimmungen
        </h2>
        <p style={{ marginBottom: '1rem' }}>
          (1) Es gilt das Recht der Bundesrepublik Deutschland unter
          Ausschluss des UN-Kaufrechts. Bei Verbrauchern gilt diese Rechtswahl
          nur insoweit, als nicht der durch zwingende Bestimmungen des Rechts
          des Staates, in dem der Verbraucher seinen gewöhnlichen Aufenthalt
          hat, gewährte Schutz entzogen wird.
        </p>
        <p style={{ marginBottom: '1rem' }}>
          (2) Sofern der Kunde Kaufmann, juristische Person des öffentlichen
          Rechts oder öffentlich-rechtliches Sondervermögen ist, ist
          ausschließlicher Gerichtsstand für alle Streitigkeiten aus diesem
          Vertrag 15757 Halbe des Anbieters.
        </p>
        <p style={{ marginBottom: '1rem' }}>
          (3) Der Vertragstext wird vom Anbieter gespeichert. Die AGB können
          jederzeit auf dieser Seite eingesehen werden. Die Bestelldaten werden
          dem Kunden per E-Mail zugesandt.
        </p>

        {/* § 13 Salvatorische Klausel */}
        <h2 style={{ marginTop: '2.5rem', marginBottom: '1rem' }}>
          § 13 Salvatorische Klausel
        </h2>
        <p style={{ marginBottom: '1rem' }}>
          Sollte eine Bestimmung dieser AGB unwirksam sein oder werden, so
          bleibt die Wirksamkeit der übrigen Bestimmungen hiervon unberührt.
          Anstelle der unwirksamen Bestimmung gilt eine wirksame Bestimmung als
          vereinbart, die dem wirtschaftlichen Zweck der unwirksamen Bestimmung
          am nächsten kommt. Entsprechendes gilt für eventuelle Lücken.
        </p>

        <p style={{ marginTop: '2.5rem', marginBottom: '1rem' }}>
          <strong>Stand:</strong> März 2026
        </p>
      </div>
    </section>
  )
}
