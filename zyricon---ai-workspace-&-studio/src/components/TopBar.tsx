import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  Settings2,
  Share2,
  Check,
  Zap,
  Menu,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { ModelOption } from '../types';
import { AVAILABLE_MODELS } from '../data/models';

interface TopBarProps {
  selectedModel: ModelOption;
  onSelectModel: (model: ModelOption) => void;
  onOpenConfiguration: () => void;
  onOpenExport: () => void;
  onToggleMobileMenu: () => void;
  isFramed: boolean;
  onToggleFramed: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  selectedModel,
  onSelectModel,
  onOpenConfiguration,
  onOpenExport,
  onToggleMobileMenu,
  isFramed,
  onToggleFramed,
}) => {
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsModelDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="relative z-30 flex items-center justify-between px-4 md:px-6 py-3.5 border-b border-[#1b1528]/80 select-none">
      {/* Left side: Mobile menu toggle & Model Selector */}
      <div className="flex items-center gap-3">
        {/* Mobile menu hamburger */}
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-1.5 rounded-lg text-[#8b82a1] hover:text-white hover:bg-[#1c162e] transition-colors"
          aria-label="Open navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Model Selector Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#151122] hover:bg-[#1e1830] border border-[#271f38] hover:border-[#3f315a] transition-all text-xs font-medium text-white shadow-sm cursor-pointer"
            aria-haspopup="listbox"
            aria-expanded={isModelDropdownOpen}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            <span className="tracking-tight">{selectedModel.name}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-[#8b82a1] transition-transform duration-200 ${
                isModelDropdownOpen ? 'rotate-180 text-white' : ''
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {isModelDropdownOpen && (
            <div className="absolute left-0 top-full mt-2 w-72 rounded-2xl bg-[#140f23] border border-[#2e2344] shadow-[0_12px_36px_rgba(0,0,0,0.6)] py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-md">
              <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#706782] border-b border-[#211933]">
                Select AI Engine
              </div>
              <div className="max-h-72 overflow-y-auto py-1 space-y-0.5 px-1.5">
                {AVAILABLE_MODELS.map((model) => {
                  const isSelected = model.id === selectedModel.id;
                  return (
                    <button
                      key={model.id}
                      onClick={() => {
                        onSelectModel(model);
                        setIsModelDropdownOpen(false);
                      }}
                      className={`
                        w-full flex items-start gap-2.5 px-2.5 py-2 rounded-xl text-left transition-all
                        ${
                          isSelected
                            ? 'bg-[#251b3d] text-white border border-purple-500/30'
                            : 'hover:bg-[#1a142c] text-[#a49bb8] hover:text-white'
                        }
                      `}
                    >
                      <div className="mt-0.5">
                        <Zap className={`w-3.5 h-3.5 ${isSelected ? 'text-purple-300' : 'text-[#6e6680]'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-white truncate">
                            {model.name}
                          </span>
                          {model.badge && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-purple-950/80 text-purple-300 border border-purple-500/30 font-medium">
                              {model.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-[#867d9c] mt-0.5 line-clamp-1">
                          {model.description}
                        </p>
                      </div>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-purple-400 mt-1" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right side: Configuration, Export, Frame View Toggle */}
      <div className="flex items-center gap-2 md:gap-2.5">
        {/* Frame Toggle (Desktop Mockup vs Edge-to-Edge) */}
        <button
          onClick={onToggleFramed}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#151122]/70 hover:bg-[#1e1830] border border-[#251e36] text-xs text-[#a097b5] hover:text-white transition-colors"
          title={isFramed ? 'Switch to Fullscreen Edge-to-Edge' : 'Switch to Framed Mockup Perspective'}
        >
          {isFramed ? (
            <>
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline text-[11px]">Full</span>
            </>
          ) : (
            <>
              <Minimize2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline text-[11px]">Frame</span>
            </>
          )}
        </button>

        {/* Configuration Button */}
        <button
          onClick={onOpenConfiguration}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#151122] hover:bg-[#1e1830] border border-[#251e36] hover:border-[#3f315a] transition-all text-xs font-medium text-white shadow-sm cursor-pointer"
          title="Open AI parameters & system instructions"
        >
          <span>Configuration</span>
          <Settings2 className="w-3.5 h-3.5 text-[#988fae]" />
        </button>

        {/* Export Button */}
        <button
          onClick={onOpenExport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#151122] hover:bg-[#1e1830] border border-[#251e36] hover:border-[#3f315a] transition-all text-xs font-medium text-white shadow-sm cursor-pointer"
          title="Export conversation or workspace output"
        >
          <span>Export</span>
          <Share2 className="w-3.5 h-3.5 text-[#988fae]" />
        </button>
      </div>
    </header>
  );
};
