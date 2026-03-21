'use client'

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'

interface User {
  id: string
  email: string
  role: 'admin' | 'member'
  firstName?: string
  lastName?: string
  phone?: string
  purchasedItems?: Array<string | { id: string }>
  purchasedBundles?: Array<string | { id: string }>
  trainingAccess?: Array<{
    training: string | { id: string }
    startDate: string
    endDate: string
  }>
}

interface AuthContextType {
  user: User | null
  isLoggedIn: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch('/api/users/me', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        if (data.user) {
          setUser(data.user)
        } else {
          setUser(null)
        }
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    }
  }, [])

  // Check session on mount
  useEffect(() => {
    refreshUser().finally(() => setIsLoading(false))
  }, [refreshUser])

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      })

      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
        return { success: true }
      }

      return { success: false, error: 'E-Mail oder Passwort falsch.' }
    } catch {
      return { success: false, error: 'Verbindungsfehler. Bitte versuche es erneut.' }
    }
  }, [])

  const register = useCallback(async (data: RegisterData) => {
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, role: 'member' }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        return {
          success: false,
          error: errorData.errors?.[0]?.message || 'Registrierung fehlgeschlagen.',
        }
      }

      // Auto-login after registration
      const loginResult = await login(data.email, data.password)
      return loginResult
    } catch {
      return { success: false, error: 'Verbindungsfehler. Bitte versuche es erneut.' }
    }
  }, [login])

  const logout = useCallback(async () => {
    try {
      await fetch('/api/users/logout', { method: 'POST', credentials: 'include' })
    } finally {
      setUser(null)
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: Boolean(user),
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
