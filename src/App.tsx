import { AuthProvider, useAuthContext } from '@/providers/AuthProvider'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { AuthPage } from '@/pages/AuthPage'
import { ChatPage } from '@/pages/ChatPage'

function AppContent() {
  const { user, loading } = useAuthContext()

  if (loading) {
    return (
      <div className="h-screen bg-neutral-950 flex items-center justify-center">
        <div className="flex gap-2">
          <span className="w-2 h-2 rounded-full bg-neutral-600 animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 rounded-full bg-neutral-600 animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 rounded-full bg-neutral-600 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    )
  }

  return user ? <ChatPage /> : <AuthPage />
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
