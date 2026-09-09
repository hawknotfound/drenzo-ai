import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, ArrowRight, AlertCircle, Check } from 'lucide-react'
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
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 backdrop-blur-sm"
        >
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-red-300 font-medium">{error}</p>
            {errorType === 'unconfirmed' && (
              <div className="pt-1.5">
                {resent ? (
                  <p className="text-xs text-emerald-400 flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Confirmation email sent! Check your inbox (and spam).
                  </p>
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
        </motion.div>
      )}

      <div className="space-y-2">
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
          <Input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="you@example.com"
            className="pl-10"
          />
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
          <Input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            placeholder="Your password"
            className="pl-10"
          />
        </div>
      </div>

      <Button type="submit" className="w-full" size="md" loading={loading}>
        {loading ? 'Signing in...' : (
          <>
            Sign in
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </Button>

      <p className="text-center text-sm text-zinc-500">
        Don't have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToSignUp}
          className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
        >
          Sign up
        </button>
      </p>
    </form>
  )
}
