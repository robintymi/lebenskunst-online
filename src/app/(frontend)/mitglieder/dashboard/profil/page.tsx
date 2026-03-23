'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import styles from '../dashboard.module.css'
import { formatPrice, formatDate, formatDateShort } from '@/lib/utils'

export default function ProfilePage() {
  const { user, refreshUser } = useAuth()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [profileSuccess, setProfileSuccess] = useState('')
  const [profileError, setProfileError] = useState('')
  const [profileLoading, setProfileLoading] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordLoading, setPasswordLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '')
      setLastName(user.lastName || '')
      setPhone(user.phone || '')
    }
  }, [user])

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileSuccess('')
    setProfileError('')
    setProfileLoading(true)

    try {
      const res = await fetch(`/api/users/${user?.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ firstName, lastName, phone }),
      })

      if (res.ok) {
        await refreshUser()
        setProfileSuccess('Profil erfolgreich aktualisiert.')
      } else {
        const data = await res.json()
        setProfileError(data.errors?.[0]?.message || 'Fehler beim Speichern.')
      }
    } catch {
      setProfileError('Verbindungsfehler. Bitte versuche es erneut.')
    } finally {
      setProfileLoading(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordSuccess('')
    setPasswordError('')

    if (newPassword.length < 8) {
      setPasswordError('Das neue Passwort muss mindestens 8 Zeichen lang sein.')
      return
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordError('Die Passwörter stimmen nicht überein.')
      return
    }

    setPasswordLoading(true)

    try {
      const res = await fetch(`/api/users/${user?.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ currentPassword, password: newPassword }),
      })

      if (res.ok) {
        setPasswordSuccess('Passwort erfolgreich geändert.')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmNewPassword('')
      } else {
        const data = await res.json()
        setPasswordError(data.errors?.[0]?.message || 'Fehler beim Ändern des Passworts.')
      }
    } catch {
      setPasswordError('Verbindungsfehler. Bitte versuche es erneut.')
    } finally {
      setPasswordLoading(false)
    }
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1>Mein Profil</h1>
        <p>Verwalte deine persönlichen Daten.</p>
      </div>

      <div className={styles.card}>
        {profileSuccess && <div className={styles.successMsg}>{profileSuccess}</div>}
        {profileError && <div className={styles.errorMsg}>{profileError}</div>}

        <form onSubmit={handleProfileSubmit} className={styles.profileForm}>
          <div className={styles.formField}>
            <label>Vorname</label>
            <input
              type="text"
              className="input"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div className={styles.formField}>
            <label>Nachname</label>
            <input
              type="text"
              className="input"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div className={styles.formField}>
            <label>E-Mail</label>
            <input
              type="email"
              className="input"
              value={user?.email || ''}
              readOnly
              style={{ opacity: 0.6, cursor: 'not-allowed' }}
            />
          </div>

          <div className={styles.formField}>
            <label>Telefon</label>
            <input
              type="tel"
              className="input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={profileLoading}>
            {profileLoading ? 'Wird gespeichert...' : 'Speichern'}
          </button>
        </form>

        <hr className={styles.formDivider} />

        <h2>Passwort ändern</h2>

        {passwordSuccess && <div className={styles.successMsg}>{passwordSuccess}</div>}
        {passwordError && <div className={styles.errorMsg}>{passwordError}</div>}

        <form onSubmit={handlePasswordSubmit} className={styles.profileForm}>
          <div className={styles.formField}>
            <label>Aktuelles Passwort</label>
            <input
              type="password"
              className="input"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>

          <div className={styles.formField}>
            <label>Neues Passwort</label>
            <input
              type="password"
              className="input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>

          <div className={styles.formField}>
            <label>Neues Passwort bestätigen</label>
            <input
              type="password"
              className="input"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={passwordLoading}>
            {passwordLoading ? 'Wird geändert...' : 'Passwort ändern'}
          </button>
        </form>
      </div>
    </div>
  )
}
