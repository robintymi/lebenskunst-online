'use client'

import React, { useEffect } from 'react'
import { useField } from '@payloadcms/ui'
import type { TextFieldClientComponent } from 'payload'

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export const SlugField: TextFieldClientComponent = ({ field, path }) => {
  const { value: slug, setValue: setSlug } = useField<string>({ path })
  const { value: title } = useField<string>({ path: 'title' })

  useEffect(() => {
    if (title && !slug) {
      setSlug(generateSlug(title as string))
    }
  }, [title]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ marginBottom: '1rem' }}>
      <label
        htmlFor={`field-${path}`}
        style={{
          display: 'block',
          marginBottom: '0.25rem',
          fontSize: '0.875rem',
          fontWeight: 600,
          color: 'var(--theme-text)',
        }}
      >
        {field.label as string ?? 'Slug'}
        {field.required && (
          <span style={{ color: 'var(--theme-error)', marginLeft: '0.25rem' }}>*</span>
        )}
      </label>
      <input
        id={`field-${path}`}
        type="text"
        value={(slug as string) || ''}
        onChange={(e) => setSlug(e.target.value)}
        placeholder="Wird automatisch aus dem Titel generiert"
        style={{
          display: 'block',
          width: '100%',
          padding: '0.5rem 0.75rem',
          fontSize: '0.875rem',
          border: '1px solid var(--theme-border-color)',
          borderRadius: 4,
          background: 'var(--theme-input-bg)',
          color: 'var(--theme-text)',
          fontFamily: 'inherit',
          boxSizing: 'border-box',
        }}
      />
      <p
        style={{
          marginTop: '0.25rem',
          fontSize: '0.75rem',
          color: 'var(--theme-text-muted, #666)',
        }}
      >
        Wird automatisch aus dem Titel generiert. Kann manuell angepasst werden.
      </p>
    </div>
  )
}

export default SlugField
