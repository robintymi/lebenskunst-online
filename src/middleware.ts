import { NextRequest, NextResponse } from 'next/server'

const protectedPaths = [
  '/mitglieder/dashboard',
  '/checkout',
]

const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

const RATE_LIMITS: Record<string, { max: number; windowMs: number }> = {
  '/api/checkout': { max: 5, windowMs: 60_000 },
  '/api/users/login': { max: 10, windowMs: 60_000 },
  '/api/users/forgot-password': { max: 3, windowMs: 60_000 },
}

function getClientIp(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
}

function isRateLimited(key: string, max: number, windowMs: number): boolean {
  const now = Date.now()

  // Periodically purge expired entries to prevent unbounded Map growth
  if (Math.random() < 0.01) {
    for (const [k, v] of rateLimitMap) {
      if (now > v.resetTime) rateLimitMap.delete(k)
    }
  }

  const entry = rateLimitMap.get(key)

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs })
    return false
  }

  entry.count++
  return entry.count > max
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Rate limiting for API routes
  for (const [path, limits] of Object.entries(RATE_LIMITS)) {
    if (pathname.startsWith(path)) {
      const ip = getClientIp(req)
      const key = `${ip}:${path}`
      if (isRateLimited(key, limits.max, limits.windowMs)) {
        return NextResponse.json(
          { error: 'Zu viele Anfragen. Bitte warte einen Moment.' },
          { status: 429 },
        )
      }
    }
  }

  // Don't rate limit webhooks
  if (pathname.startsWith('/api/webhooks')) {
    return NextResponse.next()
  }

  // Protected routes — check for Payload auth cookie
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p))
  if (isProtected) {
    const token = req.cookies.get('payload-token')
    if (!token?.value) {
      const loginUrl = new URL('/mitglieder', req.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/mitglieder/dashboard/:path*',
    '/checkout',
    '/api/checkout',
    '/api/users/login',
    '/api/users/forgot-password',
    '/api/webhooks/:path*',
  ],
}
