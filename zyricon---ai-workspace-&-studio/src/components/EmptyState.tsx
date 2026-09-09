import React from 'react';
import { Image as ImageIcon, Lightbulb, FileText } from 'lucide-react';
import { GlowingOrb } from './GlowingOrb';

interface EmptyStateProps {
  onSelectPrompt: (promptText: string) => void;
  onOrbClick?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onSelectPrompt, onOrbClick }) => {
  const promptShortcuts = [
    {
      id: 'image',
      label: 'Create Image',
      icon: ImageIcon,
      prompt: 'Create a hyper-detailed cinematic render of a futuristic glass greenhouse on Mars at sunset, volumetric purple lighting, 8k resolution'
    },
    {
      id: 'brainstorm',
      label: 'Brainstorm',
      icon: Lightbulb,
      prompt: 'Brainstorm 5 high-impact AI product features that solve contextual collaboration for remote engineering teams'
    },
    {
      id: 'plan',
      label: 'Make a plan',
      icon: FileText,
      prompt: 'Create a comprehensive 4-week execution roadmap to launch an MVP with key milestones, risks, and KPIs'
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center text-center select-none pt-4 pb-4">
      {/* 3D Glowing Cosmic Orb */}
      <div className="mb-2">
        <GlowingOrb size={64} onClick={onOrbClick} />
      </div>

      {/* Main Headline */}
      <h1 className="text-2xl md:text-[28px] font-normal tracking-tight text-white/95 mb-4">
        Ready to Create Something New?
      </h1>

      {/* Shortcut Action Chips */}
      <div className="flex flex-wrap items-center justify-center gap-2 max-w-xl">
        {promptShortcuts.map((chip) => {
          const Icon = chip.icon;
          return (
            <button
              key={chip.id}
              onClick={() => onSelectPrompt(chip.prompt)}
              className="group flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#161124]/90 hover:bg-[#221a36] border border-[#2c2240] hover:border-[#523d75] transition-all duration-200 text-xs font-normal text-[#cfc8de] hover:text-white shadow-sm cursor-pointer active:scale-95"
            >
              <span>{chip.label}</span>
              <Icon className="w-3.5 h-3.5 text-[#887e9e] group-hover:text-purple-300 transition-colors" />
            </button>
          );
        })}
      </div>
    </div>
  );
};
