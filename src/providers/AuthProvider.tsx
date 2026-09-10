import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import { signIn as googleSignIn, signOut as googleSignOut, getAccessToken, getUserInfo } from '@/lib/google/auth'

interface GoogleUser {
  email: string
  name: string
  picture: string
}

interface AuthContextValue {
  user: GoogleUser | null
  loading: boolean
  signIn: () => Promise<void>
  signOut: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function getUserFromToken(): GoogleUser | null {
  const info = getUserInfo()
  if (info) return info
  const token = getAccessToken()
  if (!token) return null
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return { email: payload.email, name: payload.name, picture: payload.picture }
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<GoogleUser | null>(() => getUserFromToken())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = getAccessToken()
    if (stored) {
      setUser(getUserFromToken())
    }
    setLoading(false)
  }, [])

  const signIn = useCallback(async () => {
    setLoading(true)
    try {
      await googleSignIn()
      setUser(getUserFromToken())
    } finally {
      setLoading(false)
    }
  }, [])

  const signOut = useCallback(() => {
    googleSignOut()
    setUser(null)
    localStorage.removeItem('drenzo_onboarding_seen')
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider')
  return ctx
}
