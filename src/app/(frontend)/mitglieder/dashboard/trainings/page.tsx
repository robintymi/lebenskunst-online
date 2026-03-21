'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { formatDateShort } from '@/lib/utils'
import styles from '../dashboard.module.css'

interface TrainingModule {
  title: string
  weekNumber: number
  [key: string]: unknown
}

interface TrainingDetails {
  durationWeeks: number
  modules: TrainingModule[]
}

interface TrainingItem {
  id: string
  title: string
  trainingDetails?: TrainingDetails
  [key: string]: unknown
}

interface TrainingAccess {
  training: string | { id: string }
  startDate: string
  endDate: string
}

interface TrainingWithDetails {
  access: TrainingAccess
  details: TrainingItem | null
}

export default function TrainingsPage() {
  const { user } = useAuth()
  const [trainings, setTrainings] = useState<TrainingWithDetails[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return

    const trainingAccess = user.trainingAccess ?? []

    if (trainingAccess.length === 0) {
      setIsLoading(false)
      return
    }

    const fetchTrainings = async () => {
      try {
        setIsLoading(true)

        const results = await Promise.all(
          trainingAccess.map(async (access) => {
            const trainingId =
              typeof access.training === 'object' ? access.training.id : access.training

            try {
              const res = await fetch(`/api/shop-items/${trainingId}?depth=1`, {
                credentials: 'include',
              })

              if (!res.ok) {
                return { access, details: null }
              }

              const data: TrainingItem = await res.json()
              return { access, details: data }
            } catch {
              return { access, details: null }
            }
          }),
        )

        setTrainings(results)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTrainings()
  }, [user])

  if (isLoading) {
    return (
      <div>
        <div className={styles.pageHeader}>
          <h1>Meine Trainings</h1>
          <p>Deine Trainings werden geladen...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <div className={styles.pageHeader}>
          <h1>Meine Trainings</h1>
        </div>
        <div className={styles.errorMsg}>{error}</div>
      </div>
    )
  }

  const hasTrainings = trainings.length > 0

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1>Meine Trainings</h1>
        <p>Verfolge deinen Fortschritt und greife auf deine Trainingsmodule zu.</p>
      </div>

      {!hasTrainings ? (
        <div className={styles.card}>
          <div className={styles.emptyState}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h3>Noch keine Trainings</h3>
            <p>Du hast noch keine Trainings gebucht. Entdecke unsere Einzeltrainings im Shop.</p>
            <Link href="/shop" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>
              Zum Shop
            </Link>
          </div>
        </div>
      ) : (
        trainings.map((training, index) => {
          const now = Date.now()
          const startDate = new Date(training.access.startDate).getTime()
          const endDate = new Date(training.access.endDate).getTime()
          const isCompleted = now > endDate
          const title = training.details?.title ?? 'Training'

          const totalWeeks = training.details?.trainingDetails?.durationWeeks ?? 12
          const weeksElapsed = Math.floor((now - startDate) / (7 * 24 * 60 * 60 * 1000))
          const progressPercent = Math.min(100, Math.max(0, (weeksElapsed / totalWeeks) * 100))
          const displayWeek = Math.min(weeksElapsed, totalWeeks)

          const modules = training.details?.trainingDetails?.modules ?? []

          return (
            <div key={training.details?.id ?? index} className={styles.card}>
              <h3>{title}</h3>

              <p style={{ margin: '0.5rem 0', fontSize: '0.9375rem', color: 'var(--color-text-muted)' }}>
                Zugang: {formatDateShort(training.access.startDate)} &mdash; {formatDateShort(training.access.endDate)}
              </p>

              <span
                className={styles.statusBadge}
                style={
                  isCompleted
                    ? { background: 'rgba(176, 117, 128, 0.15)', color: 'var(--color-text-muted)' }
                    : { background: 'rgba(91, 140, 90, 0.15)', color: '#5B8C5A' }
                }
              >
                {isCompleted ? 'Abgeschlossen' : 'Aktiv'}
              </span>

              <div style={{ marginTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Fortschritt</span>
                  <span style={{ color: 'var(--color-primary-dark)', fontWeight: 500 }}>
                    Woche {displayWeek} von {totalWeeks}
                  </span>
                </div>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {modules.length > 0 && (
                <div style={{ marginTop: '1.5rem' }}>
                  <h4 style={{ marginBottom: '0.75rem', fontSize: '1rem' }}>Module</h4>
                  <div className={styles.moduleList}>
                    {modules.map((mod, modIndex) => {
                      const isUnlocked = mod.weekNumber <= weeksElapsed + 1

                      return (
                        <div
                          key={modIndex}
                          className={`${styles.module} ${!isUnlocked ? styles.moduleLocked : ''}`}
                        >
                          <div
                            className={`${styles.moduleIcon} ${isUnlocked ? styles.moduleUnlocked : styles.moduleLockedIcon}`}
                          >
                            {isUnlocked ? (
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            ) : (
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0110 0v4" />
                              </svg>
                            )}
                          </div>
                          <div className={styles.moduleInfo}>
                            <strong>{mod.title}</strong>
                            <span>
                              {isUnlocked
                                ? `Woche ${mod.weekNumber}`
                                : `Verfügbar ab Woche ${mod.weekNumber}`}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )
        })
      )}
    </div>
  )
}
