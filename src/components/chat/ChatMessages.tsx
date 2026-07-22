import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageBubble } from './MessageBubble'
import { WelcomeScreen } from './WelcomeScreen'
import { Skeleton } from '@/components/ui/Skeleton'
import type { ChatMessage } from '@/types/chat'

interface ChatMessagesProps {
  messages: ChatMessage[]
  loading: boolean
  isStreaming: boolean
  error: string | null
  onRegenerate: () => void
  onClearError: () => void
}

export function ChatMessages({ messages, loading, isStreaming, error, onRegenerate, onClearError }: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (loading) {
    return (
      <div className="flex-1 flex flex-col gap-4 p-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex gap-3">
            <Skeleton className="w-8 h-8 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (messages.length === 0) return <WelcomeScreen />

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-8">
      <div className="max-w-3xl mx-auto py-4">
        <AnimatePresence initial={false}>
          {messages.map(msg => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageBubble message={msg} />
            </motion.div>
          ))}
        </AnimatePresence>
        {isStreaming && (
          <div className="flex gap-2 py-2">
            <span className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        )}
        {error && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-red-900/20 border border-red-800/30 mt-2">
            <p className="text-sm text-red-400 flex-1">{error}</p>
            <button onClick={onClearError} className="text-xs text-red-400 hover:text-red-300">Dismiss</button>
            <button onClick={onRegenerate} className="text-xs text-neutral-400 hover:text-neutral-200">Retry</button>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
