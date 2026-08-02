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
      <div className="h-screen bg-[#0b0f19] flex flex-col items-center justify-center gap-6">
        <div className="w-20 h-20">
          <img src="Logo.png" alt="DRENZO AI" draggable={false} onContextMenu={(e) => e.preventDefault()} className="w-full h-full object-contain" />
        </div>
        <div className="flex gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    )
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
