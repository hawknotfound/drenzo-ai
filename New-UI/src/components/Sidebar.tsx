import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Search,
  History,
  Pin,
  BookOpen,
  GraduationCap,
  FileText,
  Image as ImageIcon,
  Settings,
  ChevronRight,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles
} from 'lucide-react';
import { Conversation } from '../types';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  activeNav: string;
  setActiveNav: (nav: string) => void;
  onNewChat: () => void;
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onOpenSearch: () => void;
  onOpenSettings: () => void;
  onOpenFiles: () => void;
  onOpenImages: () => void;
  onOpenLibrary: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  activeNav,
  setActiveNav,
  onNewChat,
  conversations,
  activeConversationId,
  onSelectConversation,
  onOpenSearch,
  onOpenSettings,
  onOpenFiles,
  onOpenImages,
  onOpenLibrary
}) => {
  const navItems = [
    { id: 'search', label: 'Search Conversations', icon: Search, onClick: onOpenSearch },
    { id: 'history', label: 'Conversation History', icon: History, onClick: () => setActiveNav('history') },
    { id: 'pinned', label: 'Pinned Chats', icon: Pin, onClick: () => setActiveNav('pinned') },
    { id: 'library', label: 'AI Library', icon: BookOpen, onClick: onOpenLibrary },
    { id: 'knowledge', label: 'Knowledge', icon: GraduationCap, onClick: onOpenFiles },
    { id: 'files', label: 'Files', icon: FileText, onClick: onOpenFiles },
    { id: 'images', label: 'Images', icon: ImageIcon, onClick: onOpenImages },
    { id: 'settings', label: 'Settings', icon: Settings, onClick: onOpenSettings },
  ];

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 76 : 260 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex flex-col h-full bg-[#11151e]/80 backdrop-blur-2xl border-r border-white/10 rounded-l-[26px] select-none overflow-hidden z-20 shrink-0"
    >
      {/* Top Logo & Branding */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-white/5">
        <div className="flex items-center gap-3 overflow-hidden cursor-pointer" onClick={onNewChat}>
          {/* Geometric Drenzo D Icon */}
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500/20 via-sky-500/30 to-indigo-600/20 border border-blue-400/30 shadow-[0_0_15px_rgba(59,130,246,0.3)] shrink-0">
            <svg
              className="w-5 h-5 text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
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

      {/* New Chat Button */}
      <div className="p-3">
        <button
          onClick={onNewChat}
          className={`group relative flex items-center justify-center gap-2.5 w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-white/10 via-white/5 to-white/10 hover:from-blue-600/30 hover:via-blue-500/20 hover:to-indigo-600/30 border border-white/15 hover:border-blue-400/50 text-white font-medium text-sm transition-all duration-200 shadow-md hover:shadow-blue-500/20 active:scale-[0.98] ${
            isCollapsed ? 'px-0' : ''
          }`}
          title="New Chat"
        >
          <Plus className="w-4 h-4 text-blue-400 group-hover:scale-110 group-hover:rotate-90 transition-transform duration-200" />
          {!isCollapsed && <span className="whitespace-nowrap">New Chat</span>}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 px-3 py-1 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeNav === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveNav(item.id);
                item.onClick();
              }}
              className={`group flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-blue-600/20 text-white border border-blue-500/40 shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              } ${isCollapsed ? 'justify-center px-0' : ''}`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? 'text-blue-400' : 'text-zinc-400 group-hover:text-zinc-200'
                }`}
              />
              {!isCollapsed && (
                <span className="truncate whitespace-nowrap text-[13.5px] font-normal">
                  {item.label}
                </span>
              )}
            </button>
          );
        })}

        {/* Recent Conversations List (When not collapsed and on History/Pinned view) */}
        {!isCollapsed && activeNav === 'history' && (
          <div className="pt-3 mt-2 border-t border-white/5">
            <div className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              Recent Conversations
            </div>
            <div className="space-y-1">
              {conversations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => onSelectConversation(c.id)}
                  className={`flex items-center gap-2 w-full px-2.5 py-1.5 rounded-lg text-xs text-left truncate transition-colors ${
                    activeConversationId === c.id
                      ? 'bg-blue-500/20 text-blue-200 font-medium'
                      : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
                  }`}
                >
                  <Sparkles className="w-3 h-3 shrink-0 text-zinc-500" />
                  <span className="truncate">{c.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* User Profile Card at bottom */}
      <div className="p-3 border-t border-white/5 space-y-2">
        <div
          onClick={onOpenSettings}
          className={`flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/15 cursor-pointer transition-all ${
            isCollapsed ? 'justify-center p-2' : 'justify-between'
          }`}
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            {/* User Avatar Image matching user Shahzaib */}
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-blue-400/40 shrink-0">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120"
                alt="Shahzaib"
                className="w-full h-full object-cover"
              />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col truncate">
                <span className="text-xs font-semibold text-white truncate leading-tight">
                  Shahzaib
                </span>
                <span className="text-[10.5px] text-zinc-400 truncate leading-tight">
                  shatzaib@dyna.com
                </span>
              </div>
            )}
          </div>
          {!isCollapsed && <ChevronRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />}
        </div>

        {/* Collapse Sidebar Button at very bottom */}
        <button
          onClick={onToggleCollapse}
          className={`flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-400 hover:text-white text-xs font-medium transition-all ${
            isCollapsed ? 'p-2' : ''
          }`}
        >
          {isCollapsed ? (
            <PanelLeftOpen className="w-4 h-4 text-zinc-300" />
          ) : (
            <>
              <X className="w-3.5 h-3.5 text-zinc-400" />
              <span>Collapse Sidebar</span>
            </>
          )}
        </button>
      </div>
    </motion.aside>
  );
};
