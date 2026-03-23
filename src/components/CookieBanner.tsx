'use client'

import { useState, useEffect } from 'react'
import styles from './CookieBanner.module.css'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      setVisible(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'true')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className={styles.banner}>
      <div className={styles.content}>
        <p className={styles.text}>
          Diese Website verwendet nur technisch notwendige Cookies für die Anmeldung. Keine Tracking-Cookies.
        </p>
        <button className={styles.button} onClick={handleAccept}>
          Verstanden
        </button>
      </div>
    </div>
  )
}
