import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>
  onSwitchToSignUp: () => void
  onResendConfirmation?: (email: string) => Promise<void>
}

export function LoginForm({ onLogin, onSwitchToSignUp, onResendConfirmation }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [errorType, setErrorType] = useState<string | null>(null)
  const [resent, setResent] = useState(false)
  const [resending, setResending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setErrorType(null)
    setResent(false)
    setLoading(true)
    try {
      await onLogin(email, password)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Login failed'
      setError(msg)
      if (msg.toLowerCase().includes('email not confirmed')) {
        setErrorType('unconfirmed')
      } else if (msg.toLowerCase().includes('rate limit')) {
        setErrorType('rate_limit')
      } else if (msg.toLowerCase().includes('invalid login credentials')) {
        setErrorType('invalid_credentials')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (!onResendConfirmation || !email) return
    setResending(true)
    setResent(false)
    try {
      await onResendConfirmation(email)
      setResent(true)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend')
    } finally {
      setResending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-xl bg-neutral-800 flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6 text-neutral-100" viewBox="0 0 32 32" fill="none">
            <rect x="8" y="10" width="4" height="12" rx="1" fill="currentColor" opacity="0.9"/>
            <rect x="14" y="10" width="4" height="12" rx="1" fill="currentColor" opacity="0.6"/>
            <rect x="20" y="10" width="4" height="12" rx="1" fill="currentColor" opacity="0.3"/>
          </svg>
        </div>
        <h1 className="text-xl font-semibold text-neutral-100">Welcome back</h1>
        <p className="text-sm text-neutral-500 mt-1">Sign in to Drenzo AI</p>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-900/20 border border-red-800/30 space-y-2">
          <p className="text-sm text-red-400">{error}</p>
          {errorType === 'unconfirmed' && (
            <div className="pt-1">
              {resent ? (
                <p className="text-xs text-emerald-400">Confirmation email sent! Check your inbox (and spam).</p>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending || !email}
                  className="text-xs text-blue-400 hover:text-blue-300 underline underline-offset-2 disabled:opacity-50"
                >
                  {resending ? 'Sending...' : 'Resend confirmation email'}
                </button>
              )}
            </div>
          )}
        </div>
      )}

      <Input
        id="email"
        label="Email"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        autoComplete="email"
      />
      <Input
        id="password"
        label="Password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        autoComplete="current-password"
      />
      <Button type="submit" className="w-full" loading={loading}>
        Sign in
      </Button>

      <p className="text-center text-sm text-neutral-500">
        Don't have an account?{' '}
        <button type="button" onClick={onSwitchToSignUp} className="text-neutral-300 hover:text-neutral-100 underline underline-offset-2">
          Sign up
        </button>
      </p>
    </form>
  )
}
