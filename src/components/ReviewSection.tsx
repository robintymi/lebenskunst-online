'use client'

import { useState, useEffect, useCallback } from 'react'
import styles from './ReviewSection.module.css'

interface Review {
  id: string
  name: string
  text: string
  rating: number
  context?: string
  createdAt: string
}

function StarDisplay({ rating }: { rating: number }) {
  return (
    <span>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i}>{i < rating ? '\u2605' : '\u2606'}</span>
      ))}
    </span>
  )
}

function StarRatingInput({
  value,
  onChange,
}: {
  value: number
  onChange: (rating: number) => void
}) {
  const [hovered, setHovered] = useState(0)

  return (
    <div className={styles.starRating}>
      {Array.from({ length: 5 }, (_, i) => {
        const starValue = i + 1
        const isFilled = starValue <= (hovered || value)
        return (
          <button
            key={i}
            type="button"
            className={`${styles.starButton} ${isFilled ? styles.starButtonFilled : ''}`}
            onClick={() => onChange(starValue)}
            onMouseEnter={() => setHovered(starValue)}
            onMouseLeave={() => setHovered(0)}
            aria-label={`${starValue} Stern${starValue > 1 ? 'e' : ''}`}
          >
            {isFilled ? '\u2605' : '\u2606'}
          </button>
        )
      })}
    </div>
  )
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('de-DE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function ReviewSection() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const [formName, setFormName] = useState('')
  const [formText, setFormText] = useState('')
  const [formRating, setFormRating] = useState(5)
  const [formContext, setFormContext] = useState('')

  const fetchReviews = useCallback(async () => {
    try {
      const response = await fetch('/api/reviews')
      if (response.ok) {
        const data = await response.json()
        setReviews(data.reviews || [])
      }
    } catch {
      // Silently fail — reviews are not critical
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  const resetForm = () => {
    setFormName('')
    setFormText('')
    setFormRating(5)
    setFormContext('')
    setErrorMessage('')
  }

  const handleCancel = () => {
    setShowForm(false)
    resetForm()
    setErrorMessage('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName,
          text: formText,
          rating: formRating,
          context: formContext || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setErrorMessage(data.error || 'Ein Fehler ist aufgetreten.')
        return
      }

      // Add the new review to the top of the list
      if (data.review) {
        setReviews((prev) => [data.review, ...prev])
      }

      setShowForm(false)
      resetForm()
      setSuccessMessage('Vielen Dank für deine Bewertung!')
      setTimeout(() => setSuccessMessage(''), 5000)
    } catch {
      setErrorMessage('Bewertung konnte nicht gesendet werden. Bitte versuche es erneut.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <p className={styles.subtitle}>Erfahrungen</p>
        <h2 className={styles.title}>Was Teilnehmer sagen</h2>

        {reviews.length > 0 && (
          <div className={styles.summary}>
            <span className={styles.summaryStars}>
              <StarDisplay rating={Math.round(averageRating)} />
            </span>
            <span className={styles.summaryText}>
              {averageRating.toFixed(1)} von 5 Sternen — {reviews.length}{' '}
              {reviews.length === 1 ? 'Bewertung' : 'Bewertungen'}
            </span>
          </div>
        )}

        {successMessage && (
          <div className={styles.successMessage}>{successMessage}</div>
        )}

        {/* Write Review Button */}
        {!showForm && (
          <div className={styles.writeButtonWrapper}>
            <button
              className="btn btn-secondary"
              onClick={() => setShowForm(true)}
            >
              Bewertung schreiben
            </button>
          </div>
        )}

        {/* Review Form */}
        {showForm && (
          <div className={styles.formCard}>
            <h3 className={styles.formTitle}>Deine Bewertung</h3>
            <form onSubmit={handleSubmit}>
              {errorMessage && (
                <div className={styles.errorMessage}>{errorMessage}</div>
              )}

              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="review-name">
                  Name *
                </label>
                <input
                  id="review-name"
                  type="text"
                  className={styles.formInput}
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Dein Name"
                  maxLength={100}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Bewertung *</label>
                <StarRatingInput value={formRating} onChange={setFormRating} />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="review-context">
                  Kontext (optional)
                </label>
                <input
                  id="review-context"
                  type="text"
                  className={styles.formInput}
                  value={formContext}
                  onChange={(e) => setFormContext(e.target.value)}
                  placeholder='z.B. "Workshop-Teilnehmerin"'
                  maxLength={100}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="review-text">
                  Deine Erfahrung *
                </label>
                <textarea
                  id="review-text"
                  className={styles.formTextarea}
                  value={formText}
                  onChange={(e) => setFormText(e.target.value)}
                  placeholder="Erzähle von deiner Erfahrung..."
                  maxLength={1000}
                  required
                />
                <div className={styles.charCount}>{formText.length} / 1000</div>
              </div>

              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={handleCancel}
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={isSubmitting || !formName.trim() || !formText.trim()}
                >
                  {isSubmitting ? 'Wird gesendet...' : 'Bewertung absenden'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Reviews Grid */}
        {isLoading ? (
          <div className={styles.loading}>Bewertungen werden geladen...</div>
        ) : reviews.length > 0 ? (
          <div className={styles.grid}>
            {reviews.map((review) => (
              <div key={review.id} className={styles.card}>
                <div className={styles.cardStars}>
                  <StarDisplay rating={review.rating} />
                </div>
                <p className={styles.cardText}>
                  &ldquo;{review.text}&rdquo;
                </p>
                <div className={styles.cardAuthor}>
                  <span className={styles.cardAuthorName}>{review.name}</span>
                  {review.context && (
                    <span className={styles.cardAuthorContext}>
                      {review.context}
                    </span>
                  )}
                </div>
                {review.createdAt && (
                  <div className={styles.cardDate}>
                    {formatDate(review.createdAt)}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            Noch keine Bewertungen vorhanden. Sei die erste Person, die eine
            Bewertung schreibt!
          </div>
        )}
      </div>
    </section>
  )
}
