import { useState, useEffect } from 'react'
import { AuthProvider, useAuthContext } from '@/providers/AuthProvider'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { AuthPage } from '@/pages/AuthPage'
import { ChatPage } from '@/pages/ChatPage'

function AppContent() {
  const { user, loading } = useAuthContext()
  const [guestMode, setGuestMode] = useState(false)

  useEffect(() => {
    const handler = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'IMG' || target.closest('img')) {
        e.preventDefault()
      }
    }
    document.addEventListener('contextmenu', handler)
    return () => document.removeEventListener('contextmenu', handler)
  }, [])

  if (loading) {
    return (
      <div className="h-screen bg-[#09090f] flex flex-col items-center justify-center gap-6 relative overflow-hidden">
        {/* Subtle ambient glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-violet-500/10 blur-3xl" />
        </div>
        <div className="relative">
          <div className="absolute inset-0 blur-2xl opacity-50 bg-gradient-to-r from-blue-500/40 via-indigo-500/40 to-violet-500/40" />
          <div className="relative w-20 h-20">
            <img src="Logo.png" alt="DRENZO AI" draggable={false} onContextMenu={(e) => e.preventDefault()} className="w-full h-full object-contain" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
        <p className="text-xs text-zinc-500 font-medium tracking-wider uppercase">Loading Drenzo AI</p>
      </div>
    );
  }

  if (user) return <ChatPage />
  if (guestMode) return <ChatPage isGuest onExitGuest={() => setGuestMode(false)} />
  return <AuthPage onTryAsGuest={() => setGuestMode(true)} />
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  )
}
