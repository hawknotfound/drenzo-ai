import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, MessageSquare, Library, Trash2, Pencil, Pin, PinOff,
  PanelLeftClose, PanelLeftOpen, Plus, Settings, Presentation, Code2
} from 'lucide-react';
import type { Conversation } from '@/types/database';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onNewChat: () => void;
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onRenameConversation: (id: string, title: string) => void;
  onTogglePin: (id: string, isPinned: boolean) => void;
  onOpenSettings: () => void;
  onOpenStudio: (view: 'presentation' | 'dev' | 'library' | 'workspace') => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({
  isCollapsed, onToggleCollapse, onNewChat, conversations,
  activeConversationId, onSelectConversation,
  onDeleteConversation, onRenameConversation, onTogglePin,
  onOpenSettings, onOpenStudio, isMobileOpen, onCloseMobile,
}: SidebarProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const editRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId && editRef.current) {
      editRef.current.focus();
      editRef.current.select();
    }
  }, [editingId]);

  const startRename = (id: string, currentTitle: string) => {
    setEditingId(id);
    setEditTitle(currentTitle);
  };

  const finishRename = () => {
    if (editingId && editTitle.trim()) {
      onRenameConversation(editingId, editTitle.trim());
    }
    setEditingId(null);
  };

  const pinned = conversations.filter(c => c.is_pinned);
  const unpinned = conversations.filter(c => !c.is_pinned);
  const sorted = [...pinned, ...unpinned];

  const sidebarWidth = isCollapsed ? 68 : 240;

  return (
    <>
      {/* Mobile Backdrop Overlay with fade */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={onCloseMobile}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Shell — Framer Motion for smooth width transition */}
      <motion.aside
        animate={{ width: sidebarWidth }}
        transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          flex flex-col justify-between overflow-hidden
          bg-[#0C0914] border-r border-[#20182E]
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          h-full select-none
        `}
      >
        {/* Top Header & Navigation Area */}
        <div className="flex flex-col flex-1 overflow-y-auto px-3.5 pt-4 pb-2 min-w-0">
          {/* Logo & Collapse Toggle */}
          <div className={`flex mb-4 px-1 ${isCollapsed ? 'flex-col items-center gap-2' : 'items-center justify-between'}`}>
            <div
              className="flex items-center gap-2.5 cursor-pointer group"
              onClick={onNewChat}
              title="Drenzo AI"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#7e22ce] to-[#3b0764] flex items-center justify-center shadow-[0_0_12px_rgba(147,51,234,0.4)] group-hover:scale-105 transition-transform shrink-0">
                <img src="Logo.png" alt="" className="w-4 h-4 object-contain" draggable={false} />
              </div>
              <AnimatePresence mode="wait">
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.15 }}
                    className="font-semibold text-sm tracking-wide text-white whitespace-nowrap"
                  >
                    Drenzo
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            {/* Collapse button for desktop */}
            <button
              onClick={onToggleCollapse}
              className={`hidden lg:flex p-1.5 rounded-lg text-[#7c7391] hover:text-white hover:bg-[#1a1429] transition-colors shrink-0 ${isCollapsed ? 'mx-auto' : ''}`}
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-label="Toggle sidebar"
            >
              {isCollapsed ? (
                <PanelLeftOpen className="w-4 h-4" />
              ) : (
                <PanelLeftClose className="w-4 h-4" />
              )}
            </button>

            {/* Mobile close button */}
            {!isCollapsed && (
              <button
                onClick={onCloseMobile}
                className="lg:hidden p-1.5 rounded-lg text-[#7c7391] hover:text-white shrink-0"
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* New Chat Button */}
          <button
            onClick={() => {
              onNewChat();
              if (isMobileOpen) onCloseMobile();
            }}
            className={`
              w-full flex items-center gap-2.5 py-2 px-3 rounded-xl
              bg-[#191327] hover:bg-[#231c36] text-white border border-[#2b2140]
              transition-all duration-200 text-xs font-medium mb-5 shadow-sm
              ${isCollapsed ? 'justify-center px-0' : ''}
            `}
            title="Start a new chat"
          >
            <div className="w-4 h-4 rounded-full border border-purple-400/60 flex items-center justify-center text-purple-300 shrink-0">
              <Plus className="w-3 h-3" />
            </div>
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.15 }}
                  className="whitespace-nowrap overflow-hidden"
                >
                  New Chat
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* Features Section */}
          <div className="mb-4">
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="text-[11px] font-medium text-[#6e6680] tracking-wider uppercase px-2 mb-1.5"
                >
                  Features
                </motion.div>
              )}
            </AnimatePresence>
            <div className="space-y-0.5">
              {[
                { icon: MessageSquare, label: 'Chat', action: () => onNewChat(), active: !activeConversationId, color: 'text-[#a855f7]' },
                { icon: Library, label: 'Library', action: () => onOpenStudio('library'), active: false, color: 'text-[#8b82a1]' },
                { icon: Presentation, label: 'Presentations', action: () => onOpenStudio('presentation'), active: false, color: 'text-[#a855f7]' },
                { icon: Code2, label: 'Code Assistant', action: () => onOpenStudio('dev'), active: false, color: 'text-[#a855f7]' },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    item.action();
                    if (isMobileOpen) onCloseMobile();
                  }}
                  className={`
                    w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium
                    transition-colors
                    ${item.active ? 'bg-[#1e1730] text-white' : 'text-[#9b92b0] hover:text-white hover:bg-[#161124]'}
                    ${isCollapsed ? 'justify-center px-0' : ''}
                  `}
                  title={item.label}
                >
                  <item.icon className={`w-4 h-4 shrink-0 ${item.color}`} />
                  <AnimatePresence mode="wait">
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.15 }}
                        className="whitespace-nowrap overflow-hidden"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              ))}
            </div>
          </div>

          {/* Conversations Section */}
          <div className="flex-1 min-h-0">
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="text-[11px] font-medium text-[#6e6680] tracking-wider uppercase px-2 mb-1.5"
                >
                  Recent
                </motion.div>
              )}
            </AnimatePresence>
            <div className="space-y-0.5">
              {sorted.map((c) => (
                <div
                  key={c.id}
                  className={`group relative flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeConversationId === c.id
                      ? 'bg-[#1e1730] text-white'
                      : 'text-[#9b92b0] hover:text-white hover:bg-[#161124]'
                  } ${isCollapsed ? 'justify-center px-0' : ''}`}
                  onClick={() => { onSelectConversation(c.id); if (window.innerWidth < 1024) onCloseMobile(); }}
                  title={isCollapsed ? c.title : undefined}
                >
                  {c.is_pinned ? (
                    <Pin className="w-3.5 h-3.5 shrink-0 text-purple-400" />
                  ) : (
                    <MessageSquare className="w-3.5 h-3.5 shrink-0 text-[#79708f]" />
                  )}
                  <AnimatePresence mode="wait">
                    {!isCollapsed && (
                      <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.15 }}
                        className="flex-1 min-w-0 overflow-hidden"
                      >
                        {editingId === c.id ? (
                          <input
                            ref={editRef}
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onBlur={finishRename}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') finishRename();
                              if (e.key === 'Escape') setEditingId(null);
                            }}
                            className="w-full bg-transparent border-b border-purple-500/50 text-white text-xs outline-none px-1"
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : (
                          <span className="truncate block">{c.title}</span>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {!isCollapsed && (
                    <div className="flex lg:opacity-0 lg:group-hover:opacity-100 items-center gap-0.5 transition-opacity shrink-0">
                      {editingId !== c.id && (
                        <>
                          <button
                            onClick={(e) => { e.stopPropagation(); onTogglePin(c.id, c.is_pinned); }}
                            className={`p-1 rounded hover:bg-[#251d38] transition-colors ${
                              c.is_pinned ? 'text-purple-400' : 'text-[#635b75] hover:text-purple-400'
                            }`}
                            title={c.is_pinned ? 'Unpin' : 'Pin'}
                          >
                            {c.is_pinned ? <PinOff className="w-3 h-3" /> : <Pin className="w-3 h-3" />}
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); startRename(c.id, c.title); }}
                            className="p-1 rounded hover:bg-[#251d38] text-[#635b75] hover:text-white transition-colors"
                            title="Rename"
                          >
                            <Pencil className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); onDeleteConversation(c.id); }}
                            className="p-1 rounded hover:bg-red-950/30 text-[#635b75] hover:text-red-400 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {sorted.length === 0 && !isCollapsed && (
                <p className="text-[11px] text-[#6e6680] px-2 py-3">No conversations yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Settings Card */}
        <div className="p-3 border-t border-[#1e172e]/60">
          <button
            onClick={onOpenSettings}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#181326] hover:bg-[#1e1830] border border-[#271f3a] text-xs font-medium text-[#9b92b0] hover:text-white transition-all ${isCollapsed ? 'justify-center px-0' : ''}`}
            title={isCollapsed ? 'Settings' : undefined}
          >
            <Settings className="w-4 h-4 text-[#8b82a1] shrink-0" />
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.15 }}
                  className="whitespace-nowrap overflow-hidden"
                >
                  Settings
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>
    </>
  );
}
