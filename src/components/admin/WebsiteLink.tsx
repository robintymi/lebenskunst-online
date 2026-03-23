'use client'

import React from 'react'

const WebsiteLink: React.FC = () => {
  return (
    <a
      href="/"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '8px 12px',
        color: 'var(--theme-text)',
        textDecoration: 'none',
        fontSize: '14px',
        opacity: 0.8,
        transition: 'opacity 0.2s',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.opacity = '1' }}
      onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.8' }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
      </svg>
      Zur Website
    </a>
  )
}

export default WebsiteLink
