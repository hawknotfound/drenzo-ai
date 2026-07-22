import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils/cn'
import type { ChatMessage } from '@/types/chat'

interface MessageBubbleProps {
  message: ChatMessage
  showCursor?: boolean
}

export function MessageBubble({ message, showCursor }: MessageBubbleProps) {
  const isUser = message.role === 'user'
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn('flex w-full gap-3 py-4', isUser ? 'justify-end' : 'justify-start')}>
      {!isUser && (
        <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center shrink-0 mt-1">
          <svg className="w-4 h-4 text-neutral-300" viewBox="0 0 32 32" fill="none">
            <rect x="8" y="10" width="4" height="12" rx="1" fill="currentColor" opacity="0.9"/>
            <rect x="14" y="10" width="4" height="12" rx="1" fill="currentColor" opacity="0.6"/>
            <rect x="20" y="10" width="4" height="12" rx="1" fill="currentColor" opacity="0.3"/>
          </svg>
        </div>
      )}
      <div className={cn(
        'flex flex-col max-w-[80%] md:max-w-[65%]',
        isUser && 'items-end'
      )}>
        <div className={cn(
          'rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
          isUser
            ? 'bg-neutral-800 text-neutral-100 rounded-tr-md'
            : 'bg-transparent text-neutral-200'
        )}>
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="prose prose-invert prose-sm max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  pre: ({ children }) => <pre className="overflow-x-auto rounded-lg bg-neutral-900 p-3 my-2 border border-neutral-800">{children}</pre>,
                  code: ({ className, children, ...props }) => {
                    const isInline = !className
                    return isInline
                      ? <code className="bg-neutral-800 px-1.5 py-0.5 rounded text-sm text-amber-300" {...props}>{children}</code>
                      : <code className={className} {...props}>{children}</code>
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>
              {showCursor && (
                <span className="inline-block w-[2px] h-[1em] bg-neutral-200 ml-0.5 animate-pulse align-middle" />
              )}
            </div>
          )}
        </div>
        {!isUser && message.content && (
          <div className="flex items-center gap-2 mt-1 px-1">
            <button
              onClick={handleCopy}
              className="text-xs text-neutral-600 hover:text-neutral-400 transition-colors"
              title="Copy response"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        )}
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-lg bg-neutral-700 flex items-center justify-center shrink-0 mt-1">
          <svg className="w-4 h-4 text-neutral-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      )}
    </div>
  )
}
