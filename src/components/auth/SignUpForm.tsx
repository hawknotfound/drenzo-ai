import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, ArrowRight, AlertCircle, Check, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface SignUpFormProps {
  onSignUp: (email: string, password: string) => Promise<void>
  onSwitchToLogin: () => void
  onResendConfirmation?: (email: string) => Promise<void>
}

export function SignUpForm({ onSignUp, onSwitchToLogin, onResendConfirmation }: SignUpFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [resent, setResent] = useState(false)
  const [resending, setResending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (password !== confirm) { setError('Passwords do not match'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      await onSignUp(email, password)
      setSuccess(true)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Sign up failed'
      if (msg.toLowerCase().includes('rate limit')) {
        setError('Too many attempts. Please wait a few minutes before trying again.')
      } else {
        setError(msg)
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
    } catch {
      setError('Failed to resend confirmation email.')
    } finally {
      setResending(false)
    }
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-4"
      >
        <div className="relative inline-block">
          <div className="absolute inset-0 blur-xl opacity-50 bg-emerald-500/40" />
          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 border border-emerald-500/30 flex items-center justify-center mx-auto">
            <Check className="w-6 h-6 text-emerald-400" />
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">Check your email</h2>
          <p className="text-sm text-zinc-400 mt-1">
            We sent a confirmation link to <span className="text-zinc-200 font-medium">{email}</span>
          </p>
          <p className="text-xs text-zinc-500 mt-2">
            Click the link to activate your account. Check spam if you don't see it.
          </p>
        </div>

        <div className="pt-2 space-y-2">
          {resent ? (
            <p className="text-xs text-emerald-400 flex items-center justify-center gap-1.5">
              <Check className="w-3 h-3" />
              Confirmation resent!
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="text-xs text-blue-400 hover:text-blue-300 underline underline-offset-2 disabled:opacity-50"
            >
              {resending ? 'Sending...' : 'Resend confirmation email'}
            </button>
          )}
        </div>

        <div className="pt-3">
          <Button variant="secondary" onClick={onSwitchToLogin}>
            Go to sign in
          </Button>
        </div>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/30"
        >
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <p className="text-xs text-red-300 font-medium">{error}</p>
        </motion.div>
      )}

      <div className="space-y-2">
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
          <Input
            id="signup-email"
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
            id="signup-password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            placeholder="Min. 6 characters"
            className="pl-10"
          />
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
          <Input
            id="signup-confirm"
            type="password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            required
            autoComplete="new-password"
            placeholder="Confirm password"
            className="pl-10"
          />
        </div>
      </div>

      <Button type="submit" className="w-full" size="md" loading={loading}>
        {loading ? 'Creating account...' : (
          <>
            <Sparkles className="w-4 h-4" />
            Create account
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </Button>

      <p className="text-center text-sm text-zinc-500">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
        >
          Sign in
        </button>
      </p>
    </form>
  )
}
