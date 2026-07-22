import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface SignUpFormProps {
  onSignUp: (email: string, password: string) => Promise<void>
  onSwitchToLogin: () => void
}

export function SignUpForm({ onSignUp, onSwitchToLogin }: SignUpFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

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
      setError(err instanceof Error ? err.message : 'Sign up failed')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center space-y-4">
        <div className="w-12 h-12 rounded-xl bg-green-900/30 border border-green-800/30 flex items-center justify-center mx-auto">
          <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-neutral-100">Check your email</h2>
        <p className="text-sm text-neutral-500">We sent a confirmation link to {email}</p>
        <Button variant="ghost" onClick={onSwitchToLogin}>Back to sign in</Button>
      </div>
    )
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
        <h1 className="text-xl font-semibold text-neutral-100">Create account</h1>
        <p className="text-sm text-neutral-500 mt-1">Get started with Drenzo AI</p>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-900/20 border border-red-800/30">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <Input id="signup-email" label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
      <Input id="signup-password" label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="new-password" />
      <Input id="signup-confirm" label="Confirm password" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required autoComplete="new-password" />
      <Button type="submit" className="w-full" loading={loading}>Create account</Button>

      <p className="text-center text-sm text-neutral-500">
        Already have an account?{' '}
        <button type="button" onClick={onSwitchToLogin} className="text-neutral-300 hover:text-neutral-100 underline underline-offset-2">
          Sign in
        </button>
      </p>
    </form>
  )
}
