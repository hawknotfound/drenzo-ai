import React from 'react';
import {
  MessageSquare,
  Archive,
  Library,
  FolderPlus,
  Folder,
  Crown,
  Plus,
  PanelLeftClose,
  PanelLeftOpen,
  X,
  Aperture
} from 'lucide-react';
import { ViewMode, WorkspaceFolder } from '../types';

interface SidebarProps {
  currentView: ViewMode;
  onSelectView: (view: ViewMode) => void;
  workspaces: WorkspaceFolder[];
  activeWorkspaceId: string | null;
  onSelectWorkspace: (workspace: WorkspaceFolder) => void;
  onNewChat: () => void;
  onNewProject: () => void;
  onOpenUpgrade: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  workspaces,
  activeWorkspaceId,
  onSelectWorkspace,
  onNewChat,
  onNewProject,
  onOpenUpgrade,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}) => {
  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Shell */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          flex flex-col justify-between
          bg-[#0C0914] border-r border-[#20182E]
          transition-all duration-300 ease-in-out
          ${isCollapsed ? 'lg:w-[72px]' : 'lg:w-[240px]'}
          ${isMobileOpen ? 'translate-x-0 w-[260px]' : '-translate-x-full lg:translate-x-0'}
          h-full select-none
        `}
      >
        {/* Top Header & Navigation Area */}
        <div className="flex flex-col flex-1 overflow-y-auto px-3.5 pt-4 pb-2">
          {/* Logo & Collapse Toggle */}
          <div className="flex items-center justify-between mb-4 px-1">
            <div
              className="flex items-center gap-2.5 cursor-pointer group"
              onClick={onNewChat}
              title="Zyricon AI"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#7e22ce] to-[#3b0764] flex items-center justify-center shadow-[0_0_12px_rgba(147,51,234,0.4)] group-hover:scale-105 transition-transform">
                <Aperture className="w-4 h-4 text-white" />
              </div>
              {!isCollapsed && (
                <span className="font-semibold text-sm tracking-wide text-white">
                  Zyricon
                </span>
              )}
            </div>

            {/* Collapse button for desktop */}
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex p-1.5 rounded-lg text-[#7c7391] hover:text-white hover:bg-[#1a1429] transition-colors"
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
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-[#7c7391] hover:text-white"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
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
            <div className="w-4 h-4 rounded-full border border-purple-400/60 flex items-center justify-center text-purple-300">
              <Plus className="w-3 h-3" />
            </div>
            {!isCollapsed && <span>New Chat</span>}
          </button>

          {/* Features Section */}
          <div className="mb-4">
            {!isCollapsed && (
              <div className="text-[11px] font-medium text-[#6e6680] tracking-wider uppercase px-2 mb-1.5">
                Features
              </div>
            )}
            <div className="space-y-0.5">
              <button
                onClick={() => {
                  onSelectView('chat');
                  if (isMobileOpen) onCloseMobile();
                }}
                className={`
                  w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium
                  transition-colors
                  ${
                    currentView === 'chat' && !activeWorkspaceId
                      ? 'bg-[#1e1730] text-white'
                      : 'text-[#9b92b0] hover:text-white hover:bg-[#161124]'
                  }
                  ${isCollapsed ? 'justify-center px-0' : ''}
                `}
                title="Chat"
              >
                <MessageSquare className="w-4 h-4 text-[#a855f7]" />
                {!isCollapsed && <span>Chat</span>}
              </button>

              <button
                onClick={() => {
                  onSelectView('archived');
                  if (isMobileOpen) onCloseMobile();
                }}
                className={`
                  w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium
                  transition-colors
                  ${
                    currentView === 'archived'
                      ? 'bg-[#1e1730] text-white'
                      : 'text-[#9b92b0] hover:text-white hover:bg-[#161124]'
                  }
                  ${isCollapsed ? 'justify-center px-0' : ''}
                `}
                title="Archived"
              >
                <Archive className="w-4 h-4 text-[#8b82a1]" />
                {!isCollapsed && <span>Archived</span>}
              </button>

              <button
                onClick={() => {
                  onSelectView('library');
                  if (isMobileOpen) onCloseMobile();
                }}
                className={`
                  w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium
                  transition-colors
                  ${
                    currentView === 'library'
                      ? 'bg-[#1e1730] text-white'
                      : 'text-[#9b92b0] hover:text-white hover:bg-[#161124]'
                  }
                  ${isCollapsed ? 'justify-center px-0' : ''}
                `}
                title="Library"
              >
                <Library className="w-4 h-4 text-[#8b82a1]" />
                {!isCollapsed && <span>Library</span>}
              </button>
            </div>
          </div>

          {/* Workspaces Section */}
          <div className="mb-4">
            {!isCollapsed && (
              <div className="text-[11px] font-medium text-[#6e6680] tracking-wider uppercase px-2 mb-1.5">
                Workspaces
              </div>
            )}
            <div className="space-y-0.5">
              {/* New Project item */}
              <button
                onClick={() => {
                  onNewProject();
                  if (isMobileOpen) onCloseMobile();
                }}
                className={`
                  w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium
                  text-[#9b92b0] hover:text-white hover:bg-[#161124] transition-colors
                  ${isCollapsed ? 'justify-center px-0' : ''}
                `}
                title="New Project"
              >
                <FolderPlus className="w-4 h-4 text-[#a855f7]" />
                {!isCollapsed && <span>New Project</span>}
              </button>

              {/* Workspaces list */}
              {workspaces.filter(ws => ws.id !== 'ws-new').map((ws) => {
                const isActive = activeWorkspaceId === ws.id;
                return (
                  <button
                    key={ws.id}
                    onClick={() => {
                      onSelectWorkspace(ws);
                      if (isMobileOpen) onCloseMobile();
                    }}
                    className={`
                      w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium
                      transition-colors
                      ${
                        isActive
                          ? 'bg-[#1e1730] text-white'
                          : 'text-[#9b92b0] hover:text-white hover:bg-[#161124]'
                      }
                      ${isCollapsed ? 'justify-center px-0' : ''}
                    `}
                    title={ws.name}
                  >
                    <Folder className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-[#79708f]'}`} />
                    {!isCollapsed && (
                      <div className="flex items-center justify-between w-full">
                        <span className="truncate">{ws.name}</span>
                        {ws.itemCount > 0 && (
                          <span className="text-[10px] text-[#635b75]">{ws.itemCount}</span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Upgrade Card */}
        {!isCollapsed ? (
          <div className="p-3 border-t border-[#1e172e]/60">
            <div className="bg-gradient-to-b from-[#181326] to-[#110d1c] border border-[#271f3a] rounded-2xl p-3.5 text-center relative overflow-hidden group">
              {/* Subtle ambient corner light */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-600/10 rounded-full blur-xl pointer-events-none" />

              {/* Crown Icon */}
              <div className="w-7 h-7 mx-auto rounded-full bg-[#271f3b] border border-purple-500/30 flex items-center justify-center text-purple-300 mb-2">
                <Crown className="w-3.5 h-3.5" />
              </div>

              <h4 className="text-xs font-semibold text-white">
                Upgrade to premium
              </h4>
              <p className="text-[10px] text-[#867d9c] leading-relaxed mt-1 mb-2.5">
                Boost productivity with seamless automation and responsive AI built to adapt to your needs.
              </p>
              <button
                onClick={onOpenUpgrade}
                className="w-full py-1.5 px-3 text-xs font-medium bg-[#251d38] hover:bg-[#32284e] active:scale-[0.98] text-white rounded-xl transition-all border border-purple-500/20 hover:border-purple-500/40 shadow-sm"
              >
                Upgrade
              </button>
            </div>
          </div>
        ) : (
          <div className="p-2 border-t border-[#1e172e]/60 flex justify-center">
            <button
              onClick={onOpenUpgrade}
              className="p-2.5 rounded-xl bg-[#251d38] text-purple-300 hover:text-white transition-colors"
              title="Upgrade to premium"
            >
              <Crown className="w-4 h-4" />
            </button>
          </div>
        )}
      </aside>
    </>
  );
};
