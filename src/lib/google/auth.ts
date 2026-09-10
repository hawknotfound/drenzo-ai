const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string
const SCOPES = 'https://www.googleapis.com/auth/drive.appdata'

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient(config: Record<string, unknown>): TokenClient
          revoke(accessToken: string, done: () => void): void
        }
      }
    }
  }
}

interface TokenClient {
  requestAccessToken: (params?: { prompt?: string }) => void
}

interface GoogleUser {
  email: string
  name: string
  picture: string
}

let tokenClient: TokenClient | null = null
let tokenResolve: ((token: string) => void) | null = null
let tokenReject: ((err: Error) => void) | null = null
let cachedUser: GoogleUser | null = null

const TOKEN_KEY = 'g_access_token'
const TOKEN_EXPIRES_KEY = 'g_token_expires'
const USER_KEY = 'g_user_info'

function loadStoredToken(): { accessToken: string; expiresAt: number } | null {
  const token = localStorage.getItem(TOKEN_KEY)
  const expires = localStorage.getItem(TOKEN_EXPIRES_KEY)
  if (!token || !expires) return null
  return { accessToken: token, expiresAt: Number(expires) }
}

function storeToken(token: string, expiresInSeconds: number) {
  const expiresAt = Date.now() + expiresInSeconds * 1000
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(TOKEN_EXPIRES_KEY, String(expiresAt))
}

function storeUser(user: GoogleUser) {
  cachedUser = user
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(TOKEN_EXPIRES_KEY)
  localStorage.removeItem(USER_KEY)
  cachedUser = null
}

function isExpired(): boolean {
  const state = loadStoredToken()
  if (!state) return true
  return Date.now() >= state.expiresAt - 60_000
}

function waitForGIS(): Promise<void> {
  return new Promise((resolve) => {
    if (window.google?.accounts?.oauth2) { resolve(); return }
    const check = setInterval(() => {
      if (window.google?.accounts?.oauth2) { clearInterval(check); resolve() }
    }, 100)
    setTimeout(() => { clearInterval(check); resolve() }, 5000)
  })
}

async function fetchUserInfo(accessToken: string): Promise<GoogleUser> {
  const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!res.ok) throw new Error('Failed to fetch user info')
  const data = await res.json()
  return { email: data.email, name: data.name, picture: data.picture }
}

export function getAccessToken(): string | null {
  if (isExpired()) return null
  return loadStoredToken()?.accessToken ?? null
}

export function getUserInfo(): GoogleUser | null {
  if (cachedUser) return cachedUser
  const stored = localStorage.getItem(USER_KEY)
  if (stored) {
    try {
      cachedUser = JSON.parse(stored)
      return cachedUser
    } catch {}
  }
  const token = getAccessToken()
  if (!token) return null
  return null
}

export async function ensureToken(): Promise<string> {
  const existing = getAccessToken()
  if (existing) return existing
  return requestNewToken()
}

async function requestNewToken(): Promise<string> {
  await waitForGIS()

  if (!window.google?.accounts?.oauth2) {
    throw new Error('Google Identity Services not loaded')
  }

  if (!tokenClient) {
    tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: (response: { access_token?: string; expires_in?: number; error?: string; error_description?: string }) => {
        if (response.error) {
          tokenReject?.(new Error(response.error_description || response.error))
          tokenResolve = null
          tokenReject = null
          return
        }
        if (response.access_token && response.expires_in) {
          storeToken(response.access_token, response.expires_in)
          fetchUserInfo(response.access_token).then(storeUser).catch(() => {})
          tokenResolve?.(response.access_token)
        }
        tokenResolve = null
        tokenReject = null
      },
      error_callback: (err: Error) => {
        tokenReject?.(err)
        tokenResolve = null
        tokenReject = null
      },
    })
  }

  return new Promise<string>((resolve, reject) => {
    tokenResolve = resolve
    tokenReject = reject
    tokenClient!.requestAccessToken({ prompt: '' })
  })
}

export async function signIn(): Promise<string> {
  return requestNewToken()
}

export async function silentRefresh(): Promise<string | null> {
  await waitForGIS()

  if (!window.google?.accounts?.oauth2) return null
  if (!tokenClient) return null

  return new Promise<string>((resolve) => {
    tokenResolve = (token) => resolve(token)
    tokenReject = () => resolve(null)
    tokenClient!.requestAccessToken({ prompt: 'none' })
  })
}

export function signOut(): void {
  const token = loadStoredToken()?.accessToken
  if (token && window.google?.accounts?.oauth2) {
    window.google.accounts.oauth2.revoke(token, () => {})
  }
  clearToken()
  tokenClient = null
}
