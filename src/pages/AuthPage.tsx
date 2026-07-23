import { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye } from 'lucide-react'
import { LoginForm } from '@/components/auth/LoginForm'
import { SignUpForm } from '@/components/auth/SignUpForm'
import { useAuthContext } from '@/providers/AuthProvider'

interface AuthPageProps {
  onTryAsGuest?: () => void
}

export function AuthPage({ onTryAsGuest }: AuthPageProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const { signIn, signUp, signInWithGoogle, resendConfirmation } = useAuthContext()
  const [googleLoading, setGoogleLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true)
    try { await signInWithGoogle() }
    catch { setGoogleLoading(false) }
  }

  return (
    <div className="fixed inset-0 overflow-y-auto bg-[#090b10]">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-950/25 via-[#0b0f19] to-[#06080d]" />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
        <motion.div
          animate={{ x: [0, 25, -20, 0], y: [0, -30, 20, 0], scale: [1, 1.08, 0.95, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[10%] left-[8%] w-72 h-72 rounded-full bg-gradient-to-tr from-blue-600/30 via-indigo-500/20 to-sky-400/10 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -35, 15, 0], y: [0, 35, -25, 0], scale: [1, 1.1, 0.92, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-[10%] right-[8%] w-80 h-80 rounded-full bg-gradient-to-br from-blue-500/20 via-sky-600/15 to-purple-600/10 blur-3xl"
        />
        <motion.div
          animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.05, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[5%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-blue-500/15 via-indigo-600/10 to-transparent blur-3xl"
        />
      </div>

      <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="w-full max-w-sm"
        >
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-center mb-8"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-500/25">
              <svg className="w-5 h-5 text-white" viewBox="0 0 32 32" fill="none">
                <rect x="8" y="10" width="4" height="12" rx="1" fill="currentColor" opacity="0.9"/>
                <rect x="14" y="10" width="4" height="12" rx="1" fill="currentColor" opacity="0.6"/>
                <rect x="20" y="10" width="4" height="12" rx="1" fill="currentColor" opacity="0.3"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Drenzo AI</h1>
            <p className="text-sm text-zinc-500 mt-1">Think. Build. Create.</p>
          </motion.div>

          {/* Auth card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="rounded-2xl bg-[#161a25]/80 border border-white/[0.06] backdrop-blur-2xl shadow-[0_0_40px_rgba(0,0,0,0.3)] p-6 sm:p-8"
          >
            {/* Google */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-white hover:bg-zinc-100 text-zinc-900 text-sm font-medium transition-all disabled:opacity-50 active:scale-[0.98]"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {googleLoading ? 'Redirecting...' : 'Continue with Google'}
            </button>

            {/* Divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/[0.06]" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#161a25] px-3 text-zinc-500 tracking-wider">or {mode === 'login' ? 'sign in' : 'sign up'} with email</span>
              </div>
            </div>

            {/* Form */}
            {mode === 'login' ? (
              <LoginForm onLogin={signIn} onSwitchToSignUp={() => setMode('signup')} onResendConfirmation={resendConfirmation} />
            ) : (
              <SignUpForm onSignUp={signUp} onSwitchToLogin={() => setMode('login')} onResendConfirmation={resendConfirmation} />
            )}

            {/* Guest access */}
            {onTryAsGuest && (
              <>
                <div className="relative my-5">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/[0.06]" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-[#161a25] px-3 text-zinc-500 tracking-wider">or</span>
                  </div>
                </div>
                <button
                  onClick={onTryAsGuest}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.07] hover:border-white/[0.12] text-zinc-400 hover:text-zinc-200 text-sm font-medium transition-all active:scale-[0.98]"
                >
                  <Eye className="w-4 h-4" />
                  Try 3 free chats
                </button>
              </>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
