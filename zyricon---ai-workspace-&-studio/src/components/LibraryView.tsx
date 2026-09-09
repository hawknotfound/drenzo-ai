import React, { useState } from 'react';
import { Library, ArrowLeft, Search, Sparkles, Copy, ArrowUpRight, Check } from 'lucide-react';
import { LibraryTemplate } from '../types';
import { INITIAL_TEMPLATES } from '../data/models';

interface LibraryViewProps {
  onBack: () => void;
  onUseTemplate: (prompt: string) => void;
  onShowToast: (title: string, desc?: string, type?: 'success' | 'info') => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  onBack,
  onUseTemplate,
  onShowToast,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ['All', 'Coding', 'Creative', 'Productivity', 'Research'];

  const filtered = selectedCategory === 'All'
    ? INITIAL_TEMPLATES
    : INITIAL_TEMPLATES.filter((t) => t.category === selectedCategory);

  const handleCopyPrompt = (id: string, prompt: string) => {
    navigator.clipboard.writeText(prompt);
    setCopiedId(id);
    onShowToast('Prompt Copied', 'Template copied to clipboard', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 space-y-5 animate-in fade-in duration-200">
      {/* Top navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#171126] hover:bg-[#221938] border border-[#2B2042] text-xs font-medium text-purple-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Zyricon Hub</span>
        </button>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#8A81A1] flex items-center gap-1.5">
          <Library className="w-3.5 h-3.5 text-purple-400" />
          <span>Prompt & Asset Library</span>
        </span>
      </div>

      {/* Category pills */}
      <div className="flex items-center gap-2 overflow-x-auto py-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              selectedCategory === cat
                ? 'bg-[#8B5CF6] text-white shadow-md'
                : 'bg-[#150F22] border border-[#271E3A] text-[#8E85A3] hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-2xl bg-[#130E20] border border-[#271D3A] hover:border-[#4B376E] transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-950/80 border border-purple-500/20 text-purple-300">
                  {item.category}
                </span>
                <div className="flex items-center gap-1">
                  {item.tags.map((tag) => (
                    <span key={tag} className="text-[10px] text-[#6E6582]">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <h4 className="text-xs font-semibold text-white group-hover:text-purple-200 transition-colors">
                {item.title}
              </h4>
              <p className="text-[11px] text-[#877E9C] mt-1 line-clamp-2 leading-relaxed">
                {item.description}
              </p>

              <div className="mt-3 p-2 rounded-xl bg-[#0F0A18] border border-[#1F172E] text-[11px] font-mono text-[#A89EC0] line-clamp-2">
                "{item.prompt}"
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#1E172E]">
              <button
                onClick={() => handleCopyPrompt(item.id, item.prompt)}
                className="flex items-center gap-1 text-[11px] text-[#867C9D] hover:text-white transition-colors"
              >
                {copiedId === item.id ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                <span>{copiedId === item.id ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={() => onUseTemplate(item.prompt)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#231A38] hover:bg-[#8B5CF6] text-purple-200 hover:text-white text-xs font-medium transition-all shadow-sm"
              >
                <span>Use Template</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
