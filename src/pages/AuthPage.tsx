import { useState } from 'react'
import { LoginForm } from '@/components/auth/LoginForm'
import { SignUpForm } from '@/components/auth/SignUpForm'
import { useAuthContext } from '@/providers/AuthProvider'

export function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const { signIn, signUp } = useAuthContext()

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {mode === 'login' ? (
          <LoginForm onLogin={signIn} onSwitchToSignUp={() => setMode('signup')} />
        ) : (
          <SignUpForm onSignUp={signUp} onSwitchToLogin={() => setMode('login')} />
        )}
      </div>
    </div>
  )
}
