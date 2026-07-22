import { useMemo } from 'react'
import { ChatItem } from './ChatItem'
import type { Conversation } from '@/types/database'

interface ChatListProps {
  conversations: Conversation[]
  activeId: string | null
  onSelect: (id: string) => void
  onDelete: (id: string) => void
  onRename: (id: string, title: string) => void
  onTogglePin: (id: string, pinned: boolean) => void
  searchQuery: string
}

export function ChatList({
  conversations, activeId, onSelect, onDelete, onRename, onTogglePin, searchQuery,
}: ChatListProps) {
  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return conversations
    const q = searchQuery.toLowerCase()
    return conversations.filter(c => c.title.toLowerCase().includes(q))
  }, [conversations, searchQuery])

  const pinned = useMemo(() => filtered.filter(c => c.is_pinned), [filtered])
  const unpinned = useMemo(() => filtered.filter(c => !c.is_pinned), [filtered])

  return (
    <div className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5 scrollbar-thin">
      {pinned.length > 0 && (
        <div className="mb-2">
          <p className="px-2 py-1 text-xs font-medium text-neutral-500 uppercase tracking-wider">Pinned</p>
          {pinned.map(conv => (
            <ChatItem
              key={conv.id}
              conversation={conv}
              isActive={conv.id === activeId}
              onSelect={onSelect}
              onDelete={onDelete}
              onRename={onRename}
              onTogglePin={onTogglePin}
            />
          ))}
        </div>
      )}
      {unpinned.map(conv => (
        <ChatItem
          key={conv.id}
          conversation={conv}
          isActive={conv.id === activeId}
          onSelect={onSelect}
          onDelete={onDelete}
          onRename={onRename}
          onTogglePin={onTogglePin}
        />
      ))}
      {filtered.length === 0 && (
        <p className="px-2 py-4 text-center text-sm text-neutral-500">No conversations found</p>
      )}
    </div>
  )
}
