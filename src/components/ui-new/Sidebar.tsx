import { useState, useRef, useEffect } from 'react';
import {
  X, Sheet, Trash2, Pencil, Pin, PinOff
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

  const pinned = conversations.filter(c => c.is_pinned)
  const unpinned = conversations.filter(c => !c.is_pinned)
  const sorted = [...pinned, ...unpinned]

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
          flex flex-col h-full bg-[#11151e]/80 backdrop-blur-2xl border-r border-white/10 shrink-0 overflow-hidden select-none
          transition-all duration-250 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${isCollapsed ? 'w-[76px]' : 'w-[260px]'}
          fixed left-0 top-0 z-50 lg:z-auto lg:static
          ${isCollapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-3 overflow-hidden cursor-pointer" onClick={isCollapsed ? onNewChat : undefined}>
            {!isCollapsed && (
              <div className="shrink-0">
                <img src="banner.png" alt="DRENZO AI" draggable={false} onContextMenu={(e) => e.preventDefault()} className="h-12 w-auto object-contain" />
              </div>
            )}
            {isCollapsed && (
              <div className="flex items-center justify-center w-9 h-9 shrink-0">
                <img src="Logo.png" alt="DRENZO AI" draggable={false} onContextMenu={(e) => e.preventDefault()} className="w-full h-full object-contain" />
              </div>
            )}
          </div>
          {!isCollapsed && (
            <button
              onClick={onToggleCollapse}
              className="p-2.5 rounded-lg hover:bg-white/10 active:bg-white/15 text-zinc-400 hover:text-white transition-colors lg:hidden"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Recent Conversations */}
        <div className="flex-1 px-3 py-2 overflow-y-auto custom-scrollbar min-h-0">
          {!isCollapsed && (
            <div className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              Recent Conversations
            </div>
          )}
          <div className="space-y-0.5">
            {sorted.map((c) => (
              <div
                key={c.id}
                className={`group relative flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  activeConversationId === c.id
                    ? 'bg-blue-500/20'
                    : 'hover:bg-white/5'
                }`}
                onClick={() => { onSelectConversation(c.id); if (window.innerWidth < 1024) onToggleCollapse(); }}
                title={isCollapsed ? c.title : undefined}
              >
                <Sheet className={`w-3.5 h-3.5 shrink-0 ${c.is_pinned ? 'text-blue-400' : 'text-zinc-500'}`} />
                {!isCollapsed && (
                  <>
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
                    <div className="flex lg:opacity-0 lg:group-hover:opacity-100 items-center gap-0.5 transition-opacity shrink-0">
                      {editingId !== c.id && (
                        <>
                          <button
                            onClick={(e) => { e.stopPropagation(); onTogglePin(c.id, c.is_pinned); }}
                            className={`p-1.5 rounded hover:bg-white/10 active:bg-white/15 transition-colors ${
                              c.is_pinned ? 'text-blue-400' : 'text-zinc-500 hover:text-blue-400'
                            }`}
                            title={c.is_pinned ? 'Unpin' : 'Pin'}
                          >
                            {c.is_pinned ? <PinOff className="w-3 h-3" /> : <Pin className="w-3 h-3" />}
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); startRename(c.id, c.title); }}
                            className="p-1.5 rounded hover:bg-white/10 active:bg-white/15 text-zinc-500 hover:text-blue-400 transition-colors"
                            title="Rename"
                          >
                            <Pencil className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); onDeleteConversation(c.id); }}
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
            ))}
          </div>
        </div>

      </aside>
    </>
  );
}
