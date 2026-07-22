import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils/cn'
import type { Conversation } from '@/types/database'

interface ChatItemProps {
  conversation: Conversation
  isActive: boolean
  onSelect: (id: string) => void
  onDelete: (id: string) => void
  onRename: (id: string, title: string) => void
  onTogglePin: (id: string, pinned: boolean) => void
}

export function ChatItem({ conversation, isActive, onSelect, onDelete: _onDelete, onRename, onTogglePin }: ChatItemProps) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(conversation.title)
  const [menuOpen, setMenuOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editing])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  const handleRename = () => {
    if (title.trim() && title !== conversation.title) {
      onRename(conversation.id, title.trim())
    } else {
      setTitle(conversation.title)
    }
    setEditing(false)
  }

  return (
    <div
      className={cn(
        'group relative flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors',
        isActive
          ? 'bg-neutral-800 text-neutral-100'
          : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
      )}
      onClick={() => { if (!editing) onSelect(conversation.id) }}
    >
      <svg className="w-4 h-4 shrink-0 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
      {editing ? (
        <input
          ref={inputRef}
          value={title}
          onChange={e => setTitle(e.target.value)}
          onBlur={handleRename}
          onKeyDown={e => { if (e.key === 'Enter') handleRename(); if (e.key === 'Escape') { setTitle(conversation.title); setEditing(false) } }}
          className="flex-1 bg-transparent border-b border-neutral-500 text-sm text-neutral-100 outline-none"
          onClick={e => e.stopPropagation()}
        />
      ) : (
        <span className="flex-1 truncate">{conversation.title}</span>
      )}
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={e => { e.stopPropagation(); onTogglePin(conversation.id, conversation.is_pinned) }}
          className={cn('p-1 rounded hover:bg-neutral-700 transition-colors', conversation.is_pinned && 'text-amber-400')}
          title={conversation.is_pinned ? 'Unpin' : 'Pin'}
        >
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
          </svg>
        </button>
      </div>
    </div>
  )
}
