import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils/cn'

interface ChatInputProps {
  onSend: (message: string) => void
  onStop: () => void
  isStreaming: boolean
  disabled: boolean
}

export function ChatInput({ onSend, onStop, isStreaming, disabled }: ChatInputProps) {
  const [input, setInput] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!isStreaming && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [isStreaming])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px'
    }
  }, [input])

  const handleSubmit = () => {
    if (!input.trim() || isStreaming || disabled) return
    onSend(input.trim())
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="border-t border-neutral-800 bg-neutral-950 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="relative flex items-end gap-2 bg-neutral-900 rounded-xl border border-neutral-800 focus-within:border-neutral-600 transition-colors px-3 py-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message Drenzo AI..."
            rows={1}
            disabled={disabled}
            className={cn(
              'flex-1 bg-transparent text-sm text-neutral-100 placeholder-neutral-500 resize-none outline-none max-h-[200px] py-1',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          />
          <div className="flex items-center gap-1">
            {isStreaming ? (
              <button
                onClick={onStop}
                className="p-2 rounded-lg bg-neutral-700 hover:bg-neutral-600 transition-colors"
                title="Stop generating"
              >
                <svg className="w-4 h-4 text-neutral-100" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="6" width="12" height="12" rx="2" />
                </svg>
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!input.trim() || disabled}
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  input.trim() && !disabled
                    ? 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200'
                    : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                )}
                title="Send message"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>
        <p className="text-[10px] text-neutral-600 text-center mt-2">
          Drenzo AI may produce inaccurate information. Verify important facts.
        </p>
      </div>
    </div>
  )
}
