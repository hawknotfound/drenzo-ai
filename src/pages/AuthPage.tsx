import { useState } from 'react'
import { LoginForm } from '@/components/auth/LoginForm'
import { SignUpForm } from '@/components/auth/SignUpForm'
import { useAuthContext } from '@/providers/AuthProvider'

interface AuthPageProps {
  onTryAsGuest?: () => void
}

export function AuthPage({ onTryAsGuest }: AuthPageProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const { signIn, signUp, resendConfirmation } = useAuthContext()

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-4">
        {mode === 'login' ? (
          <LoginForm onLogin={signIn} onSwitchToSignUp={() => setMode('signup')} onResendConfirmation={resendConfirmation} />
        ) : (
          <SignUpForm onSignUp={signUp} onSwitchToLogin={() => setMode('login')} onResendConfirmation={resendConfirmation} />
        )}
        {onTryAsGuest && (
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-neutral-950 px-2 text-zinc-500">or</span>
            </div>
          </div>
        )}
        {onTryAsGuest && (
          <button
            onClick={onTryAsGuest}
            className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white text-sm font-medium transition-all"
          >
            Try 3 free chats
          </button>
        )}
      </div>
    </div>
  )
}
