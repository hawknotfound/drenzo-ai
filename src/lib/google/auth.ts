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

interface TokenState {
  accessToken: string
  expiresAt: number
}

let tokenClient: TokenClient | null = null
let tokenResolve: ((token: string) => void) | null = null
let tokenReject: ((err: Error) => void) | null = null

const TOKEN_KEY = 'g_access_token'
const TOKEN_EXPIRES_KEY = 'g_token_expires'
const REFRESH_TOKEN_KEY = 'g_refresh_token'

function loadStoredToken(): TokenState | null {
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

function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(TOKEN_EXPIRES_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
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

export function getAccessToken(): string | null {
  if (isExpired()) return null
  return loadStoredToken()?.accessToken ?? null
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

export function getUserInfo(): { email: string; name: string; picture: string } | null {
  const token = loadStoredToken()
  if (!token) return null
  try {
    const payload = JSON.parse(atob(token.accessToken.split('.')[1]))
    return { email: payload.email, name: payload.name, picture: payload.picture }
  } catch {
    return null
  }
}
