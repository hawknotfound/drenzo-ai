import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus, Search, Settings, ChevronRight,
  X, PanelLeftOpen, Sparkles, Trash2, Pencil, Check
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
  onOpenSearch: () => void;
  onOpenSettings: () => void;
  onSignOut: () => void;
  userName?: string;
  userEmail?: string;
}

export function Sidebar({
  isCollapsed, onToggleCollapse, onNewChat, conversations,
  activeConversationId, onSelectConversation,
  onDeleteConversation, onRenameConversation,
  onOpenSearch, onOpenSettings, onSignOut,
  userName, userEmail,
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

  const navItems = [
    { id: 'search', label: 'Search Conversations', icon: Search, onClick: onOpenSearch },
    { id: 'settings', label: 'Settings', icon: Settings, onClick: onOpenSettings },
  ];

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 76 : 260 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex flex-col h-full bg-[#11151e]/80 backdrop-blur-2xl border-r border-white/10 shrink-0 overflow-hidden select-none"
    >
      <div className="flex items-center justify-between px-5 py-5 border-b border-white/5">
        <div className="flex items-center gap-3 overflow-hidden cursor-pointer" onClick={onNewChat}>
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500/20 via-sky-500/30 to-indigo-600/20 border border-blue-400/30 shadow-[0_0_15px_rgba(59,130,246,0.3)] shrink-0">
            <svg className="w-5 h-5 text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h8a8 8 0 0 1 8 8 8 8 0 0 1-8 8H4V4z" />
              <path d="M9 8h3a4 4 0 0 1 4 4 4 4 0 0 1-4 4H9V8z" className="text-sky-300 opacity-90" />
            </svg>
          </div>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="text-white font-bold text-lg tracking-tight whitespace-nowrap"
            >
              Drenzo AI
            </motion.span>
          )}
        </div>
      </div>

      <div className="p-3">
        <button
          onClick={onNewChat}
          className="group relative flex items-center justify-center gap-2.5 w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-white/10 via-white/5 to-white/10 hover:from-blue-600/30 hover:via-blue-500/20 hover:to-indigo-600/30 border border-white/15 hover:border-blue-400/50 text-white font-medium text-sm transition-all duration-200 shadow-md hover:shadow-blue-500/20 active:scale-[0.98]"
          title="New Chat"
        >
          <Plus className="w-4 h-4 text-blue-400 group-hover:scale-110 group-hover:rotate-90 transition-transform duration-200" />
          {!isCollapsed && <span className="whitespace-nowrap">New Chat</span>}
        </button>
      </div>

      <div className="flex-1 px-3 py-1 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={item.onClick}
              className="group flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 text-zinc-400 hover:text-white hover:bg-white/5"
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className="w-4 h-4 shrink-0 text-zinc-400 group-hover:text-zinc-200 transition-colors" />
              {!isCollapsed && (
                <span className="truncate whitespace-nowrap text-[13.5px] font-normal">{item.label}</span>
              )}
            </button>
          );
        })}

        {!isCollapsed && (
          <div className="pt-3 mt-2 border-t border-white/5">
            <div className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              Recent Conversations
            </div>
            <div className="space-y-0.5 max-h-[300px] overflow-y-auto custom-scrollbar">
              {conversations.map((c) => (
                <div
                  key={c.id}
                  className={`group relative flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                    activeConversationId === c.id
                      ? 'bg-blue-500/20'
                      : 'hover:bg-white/5'
                  }`}
                  onClick={() => onSelectConversation(c.id)}
                >
                  <Sparkles className="w-3 h-3 shrink-0 text-zinc-500" />
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
                      className="flex-1 bg-transparent border-b border-blue-400 text-white text-xs outline-none px-1"
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <span className={`flex-1 truncate ${
                      activeConversationId === c.id ? 'text-blue-200 font-medium' : 'text-zinc-400'
                    }`}>
                      {c.title}
                    </span>
                  )}
                  <div className="hidden group-hover:flex items-center gap-0.5">
                    {editingId !== c.id && (
                      <>
                        <button
                          onClick={(e) => { e.stopPropagation(); startRename(c.id, c.title); }}
                          className="p-1 rounded hover:bg-white/10 text-zinc-500 hover:text-blue-400 transition-colors"
                          title="Rename"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); onDeleteConversation(c.id); }}
                          className="p-1 rounded hover:bg-red-500/10 text-zinc-500 hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-white/5 space-y-2">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/15 cursor-pointer transition-all" onClick={onOpenSettings}>
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-blue-400/40 shrink-0 flex items-center justify-center bg-blue-600/30 text-blue-300 text-xs font-bold">
            {userName?.charAt(0).toUpperCase() || 'U'}
          </div>
          {!isCollapsed && (
            <div className="flex flex-col truncate">
              <span className="text-xs font-semibold text-white truncate leading-tight">{userName || 'User'}</span>
              <span className="text-[10.5px] text-zinc-400 truncate leading-tight">{userEmail || ''}</span>
            </div>
          )}
          {!isCollapsed && <ChevronRight className="w-3.5 h-3.5 text-zinc-400 shrink-0 ml-auto" />}
        </div>

        <button
          onClick={onToggleCollapse}
          className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-400 hover:text-white text-xs font-medium transition-all"
        >
          {isCollapsed ? (
            <PanelLeftOpen className="w-4 h-4 text-zinc-300" />
          ) : (
            <><X className="w-3.5 h-3.5 text-zinc-400" /><span>Collapse</span></>
          )}
        </button>
      </div>
    </motion.aside>
  );
}
