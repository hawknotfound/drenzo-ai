import { useState, useCallback, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAuthContext } from '@/providers/AuthProvider'
import { useConversations } from '@/hooks/useConversations'
import { useChat } from '@/hooks/useChat'
import { BackgroundOrbs } from '@/components/ui-new/BackgroundOrbs'
import { Sidebar } from '@/components/ui-new/Sidebar'
import { TopBar } from '@/components/ui-new/TopBar'
import { HeroState } from '@/components/ui-new/HeroState'
import { ChatTimeline } from '@/components/ui-new/ChatTimeline'
import { SearchModal } from '@/components/ui-new/SearchModal'
import { SettingsModal } from '@/components/ui-new/SettingsModal'
import { LogIn, UserPlus, MessageSquare } from 'lucide-react'

interface ChatPageProps {
  isGuest?: boolean
  onExitGuest?: () => void
}

export function ChatPage({ isGuest, onExitGuest }: ChatPageProps) {
  const { user, signOut } = useAuthContext()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [inputText, setInputText] = useState('')

  const [language, setLanguage] = useState<'english' | 'hinglish'>('english')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const guestConvId = useRef(isGuest ? crypto.randomUUID() : null)

  const {
    conversations,
    loading: _convsLoading,
    createConversation,
    deleteConversation,
    renameConversation,
  } = useConversations(user?.id)

  const {
    messages,
    isStreaming,
    error,
    limitReached,
    guestLimitReached,
    guestMessagesUsed,
    loadMessages,
    sendMessage,
    regenerate,
    clearError,
  } = useChat(isGuest ? guestConvId.current : activeConversationId, !!isGuest, language)

  const handleNewChat = useCallback(async () => {
    if (isGuest) {
      guestConvId.current = crypto.randomUUID()
      setActiveConversationId(null)
      return
    }
    const conv = await createConversation()
    if (conv) setActiveConversationId(conv.id)
  }, [createConversation, isGuest])

  const handleSelectConversation = useCallback((id: string) => {
    setActiveConversationId(id)
    loadMessages(id)
  }, [loadMessages])

  const handleDeleteConversation = useCallback(async (id: string) => {
    await deleteConversation(id)
    if (activeConversationId === id) setActiveConversationId(null)
  }, [deleteConversation, activeConversationId])

  const handleSendMessage = useCallback(async (text: string) => {
    if (isGuest) {
      if (!guestConvId.current) guestConvId.current = crypto.randomUUID()
      sendMessage(text, guestConvId.current)
      return
    }
    if (!activeConversationId) {
      const conv = await createConversation()
      if (conv) {
        setActiveConversationId(conv.id)
        sendMessage(text, conv.id)
        return
      }
    }
    sendMessage(text)
  }, [activeConversationId, createConversation, sendMessage, isGuest])

  const handlePromptSuggestion = (promptText: string) => {
    setInputText(promptText)
    handleSendMessage(promptText)
  }

  const hasConversation = (isGuest ? messages.length > 0 : activeConversationId && messages.length > 0)
  const guestRemaining = Math.max(0, 3 - guestMessagesUsed)

  return (
    <div className="h-screen flex bg-[#090b10] overflow-hidden relative">
      <BackgroundOrbs />

      <div className="relative z-10 flex w-full h-full">
        {!isGuest && (
          <Sidebar
            isCollapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            onNewChat={handleNewChat}
            conversations={conversations}
            activeConversationId={activeConversationId}
            onSelectConversation={handleSelectConversation}
            onDeleteConversation={handleDeleteConversation}
            onRenameConversation={renameConversation}
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            userName={user?.user_metadata?.name || user?.email?.split('@')[0]}
            userEmail={user?.email || ''}
          />
        )}

        <div className="flex flex-col flex-1 min-w-0 bg-gradient-to-b from-transparent via-blue-950/5 to-transparent">
          <TopBar
            onOpenSettings={() => setIsSettingsOpen(true)}
            onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
            language={language}
            onToggleLanguage={() => setLanguage(prev => prev === 'english' ? 'hinglish' : 'english')}
          />

          {isGuest && !guestLimitReached && (
            <div className="px-4 py-2 bg-blue-900/20 border-b border-blue-800/30 text-center flex items-center justify-center gap-2">
              <MessageSquare className="w-3 h-3 text-blue-400" />
              <p className="text-xs text-blue-400">{guestRemaining} free chat{guestRemaining !== 1 ? 's' : ''} remaining — <button onClick={onExitGuest} className="underline hover:text-blue-300">sign in</button> for unlimited</p>
            </div>
          )}

          {limitReached && !isGuest && (
            <div className="px-4 py-2 bg-amber-900/20 border-b border-amber-800/30 text-center">
              <p className="text-xs text-amber-400">Limit reached — 35 messages per conversation. Start a new chat.</p>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-3 p-3 mx-4 mt-2 rounded-lg bg-red-900/20 border border-red-800/30">
              <p className="text-xs text-red-400 flex-1">{error}</p>
              <button onClick={clearError} className="text-xs text-red-400 hover:text-red-300">Dismiss</button>
              {!isGuest && <button onClick={regenerate} className="text-xs text-zinc-400 hover:text-zinc-200">Retry</button>}
            </div>
          )}

          <div className="flex-1 overflow-y-auto custom-scrollbar relative">
            <AnimatePresence mode="wait">
              {!hasConversation ? (
                <motion.div
                  key="hero"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="w-full h-full flex flex-col items-center"
                >
                  <HeroState
                    inputText={inputText}
                    setInputText={setInputText}
                    onSubmit={() => handleSendMessage(inputText)}
                    onSelectPromptSuggestion={handlePromptSuggestion}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="timeline"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="w-full h-full"
                >
                  <ChatTimeline
                    messages={messages}
                    onSendMessage={handleSendMessage}
                    onRegenerate={regenerate}
                    isStreaming={isStreaming}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {guestLimitReached && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 z-30 bg-[#090b10]/90 backdrop-blur-md flex items-center justify-center p-4"
              >
                <div className="max-w-sm text-center space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mx-auto">
                    <MessageSquare className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Free chats used up</h3>
                  <p className="text-sm text-zinc-400">Sign in or create an account for unlimited conversations with Drenzo AI.</p>
                  <div className="flex flex-col gap-2 pt-2">
                    <button
                      onClick={() => { if (onExitGuest) onExitGuest() }}
                      className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-all"
                    >
                      <LogIn className="w-4 h-4" />
                      Sign In
                    </button>
                    <button
                      onClick={() => { if (onExitGuest) onExitGuest() }}
                      className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white text-sm font-medium transition-all"
                    >
                      <UserPlus className="w-4 h-4" />
                      Create Account
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {!isGuest && (
        <SearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          conversations={conversations}
          onSelectConversation={handleSelectConversation}
        />
      )}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        userEmail={user?.email}
        onSignOut={signOut}
      />
    </div>
  )
}
