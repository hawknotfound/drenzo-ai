import React from 'react';
import { Image as ImageIcon, Presentation, Code2 } from 'lucide-react';
import { ViewMode } from '../types';

interface FeatureCardsProps {
  onSelectFeature: (view: ViewMode, promptHint?: string) => void;
}

export const FeatureCards: React.FC<FeatureCardsProps> = ({ onSelectFeature }) => {
  const cards = [
    {
      id: 'image-generator',
      view: 'image-generator' as ViewMode,
      icon: ImageIcon,
      actionLabel: 'Create Image',
      title: 'Image Generator',
      description: 'Create high-quality images instantly from text.',
      promptHint: 'Generate a photorealistic 8K render of a floating cyberpunk garden with neon flora and holographic waterfall'
    },
    {
      id: 'ai-presentation',
      view: 'ai-presentation' as ViewMode,
      icon: Presentation,
      actionLabel: 'Make Slides',
      title: 'AI Presentation',
      description: 'Turn ideas into engaging, professional presentations.',
      promptHint: 'Create a 6-slide presentation deck outlining the future of quantum computing and neural interfaces'
    },
    {
      id: 'dev-assistant',
      view: 'dev-assistant' as ViewMode,
      icon: Code2,
      actionLabel: 'Generate Code',
      title: 'Dev Assistant',
      description: 'Generate clean, production ready code in seconds.',
      promptHint: 'Write a TypeScript utility for debounced search with abort controller support and unit tests'
    }
  ];

  return (
    <div className="w-full max-w-3xl mx-auto px-4 mt-2 mb-4 select-none">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              onClick={() => onSelectFeature(card.view, card.promptHint)}
              className="group relative rounded-2xl bg-[#120E1E]/90 hover:bg-[#191328] border border-[#241C36] hover:border-[#4B376F] transition-all duration-200 p-4 cursor-pointer hover:shadow-[0_10px_25px_rgba(0,0,0,0.5)] flex flex-col justify-between"
            >
              {/* Top Row: Icon on left, Action pill on right */}
              <div className="flex items-center justify-between mb-3">
                <div className="w-7 h-7 rounded-lg bg-[#1D162E] border border-[#31254D] flex items-center justify-center text-[#B9AEDB] group-hover:text-purple-300 group-hover:scale-105 transition-all">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-medium px-2.5 py-0.5 rounded-full bg-[#1A142B] border border-[#2E2347] text-[#9D93B3] group-hover:text-purple-200 group-hover:border-purple-500/40 transition-colors">
                  {card.actionLabel}
                </span>
              </div>

              {/* Text content */}
              <div>
                <h3 className="text-xs font-semibold text-white group-hover:text-purple-100 transition-colors">
                  {card.title}
                </h3>
                <p className="text-[11px] text-[#827A96] leading-relaxed mt-1 line-clamp-2">
                  {card.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
