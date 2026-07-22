import { useState, useEffect, useCallback } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { ChatMessages } from '@/components/chat/ChatMessages'
import { ChatInput } from '@/components/chat/ChatInput'
import { useAuthContext } from '@/providers/AuthProvider'
import { useConversations } from '@/hooks/useConversations'
import { useChat } from '@/hooks/useChat'
import { useDebounce } from '@/hooks/useDebounce'

export function ChatPage() {
  const { user, signOut } = useAuthContext()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearch = useDebounce(searchQuery, 300)

  const {
    conversations,
    loading: convsLoading,
    createConversation,
    deleteConversation,
    togglePin,
    renameConversation,
  } = useConversations(user?.id)

  const {
    messages,
    isStreaming,
    error,
    loadMessages,
    sendMessage,
    stopStreaming,
    regenerate,
    clearError,
  } = useChat(activeConversationId)

  useEffect(() => {
    if (activeConversationId) loadMessages()
  }, [activeConversationId, loadMessages])

  const handleNewChat = useCallback(async () => {
    const conv = await createConversation()
    if (conv) setActiveConversationId(conv.id)
  }, [createConversation])

  const handleSelectConversation = useCallback((id: string) => {
    setActiveConversationId(id)
    if (window.innerWidth < 1024) setSidebarOpen(false)
  }, [])

  const handleSendMessage = useCallback(async (content: string) => {
    if (!activeConversationId) {
      const conv = await createConversation()
      if (conv) {
        setActiveConversationId(conv.id)
        setTimeout(() => sendMessage(content), 100)
        return
      }
    }
    sendMessage(content)
  }, [activeConversationId, createConversation, sendMessage])

  const handleDeleteConversation = useCallback(async (id: string) => {
    await deleteConversation(id)
    if (activeConversationId === id) setActiveConversationId(null)
  }, [deleteConversation, activeConversationId])

  return (
    <div className="h-screen flex bg-neutral-950 overflow-hidden">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        conversations={conversations}
        activeId={activeConversationId}
        onSelect={handleSelectConversation}
        onNew={handleNewChat}
        onDelete={handleDeleteConversation}
        onRename={renameConversation}
        onTogglePin={togglePin}
        onSignOut={signOut}
        searchQuery={searchQuery}
          searchFilter={debouncedSearch}
          onSearchChange={setSearchQuery}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center gap-3 px-4 h-12 border-b border-neutral-800 shrink-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-neutral-800 transition-colors text-neutral-400"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            {activeConversationId && messages.length > 0 && (
              <button
                onClick={handleNewChat}
                className="p-1.5 rounded-lg hover:bg-neutral-800 transition-colors text-neutral-400"
                title="New chat"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            )}
          </div>
        </header>
        <ChatMessages
          messages={messages}
          loading={convsLoading}
          isStreaming={isStreaming}
          error={error}
          onRegenerate={regenerate}
          onClearError={clearError}
        />
        <ChatInput
          onSend={handleSendMessage}
          onStop={stopStreaming}
          isStreaming={isStreaming}
          disabled={!user}
        />
      </div>
    </div>
  )
}
