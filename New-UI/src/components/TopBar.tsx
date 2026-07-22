import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Settings, Sun, Moon, Check, Zap, Cpu, Sparkles, Brain } from 'lucide-react';
import { AIModel } from '../types';
import { AI_MODELS } from '../data/initialData';

interface TopBarProps {
  selectedModel: AIModel;
  onSelectModel: (model: AIModel) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenSettings: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  selectedModel,
  onSelectModel,
  isDarkMode,
  onToggleDarkMode,
  onOpenSettings
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative z-20 flex items-center justify-between w-full px-6 py-4 border-b border-white/5 bg-transparent select-none">
      {/* Left empty spacer or search indicator */}
      <div className="flex items-center gap-2">
        {/* Subtle status indicator */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>System Ready</span>
        </div>
      </div>

      {/* Right Controls Area matching reference image */}
      <div className="flex items-center gap-3">
        {/* Model Selector Pill Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-[#1a202c]/70 hover:bg-[#222938] border border-white/10 hover:border-blue-400/40 text-white font-normal text-xs transition-all shadow-md active:scale-95 cursor-pointer backdrop-blur-md"
          >
            <Zap className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-medium">{selectedModel.name}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Model Selection Menu */}
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-72 p-2 rounded-2xl bg-[#141824]/95 border border-white/15 shadow-2xl backdrop-blur-2xl z-50 space-y-1"
              >
                <div className="px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-zinc-400 border-b border-white/5">
                  Select AI Model
                </div>

                {AI_MODELS.map((model) => {
                  const isSelected = model.id === selectedModel.id;
                  return (
                    <button
                      key={model.id}
                      onClick={() => {
                        onSelectModel(model);
                        setIsDropdownOpen(false);
                      }}
                      className={`flex items-start justify-between w-full p-2.5 rounded-xl text-left transition-all ${
                        isSelected
                          ? 'bg-blue-600/20 border border-blue-500/40 text-white'
                          : 'hover:bg-white/5 text-zinc-300 hover:text-white'
                      }`}
                    >
                      <div className="flex flex-col space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold">{model.name}</span>
                          {model.badge && (
                            <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                              {model.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-zinc-400 line-clamp-1">{model.description}</span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Settings Icon Button */}
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-xl bg-[#1a202c]/70 hover:bg-[#222938] border border-white/10 hover:border-white/20 text-zinc-300 hover:text-white transition-all backdrop-blur-md active:scale-95"
          title="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Dark / Light Mode Toggle */}
        <button
          onClick={onToggleDarkMode}
          className="p-2 rounded-xl bg-[#1a202c]/70 hover:bg-[#222938] border border-white/10 hover:border-white/20 text-zinc-300 hover:text-white transition-all backdrop-blur-md active:scale-95 flex items-center gap-1.5"
          title="Toggle Theme"
        >
          <Sun className={`w-3.5 h-3.5 ${!isDarkMode ? 'text-amber-400' : 'text-zinc-500'}`} />
          <Moon className={`w-3.5 h-3.5 ${isDarkMode ? 'text-blue-400' : 'text-zinc-500'}`} />
        </button>

        {/* User Profile Avatar Circle */}
        <div 
          onClick={onOpenSettings}
          className="relative w-8 h-8 rounded-full overflow-hidden border border-blue-400/40 cursor-pointer hover:ring-2 hover:ring-blue-400/50 transition-all shrink-0"
        >
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120"
            alt="User"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};
