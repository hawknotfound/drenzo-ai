import { motion, AnimatePresence } from 'framer-motion'
import { ChatList } from '@/components/sidebar/ChatList'
import { SearchBar } from '@/components/sidebar/SearchBar'
import { SidebarFooter } from '@/components/sidebar/SidebarFooter'
import { Button } from '@/components/ui/Button'
import type { Conversation } from '@/types/database'

interface SidebarProps {
  open: boolean
  onClose: () => void
  conversations: Conversation[]
  activeId: string | null
  onSelect: (id: string) => void
  onNew: () => void
  onDelete: (id: string) => void
  onRename: (id: string, title: string) => void
  onTogglePin: (id: string, pinned: boolean) => void
  onSignOut: () => void
  searchQuery: string
  searchFilter: string
  onSearchChange: (q: string) => void
}

export function Sidebar({
  open, onClose, conversations, activeId, onSelect, onNew,
  onDelete, onRename, onTogglePin, onSignOut,
  searchQuery, searchFilter, onSearchChange,
}: SidebarProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-30 lg:hidden"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 left-0 z-40 h-full w-72 border-r border-neutral-800 bg-neutral-950 flex flex-col lg:static lg:z-0"
          >
            <div className="p-3 border-b border-neutral-800">
              <Button onClick={onNew} className="w-full" variant="secondary" size="md">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Chat
              </Button>
            </div>
            <SearchBar value={searchQuery} onChange={onSearchChange} />
            <ChatList
              conversations={conversations}
              activeId={activeId}
              onSelect={onSelect}
              onDelete={onDelete}
              onRename={onRename}
              onTogglePin={onTogglePin}
              searchQuery={searchFilter}
            />
            <SidebarFooter onSignOut={onSignOut} />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
