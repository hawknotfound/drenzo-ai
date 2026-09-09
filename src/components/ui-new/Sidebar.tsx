import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Sheet, Trash2, Pencil, Pin, PinOff, Plus, MessageSquare, Sparkles
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
}

export function Sidebar({
  isCollapsed, onToggleCollapse, onNewChat, conversations,
  activeConversationId, onSelectConversation,
  onDeleteConversation, onRenameConversation, onTogglePin,
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
  const hasConversations = sorted.length > 0;

  return (
    <>
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggleCollapse}
        />
      )}
      <aside
        className={`
          flex flex-col h-full glass-strong shrink-0 overflow-hidden select-none
          transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${isCollapsed ? 'w-[76px]' : 'w-[280px]'}
          fixed left-0 top-0 z-50 lg:z-auto lg:static
          ${isCollapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-2.5 overflow-hidden">
            {!isCollapsed ? (
              <img
                src="banner.png"
                alt="DRENZO AI"
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                className="h-10 w-auto object-contain"
              />
            ) : (
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/20 shrink-0">
                <img
                  src="Logo.png"
                  alt="D"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                  className="w-5 h-5 object-contain"
                />
              </div>
            )}
          </div>
          {!isCollapsed && (
            <button
              onClick={onToggleCollapse}
              className="p-2 rounded-lg hover:bg-white/10 active:bg-white/15 text-zinc-400 hover:text-white transition-colors lg:hidden"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* New Chat button */}
        <div className="px-3 pt-3 shrink-0">
          <button
            onClick={onNewChat}
            className={`group w-full flex items-center gap-2.5 ${isCollapsed ? 'justify-center' : ''} px-3 py-2.5 rounded-xl bg-gradient-to-r from-blue-600/20 to-indigo-600/20 hover:from-blue-600/30 hover:to-indigo-600/30 border border-blue-500/20 hover:border-blue-500/40 text-blue-300 hover:text-white transition-all active:scale-[0.98]`}
            title="New chat"
          >
            <div className="w-6 h-6 rounded-md bg-blue-500/20 group-hover:bg-blue-500/30 flex items-center justify-center shrink-0 transition-colors">
              <Plus className="w-3.5 h-3.5" />
            </div>
            {!isCollapsed && <span className="text-xs font-semibold">New chat</span>}
          </button>
        </div>

        {/* Recent Conversations */}
        <div className="flex-1 px-3 py-3 overflow-y-auto custom-scrollbar min-h-0">
          {!isCollapsed && (
            <div className="px-2 pb-2 flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                Recent
              </span>
              <span className="text-[10px] text-zinc-600 font-medium">
                {sorted.length}
              </span>
            </div>
          )}

          <AnimatePresence mode="popLayout">
            {!hasConversations ? (
              !isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center justify-center py-10 px-4 text-center"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mb-3">
                    <MessageSquare className="w-5 h-5 text-zinc-500" />
                  </div>
                  <p className="text-xs font-medium text-zinc-400 mb-1">No conversations yet</p>
                  <p className="text-[11px] text-zinc-500 leading-relaxed">
                    Start a new chat to see it here
                  </p>
                </motion.div>
              )
            ) : (
              <div className="space-y-0.5">
                {sorted.map((c, i) => (
                  <motion.div
                    key={c.id}
                    layout
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    transition={{ duration: 0.2, delay: i < 8 ? i * 0.02 : 0 }}
                  >
                    <ConversationItem
                      conv={c}
                      isActive={activeConversationId === c.id}
                      isCollapsed={isCollapsed}
                      editing={editingId === c.id}
                      editTitle={editTitle}
                      setEditTitle={setEditTitle}
                      editRef={editRef}
                      onSelect={() => {
                        onSelectConversation(c.id);
                        if (window.innerWidth < 1024) onToggleCollapse();
                      }}
                      onStartRename={() => startRename(c.id, c.title)}
                      onFinishRename={finishRename}
                      onCancelRename={() => setEditingId(null)}
                      onTogglePin={() => onTogglePin(c.id, c.is_pinned)}
                      onDelete={() => onDeleteConversation(c.id)}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        {!isCollapsed && (
          <div className="px-3 py-3 border-t border-white/5 shrink-0">
            <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold text-white truncate">Drenzo AI</p>
                <p className="text-[10px] text-zinc-400">v2.0 · Resurrected</p>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

function ConversationItem({
  conv, isActive, isCollapsed, editing, editTitle, setEditTitle, editRef,
  onSelect, onStartRename, onFinishRename, onCancelRename, onTogglePin, onDelete
}: {
  conv: Conversation;
  isActive: boolean;
  isCollapsed: boolean;
  editing: boolean;
  editTitle: string;
  setEditTitle: (v: string) => void;
  editRef: React.RefObject<HTMLInputElement | null>;
  onSelect: () => void;
  onStartRename: () => void;
  onFinishRename: () => void;
  onCancelRename: () => void;
  onTogglePin: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      onClick={editing ? undefined : onSelect}
      className={`group relative flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs transition-all cursor-pointer ${
        isActive
          ? 'bg-gradient-to-r from-blue-500/25 to-indigo-500/15 border border-blue-500/30 shadow-sm shadow-blue-500/10'
          : 'hover:bg-white/5 border border-transparent'
      }`}
      title={isCollapsed ? conv.title : undefined}
    >
      {isActive && !isCollapsed && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-gradient-to-b from-blue-400 to-indigo-400" />
      )}
      <Sheet
        className={`w-3.5 h-3.5 shrink-0 ${conv.is_pinned ? 'text-blue-400 fill-blue-400/30' : 'text-zinc-500'} ${
          isActive ? 'text-blue-300' : ''
        }`}
      />
      {!isCollapsed && (
        <>
          {editing ? (
            <input
              ref={editRef}
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={onFinishRename}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onFinishRename();
                if (e.key === 'Escape') onCancelRename();
              }}
              className="flex-1 bg-[#0d1117] border border-blue-500/50 text-white text-xs outline-none px-2 py-0.5 rounded"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className={`flex-1 truncate ${
              isActive ? 'text-white font-medium' : 'text-zinc-400 group-hover:text-zinc-200'
            }`}>
              {conv.title}
            </span>
          )}
          <div className="flex lg:opacity-0 lg:group-hover:opacity-100 items-center gap-0.5 transition-opacity shrink-0">
            {editing ? null : (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); onTogglePin(); }}
                  className={`p-1.5 rounded hover:bg-white/10 active:bg-white/15 transition-colors ${
                    conv.is_pinned ? 'text-blue-400' : 'text-zinc-500 hover:text-blue-400'
                  }`}
                  title={conv.is_pinned ? 'Unpin' : 'Pin'}
                >
                  {conv.is_pinned ? <PinOff className="w-3 h-3" /> : <Pin className="w-3 h-3" />}
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onStartRename(); }}
                  className="p-1.5 rounded hover:bg-white/10 active:bg-white/15 text-zinc-500 hover:text-blue-400 transition-colors"
                  title="Rename"
                >
                  <Pencil className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(); }}
                  className="p-1.5 rounded hover:bg-red-500/10 active:bg-red-500/20 text-zinc-500 hover:text-red-400 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
